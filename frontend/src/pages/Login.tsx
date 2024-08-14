import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import useAppStore from "../store/useStore";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import ErrorMessage from "../components/ErrorMessage";
import { User } from "../types";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post<{ token: string; user: User }>(
        "/auth/login",
        { email, password }
      );
      const { token, user } = response.data;
      login(user, token);
      navigate("/dashboard");
    } catch (error) {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Login to CodeSprint
      </h1>
      {error && <ErrorMessage message={error} />}
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputBox
          label="Email"
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <InputBox
          label="Password"
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{" "}
        <a
          href="/register"
          className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
        >
          Register here
        </a>
      </p>
    </div>
  );
};

export default Login;
