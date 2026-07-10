import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import authApi from "../../api/authApi";
import AuthLayout from "../../layouts/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import Button from "../../components/common/Button";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    role: "farmer",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authApi.post("/register", form);
      toast.success("Registration successful");
      navigate("/send-otp");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Create Account"
        subtitle="Start using YieldSense AI"
      >
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            name="full_name"
            placeholder="Full name"
            value={form.full_name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-green-600"
          />

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
            name="phone"
            placeholder="Phone number"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-green-600"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-green-600"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-green-600"
          >
            <option value="farmer">Farmer</option>
            <option value="admin">Admin</option>
          </select>

          <Button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-green-700">
            Login
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}

export default Register;