"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { login } from "@/services/auth.service";
import Cookies from "js-cookie";

import { useAuthStore } from "@/store/authStore";

export function useLogin() {

    const router = useRouter();

    const setToken = useAuthStore(
        state => state.setToken
    );

    const loginUser = async (data: any) => {
        try {
            const response = await login(data);

            setToken(response.access_token);

            Cookies.set("token", response.access_token, {
                expires: 7,
                secure: false, // use false for localhost
                sameSite: "lax"
            });

            toast.success("Login Successful");

            router.push("/dashboard");

        } catch (error) {
            toast.error("Invalid Credentials");
        }
    };

    return {

        loginUser

    };

}
