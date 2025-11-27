"use client";

import React, { useState, useEffect } from "react";
import { profileAPI } from "@/services/api";
import { useRouter } from "next/navigation";
import {
  FaFire,
  FaDrumstickBite,
  FaBreadSlice,
  FaTint,
  FaArrowLeft,
  FaPlus,
  FaTimes,
  FaUtensils,
  FaLeaf
} from "react-icons/fa";

export default function CustomDiet() {
  const [user, setUser] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dietPlan, setDietPlan] = useState(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadUser = () => {
      if (typeof window !== "undefined") {
        const userData = localStorage.getItem("user");
        if (userData) {
          try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);

            const lastSubmissionKey = `customDiet_${parsedUser.email}_lastSubmission`;
            const lastSubmissionDate = localStorage.getItem(lastSubmissionKey);
            const today = new Date().toISOString().split("T")[0];

            if (lastSubmissionDate === today) {
              setAlreadySubmitted(true);
              const savedDietPlanKey = `customDiet_${parsedUser.email}_plan`;
              const savedPlan = localStorage.getItem(savedDietPlanKey);
              if (savedPlan) {
                try {
                  setDietPlan(JSON.parse(savedPlan));
                } catch (e) {
                  console.error("Error parsing saved diet plan:", e);
                }
              }
            }
          } catch (e) {
            console.error("Error parsing user data:", e);
          }
        }
      }
    };
    loadUser();
  }, []);

  const addIngredient = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !ingredients.includes(trimmed.toLowerCase())) {
      setIngredients([...ingredients, trimmed.toLowerCase()]);
      setInputValue("");
      setError(null);
    }
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addIngredient();
    }
  };

  const handleSubmit = async () => {
    if (ingredients.length === 0) {
      setError("Please add at least one ingredient");
      return;
    }

    if (!user?.email) {
      setError("User information not found. Please login again.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await profileAPI.getCustomDiet(user.email, ingredients);
      setDietPlan(response);

      const today = new Date().toISOString().split("T")[0];
      const lastSubmissionKey = `customDiet_${user.email}_lastSubmission`;
      const savedDietPlanKey = `customDiet_${user.email}_plan`;

      localStorage.setItem(lastSubmissionKey, today);
      localStorage.setItem(savedDietPlanKey, JSON.stringify(response));
      setAlreadySubmitted(true);
    } catch (err) {
      console.error("Error fetching custom diet:", err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to generate custom diet plan. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const MacroBar = ({ label, value, total, color }) => {
    const percentage = Math.min((value / (total || 1)) * 100, 100);

    return (
      <div className="flex flex-col gap-1 w-full">
        <div className="flex justify-between items-end text-xs mb-1">
          <span className="text-gray-400 font-medium text-[10px]">{label}</span>
          <span className="font-bold text-white text-xs">{value}g</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
              boxShadow: `0 0 10px ${color}40`
            }}
          />
        </div>
      </div>
    );
  };

  const MealCard = ({ meal, mealName }) => {
    if (!meal) return null;

    return (
      <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:border-[#f2b705]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(242,183,5,0.1)] hover:-translate-y-1 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#f2b705]/10 rounded-full blur-3xl group-hover:bg-[#f2b705]/20 transition-all duration-500" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white capitalize flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#f2b705]/10 flex items-center justify-center border border-[#f2b705]/20 group-hover:scale-110 transition-transform duration-300">
                <FaUtensils className="text-[#f2b705] text-xs" />
              </div>
              {mealName}
            </h3>
            <div className="flex flex-col items-end">
              <span className="text-xl font-bold text-[#f2b705]">{meal.total?.calories || 0}</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">Kcal</span>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Menu Items</h4>
            <div className="flex flex-wrap gap-1.5">
              {meal.items?.map((item, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-white/5 border border-white/10 text-gray-300 rounded-lg text-xs hover:bg-[#f2b705]/10 hover:text-[#f2b705] hover:border-[#f2b705]/30 transition-all duration-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3 bg-black/20 rounded-xl p-3 border border-white/5">
            <MacroBar label="Protein" value={meal.total?.protein || 0} total={50} color="#22c55e" />
            <MacroBar label="Carbs" value={meal.total?.carbs || 0} total={100} color="#f97316" />
            <MacroBar label="Fats" value={meal.total?.fat || 0} total={40} color="#ef4444" />
          </div>

          {meal.recipe && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                Chef's Note
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed italic">
                "{meal.recipe}"
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const StatCard = ({ label, value, unit, icon: Icon, color }) => (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 flex items-center gap-3 hover:bg-white/10 transition-colors duration-300">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
        style={{ backgroundColor: `${color}20`, color: color }}
      >
        <Icon />
      </div>
      <div>
        <div className="text-xl font-bold text-white">
          {value}
          <span className="text-xs font-normal text-gray-400 ml-1">{unit}</span>
        </div>
        <div className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">{label}</div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#f2b705]/10 rounded-full blur-[120px] animate-orb-1" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#f2b705]/5 rounded-full blur-[120px] animate-orb-2" />
        <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-white/5 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-500">
                Custom Diet Plan
              </h1>
              <p className="text-sm text-gray-400">
                Create your personalized nutrition plan with preferred ingredients
              </p>
            </div>
            <button
              onClick={() => router.back()}
              className="group flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-[#f2b705] border border-white/10 hover:border-[#f2b705] rounded-full transition-all duration-300"
            >
              <FaArrowLeft className="text-[#f2b705] group-hover:text-black transition-colors text-sm" />
              <span className="font-semibold text-sm text-white group-hover:text-black">Back</span>
            </button>
          </div>

          {alreadySubmitted && dietPlan ? (
            <div className="space-y-6">
              {/* Warning Banner */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                    <FaLeaf className="text-yellow-500 text-lg" />
                  </div>
                  <div>
                    <p className="text-yellow-400 font-bold text-sm mb-1">
                      Already Submitted Today
                    </p>
                    <p className="text-yellow-300/80 text-xs">
                      You've created a custom plan today. Come back tomorrow for a new one!
                    </p>
                  </div>
                </div>
              </div>

              {/* Plan Header */}
              <div className="bg-gradient-to-r from-[#f2b705] to-[#d4a004] rounded-2xl p-5">
                <h2 className="text-xl font-bold mb-1 text-black">
                  Your Custom Plan
                </h2>
                <p className="text-black/70 text-sm">
                  {formatDate(dietPlan.date || dietPlan.diet_plan?.date)}
                </p>
              </div>

              {/* Ingredients */}
              {dietPlan.ingredients && dietPlan.ingredients.length > 0 && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                  <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                    <FaLeaf className="text-[#f2b705]" />
                    Selected Ingredients
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {dietPlan.ingredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-[#f2b705]/20 text-[#f2b705] rounded-full text-xs font-medium border border-[#f2b705]/30"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              {dietPlan.diet_plan && (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    <StatCard
                      label="Total Calories"
                      value={(dietPlan.diet_plan.breakfast?.total?.calories || 0) +
                        (dietPlan.diet_plan.lunch?.total?.calories || 0) +
                        (dietPlan.diet_plan.dinner?.total?.calories || 0)}
                      unit="kcal"
                      icon={FaFire}
                      color="#f2b705"
                    />
                    <StatCard
                      label="Total Protein"
                      value={(dietPlan.diet_plan.breakfast?.total?.protein || 0) +
                        (dietPlan.diet_plan.lunch?.total?.protein || 0) +
                        (dietPlan.diet_plan.dinner?.total?.protein || 0)}
                      unit="g"
                      icon={FaDrumstickBite}
                      color="#22c55e"
                    />
                    <StatCard
                      label="Total Carbs"
                      value={(dietPlan.diet_plan.breakfast?.total?.carbs || 0) +
                        (dietPlan.diet_plan.lunch?.total?.carbs || 0) +
                        (dietPlan.diet_plan.dinner?.total?.carbs || 0)}
                      unit="g"
                      icon={FaBreadSlice}
                      color="#f97316"
                    />
                    <StatCard
                      label="Total Fat"
                      value={(dietPlan.diet_plan.breakfast?.total?.fat || 0) +
                        (dietPlan.diet_plan.lunch?.total?.fat || 0) +
                        (dietPlan.diet_plan.dinner?.total?.fat || 0)}
                      unit="g"
                      icon={FaTint}
                      color="#ef4444"
                    />
                  </div>

                  {/* Meals */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
                    <MealCard meal={dietPlan.diet_plan.breakfast} mealName="Breakfast" />
                    <MealCard meal={dietPlan.diet_plan.lunch} mealName="Lunch" />
                    <MealCard meal={dietPlan.diet_plan.dinner} mealName="Dinner" />
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Input Form */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <FaLeaf className="text-[#f2b705]" />
                  Add Ingredients
                </h2>
                <p className="text-xs text-gray-400 mb-4">
                  Enter your preferred ingredients. Press Enter or click Add for each one.
                </p>

                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="e.g., spinach, chicken, rice"
                    className="flex-1 px-4 py-2.5 bg-black/40 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2b705] focus:border-transparent text-sm"
                    disabled={loading}
                  />
                  <button
                    onClick={addIngredient}
                    disabled={loading || !inputValue.trim()}
                    className="px-5 py-2.5 bg-[#f2b705] hover:bg-[#d4a004] text-black rounded-xl font-bold transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2 text-sm shadow-[0_0_20px_rgba(242,183,5,0.3)]"
                  >
                    <FaPlus className="text-xs" />
                    Add
                  </button>
                </div>

                {ingredients.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Selected ({ingredients.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {ingredients.map((ingredient, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#f2b705]/20 text-[#f2b705] rounded-full text-xs font-medium border border-[#f2b705]/30 hover:bg-[#f2b705]/30 transition-all"
                        >
                          {ingredient}
                          <button
                            onClick={() => removeIngredient(index)}
                            disabled={loading}
                            className="hover:text-[#d4a004] transition-colors"
                          >
                            <FaTimes className="text-[10px]" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-xl p-3 backdrop-blur-sm">
                    <p className="text-red-400 text-xs">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading || ingredients.length === 0}
                  className="w-full px-6 py-3 bg-[#f2b705] hover:bg-[#d4a004] text-black rounded-xl font-bold transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(242,183,5,0.3)] hover:shadow-[0_0_30px_rgba(242,183,5,0.5)] text-sm"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                      Generating Plan...
                    </span>
                  ) : (
                    "Generate Custom Diet Plan"
                  )}
                </button>
              </div>

              {/* Generated Plan (if exists and not already submitted) */}
              {dietPlan && !alreadySubmitted && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-[#f2b705] to-[#d4a004] rounded-2xl p-5">
                    <h2 className="text-xl font-bold mb-1 text-black">
                      Your Custom Plan
                    </h2>
                    <p className="text-black/70 text-sm">
                      {formatDate(dietPlan.date || dietPlan.diet_plan?.date)}
                    </p>
                  </div>

                  {dietPlan.ingredients && dietPlan.ingredients.length > 0 && (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                      <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                        <FaLeaf className="text-[#f2b705]" />
                        Selected Ingredients
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {dietPlan.ingredients.map((ingredient, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-[#f2b705]/20 text-[#f2b705] rounded-full text-xs font-medium border border-[#f2b705]/30"
                          >
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {dietPlan.diet_plan && (
                    <>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                        <StatCard
                          label="Total Calories"
                          value={(dietPlan.diet_plan.breakfast?.total?.calories || 0) +
                            (dietPlan.diet_plan.lunch?.total?.calories || 0) +
                            (dietPlan.diet_plan.dinner?.total?.calories || 0)}
                          unit="kcal"
                          icon={FaFire}
                          color="#f2b705"
                        />
                        <StatCard
                          label="Total Protein"
                          value={(dietPlan.diet_plan.breakfast?.total?.protein || 0) +
                            (dietPlan.diet_plan.lunch?.total?.protein || 0) +
                            (dietPlan.diet_plan.dinner?.total?.protein || 0)}
                          unit="g"
                          icon={FaDrumstickBite}
                          color="#22c55e"
                        />
                        <StatCard
                          label="Total Carbs"
                          value={(dietPlan.diet_plan.breakfast?.total?.carbs || 0) +
                            (dietPlan.diet_plan.lunch?.total?.carbs || 0) +
                            (dietPlan.diet_plan.dinner?.total?.carbs || 0)}
                          unit="g"
                          icon={FaBreadSlice}
                          color="#f97316"
                        />
                        <StatCard
                          label="Total Fat"
                          value={(dietPlan.diet_plan.breakfast?.total?.fat || 0) +
                            (dietPlan.diet_plan.lunch?.total?.fat || 0) +
                            (dietPlan.diet_plan.dinner?.total?.fat || 0)}
                          unit="g"
                          icon={FaTint}
                          color="#ef4444"
                        />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
                        <MealCard meal={dietPlan.diet_plan.breakfast} mealName="Breakfast" />
                        <MealCard meal={dietPlan.diet_plan.lunch} mealName="Lunch" />
                        <MealCard meal={dietPlan.diet_plan.dinner} mealName="Dinner" />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
