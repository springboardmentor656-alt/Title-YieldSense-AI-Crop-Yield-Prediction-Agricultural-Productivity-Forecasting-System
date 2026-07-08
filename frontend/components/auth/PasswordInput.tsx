"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";

interface Props {

    register: any;

    error?: string;

}

export default function PasswordInput({

    register,

    error,

}: Props) {

    const [show, setShow] = useState(false);

    return (

        <div>

            <label className="font-medium">

                Password

            </label>

            <div className="relative mt-2">

                <Input

                    type={show ? "text" : "password"}

                    {...register}

                />

                <button

                    type="button"

                    onClick={() => setShow(!show)}

                    className="absolute right-3 top-3"

                >

                    {show ? <EyeOff size={18} /> : <Eye size={18} />}

                </button>

            </div>

            {error && (

                <p className="text-red-500 text-sm mt-2">

                    {error}

                </p>

            )}

        </div>

    )

}