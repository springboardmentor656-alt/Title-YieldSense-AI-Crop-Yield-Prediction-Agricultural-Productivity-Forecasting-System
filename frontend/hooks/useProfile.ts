"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import * as AuthService from "@/services/auth.service";

import { User } from "@/types/user";

export function useProfile() {

    const [profile, setProfile] = useState<User | null>(null);

    const [loading, setLoading] = useState(true);

    async function load() {

        try {

            setLoading(true);

            const data = await AuthService.getMe();

            setProfile(data);

        }

        catch {

            toast.error("Unable to load profile");

        }

        finally {

            setLoading(false);

        }

    }

    async function updateProfile(data: { full_name: string; email: string }) {

        try {

            const updated = await AuthService.updateProfile(data);

            setProfile(updated);

            toast.success("Profile updated");

            return true;

        }

        catch (err: any) {

            toast.error(
                err?.response?.data?.detail || "Unable to update profile"
            );

            return false;

        }

    }

    async function changePassword(data: {
        current_password: string;
        new_password: string;
    }) {

        try {

            await AuthService.changePassword(data);

            toast.success("Password updated");

            return true;

        }

        catch (err: any) {

            toast.error(
                err?.response?.data?.detail || "Unable to update password"
            );

            return false;

        }

    }

    useEffect(() => {

        load();

    }, []);

    return {

        profile,

        loading,

        updateProfile,

        changePassword,

        refresh: load,

    };

}
