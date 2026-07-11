"use client";
import { useState, useEffect } from "react";
import { Search, Loader2, Trash2, Mail as MailIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter");
      const data = await res.json();
      if (res.ok) {
        setSubscribers(data.subscribers || []);
      } else {
        toast.error(data.error || "Failed to fetch subscribers");
      }
    } catch (err) {
      toast.error("Error fetching subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this subscriber?")) return;
    try {
      const res = await fetch(`/api/newsletter/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setSubscribers((prev) => prev.filter((sub) => sub._id !== id));
        toast.success("Subscriber removed successfully");
      } else {
        toast.error(data.error || "Failed to remove subscriber");
      }
    } catch (err) {
      toast.error("Error removing subscriber");
    }
  };

  const filteredSubscribers = subscribers.filter((sub) =>
    sub.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl text-charcoal">Subscribers</h1>
          <p className="text-sm font-body text-charcoal/50 mt-0.5">
            Manage newsletter subscriptions ({filteredSubscribers.length} total)
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email..."
          className="luxury-input pl-11 w-full max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-beige overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-gold" />
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="text-center py-20">
            <MailIcon size={48} className="text-beige-dark mx-auto mb-4" />
            <p className="font-heading text-2xl text-charcoal/40">No subscribers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-beige bg-beige-light/50">
                  <th className="px-5 py-3 text-left text-xs font-body font-bold tracking-widest uppercase text-charcoal/50">
                    Email Address
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-body font-bold tracking-widest uppercase text-charcoal/50">
                    Subscribed Date
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-body font-bold tracking-widest uppercase text-charcoal/50">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscribers.map((sub) => (
                  <tr key={sub._id} className="border-b border-beige/50 hover:bg-beige-light/20 transition-colors">
                    <td className="px-5 py-4 text-sm font-body text-charcoal font-medium">
                      {sub.email}
                    </td>
                    <td className="px-5 py-4 text-sm font-body text-charcoal/60">
                      {new Date(sub.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleDelete(sub._id)}
                        className="w-8 h-8 flex items-center justify-center border border-beige text-charcoal/50 hover:text-red-500 hover:border-red-300 transition-colors"
                        title="Remove Subscriber"
                      >
                        <Trash2 size={13} />
                      </button>
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
