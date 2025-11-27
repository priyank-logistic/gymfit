"use client";

import React, { useState, useEffect } from "react";
import { profileAPI } from "@/services/api";
import Link from "next/link";
import {
  FaFire,
  FaDrumstickBite,
  FaBreadSlice,
  FaTint,
  FaHistory,
  FaEdit,
  FaUtensils
} from "react-icons/fa";

export default function DietSuggestions() {
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    const fetchDietPlan = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);
        const response = await profileAPI.getDietPlan(user.name, user.email);
        setDietPlan(response);
      } catch (err) {
        console.error("Error fetching diet plan:", err);
        setError(
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to load diet plan. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.name && user?.email) {
      fetchDietPlan();
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

  const MacroBar = ({ label, value, total, color, icon: Icon }) => {
    // Calculate percentage for width, max 100%
    const percentage = Math.min((value / (total || 1)) * 100, 100);

    return (
      <div className="flex flex-col gap-1 w-full">
        <div className="flex justify-between items-end text-xs mb-1">
          <span className="flex items-center gap-1 text-gray-400 font-medium">
            {Icon && <Icon className="w-3 h-3" style={{ color }} />}
            {label}
          </span>
          <span className="font-bold text-white">
            {value}g
          </span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
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

  const MealCard = ({ meal, mealName, delay }) => {
    if (!meal) return null;

    return (
      <div
        className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:border-[#f2b705]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(242,183,5,0.1)] hover:-translate-y-1 overflow-hidden"
        style={{ animationDelay: `${delay}ms` }}
      >
        {/* Glow Effect */}
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
            <MacroBar
              label="Protein"
              value={meal.total?.protein || 0}
              total={50} // Arbitrary max for visualization
              color="#22c55e"
              icon={FaDrumstickBite}
            />
            <MacroBar
              label="Carbs"
              value={meal.total?.carbs || 0}
              total={100}
              color="#f97316"
              icon={FaBreadSlice}
            />
            <MacroBar
              label="Fats"
              value={meal.total?.fat || 0}
              total={40}
              color="#ef4444"
              icon={FaTint}
            />
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
    <div className="relative min-h-screen bg-black text-white overflow-hidden selection:bg-[#f2b705] selection:text-black">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#f2b705]/10 rounded-full blur-[120px] animate-orb-1" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#f2b705]/5 rounded-full blur-[120px] animate-orb-2" />
        <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-white/5 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-500">
                Diet Plan
              </h1>
              <p className="text-sm md:text-base text-gray-400 max-w-2xl">
                Fuel your body with precision. Your personalized nutrition roadmap for
                <span className="text-[#f2b705] font-semibold ml-2">
                  {dietPlan?.date || dietPlan?.diet_plan?.date ? formatDate(dietPlan.date || dietPlan.diet_plan?.date) : "Today"}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/diet-suggestions/history">
                <button className="group flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-[#f2b705] border border-white/10 hover:border-[#f2b705] rounded-full transition-all duration-300">
                  <FaHistory className="text-[#f2b705] group-hover:text-black transition-colors text-sm" />
                  <span className="font-semibold text-sm text-white group-hover:text-black">History</span>
                </button>
              </Link>
              <Link href="/diet-suggestions/custom">
                <button className="group flex items-center gap-2 px-5 py-2.5 bg-[#f2b705] hover:bg-[#d4a004] text-black rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(242,183,5,0.3)] hover:shadow-[0_0_30px_rgba(242,183,5,0.5)]">
                  <FaEdit className="text-sm" />
                  <span className="font-bold text-sm">Customize</span>
                </button>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#f2b705] rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="text-gray-400 animate-pulse">Generating your nutritional roadmap...</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center max-w-2xl mx-auto backdrop-blur-sm">
              <p className="text-red-400 font-bold text-xl mb-2">Unable to Load Plan</p>
              <p className="text-gray-400">{error}</p>
            </div>
          ) : dietPlan?.diet_plan ? (
            <div className="space-y-8">
              {/* Daily Summary Stats */}
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

              {/* Meals Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
                <MealCard
                  meal={dietPlan.diet_plan.breakfast}
                  mealName="Breakfast"
                  delay={0}
                />
                <MealCard
                  meal={dietPlan.diet_plan.lunch}
                  mealName="Lunch"
                  delay={100}
                />
                <MealCard
                  meal={dietPlan.diet_plan.dinner}
                  mealName="Dinner"
                  delay={200}
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-32 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-3">
                No Diet Plan Found
              </h3>
              <p className="text-gray-400">
                We couldn't find a plan for today. Try generating a custom one!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
