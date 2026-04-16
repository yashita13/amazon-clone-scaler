import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { 
  Users, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  ShieldCheck
} from "lucide-react";

export default async function AdminDashboard() {
  const user = await getCurrentUser();

  const stats = [
    { label: "Total Users", value: "1,284", icon: Users, color: "text-blue-600" },
    { label: "Products", value: "482", icon: Package, color: "text-green-600" },
    { label: "Pending Orders", value: "24", icon: ShoppingCart, color: "text-orange-600" },
    { label: "Monthly Revenue", value: "₹4.2L", icon: BarChart3, color: "text-purple-600" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShieldCheck className="text-[#e47911]" />
            Admin Control Center
          </h1>
          <p className="text-gray-500 mt-1">Logged in as: <span className="font-bold">{user.name}</span></p>
        </div>
        
        {/* Demo Notice */}
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4 rounded-r-md shadow-sm max-w-md hidden md:block">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-orange-700 font-bold">
                Evaluation Note:
              </p>
              <p className="text-xs text-orange-600 mt-1">
                Role switching is currently permitted for demo/evaluation purposes. In production, access is restricted to authenticated partners with secure tokens.
              </p>
            </div>
          </div>
        </div>

        <Link 
          href="/" 
          className="text-sm text-[#007185] hover:underline"
        >
          View Main Site
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-md bg-gray-50 ${item.color}`}>
                <item.icon size={24} />
              </div>
              <span className="text-xs font-bold text-green-500 font-mono">+12%</span>
            </div>
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="text-2xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Placeholder for Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Quick Management</h2>
          <div className="space-y-4">
            <button className="w-full text-left p-4 border border-gray-100 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-between">
              <span>Manage Product Inventory</span>
              <Settings size={18} className="text-gray-400" />
            </button>
            <button className="w-full text-left p-4 border border-gray-100 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-between">
              <span>Review Refund Requests</span>
              <Settings size={18} className="text-gray-400" />
            </button>
            <button className="w-full text-left p-4 border border-gray-100 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-between">
              <span>Configure System Settings</span>
              <Settings size={18} className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-start gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                <div>
                  <p className="text-sm font-medium">Order #ORD-{i}2B4 was placed</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
