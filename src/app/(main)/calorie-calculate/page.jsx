"use client";

import React, { useState, useRef, useEffect } from "react";
import { profileAPI } from "@/services/api";

export default function CalorieCalculate() {
  const [imageSource, setImageSource] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [caloriesResult, setCaloriesResult] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

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
      }
    };
    loadUser();
  }, []);

  const handleSourceSelect = (source) => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setImageSource(source);
    setCapturedImage(null);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);

      const imageData = canvas.toDataURL("image/jpeg");
      setCapturedImage(imageData);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], "captured-image.jpeg", {
              type: "image/jpeg",
            });
            setImageFile(file);
          }
        },
        "image/jpeg",
        0.9
      );

      stopCamera();
    }
  };

  const handleAnalyze = async () => {
    if (!capturedImage || !imageFile) return;
    if (!user?.name || !user?.email) {
      setError("User information not found. Please login again.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setCaloriesResult(null);

    try {
      const result = await profileAPI.detectCalories(
        imageFile,
        user.name,
        user.email
      );
      setCaloriesResult(result);
    } catch (err) {
      console.error("Error detecting calories:", err);
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          "Failed to detect calories. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setCapturedImage(null);
    setImageFile(null);
    setImageSource(null);
    setCaloriesResult(null);
    setError(null);
    stopCamera();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  React.useEffect(() => {
    if (imageSource === "camera") {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [imageSource]);

  return (
    <div className="p-4 md:p-6 bg-black min-h-screen">
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
          Calorie Calculator
        </h1>
        <p className="text-gray-400 text-sm">
          Upload or capture a photo of your meal to calculate calories
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {!imageSource && !capturedImage && (
          <div className="bg-gradient-to-br from-black via-gray-900 to-black border border-[#f2b705]/30 rounded-xl shadow-xl p-4">
            <h2 className="text-base font-semibold text-white mb-4 text-center">
              Choose Image Source
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleSourceSelect("camera")}
                className="group relative overflow-hidden rounded-lg border border-[#f2b705]/30 hover:border-[#f2b705] transition-all duration-300 bg-gray-900/50 p-4 hover:bg-gray-900 hover:shadow-md hover:shadow-[#f2b705]/20"
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-14 h-14 bg-[#f2b705] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-7 h-7 text-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-white">
                    Use Camera
                  </h3>
                  <p className="text-xs text-gray-400 text-center">
                    Capture a photo directly from your device camera
                  </p>
                </div>
              </button>

              <button
                onClick={() => {
                  fileInputRef.current?.click();
                }}
                className="group relative overflow-hidden rounded-lg border border-[#f2b705]/30 hover:border-[#f2b705] transition-all duration-300 bg-gray-900/50 p-4 hover:bg-gray-900 hover:shadow-md hover:shadow-[#f2b705]/20"
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-14 h-14 bg-[#f2b705] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-7 h-7 text-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-white">
                    Upload from Device
                  </h3>
                  <p className="text-xs text-gray-400 text-center">
                    Choose an image from your device gallery
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {imageSource === "camera" && !capturedImage && (
          <div className="bg-gradient-to-br from-black via-gray-900 to-black border border-[#f2b705]/30 rounded-xl shadow-xl p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">
                Camera Preview
              </h2>
              <button
                onClick={() => handleSourceSelect(null)}
                className="text-gray-500 hover:text-gray-300 transition-colors"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-auto max-h-[400px] object-contain"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="mt-4 flex justify-center space-x-3">
              <button
                onClick={capturePhoto}
                className="px-6 py-2 bg-[#f2b705] text-black rounded-lg font-semibold hover:bg-[#d4a004] transition-colors shadow-md hover:shadow-lg"
              >
                Capture Photo
              </button>
              <button
                onClick={() => handleSourceSelect(null)}
                className="px-6 py-2 bg-gray-800 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {capturedImage && (
          <div className="bg-gradient-to-br from-black via-gray-900 to-black border border-[#f2b705]/30 rounded-xl shadow-xl p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">
                Image Preview
              </h2>
              <button
                onClick={handleReset}
                className="text-gray-500 hover:text-gray-300 transition-colors"
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>
            <div className="mb-4">
              <img
                src={capturedImage}
                alt="Captured meal"
                className="w-full h-auto rounded-lg shadow-md max-h-[400px] object-contain mx-auto"
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {caloriesResult && (
              <div className="mb-4 p-4 bg-gradient-to-br from-gray-900 to-black border border-[#f2b705]/30 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-[#f2b705]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Analysis Result
                  </h3>
                </div>

                <div className="space-y-3">
                  {caloriesResult.dish_name && (
                    <div className="bg-gray-900/50 border border-[#f2b705]/20 rounded-lg p-3">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Dish Name
                      </h4>
                      <p className="text-lg font-bold text-white">
                        {caloriesResult.dish_name}
                      </p>
                    </div>
                  )}

                  {caloriesResult.description && (
                    <div className="bg-gray-900/50 border border-[#f2b705]/20 rounded-lg p-3">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Description
                      </h4>
                      <p className="text-sm text-gray-300">
                        {caloriesResult.description}
                      </p>
                    </div>
                  )}

                  {caloriesResult.estimated_calories && (
                    <div className="bg-gradient-to-r from-[#f2b705] to-[#d4a004] rounded-lg p-4 text-black shadow-lg">
                      <h4 className="text-xs font-semibold uppercase tracking-wide mb-2 opacity-90">
                        Estimated Calories
                      </h4>
                      <p className="text-2xl font-bold mb-1">
                        {caloriesResult.estimated_calories} kcal
                      </p>
                      {caloriesResult.calorie_range && (
                        <p className="text-xs opacity-90">
                          Range: {caloriesResult.calorie_range}
                        </p>
                      )}
                    </div>
                  )}

                  {caloriesResult.macronutrients && (
                    <div className="bg-gray-900/50 border border-[#f2b705]/20 rounded-lg p-3">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Macronutrients
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-[#f2b705]/10 border border-[#f2b705]/30 rounded-lg p-2 text-center">
                          <div className="text-base font-bold text-[#f2b705]">
                            {caloriesResult.macronutrients.protein}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            Protein
                          </div>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2 text-center">
                          <div className="text-base font-bold text-green-500">
                            {caloriesResult.macronutrients.carbs}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            Carbs
                          </div>
                        </div>
                        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-2 text-center">
                          <div className="text-base font-bold text-orange-500">
                            {caloriesResult.macronutrients.fat}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            Fat
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {caloriesResult.ingredients &&
                    Array.isArray(caloriesResult.ingredients) &&
                    caloriesResult.ingredients.length > 0 && (
                      <div className="bg-gray-900/50 border border-[#f2b705]/20 rounded-lg p-3">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Ingredients Breakdown
                        </h4>
                        <div className="space-y-1.5">
                          {caloriesResult.ingredients.map(
                            (ingredient, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                              >
                                <span className="text-gray-300 font-medium text-sm">
                                  {ingredient.item}
                                </span>
                                <span className="text-[#f2b705] font-bold text-sm">
                                  {ingredient.estimated_calories} kcal
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {caloriesResult.health_rating && (
                    <div className="bg-gray-900/50 border border-[#f2b705]/20 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Health Rating
                        </h4>
                        <div className="flex items-center space-x-2">
                          <div className="text-lg font-bold text-white">
                            {caloriesResult.health_rating}/10
                          </div>
                          <div className="flex space-x-1">
                            {[...Array(10)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i < parseInt(caloriesResult.health_rating)
                                    ? "bg-green-500"
                                    : "bg-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {caloriesResult.advice && (
                    <div className="bg-[#f2b705]/10 border border-[#f2b705]/30 rounded-lg p-3">
                      <h4 className="text-xs font-semibold text-[#f2b705] mb-1 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Health Advice
                      </h4>
                      <p className="text-xs text-[#f2b705]">
                        {caloriesResult.advice}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-center space-x-3">
              <button
                onClick={handleAnalyze}
                disabled={isProcessing}
                className="px-6 py-2 bg-[#f2b705] text-black rounded-lg font-semibold hover:bg-[#d4a004] transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span className="text-sm">Processing...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                    <span className="text-sm">Analyze Calories</span>
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-gray-800 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-colors text-sm"
              >
                Take Another Photo
              </button>
            </div>
          </div>
        )}

        {!capturedImage && (
          <div className="mt-4 bg-[#f2b705]/10 border border-[#f2b705]/30 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-[#f2b705] mb-2 flex items-center">
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Tips for Best Results
            </h3>
            <ul className="space-y-1.5 text-xs text-[#f2b705]">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Ensure good lighting when capturing your meal</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Capture the entire meal in the frame</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Keep the camera steady for clear images</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Make sure food items are clearly visible</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
