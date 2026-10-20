"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { AuthUser, UserRole } from "@/types";
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Shield,
  ArrowLeft,
  Search,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  RefreshCw,
  UserCheck,
  UserX,
  Sparkles,
} from "lucide-react";

interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  username?: string | null;
  role: string;
  image?: string | null;
  emailVerified: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const currentUser = session?.user as (AuthUser & Record<string, unknown>) | undefined;
  const isAdmin = currentUser?.role === "admin";

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        setStatusMessage({
          type: "error",
          text: data.error || "Failed to load users.",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Network error loading users.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const handleUpdateRole = async (targetUserId: string, newRole: UserRole) => {
    setUpdatingUserId(targetUserId);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/admin/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId, role: newRole }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage({
          type: "success",
          text: data.message || `Role updated to ${newRole.toUpperCase()}`,
        });
        // Optimistically update local state
        setUsers((prev) =>
          prev.map((u) => (u.id === targetUserId ? { ...u, role: newRole } : u))
        );
      } else {
        setStatusMessage({
          type: "error",
          text: data.error || "Failed to update role.",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Network failure while updating user role.",
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-stone-950">
        <div className="flex items-center gap-3 text-stone-400 text-sm">
          <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span>Verifying administrator credentials...</span>
        </div>
      </div>
    );
  }

  // Gate 1: Not Logged In
  if (!session) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-stone-950">
        <div className="max-w-md w-full bg-stone-900/80 border border-stone-800 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-serif text-stone-100 font-bold mb-2">
            Administrator Sign In Required
          </h2>
          <p className="text-sm text-stone-400 mb-6">
            You must be logged in with an administrator account to manage user roles and permissions.
          </p>
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-semibold text-sm hover:from-amber-400 hover:to-amber-500 transition"
          >
            <span>Sign In to Continue</span>
          </Link>
        </div>
      </div>
    );
  }

  // Gate 2: Logged in but not Admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-stone-950">
        <div className="max-w-md w-full bg-stone-900/80 border border-stone-800 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-serif text-stone-100 font-bold mb-2">
            Administrator Access Required
          </h2>
          <p className="text-sm text-stone-400 mb-2">
            Logged in as <span className="text-stone-200 font-semibold">{currentUser?.email}</span>
          </p>
          <p className="text-xs text-amber-400/90 font-mono mb-4">
            Current Role: <span className="uppercase font-bold">{currentUser?.role || "user"}</span>
          </p>
          <p className="text-xs text-stone-400 mb-6 leading-relaxed">
            Only designated Administrators can view and modify user roles. A user cannot be made moderator or admin until an existing administrator activates them.
          </p>

          <div className="space-y-3">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs transition"
            >
              <span>Return to Catalog</span>
            </Link>
            <Link
              href="/profile"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition"
            >
              <span>View Your Profile</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Metrics
  const totalUsers = users.length;
  const adminUsers = users.filter((u) => u.role === "admin").length;
  const moderatorUsers = users.filter((u) => u.role === "moderator").length;
  const regularUsers = users.filter((u) => u.role !== "admin" && u.role !== "moderator").length;

  // Search Filter
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-stone-950">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-semibold transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
            </Link>
            <Link
              href="/profile"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-400 hover:text-stone-200 transition"
            >
              <span>Profile</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/add-product"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 text-xs font-medium transition"
            >
              <PlusCircle className="w-3.5 h-3.5 text-red-400" />
              <span>Add Catalog Product</span>
            </Link>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ADMIN AUTHORIZED</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-stone-100 flex items-center gap-2">
              <Users className="w-7 h-7 text-amber-500" />
              <span>User Role Governance</span>
            </h1>
            <p className="text-sm text-stone-400 mt-1">
              Inspect registered accounts and activate <strong>Moderator</strong> or <strong>Admin</strong> status. Users cannot promote themselves without your explicit authorization.
            </p>
          </div>

          <button
            onClick={fetchUsers}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-500/40 text-stone-300 text-xs font-medium transition disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Users</span>
          </button>
        </div>

        {/* Feedback Banners */}
        {statusMessage && (
          <div
            className={`p-4 rounded-xl flex items-start gap-3 text-xs ${
              statusMessage.type === "success"
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                : "bg-red-500/10 border border-red-500/20 text-red-300"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            )}
            <span className="flex-1 font-medium">{statusMessage.text}</span>
          </div>
        )}

        {/* Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800">
            <div className="text-[11px] font-mono uppercase text-stone-400 mb-1">Total Registered</div>
            <div className="text-2xl font-bold font-mono text-stone-100">{totalUsers}</div>
          </div>
          <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30">
            <div className="text-[11px] font-mono uppercase text-red-400 mb-1">Administrators</div>
            <div className="text-2xl font-bold font-mono text-red-300">{adminUsers}</div>
          </div>
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30">
            <div className="text-[11px] font-mono uppercase text-blue-400 mb-1">Moderators</div>
            <div className="text-2xl font-bold font-mono text-blue-300">{moderatorUsers}</div>
          </div>
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
            <div className="text-[11px] font-mono uppercase text-emerald-400 mb-1">Standard Users</div>
            <div className="text-2xl font-bold font-mono text-emerald-300">{regularUsers}</div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, @username, or role..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900/80 border border-stone-800 text-stone-100 placeholder-stone-500 text-xs focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        {/* Users Table */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl overflow-hidden backdrop-blur-xl">
          {loading && users.length === 0 ? (
            <div className="p-12 text-center text-stone-400 text-sm">
              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <span>Loading user directory from MongoDB...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-stone-400 text-sm">
              <Users className="w-8 h-8 text-stone-600 mx-auto mb-2" />
              <p>No user accounts found matching your query.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-800 bg-stone-950/50 text-stone-400 font-mono text-[11px] uppercase">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Current Role</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4 text-right">Assign / Turn On Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60">
                  {filteredUsers.map((item) => {
                    const isSelf = item.id === currentUser?.id;
                    const isBusy = updatingUserId === item.id;
                    const joined = new Date(item.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });

                    return (
                      <tr key={item.id} className="hover:bg-stone-800/30 transition">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 text-stone-950 font-bold flex items-center justify-center text-xs shrink-0">
                              {item.name ? item.name[0].toUpperCase() : "U"}
                            </div>
                            <div>
                              <div className="font-semibold text-stone-200 flex items-center gap-1.5">
                                <span>{item.name || "Anonymous"}</span>
                                {isSelf && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                                    YOU
                                  </span>
                                )}
                              </div>
                              {item.username && (
                                <div className="text-[11px] font-mono text-amber-400/80">
                                  @{item.username}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-stone-300 font-mono text-[11px]">
                          {item.email}
                        </td>

                        <td className="py-3.5 px-4">
                          {item.role === "admin" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold font-mono text-[10px]">
                              <ShieldAlert className="w-3 h-3" />
                              ADMIN
                            </span>
                          )}
                          {item.role === "moderator" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold font-mono text-[10px]">
                              <Shield className="w-3 h-3" />
                              MODERATOR
                            </span>
                          )}
                          {item.role !== "admin" && item.role !== "moderator" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-800 border border-stone-700 text-stone-300 font-medium text-[10px]">
                              <ShieldCheck className="w-3 h-3 text-stone-400" />
                              USER
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-stone-400 font-mono text-[11px]">
                          {joined}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            {/* Make Admin Button */}
                            <button
                              onClick={() => handleUpdateRole(item.id, "admin")}
                              disabled={isBusy || item.role === "admin"}
                              title="Turn on Admin permissions"
                              className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold transition flex items-center gap-1 ${
                                item.role === "admin"
                                  ? "border-red-500/40 bg-red-500/10 text-red-300 opacity-60 cursor-default"
                                  : "border-stone-700 hover:border-red-500/50 bg-stone-900 hover:bg-red-950/30 text-stone-300 hover:text-red-300 cursor-pointer"
                              } disabled:opacity-40`}
                            >
                              <ShieldAlert className="w-3 h-3" />
                              <span>Admin</span>
                            </button>

                            {/* Make Moderator Button */}
                            <button
                              onClick={() => handleUpdateRole(item.id, "moderator")}
                              disabled={isBusy || item.role === "moderator"}
                              title="Turn on Moderator permissions"
                              className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold transition flex items-center gap-1 ${
                                item.role === "moderator"
                                  ? "border-blue-500/40 bg-blue-500/10 text-blue-300 opacity-60 cursor-default"
                                  : "border-stone-700 hover:border-blue-500/50 bg-stone-900 hover:bg-blue-950/30 text-stone-300 hover:text-blue-300 cursor-pointer"
                              } disabled:opacity-40`}
                            >
                              <Shield className="w-3 h-3" />
                              <span>Mod</span>
                            </button>

                            {/* Set Standard User Button */}
                            <button
                              onClick={() => handleUpdateRole(item.id, "user")}
                              disabled={
                                isBusy ||
                                (item.role !== "admin" && item.role !== "moderator") ||
                                (isSelf && adminUsers <= 1)
                              }
                              title="Reset to standard user"
                              className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition flex items-center gap-1 ${
                                item.role !== "admin" && item.role !== "moderator"
                                  ? "border-stone-800 bg-stone-950 text-stone-500 opacity-60 cursor-default"
                                  : "border-stone-700 hover:border-stone-600 bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 cursor-pointer"
                              } disabled:opacity-40`}
                            >
                              <UserX className="w-3 h-3" />
                              <span>User</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
