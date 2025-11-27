"use client";

import React, { useState, useEffect } from "react";
import { profileAPI } from "@/services/api";
import Link from "next/link";

export default function CaloriesHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [user, setUser] = useState(null);

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

  useEffect(() => {
    if (user?.name && user?.email) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    if (!user?.name || !user?.email) return;

    try {
      setLoading(true);
      setError(null);

      const response = await profileAPI.getCalorieHistory(
        user.name,
        user.email
      );
      const historyData = Array.isArray(response) ? response : [];
      setHistory(historyData);
    } catch (err) {
      console.error("Error loading history:", err);
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          "Failed to load calories history."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = async (entryId) => {
    if (!user?.name || !user?.email) {
      alert("User information not found. Please login again.");
      return;
    }

    if (!confirm("Are you sure you want to delete this entry?")) {
      return;
    }

    try {
      await profileAPI.deleteCalorieEntry(entryId, user.name, user.email);
      setHistory(history.filter((item) => item.id !== entryId));
    } catch (err) {
      console.error("Error deleting entry:", err);
      alert(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          "Failed to delete entry. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <svg
              className="animate-spin h-12 w-12 text-[#f2b705] mx-auto mb-4"
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
            <p className="text-gray-400">Loading history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">{error}</p>
          <button
            onClick={loadHistory}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-black min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Calories History</h1>
          <p className="text-gray-400 mt-2">
            View your past calorie calculations
          </p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="bg-black border border-[#f2b705]/20 rounded-lg shadow-lg p-12 text-center">
          <svg
            className="w-24 h-24 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">
            No History Yet
          </h3>
          <p className="text-gray-400 mb-6">
            Start calculating calories to see your history here.
          </p>
          <Link
            href="/calorie-calculate"
            className="inline-block px-6 py-3 bg-[#f2b705] text-white rounded-lg font-semibold hover:bg-[#d4a004] transition-colors"
          >
            Calculate Calories
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((entry) => {
            const foodAnalysis = entry.food_analysis || {};
            const estimatedCalories =
              entry.estimated_calories ||
              foodAnalysis.estimated_calories ||
              "N/A";
            const dishName =
              entry.dish_name || foodAnalysis.dish_name || "Unknown Dish";
            const imagePath = entry.image_path;

            return (
              <div
                key={entry.id}
                className="bg-black border border-[#f2b705]/20 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative"
              >
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
                  title="Delete entry"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>

                {imagePath && (
                  <div className="relative h-48 bg-gray-100">
                    <img
                      src={imagePath}
                      alt={dishName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-white line-clamp-1">
                      {dishName}
                    </h3>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-[#f2b705]">
                        {typeof estimatedCalories === "number"
                          ? estimatedCalories
                          : estimatedCalories}
                      </span>
                      <span className="text-gray-500 text-sm">kcal</span>
                    </div>
                    {foodAnalysis.calorie_range && (
                      <p className="text-xs text-gray-500 mt-1">
                        Range: {foodAnalysis.calorie_range}
                      </p>
                    )}
                  </div>

                  {foodAnalysis.description && (
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                      {foodAnalysis.description}
                    </p>
                  )}

                  {foodAnalysis.health_rating && (
                    <div className="mb-3 flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        Health Rating:
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm font-bold text-white">
                          {foodAnalysis.health_rating}/10
                        </span>
                        <div className="flex space-x-0.5">
                          {[...Array(10)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < parseInt(foodAnalysis.health_rating)
                                  ? "bg-green-500"
                                  : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-gray-400 mb-3">
                    {formatDate(entry.created_at)}
                  </p>

                  {expandedId === entry.id ? (
                    <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
                      {foodAnalysis.macronutrients && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-300 mb-2">
                            Macronutrients:
                          </h4>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="bg-[#f2b705]/20 rounded p-2 text-center">
                              <div className="text-xs font-bold text-[#f2b705]">
                                {foodAnalysis.macronutrients.protein}
                              </div>
                              <div className="text-xs text-gray-400">
                                Protein
                              </div>
                            </div>
                            <div className="bg-green-50 rounded p-2 text-center">
                              <div className="text-xs font-bold text-green-600">
                                {foodAnalysis.macronutrients.carbs}
                              </div>
                              <div className="text-xs text-gray-400">Carbs</div>
                            </div>
                            <div className="bg-orange-50 rounded p-2 text-center">
                              <div className="text-xs font-bold text-orange-600">
                                {foodAnalysis.macronutrients.fat}
                              </div>
                              <div className="text-xs text-gray-400">Fat</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {foodAnalysis.ingredients &&
                        Array.isArray(foodAnalysis.ingredients) &&
                        foodAnalysis.ingredients.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">
                              Ingredients:
                            </h4>
                            <div className="space-y-1">
                              {foodAnalysis.ingredients.map(
                                (ingredient, index) => (
                                  <div
                                    key={index}
                                    className="flex justify-between text-xs text-gray-400 bg-gray-50 rounded p-2"
                                  >
                                    <span className="flex-1">
                                      {ingredient.item}
                                    </span>
                                    <span className="font-medium ml-2">
                                      {ingredient.estimated_calories} kcal
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {foodAnalysis.advice && (
                        <div className="bg-[#f2b705]/20 border border-[#f2b705]/30 rounded p-3">
                          <h4 className="text-xs font-semibold text-[#f2b705] mb-1">
                            Health Advice:
                          </h4>
                          <p className="text-xs text-[#f2b705]">
                            {foodAnalysis.advice}
                          </p>
                        </div>
                      )}

                      <button
                        onClick={() => toggleExpand(entry.id)}
                        className="text-sm text-[#f2b705] hover:text-blue-700"
                      >
                        Show Less
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleExpand(entry.id)}
                      className="text-sm text-[#f2b705] hover:text-blue-700"
                    >
                      Show Details
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
