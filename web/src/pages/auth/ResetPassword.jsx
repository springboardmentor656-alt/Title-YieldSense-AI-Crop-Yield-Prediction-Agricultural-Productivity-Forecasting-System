import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import authApi from "../../api/authApi";
import AuthLayout from "../../layouts/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import Button from "../../components/common/Button";

function ResetPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    reset_token: "",
    new_password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authApi.post("/reset-password", form);
      toast.success("Password updated successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard title="Reset Password" subtitle="Create a new account password">
        <form onSubmit={handleResetPassword} className="space-y-4">
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
            name="reset_token"
            placeholder="Reset token"
            value={form.reset_token}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-green-600"
          />

          <input
            name="new_password"
            type="password"
            placeholder="New password"
            value={form.new_password}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-green-600"
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Reset Password"}
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

export default ResetPassword;