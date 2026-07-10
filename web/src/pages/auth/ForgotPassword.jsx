import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import authApi from "../../api/authApi";
import AuthLayout from "../../layouts/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import Button from "../../components/common/Button";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authApi.post("/forgot-password", { email });
      toast.success(`Reset token: ${response.data.reset_token}`);
      navigate("/reset-password");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to generate reset token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Forgot Password"
        subtitle="Generate a reset token for your account"
      >
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <input
            type="email"
            placeholder="Registered email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-green-600"
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Generating..." : "Generate Reset Token"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm">
          <Link to="/login" className="text-green-700">
            Back to login
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}

export default ForgotPassword;