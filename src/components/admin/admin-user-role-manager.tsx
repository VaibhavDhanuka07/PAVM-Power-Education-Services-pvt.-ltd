"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { APP_ROLES, AppRole, formatAppRoleLabel } from "@/lib/auth/roles";

type UserRoleRow = {
  id: string;
  email: string;
  full_name: string | null;
  role: AppRole;
  created_at: string;
};

export function AdminUserRoleManager({ users: initialUsers }: { users: UserRoleRow[] }) {
  const [users, setUsers] = useState<UserRoleRow[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string>("");
  const [status, setStatus] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((user) =>
      [user.email, user.full_name ?? "", user.role]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [users, search]);

  async function updateRole(userId: string, role: AppRole) {
    setBusyId(userId);
    setStatus("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus(json.error || "Failed to update role");
        return;
      }

      setUsers((prev) => prev.map((item) => (item.id === userId ? { ...item, role } : item)));
      setStatus("Role updated successfully.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-semibold">User Authority Management</h2>
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name/email..."
          className="w-full md:max-w-xs"
        />
      </div>
      <p className="mb-3 text-sm text-slate-600">
        Only admin can assign the <span className="font-semibold">associate</span> role.
      </p>
      {status ? <p className="mb-3 text-sm text-slate-600">{status}</p> : null}

      <div className="max-h-[360px] overflow-y-auto rounded-lg border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-slate-50">
            <tr className="border-b border-slate-200 text-left text-slate-600">
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Created</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-b border-slate-100">
                <td className="px-3 py-2 font-medium text-slate-900">{user.full_name || "-"}</td>
                <td className="px-3 py-2 text-slate-700">{user.email}</td>
                <td className="px-3 py-2">
                  <Select
                    value={user.role}
                    onChange={(event) => {
                      const nextRole = event.target.value as AppRole;
                      setUsers((prev) =>
                        prev.map((item) => (item.id === user.id ? { ...item, role: nextRole } : item)),
                      );
                    }}
                    className="h-9"
                  >
                    {APP_ROLES.map((roleOption) => (
                      <option key={roleOption} value={roleOption}>
                        {formatAppRoleLabel(roleOption)}
                      </option>
                    ))}
                  </Select>
                </td>
                <td className="px-3 py-2 text-slate-600">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString("en-IN") : "-"}
                </td>
                <td className="px-3 py-2">
                  <Button
                    size="sm"
                    disabled={busyId === user.id}
                    onClick={() => updateRole(user.id, user.role)}
                  >
                    Save Role
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-sm text-slate-500">
                  No users found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
