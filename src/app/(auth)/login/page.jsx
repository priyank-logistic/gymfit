"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AuthInput from "@/components/AuthInput";
import Button from "@/components/Button";
import { authAPI } from "@/services/api";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        router.push("/dashboard");
      } else {
        setCheckingAuth(false);
      }
    }
  }, [router]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = "Email is required";
    } else if (!/^[\w\.-]+@[\w\.-]+\.\w+$/.test(formData.emailOrPhone)) {
      newErrors.emailOrPhone = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    if (apiError) {
      setApiError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.login({
        username: formData.emailOrPhone.trim(),
        password: formData.password,
      });

      // Store access_token from response
      if (response.access_token) {
        localStorage.setItem("token", response.access_token);
      }

      // Store user data
      const userData = {
        id: response.auth_id,
        name: response.name,
        email: response.email,
        phone: response.phone || "",
      };
      localStorage.setItem("user", JSON.stringify(userData));

      router.push("/dashboard");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.detail ||
        "Login failed. Please check your credentials and try again.";
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#f2b705] mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center mb-6 hover:opacity-80 transition-opacity"
          >
            <img
              src="/GYMFIT.svg"
              alt="GymFit Logo"
              height={60}
              className="h-16 w-44 min-w-44 object-contain"
            />
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your fitness journey</p>
        </div>

        <div className="bg-black border border-[#f2b705]/20 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <AuthInput
              label="Email"
              type="email"
              name="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={handleChange}
              placeholder="Enter your email"
              error={errors.emailOrPhone}
              required
              autoComplete="email"
            />

            <AuthInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              error={errors.password}
              required
              autoComplete="current-password"
            />

            {apiError && (
              <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                {apiError}
              </div>
            )}

            <Button type="submit" loading={isLoading} variant="primary">
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-[#f2b705] hover:text-[#d4a004] font-semibold transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
