import Image from "next/image";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">

            {/* Left Section */}

            <div className="hidden lg:flex relative flex-col justify-center items-center">

                <Image
                    src="/images/OIP.jpg"
                    alt="Agriculture"
                    fill
                    priority
                    className="object-cover"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/50"></div>

                {/* Content */}
                <div className="relative z-10 text-center text-white px-10">

                    <h1 className="text-6xl font-bold">
                        YieldSense AI
                    </h1>

                    <p className="mt-6 text-2xl">
                        Smart Agriculture Powered by Artificial Intelligence
                    </p>

                </div>

            </div>

            {/* Right Section */}

            <div className="flex items-center justify-center bg-gray-50">

                <div className="w-full max-w-md">

                    {children}

                </div>

            </div>

        </div>
    );
}