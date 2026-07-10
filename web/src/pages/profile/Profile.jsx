import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import authApi from "../../api/authApi";
import Button from "../../components/common/Button";

function Profile() {
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
  });

  const loadProfile = async () => {
    try {
      const response = await authApi.get("/me");
      setUser(response.data);
      setForm({
        full_name: response.data.full_name || "",
        phone: response.data.phone || "",
      });
    } catch {
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const response = await authApi.put("/profile", form);
      setUser(response.data);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Profile update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between bg-white px-8 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-green-800">YieldSense AI</h1>

        <Link
          to="/dashboard"
          className="rounded-lg bg-green-700 px-4 py-2 text-white hover:bg-green-800"
        >
          Dashboard
        </Link>
      </nav>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900">My Profile</h2>
          <p className="mt-2 text-gray-600">
            Manage your account information.
          </p>

          {user && (
            <div className="mt-6 rounded-xl bg-green-50 p-4 text-sm text-green-900">
              <p><b>Email:</b> {user.email}</p>
              <p><b>Role:</b> {user.role}</p>
              <p><b>Status:</b> {user.is_verified ? "Verified" : "Not Verified"}</p>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="mt-6 space-y-4">
            <input
              name="full_name"
              placeholder="Full name"
              value={form.full_name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-green-600"
            />

            <input
              name="phone"
              placeholder="Phone number"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-green-600"
            />

            <Button type="submit">Update Profile</Button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Profile;