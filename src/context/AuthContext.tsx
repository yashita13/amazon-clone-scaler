"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "ADMIN" | "DELIVERY";
}

interface AuthContextType {
  user: User | null;
  signInUser: (userData: User) => void;
  signOutUser: () => void;
  isLoading: boolean;
  switchRole: (role: "USER" | "ADMIN" | "DELIVERY") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function initAuth() {
      try {
        // 1. Initial fetch from session cookie
        const response = await fetch("/api/auth/me");
        let initialUser = null;
        
        if (response.ok) {
          const data = await response.json();
          initialUser = data.user;
        }

        // 2. Check route for Landing Page Override
        // If we are on the landing page (/), we always default to USER role
        const isLandingPage = typeof window !== "undefined" && window.location.pathname === "/";
        
        if (isLandingPage) {
          // Force reset demo role to USER on landing
          localStorage.setItem("amazon-demo-role", "USER");
          
          if (initialUser && initialUser.role !== "USER") {
            const switchRes = await fetch("/api/auth/demo-switch-role", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: "USER" }),
            });
            if (switchRes.ok) {
                const switchData = await switchRes.json();
                initialUser = switchData.user;
            }
          }
        } else {
          // 3. Check localStorage for demo role persistence (only on non-landing pages)
          const savedRole = localStorage.getItem("amazon-demo-role") as any;
          if (savedRole && initialUser && initialUser.role !== savedRole) {
              const switchRes = await fetch("/api/auth/demo-switch-role", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ role: savedRole }),
              });
              if (switchRes.ok) {
                  const switchData = await switchRes.json();
                  initialUser = switchData.user;
              }
          }
        }

        setUser(initialUser || { id: "guest-user", name: "Guest User", email: "guest@example.com", role: "USER" });
      } catch (error) {
        console.error("Auth init error:", error);
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, []);

  // Watch for navigation to landing page to reset role
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname === "/" && user && user.role !== "USER") {
      // Small timeout to prevent interference with initial mount
      const t = setTimeout(() => {
        switchRole("USER");
      }, 500);
      return () => clearTimeout(t);
    }
  }, []); // Only on mount to handle direct landing.
  // For navigation, we can use a more reactive approach if needed, 
  // but most 'Landing Page Load' signals are handled by the component.

  const signInUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem("amazon-yashita-auth", JSON.stringify(userData));
  };

  const signOutUser = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      setUser(null);
      localStorage.removeItem("amazon-yashita-auth");
      
      // Re-fetch to get dummy user again if needed for guest mode 
      const response = await fetch("/api/auth/me");
      const data = await response.json();
      setUser(data.user);
    } catch (e) {
      console.error("Signout error:", e);
      setUser(null);
    }
  };

  const switchRole = async (role: "USER" | "ADMIN" | "DELIVERY") => {
    try {
      const response = await fetch("/api/auth/demo-switch-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        
        // Persist in localStorage as requested for demo
        localStorage.setItem("amazon-demo-role", role);
        
        // Smooth transition: No reload. 
        // We notify other components via state update above.
        
        // Automatic redirection as requested
        if (role === "ADMIN") router.push("/admin");
        else if (role === "DELIVERY") router.push("/delivery");
        else router.push("/");
      }
    } catch (e) {
      console.error("Failed to switch role", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signInUser, signOutUser, switchRole, isLoading }}>
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
