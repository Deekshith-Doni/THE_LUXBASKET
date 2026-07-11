"use client";
import { useEffect, useState } from "react";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  MessageSquare,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const statusColors = {
  pending: "text-yellow-600 bg-yellow-50",
  confirmed: "text-blue-600 bg-blue-50",
  shipped: "text-indigo-600 bg-indigo-50",
  delivered: "text-emerald bg-emerald/10",
  cancelled: "text-red-600 bg-red-50",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-gold" />
      </div>
    );
  }

  const chartData = (stats?.monthlyRevenue || []).map((m) => ({
    month: months[m._id.month - 1],
    revenue: m.revenue,
    orders: m.orders,
  }));

  const metricCards = [
    {
      label: "Total Revenue",
      value: formatPrice(stats?.totalRevenue || 0),
      icon: TrendingUp,
      color: "text-gold",
      bg: "bg-gold/10",
      change: "+12.5%",
      positive: true,
    },
    {
      label: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: "text-blue-500",
      bg: "bg-blue-50",
      change: "+8.3%",
      positive: true,
    },
    {
      label: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-50",
      change: "+15.2%",
      positive: true,
    },
    {
      label: "Active Products",
      value: stats?.totalProducts || 0,
      icon: Package,
      color: "text-emerald",
      bg: "bg-emerald/10",
      change: "0%",
      positive: true,
    },
    {
      label: "New Inquiries",
      value: stats?.newInquiries || 0,
      icon: MessageSquare,
      color: "text-orange-500",
      bg: "bg-orange-50",
      change: "+3 today",
      positive: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl text-charcoal">Dashboard</h1>
        <p className="font-body text-sm text-charcoal/50 mt-1">
          Welcome back! Here&apos;s what&apos;s happening with The Lux Basket.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {metricCards.map((card) => (
          <div
            key={card.label}
            className="bg-white border border-beige p-5 hover:shadow-card transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-10 h-10 ${card.bg} flex items-center justify-center`}
              >
                <card.icon size={18} className={card.color} />
              </div>
              <span
                className={`text-xs font-body font-medium ${card.positive ? "text-emerald" : "text-red-500"} flex items-center gap-0.5`}
              >
                <ArrowUpRight size={12} />
                {card.change}
              </span>
            </div>
            <p className="font-heading text-2xl font-medium text-charcoal">
              {card.value}
            </p>
            <p className="text-xs font-body text-charcoal/50 mt-0.5">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white border border-beige p-6">
          <h3 className="font-heading text-xl text-charcoal mb-5">
            Monthly Revenue
          </h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8DDCF" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fontFamily: "Inter" }}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fontFamily: "Inter" }}
                  axisLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(v) => formatPrice(v)}
                  contentStyle={{
                    fontFamily: "Inter",
                    fontSize: 12,
                    border: "1px solid #E8DDCF",
                    borderRadius: 0,
                  }}
                />

                <Bar dataKey="revenue" fill="#D4AF37" radius={0} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-60 flex items-center justify-center text-charcoal/30 font-body text-sm">
              No revenue data yet
            </div>
          )}
        </div>

        {/* Orders Chart */}
        <div className="bg-white border border-beige p-6">
          <h3 className="font-heading text-xl text-charcoal mb-5">
            Monthly Orders
          </h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8DDCF" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fontFamily: "Inter" }}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fontFamily: "Inter" }}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    fontFamily: "Inter",
                    fontSize: 12,
                    border: "1px solid #E8DDCF",
                    borderRadius: 0,
                  }}
                />
                <Bar dataKey="orders" fill="#0F3D3E" radius={0} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-60 flex items-center justify-center text-charcoal/30 font-body text-sm">
              No order data yet
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-beige">
        <div className="flex items-center justify-between px-6 py-4 border-b border-beige">
          <h3 className="font-heading text-xl text-charcoal">Recent Orders</h3>
          <a
            href="/admin/orders"
            className="text-xs font-body text-gold hover:text-gold-dark transition-colors"
          >
            View all →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-beige bg-beige-light/50">
                {["Order ID", "Customer", "Total", "Status", "Date"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-body font-bold tracking-widest uppercase text-charcoal/50"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {(stats?.recentOrders || []).length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-sm font-body text-charcoal/40"
                  >
                    No orders yet
                  </td>
                </tr>
              ) : (
                (stats?.recentOrders || []).map((order) => (
                  <tr
                    key={order.orderId}
                    className="border-b border-beige/50 hover:bg-beige-light/30 transition-colors"
                  >
                    <td className="px-5 py-4 text-sm font-body font-medium text-charcoal">
                      {order.orderId}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-body text-charcoal">
                        {order.user?.name}
                      </p>
                      <p className="text-xs font-body text-charcoal/50">
                        {order.user?.email}
                      </p>
                    </td>
                    <td className="px-5 py-4 font-heading text-base text-emerald">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-0.5 text-xs font-body font-semibold rounded-full capitalize ${statusColors[order.status] || "text-gray-600 bg-gray-50"}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-body text-charcoal/50">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { href: "/admin/products", label: "Add New Product", icon: Package },
          { href: "/admin/orders", label: "Manage Orders", icon: ShoppingBag },
          {
            href: "/admin/inquiries",
            label: "View Inquiries",
            icon: MessageSquare,
          },
          { href: "/admin/categories", label: "Add Category", icon: Package },
        ].map(({ href, label, icon: Icon }) => (
          <a
            key={href}
            href={href}
            className="flex items-center gap-3 p-4 bg-white border border-beige hover:border-gold hover:shadow-card transition-all group"
          >
            <Icon size={16} className="text-gold" />
            <span className="text-sm font-body font-medium text-charcoal group-hover:text-emerald transition-colors">
              {label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
