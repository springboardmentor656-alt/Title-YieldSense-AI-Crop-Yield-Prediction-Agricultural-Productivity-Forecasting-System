"use client";

import Link from "next/link";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {

    Select,

    SelectContent,

    SelectItem,

    SelectTrigger,

    SelectValue,

} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

import AuthInput from "./AuthInput";

import PasswordInput from "./PasswordInput";

import {

    registerSchema,

    RegisterSchemaType,

} from "@/validators/auth.validator";

import { useRegister } from "@/hooks/useRegister";

export default function RegisterForm() {

    const { registerUser } = useRegister();

    const {

        register,

        setValue,

        handleSubmit,

        formState: { errors, isSubmitting },

    } = useForm<RegisterSchemaType>({

        resolver: zodResolver(registerSchema),

        defaultValues: {

            role: "Farmer",

        },

    });

    const onSubmit = async (

        data: RegisterSchemaType

    ) => {

        await registerUser(data);

    };

    return (

        <div className="bg-white rounded-2xl shadow-xl p-8">

            <h1 className="text-4xl font-bold">

                Create Account

            </h1>

            <form

                className="space-y-5 mt-8"

                onSubmit={handleSubmit(onSubmit)}

            >

                <AuthInput

                    label="Full Name"

                    placeholder="John Doe"

                    register={register("full_name")}

                    error={errors.full_name?.message}

                />

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

                <div>

                    <label>

                        Role

                    </label>

                    <Select
                        defaultValue="Farmer"
                        onValueChange={(value) => {
                            if (value) {
                                setValue("role", value, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                });
                            }
                        }}
                    >

                        <SelectTrigger>

                            <SelectValue />

                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="Farmer">
                                Farmer
                            </SelectItem>

                            <SelectItem value="Agriculture Department">
                                Agriculture Department
                            </SelectItem>

                            <SelectItem value="Agri Consultant">
                                Agri Consultant
                            </SelectItem>

                            <SelectItem value="Researcher">
                                Researcher
                            </SelectItem>

                            <SelectItem value="Administrator">
                                Administrator
                            </SelectItem>
                        </SelectContent>
                    </Select>

                </div>

                <Button

                    className="w-full"

                    disabled={isSubmitting}

                >

                    {isSubmitting

                        ? "Creating..."

                        : "Register"}

                </Button>

            </form>

            <p className="mt-6 text-center">

                Already have an account?

                <Link

                    href="/login"

                    className="text-green-700 ml-2"

                >

                    Login

                </Link>

            </p>

        </div>

    );

}