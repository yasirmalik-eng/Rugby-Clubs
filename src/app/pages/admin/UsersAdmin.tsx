import { useEffect, useState } from "react";
import { Users, Shield, Key, Loader2, Check, X, UserCog } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { toast } from "sonner";
import type { Database } from "../../../lib/database.types";
import { AdminFormDialog } from "../../components/admin/AdminFormDialog";

type User = Database["public"]["Tables"]["users"]["Row"];

export function UsersAdmin() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // My Password State
  const [myPassword, setMyPassword] = useState("");
  const [myPasswordConfirm, setMyPasswordConfirm] = useState("");
  const [updatingMyPassword, setUpdatingMyPassword] = useState(false);

  // Other User Password State
  const [passwordTarget, setPasswordTarget] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [updatingOtherPassword, setUpdatingOtherPassword] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false });
    setError(error?.message ?? null);
    setUsers(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void fetchUsers();
  }, []);

  const handleUpdateMyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myPassword || myPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (myPassword !== myPasswordConfirm) {
      toast.error("Passwords do not match.");
      return;
    }

    setUpdatingMyPassword(true);
    const { error } = await supabase.auth.updateUser({ password: myPassword });
    setUpdatingMyPassword(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Your password has been updated securely.");
      setMyPassword("");
      setMyPasswordConfirm("");
    }
  };

  const handleUpdateRole = async (userId: string, newRole: "owner" | "writer" | "fan") => {
    const { error } = await supabase.from("users").update({ role: newRole }).eq("id", userId);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("User role updated successfully.");
      void fetchUsers();
    }
  };

  const handleForceResetPassword = async () => {
    if (!passwordTarget) return;
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setUpdatingOtherPassword(true);
    
    // Call the secure edge function to use the Service Role key
    const { error } = await supabase.functions.invoke("admin-users", {
      body: {
        action: "update_password",
        targetUserId: passwordTarget.id,
        newPassword,
      },
    });

    setUpdatingOtherPassword(false);

    if (error) {
      toast.error("Failed to reset password: " + error.message);
    } else {
      toast.success(`${passwordTarget.full_name || passwordTarget.email}'s password was reset.`);
      setPasswordTarget(null);
      setNewPassword("");
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-600 transition-colors";

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Users & Accounts</h1>
        <p className="text-gray-500 mt-1">Manage your account password and website administrators.</p>
      </div>

      {/* My Account Section */}
      <div className="mb-12 bg-white/5 border border-white/10 rounded-2xl p-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-900/30 rounded-lg">
            <Key className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Update My Password</h2>
            <p className="text-gray-400 text-sm">Change your personal admin password securely.</p>
          </div>
        </div>

        <form onSubmit={handleUpdateMyPassword} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs mb-1 block">New Password</label>
              <input
                type="password"
                value={myPassword}
                onChange={(e) => setMyPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Confirm Password</label>
              <input
                type="password"
                value={myPasswordConfirm}
                onChange={(e) => setMyPasswordConfirm(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
                autoComplete="new-password"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={updatingMyPassword || !myPassword}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-700 hover:bg-red-600 disabled:bg-white/5 disabled:text-gray-500 text-white rounded-xl font-bold transition-colors text-sm"
          >
            {updatingMyPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Save New Password
          </button>
        </form>
      </div>

      {/* All Users Section */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-white/5 rounded-lg border border-white/10">
          <Users className="w-5 h-5 text-gray-300" />
        </div>
        <h2 className="text-xl font-bold text-white">All Registered Users</h2>
      </div>

      {error && <p className="mb-4 text-sm text-amber-400">{error}</p>}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10">
              <tr className="text-gray-500 text-left bg-black/20">
                <th className="px-5 py-4 font-semibold">User Details</th>
                <th className="px-5 py-4 font-semibold">Joined Date</th>
                <th className="px-5 py-4 font-semibold">Account Role</th>
                <th className="px-5 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-white font-semibold">{u.full_name || "Unnamed User"}</p>
                    <p className="text-gray-400 text-xs">{u.email}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-400">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : "Unknown"}
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleUpdateRole(u.id, e.target.value as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold appearance-none cursor-pointer outline-none transition-colors border ${
                        u.role === "owner"
                          ? "bg-red-900/20 text-red-400 border-red-900/40 hover:bg-red-900/40"
                          : u.role === "writer"
                            ? "bg-blue-900/20 text-blue-400 border-blue-900/40 hover:bg-blue-900/40"
                            : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <option value="fan" className="bg-zinc-900 text-white">Fan (Read Only)</option>
                      <option value="writer" className="bg-zinc-900 text-white">Writer (Manage Content)</option>
                      <option value="owner" className="bg-zinc-900 text-white">Owner (Full Admin)</option>
                    </select>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setPasswordTarget(u)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors text-xs font-medium"
                    >
                      <UserCog className="w-3.5 h-3.5" />
                      Reset Password
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <p className="text-center text-gray-600 py-12">No users found.</p>}
        </div>
      )}

      <AdminFormDialog
        open={Boolean(passwordTarget)}
        onOpenChange={(open) => !open && setPasswordTarget(null)}
        title="Force Password Reset"
        description={`Set a new password for ${passwordTarget?.email}. They will be able to log in with this immediately.`}
        footer={
          <>
            <button
              onClick={() => {
                setPasswordTarget(null);
                setNewPassword("");
              }}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              onClick={handleForceResetPassword}
              disabled={updatingOtherPassword || !newPassword}
              className="flex items-center gap-2 rounded-xl bg-red-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-60"
            >
              {updatingOtherPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />} 
              Reset Password
            </button>
          </>
        }
      >
        <div className="pt-2">
          <label className="text-gray-400 text-xs mb-1 block">New Password for {passwordTarget?.full_name}</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Type new password..."
            className={inputClass}
            autoFocus
          />
        </div>
      </AdminFormDialog>
    </div>
  );
}
