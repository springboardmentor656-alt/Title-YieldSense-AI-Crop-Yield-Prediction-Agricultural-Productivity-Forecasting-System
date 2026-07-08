"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { register } from "@/services/auth.service";

export function useRegister() {

    const router = useRouter();

    const registerUser = async (data: any) => {

        await register(data);

        router.push("/login");

    };

    return {

        registerUser

    };

}
toast.success("Registration Successful"); 5