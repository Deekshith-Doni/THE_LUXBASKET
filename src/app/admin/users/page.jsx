"use client";
import { useState, useEffect } from "react";
import { Loader2, Users as UsersIcon } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl text-charcoal">Users</h1>
          <p className="text-sm font-body text-charcoal/50 mt-0.5">
            View all registered customers and admins
          </p>
        </div>
      </div>

      <div className="bg-white border border-beige overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-gold" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20">
            <UsersIcon size={48} className="text-beige-dark mx-auto mb-4" />
            <p className="font-heading text-2xl text-charcoal/40">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-beige bg-beige-light/50">
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-charcoal/50">Name</th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-charcoal/50">Email</th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-charcoal/50">Role</th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-charcoal/50">Join Date</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-beige/50 hover:bg-beige-light/20">
                    <td className="px-5 py-4">
                      <p className="font-heading text-lg text-charcoal">{user.name}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-body text-emerald">{user.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded ${user.role === 'admin' ? 'bg-gold/20 text-emerald-dark' : 'bg-beige text-charcoal/70'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-body text-charcoal/70">
                        {new Date(user.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
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
