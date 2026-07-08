import { Input } from "@/components/ui/input";

interface Props {

    label: string;

    placeholder: string;

    type?: string;

    register: any;

    error?: string;

}

export default function AuthInput({

    label,

    placeholder,

    type = "text",

    register,

    error,

}: Props) {

    return (

        <div className="space-y-2">

            <label className="font-medium">

                {label}

            </label>

            <Input

                type={type}

                placeholder={placeholder}

                {...register}

            />

            {error && (

                <p className="text-red-500 text-sm">

                    {error}

                </p>

            )}

        </div>

    )

}