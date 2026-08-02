"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import * as UserService from "@/services/user.service";

import { User } from "@/types/user";

export function useUsers() {

    const [users, setUsers] = useState<User[]>([]);

    const [loading, setLoading] = useState(true);

    async function load() {

        try {

            setLoading(true);

            const data = await UserService.getUsers();

            setUsers(data);

        }

        catch {

            toast.error("Unable to load users");

        }

        finally {

            setLoading(false);

        }

    }

    async function changeRole(id: number, role: string) {

        try {

            await UserService.updateUserRole(id, role);

            toast.success("Role updated");

            load();

        }

        catch {

            toast.error("Unable to update role");

        }

    }

    async function toggleStatus(id: number, is_active: boolean) {

        try {

            await UserService.updateUserStatus(id, is_active);

            toast.success(is_active ? "User activated" : "User deactivated");

            load();

        }

        catch {

            toast.error("Unable to update status");

        }

    }

    async function remove(id: number) {

        try {

            await UserService.deleteUser(id);

            toast.success("User deleted");

            load();

        }

        catch {

            toast.error("Unable to delete user");

        }

    }

    useEffect(() => {

        load();

    }, []);

    return {

        users,

        loading,

        changeRole,

        toggleStatus,

        remove,

        refresh: load,

    };

}
