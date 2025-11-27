"use client";

import React, { useState, useEffect } from "react";
import { profileAPI } from "@/services/api";
import Link from "next/link";
import {
  FaFire,
  FaDrumstickBite,
  FaBreadSlice,
  FaTint,
  FaChevronDown,
  FaArrowLeft,
  FaCalendarAlt
} from "react-icons/fa";

export default function DietHistory() {
  const [dietHistory, setDietHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [expandedPlan, setExpandedPlan] = useState(null);

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
    const fetchDietHistory = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);
        const response = await profileAPI.getDietHistory(user.name, user.email);
        const history = Array.isArray(response) ? response : [];
        setDietHistory(history);
      } catch (err) {
        console.error("Error fetching diet history:", err);
        setError(
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to load diet history. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.name && user?.email) {
      fetchDietHistory();
    } else {
      setLoading(false);
      setError("User information not found. Please login again.");
    }
  }, [user]);

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

  const formatShortDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const togglePlan = (planId) => {
    setExpandedPlan(expandedPlan === planId ? null : planId);
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
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 hover:border-[#f2b705]/30 transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-white capitalize">{mealName}</h4>
          <div className="px-2 py-0.5 bg-[#f2b705]/20 text-[#f2b705] rounded-full text-[10px] font-semibold">
            {meal.total?.calories || 0} kcal
          </div>
        </div>

        <div className="mb-3">
          <h5 className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Items</h5>
          <div className="flex flex-wrap gap-1">
            {meal.items?.map((item, index) => (
              <span
                key={index}
                className="px-1.5 py-0.5 bg-white/5 border border-white/10 text-gray-300 rounded text-[10px]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2 bg-black/20 rounded-lg p-2 border border-white/5">
          <MacroBar label="Protein" value={meal.total?.protein || 0} total={50} color="#22c55e" />
          <MacroBar label="Carbs" value={meal.total?.carbs || 0} total={100} color="#f97316" />
          <MacroBar label="Fats" value={meal.total?.fat || 0} total={40} color="#ef4444" />
        </div>
      </div>
    );
  };

  const calculateDailyTotals = (dietPlan) => {
    if (!dietPlan) return { calories: 0, protein: 0, carbs: 0, fat: 0 };

    const breakfast = dietPlan.breakfast?.total || {};
    const lunch = dietPlan.lunch?.total || {};
    const dinner = dietPlan.dinner?.total || {};

    return {
      calories: (breakfast.calories || 0) + (lunch.calories || 0) + (dinner.calories || 0),
      protein: (breakfast.protein || 0) + (lunch.protein || 0) + (dinner.protein || 0),
      carbs: (breakfast.carbs || 0) + (lunch.carbs || 0) + (dinner.carbs || 0),
      fat: (breakfast.fat || 0) + (lunch.fat || 0) + (dinner.fat || 0),
    };
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#f2b705]/10 rounded-full blur-[120px] animate-orb-1" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#f2b705]/5 rounded-full blur-[120px] animate-orb-2" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-500">
                Diet History
              </h1>
              <p className="text-sm text-gray-400">
                Review your previous nutrition plans
              </p>
            </div>
            <Link href="/diet-suggestions">
              <button className="group flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-[#f2b705] border border-white/10 hover:border-[#f2b705] rounded-full transition-all duration-300">
                <FaArrowLeft className="text-[#f2b705] group-hover:text-black transition-colors text-sm" />
                <span className="font-semibold text-sm text-white group-hover:text-black">Back</span>
              </button>
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#f2b705] rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="text-gray-400 animate-pulse text-sm">Loading your history...</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center max-w-2xl mx-auto backdrop-blur-sm">
              <p className="text-red-400 font-bold text-lg mb-2">Unable to Load History</p>
              <p className="text-gray-400 text-sm">{error}</p>
            </div>
          ) : dietHistory.length === 0 ? (
            <div className="text-center py-32 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
              <FaCalendarAlt className="text-5xl text-[#f2b705]/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                No History Yet
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Your diet plan history will appear here
              </p>
              <Link href="/diet-suggestions">
                <button className="px-6 py-2.5 bg-[#f2b705] hover:bg-[#d4a004] text-black rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(242,183,5,0.3)] font-bold text-sm">
                  View Current Plan
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {dietHistory.map((plan) => {
                const isExpanded = expandedPlan === plan.diet_plan_id;
                const totals = calculateDailyTotals(plan.diet_plan);

                return (
                  <div
                    key={plan.diet_plan_id}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-[#f2b705]/30 transition-all duration-300"
                  >
                    <div
                      className="p-5 cursor-pointer"
                      onClick={() => togglePlan(plan.diet_plan_id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-[#f2b705]/10 flex items-center justify-center border border-[#f2b705]/20">
                            <FaCalendarAlt className="text-[#f2b705] text-lg" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-white">
                              {formatShortDate(plan.date)}
                            </h3>
                            <p className="text-[10px] text-gray-500 mt-0.5">
                              {formatDate(plan.date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-xl font-bold text-[#f2b705]">
                              {totals.calories}
                            </div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                              Calories
                            </div>
                          </div>
                          <button
                            className={`transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""
                              }`}
                          >
                            <FaChevronDown className="text-gray-400 text-sm" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {isExpanded && plan.diet_plan && (
                      <div className="border-t border-white/10 p-5 bg-black/20">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          <MealCard
                            meal={plan.diet_plan.breakfast}
                            mealName="Breakfast"
                          />
                          <MealCard meal={plan.diet_plan.lunch} mealName="Lunch" />
                          <MealCard
                            meal={plan.diet_plan.dinner}
                            mealName="Dinner"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
