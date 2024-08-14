import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import useAppStore from "../store/useStore";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import ErrorMessage from "../components/ErrorMessage";

const ProfileEdit: React.FC = () => {
  const { user, setUser } = useAppStore();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.put("/auth/profile", { name, email });
      setUser({ ...user!, name, email }); // Update the user in the global state
      navigate("/dashboard");
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to update profile");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
      {error && <ErrorMessage message={error} />}
      <form onSubmit={handleSubmit} className="max-w-md">
        <InputBox
          label="Name"
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <InputBox
          label="Email"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit">Update Profile</Button>
      </form>
    </div>
  );
};

export default ProfileEdit;
