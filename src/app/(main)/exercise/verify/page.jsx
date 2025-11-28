"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { profileAPI } from "@/services/api";
import {
  FaCamera,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

export default function ExerciseVerify() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const [user, setUser] = useState(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadUser = () => {
      if (typeof window !== "undefined") {
        const userData = localStorage.getItem("user");
        if (userData) {
          try {
            setUser(JSON.parse(userData));
          } catch (e) {
            console.error("Error parsing user data:", e);
          }
        }

        const followUpData = localStorage.getItem("exercise_followup");
        if (followUpData) {
          try {
            const data = JSON.parse(followUpData);
            const today = new Date().toISOString().split("T")[0];
            if (data.date === today && data.completed) {
              setAlreadySubmitted(true);
            }
          } catch (e) {
            console.error("Error parsing follow-up data:", e);
          }
        }
      }
    };
    loadUser();
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      setSelectedFile(file);
      setError(null);
      setWarning(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    if (!user?.email) {
      setError("User information not found. Please login again.");
      return;
    }

    setUploading(true);
    setError(null);
    setWarning(null);

    try {
      const response = await profileAPI.validateExercise(
        selectedFile,
        user.email
      );

      if (response.is_exercise === true) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            "exercise_verify_success",
            JSON.stringify({
              verified: true,
              timestamp: Date.now(),
            })
          );
        }
        router.push("/exercise/take-followup");
      } else {
        setWarning(
          "The uploaded image does not appear to show an exercise. Please upload a clear image of you performing an exercise."
        );
      }
    } catch (err) {
      console.error("Error validating exercise:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to validate exercise. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    setWarning(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#f2b705]/10 rounded-full blur-[120px] animate-orb-1" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#f2b705]/5 rounded-full blur-[120px] animate-orb-2" />
        <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-white/5 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="w-full max-w-2xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="mb-4 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-500">
              Exercise Verification
            </h1>
            <p className="text-sm text-gray-400 mt-2">
              Upload an image of yourself performing an exercise for
              verification
            </p>
          </div>

          {alreadySubmitted && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 md:p-8 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                  <FaTimesCircle className="text-yellow-400 text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-yellow-400 mb-2">
                    Follow Up Already Submitted
                  </h3>
                  <p className="text-yellow-300 text-sm mb-4">
                    You have already submitted your follow-up for today. You can
                    only submit once per day. Please come back tomorrow to
                    submit your next follow-up.
                  </p>
                  <button
                    onClick={() => router.push("/exercise")}
                    className="px-6 py-2.5 bg-[#f2b705] text-black rounded-lg font-semibold hover:bg-[#d4a004] transition-colors"
                  >
                    Back to Exercise Page
                  </button>
                </div>
              </div>
            </div>
          )}

          {!alreadySubmitted && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
              {!preview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center cursor-pointer hover:border-[#f2b705]/50 transition-all group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#f2b705]/20 flex items-center justify-center group-hover:bg-[#f2b705]/30 transition-colors">
                      <FaCamera className="text-[#f2b705] text-2xl" />
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-1">
                        Click to upload exercise image
                      </p>
                      <p className="text-gray-400 text-sm">
                        PNG, JPG, or JPEG up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden border border-white/10">
                    <img
                      src={preview}
                      alt="Exercise preview"
                      className="w-full h-auto max-h-96 object-contain bg-black/20"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 rounded-full transition-colors"
                    >
                      <FaTimesCircle className="text-white text-lg" />
                    </button>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    Change Image
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              )}

              {error && (
                <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                  <FaTimesCircle className="text-red-400 text-xl flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-400 font-semibold">Error</p>
                    <p className="text-red-300 text-sm mt-1">{error}</p>
                  </div>
                </div>
              )}

              {warning && (
                <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-start gap-3">
                  <FaTimesCircle className="text-yellow-400 text-xl flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-400 font-semibold">
                      Verification Failed
                    </p>
                    <p className="text-yellow-300 text-sm mt-1">{warning}</p>
                  </div>
                </div>
              )}

              {preview && (
                <button
                  onClick={handleSubmit}
                  disabled={uploading}
                  className="mt-6 w-full px-6 py-3 bg-[#f2b705] text-black rounded-lg font-semibold hover:bg-[#d4a004] transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {uploading ? (
                    <>
                      <FaSpinner className="animate-spin text-lg" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="text-lg" />
                      <span>Verify Exercise</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
