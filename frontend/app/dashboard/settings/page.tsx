"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Settings as SettingsIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useProfile } from "@/hooks/useProfile";

import {
    passwordSchema,
    PasswordSchemaType,
    profileSchema,
    ProfileSchemaType,
} from "@/validators/settings.validator";

export default function SettingsPage() {

    const { profile, loading, updateProfile, changePassword } = useProfile();

    const {
        register: registerProfile,
        handleSubmit: handleProfileSubmit,
        reset: resetProfile,
        formState: { errors: profileErrors, isSubmitting: savingProfile },
    } = useForm<ProfileSchemaType>({
        resolver: zodResolver(profileSchema),
    });

    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        reset: resetPassword,
        formState: { errors: passwordErrors, isSubmitting: savingPassword },
    } = useForm<PasswordSchemaType>({
        resolver: zodResolver(passwordSchema),
    });

    useEffect(() => {

        if (profile) {
            resetProfile({
                full_name: profile.full_name,
                email: profile.email,
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile]);

    async function onProfileSubmit(data: ProfileSchemaType) {
        await updateProfile(data);
    }

    async function onPasswordSubmit(data: PasswordSchemaType) {

        const ok = await changePassword({
            current_password: data.current_password,
            new_password: data.new_password,
        });

        if (ok) {
            resetPassword();
        }

    }

    if (loading) {
        return <p>Loading settings...</p>;
    }

    return (
        <div className="space-y-8">

            <h1 className="text-4xl font-bold flex items-center gap-3">
                <SettingsIcon size={32} />
                Settings
            </h1>

            <form
                onSubmit={handleProfileSubmit(onProfileSubmit)}
                className="space-y-6 bg-white rounded-xl shadow p-8 max-w-xl"
            >
                <h2 className="text-xl font-bold">Profile</h2>

                <div>
                    <label>Full Name</label>
                    <Input {...registerProfile("full_name")} />
                    <p className="text-red-500 text-sm">
                        {profileErrors.full_name?.message}
                    </p>
                </div>

                <div>
                    <label>Email</label>
                    <Input type="email" {...registerProfile("email")} />
                    <p className="text-red-500 text-sm">
                        {profileErrors.email?.message}
                    </p>
                </div>

                <div>
                    <label>Role</label>
                    <Input value={profile?.role ?? ""} disabled />
                </div>

                <Button className="w-full" disabled={savingProfile}>
                    {savingProfile ? "Saving..." : "Save Profile"}
                </Button>
            </form>

            <form
                onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                className="space-y-6 bg-white rounded-xl shadow p-8 max-w-xl"
            >
                <h2 className="text-xl font-bold">Change Password</h2>

                <div>
                    <label>Current Password</label>
                    <Input
                        type="password"
                        {...registerPassword("current_password")}
                    />
                    <p className="text-red-500 text-sm">
                        {passwordErrors.current_password?.message}
                    </p>
                </div>

                <div>
                    <label>New Password</label>
                    <Input
                        type="password"
                        {...registerPassword("new_password")}
                    />
                    <p className="text-red-500 text-sm">
                        {passwordErrors.new_password?.message}
                    </p>
                </div>

                <div>
                    <label>Confirm New Password</label>
                    <Input
                        type="password"
                        {...registerPassword("confirm_password")}
                    />
                    <p className="text-red-500 text-sm">
                        {passwordErrors.confirm_password?.message}
                    </p>
                </div>

                <Button className="w-full" disabled={savingPassword}>
                    {savingPassword ? "Updating..." : "Update Password"}
                </Button>
            </form>

        </div>
    );

}
