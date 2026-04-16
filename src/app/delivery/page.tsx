import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { 
  Truck, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  Shield
} from "lucide-react";

export default async function DeliveryDashboard() {
  const user = await getCurrentUser();

  const assignedOrders = [
    { id: "ORD-1284", customer: "Eva Edisson", address: "123 Main St, New York", time: "10:30 AM", status: "PENDING" },
    { id: "ORD-1285", customer: "John Doe", address: "456 Side St, Brooklyn", time: "11:15 AM", status: "SHIPPED" },
    { id: "ORD-1286", customer: "Jane Smith", address: "789 High Ave, Manhattan", time: "12:00 PM", status: "SHIPPED" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-[#131921] p-6 rounded-lg text-white mb-8 shadow-sm">
        <div className="flex items-center gap-4">
          <Truck size={32} className="text-[#FF9900]" />
          <div>
            <h1 className="text-2xl font-bold">Delivery Partner Hub</h1>
            <p className="text-gray-400 text-sm">Welcome back, <span className="font-bold text-white">{user.name}</span></p>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="mt-4 bg-[#232f3e] border-l-2 border-[#FF9900] p-3 rounded-r flex items-start gap-3">
          <div className="text-[#FF9900] pt-1">
             <Shield size={16} />
          </div>
          <p className="text-[11px] text-gray-300">
            <span className="font-bold text-white block mb-0.5">Evaluation Mode Active:</span>
            Role switching is enabled for demo purposes. Real-world delivery tracking requires partner-specific authentication tokens.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-sm font-bold text-gray-500 uppercase mb-4 flex items-center gap-2">
            <Clock size={16} /> Ready for Pickup
          </h2>
          <p className="text-3xl font-bold">8</p>
        </div>
        <div className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-sm font-bold text-gray-500 uppercase mb-4 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-500" /> Completed Today
          </h2>
          <p className="text-3xl font-bold">14</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <MapPin size={20} className="text-red-500" />
        Your Pending Deliveries
      </h2>

      <div className="space-y-4">
        {assignedOrders.map((order) => (
          <div key={order.id} className="bg-white p-6 border border-gray-100 rounded-lg shadow-sm hover:border-[#FF9900] transition-colors group">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-0.5 rounded uppercase">{order.status}</span>
                  <span className="text-sm font-mono text-gray-500">#{order.id}</span>
                </div>
                <p className="font-bold text-lg mb-1">{order.customer}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <MapPin size={14} /> {order.address}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar size={12} /> Expected By: {order.time}
                </div>
              </div>
              <button className="bg-[#FFD814] hover:bg-[#F7CA00] text-black px-4 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2 self-end sm:self-center">
                Get Directions <ArrowRight size={16} />
              </button>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-50 flex gap-2">
              <button className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 py-2 rounded font-bold text-xs transition-colors">
                MARK AS DELIVERED
              </button>
              <button className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 py-2 rounded font-bold text-xs transition-colors">
                UNABLE TO DELIVER
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
