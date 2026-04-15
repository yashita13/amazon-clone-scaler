"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface User {
  id: string;
  email: string;
  name: string | null;
}

interface AuthContextType {
  user: User | null;
  signInUser: (userData: User) => void;
  signOutUser: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: "demo-user-123",
    email: "eva@example.com",
    name: "Eva Edisson"
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("amazon-clone-auth");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Automatically sign in the demo user if nothing is stored
        const demoUser = {
          id: "demo-user-123",
          email: "eva@example.com",
          name: "Eva Edisson"
        };
        setUser(demoUser);
        localStorage.setItem("amazon-clone-auth", JSON.stringify(demoUser));
      }
    } catch (error) {
      console.error("Failed to parse auth from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signInUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem("amazon-clone-auth", JSON.stringify(userData));
  };

  const signOutUser = () => {
    setUser(null);
    localStorage.removeItem("amazon-clone-auth");
  };

  return (
    <AuthContext.Provider value={{ user, signInUser, signOutUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
