"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Shield, Truck, User } from "lucide-react";

export default function HorizontalRoleBar() {
  const { user, switchRole } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) return null;

  const roles = [
    { 
      id: "USER", 
      label: "User Access", 
      desc: "Standard Shopping", 
      icon: User, 
      color: "border-gray-300 text-gray-700 bg-white", 
      activeColor: "bg-gray-100 border-gray-400" 
    },
    { 
      id: "ADMIN", 
      label: "Admin Access", 
      desc: "Inventory & More", 
      icon: Shield, 
      color: "border-red-300 text-red-700 bg-white", 
      activeColor: "bg-red-50 border-red-500" 
    },
    { 
      id: "DELIVERY", 
      label: "Delivery Partner", 
      desc: "Order Fulfillment", 
      icon: Truck, 
      color: "border-blue-300 text-blue-700 bg-white", 
      activeColor: "bg-blue-50 border-blue-500" 
    },
  ];

  return (
    <div className="w-full bg-[#f3f3f3] py-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-6">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Demo Evaluation Panel</p>
          <h2 className="text-xl font-bold text-gray-800">Switch Roles Instantly</h2>
          <p className="text-sm text-gray-500 mt-1">Explore different parts of the application by toggling personas below.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => switchRole(role.id as any)}
              className={`flex items-center gap-4 p-4 border-2 rounded-xl transition-all hover:shadow-md text-left ${
                user.role === role.id ? role.activeColor : `${role.color} hover:border-gray-400`
              }`}
            >
              <div className={`p-3 rounded-lg ${user.role === role.id ? "bg-white shadow-sm" : "bg-gray-50"}`}>
                <role.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-bold uppercase">{role.label}</p>
                <p className="text-xs opacity-70">{role.desc}</p>
                {user.role === role.id && (
                  <span className="inline-block mt-1 text-[10px] bg-[#e47911] text-white px-2 py-0.5 rounded-full font-bold">
                    ACTIVE PERSONA
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-8 text-center">
            <p className="text-[11px] text-gray-400 max-w-2xl mx-auto leading-relaxed italic">
                * This panel is for demonstration purposes. In a production environment, user roles are assigned via administrative tokens and secure authentication headers. Changes made here update your session state across the entire platform.
            </p>
        </div>
      </div>
    </div>
  );
}
