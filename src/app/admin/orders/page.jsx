"use client";
import { useState, useEffect } from "react";
import { Loader2, ShoppingBag, RefreshCw } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

const statusOptions = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
const statusColors = {
  pending: "text-yellow-600 bg-yellow-50",
  confirmed: "text-blue-600 bg-blue-50",
  processing: "text-purple-600 bg-purple-50",
  shipped: "text-indigo-600 bg-indigo-50",
  delivered: "text-emerald bg-emerald/10",
  cancelled: "text-red-600 bg-red-50",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    fetch(`/api/admin/orders${filterStatus ? `?status=${filterStatus}` : ""}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const updateStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.orderId === orderId ? { ...o, status } : o)),
        );
        toast.success("Order status updated");
      } else {
        toast.error("Failed to update status");
      }
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl text-charcoal">Orders</h1>
          <p className="text-sm font-body text-charcoal/50 mt-0.5">
            {orders.length} orders
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="btn-outline self-start flex items-center gap-2 py-2.5 px-4 text-xs"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap">
        {["", ...statusOptions].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 text-xs font-body font-semibold tracking-wide uppercase border transition-all ${
              filterStatus === s
                ? "bg-emerald text-ivory border-emerald"
                : "bg-white text-charcoal/60 border-beige hover:border-emerald"
            }`}
          >
            {s || "All Orders"}
          </button>
        ))}
      </div>

      <div className="bg-white border border-beige overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-gold" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={48} className="text-beige-dark mx-auto mb-4" />
            <p className="font-heading text-2xl text-charcoal/40">
              No orders found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-beige bg-beige-light/50">
                  {[
                    "Order ID",
                    "Customer",
                    "Items",
                    "Total",
                    "Status",
                    "Payment",
                    "Date",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-body font-bold tracking-widest uppercase text-charcoal/50"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-beige/50 hover:bg-beige-light/20 transition-colors"
                  >
                    <td className="px-4 py-4 text-sm font-body font-medium text-charcoal">
                      {order.orderId}
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-body text-charcoal">
                        {order.user?.name}
                      </p>
                      <p className="text-xs font-body text-charcoal/50">
                        {order.user?.email}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-sm font-body text-charcoal/70">
                      {order.items?.length} items
                    </td>
                    <td className="px-4 py-4 font-heading text-base text-emerald">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(order.orderId, e.target.value)
                        }
                        disabled={updatingId === order.orderId}
                        className={`text-xs font-body font-semibold px-2 py-1 border-0 rounded-full cursor-pointer ${statusColors[order.status] || "text-gray-600 bg-gray-50"} disabled:opacity-50`}
                      >
                        {statusOptions.map((s) => (
                          <option
                            key={s}
                            value={s}
                            className="bg-white text-charcoal capitalize"
                          >
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-2.5 py-0.5 text-xs font-body font-semibold rounded-full ${
                          order.paymentStatus === "paid"
                            ? "bg-emerald/10 text-emerald"
                            : order.paymentStatus === "failed"
                              ? "bg-red-50 text-red-600"
                              : "bg-yellow-50 text-yellow-600"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs font-body text-charcoal/50">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-4">
                      {updatingId === order.orderId && (
                        <Loader2 size={14} className="animate-spin text-gold" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
