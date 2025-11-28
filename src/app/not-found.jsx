"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaHome, FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#f2b705]/10 rounded-full blur-[120px] animate-orb-1" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#f2b705]/5 rounded-full blur-[120px] animate-orb-2" />
        <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-white/5 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto rounded-full bg-[#f2b705]/10 flex items-center justify-center mb-6">
              <FaExclamationTriangle className="text-[#f2b705] text-6xl" />
            </div>
            <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f2b705] via-[#d4a004] to-[#f2b705] mb-4">
              404
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Oops! The page you&apos;re looking for doesn&apos;t exist or has
              been moved.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/10 flex items-center justify-center gap-2"
              >
                <FaArrowLeft className="text-sm" />
                Go Back
              </button>
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-[#f2b705] text-black rounded-lg font-semibold hover:bg-[#d4a004] transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <FaHome className="text-sm" />
                Go to Dashboard
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-sm text-gray-400 mb-4">Quick Links:</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  href="/exercise"
                  className="px-4 py-2 bg-white/5 text-white rounded-lg text-sm hover:bg-white/10 transition-colors border border-white/10"
                >
                  Exercise
                </Link>
                <Link
                  href="/diet-suggestions"
                  className="px-4 py-2 bg-white/5 text-white rounded-lg text-sm hover:bg-white/10 transition-colors border border-white/10"
                >
                  Diet Plan
                </Link>
                <Link
                  href="/calorie-calculate"
                  className="px-4 py-2 bg-white/5 text-white rounded-lg text-sm hover:bg-white/10 transition-colors border border-white/10"
                >
                  Calories
                </Link>
                <Link
                  href="/profile"
                  className="px-4 py-2 bg-white/5 text-white rounded-lg text-sm hover:bg-white/10 transition-colors border border-white/10"
                >
                  Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
