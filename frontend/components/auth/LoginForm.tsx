"use client";

import Link from "next/link";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

import AuthInput from "./AuthInput";

import PasswordInput from "./PasswordInput";

import { loginSchema, LoginSchemaType } from "@/validators/auth.validator";

import { useLogin } from "@/hooks/useLogin";

export default function LoginForm() {

    const { loginUser } = useLogin();

    const {

        register,

        handleSubmit,

        formState: { errors, isSubmitting },

    } = useForm<LoginSchemaType>({

        resolver: zodResolver(loginSchema),

    });

    const onSubmit = async (data: LoginSchemaType) => {

        await loginUser(data);

    };

    return (

        <div className="bg-white shadow-xl rounded-2xl p-8">

            <h1 className="text-4xl font-bold">

                Welcome Back 👋

            </h1>

            <p className="text-gray-500 mt-2">

                Login to continue

            </p>

            <form

                onSubmit={handleSubmit(onSubmit)}

                className="space-y-5 mt-8"

            >

                <AuthInput

                    label="Email"

                    placeholder="john@example.com"

                    type="email"

                    register={register("email")}

                    error={errors.email?.message}

                />

                <PasswordInput

                    register={register("password")}

                    error={errors.password?.message}

                />

                <Button

                    className="w-full"

                    disabled={isSubmitting}

                >

                    {isSubmitting

                        ? "Signing In..."

                        : "Login"}

                </Button>

            </form>

            <p className="text-center mt-6">

                Don't have an account?{" "}

                <Link

                    href="/register"

                    className="text-green-700 font-semibold"

                >

                    Register

                </Link>

            </p>

        </div>

    );

}