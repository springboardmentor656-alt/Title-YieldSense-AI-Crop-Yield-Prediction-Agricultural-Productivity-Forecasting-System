import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import authApi from "../../api/authApi";
import AuthLayout from "../../layouts/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import Button from "../../components/common/Button";

function VerifyOTP() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    otp_code: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authApi.post("/verify-otp", form);
      toast.success("Email verified successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.detail || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard title="Verify OTP" subtitle="Enter the OTP sent to your email">
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-green-600"
          />

          <input
            name="otp_code"
            placeholder="OTP code"
            value={form.otp_code}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-green-600"
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm">
          Didn't receive OTP?{" "}
          <Link to="/send-otp" className="text-green-700">
            Resend
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}

export default VerifyOTP;