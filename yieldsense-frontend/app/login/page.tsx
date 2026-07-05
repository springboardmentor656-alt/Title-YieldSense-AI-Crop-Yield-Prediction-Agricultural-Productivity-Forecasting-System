"use client";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/dashboard");
  };

  return (
    <button
      onClick={handleLogin}
      className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700"
    >
      Login
    </button>
  );
}