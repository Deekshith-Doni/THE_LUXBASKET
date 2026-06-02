"use client";
import { useEffect, useState } from "react";
import { formatPrice, formatDate } from "@/lib/utils";
import { Package, ChevronRight } from "lucide-react";
import Link from "next/link";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-emerald/10 text-emerald",
  cancelled: "bg-red-100 text-red-600",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-28 w-full" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white border border-beige p-16 text-center">
        <Package size={48} className="text-beige-dark mx-auto mb-4" />
        <h2 className="font-heading text-3xl text-charcoal/40 mb-3">
          No Orders Yet
        </h2>
        <p className="font-body text-charcoal/40 mb-6">
          Start exploring our luxury collections
        </p>
        <Link href="/collections" className="btn-primary">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-heading text-2xl text-charcoal mb-6">My Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white border border-beige p-6 hover:border-gold/30 hover:shadow-card transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-body text-sm font-semibold text-charcoal">
                    {order.orderId}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 text-xs font-body font-semibold rounded-full capitalize ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-xs font-body text-charcoal/50">
                  {formatDate(order.createdAt)}
                </p>
                <p className="text-xs font-body text-charcoal/50 mt-1">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <span className="font-heading text-xl text-emerald font-medium">
                  {formatPrice(order.total)}
                </span>
                <button className="text-charcoal/40 hover:text-emerald transition-colors">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
