"use client";

import { Users as UsersIcon, Trash2 } from "lucide-react";

import { useUsers } from "@/hooks/useUsers";

import { useAuthStore } from "@/store/authStore";

import { USER_ROLES } from "@/types/user";

export default function UsersPage() {

    const { users, loading, changeRole, toggleStatus, remove } = useUsers();

    const currentUserId = useAuthStore((state) => state.user?.sub);

    return (
        <div className="space-y-8">

            <h1 className="text-4xl font-bold flex items-center gap-3">
                <UsersIcon size={32} />
                Users
            </h1>

            {loading && <p>Loading users...</p>}

            <div className="bg-white rounded-xl shadow overflow-x-auto">

                <table className="w-full">

                    <thead>
                        <tr className="border-b">
                            <th className="p-4 text-left">Name</th>
                            <th className="text-left">Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {!loading && users.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-6 text-center text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        )}

                        {users.map((u) => {
                            const isSelf = String(u.id) === currentUserId;

                            return (
                                <tr key={u.id} className="border-b">
                                    <td className="p-4">{u.full_name}</td>
                                    <td>{u.email}</td>
                                    <td className="text-center">
                                        <select
                                            value={u.role}
                                            disabled={isSelf}
                                            onChange={(e) => changeRole(u.id, e.target.value)}
                                            className="border rounded-lg px-2 py-1 disabled:opacity-50"
                                        >
                                            {USER_ROLES.map((role) => (
                                                <option key={role} value={role}>
                                                    {role}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="text-center">
                                        <button
                                            onClick={() => toggleStatus(u.id, !u.is_active)}
                                            disabled={isSelf}
                                            className={`px-3 py-1 rounded-full text-xs font-medium disabled:opacity-50 ${
                                                u.is_active
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {u.is_active ? "Active" : "Inactive"}
                                        </button>
                                    </td>
                                    <td className="text-center">
                                        <button
                                            onClick={() => {
                                                if (
                                                    confirm(
                                                        `Delete user "${u.full_name}"? This cannot be undone.`
                                                    )
                                                ) {
                                                    remove(u.id);
                                                }
                                            }}
                                            disabled={isSelf}
                                            title="Delete"
                                            className="p-2 rounded-lg hover:bg-red-100 text-red-600 disabled:opacity-30 disabled:hover:bg-transparent"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>

                </table>

            </div>

        </div>
    );

}
