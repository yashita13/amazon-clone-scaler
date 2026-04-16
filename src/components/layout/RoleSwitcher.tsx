"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { Shield, Truck, User, ChevronDown } from "lucide-react";

export default function RoleSwitcher() {
  const { user, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted || !user) return null;

  const roles = [
    { id: "USER", label: "USER", icon: User, color: "bg-gray-100 text-gray-700 border-gray-200", badge: "bg-gray-500" },
    { id: "ADMIN", label: "ADMIN", icon: Shield, color: "bg-red-50 text-red-700 border-red-200", badge: "bg-red-600" },
    { id: "DELIVERY", label: "DELIVERY", icon: Truck, color: "bg-blue-50 text-blue-700 border-blue-200", badge: "bg-blue-600" },
  ];

  const currentRole = roles.find(r => r.id === user.role) || roles[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-extrabold transition-all hover:shadow-md active:scale-95 ${currentRole.color}`}
        title="Quick Role Switcher (Demo Only)"
      >
        <div className="relative flex items-center justify-center">
            <span className={`w-2 h-2 rounded-full ${currentRole.badge}`}></span>
            <span className={`absolute w-2 h-2 rounded-full ${currentRole.badge} animate-ping opacity-75`}></span>
        </div>
        <span className="hidden md:inline text-gray-500 font-medium">Demo Mode:</span>
        <span className="tracking-tight uppercase">{currentRole.label}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl py-2 min-w-[180px] z-[300] overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Select Access Level</p>
          </div>
          <div className="p-1">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={async () => {
                  await switchRole(role.id as any);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-all ${
                  user.role === role.id 
                    ? "bg-[#FEBD69]/10 text-[#e47911] font-bold" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className={`p-1.5 rounded-md ${user.role === role.id ? "bg-[#FEBD69]/20" : "bg-gray-100 text-gray-400"}`}>
                    <role.icon size={16} />
                </div>
                {role.label}
                {user.role === role.id && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#e47911]"></div>
                )}
              </button>
            ))}
          </div>
          <div className="px-4 py-2 mt-1 border-t border-gray-100 bg-gray-50/50">
            <p className="text-[9px] text-gray-400 leading-tight">
                * Switches JWT Session immediately. No login required.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
