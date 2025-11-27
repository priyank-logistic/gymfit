"use client";

import React, { useState, useEffect, useCallback } from "react";
import { profileAPI } from "@/services/api";
import Link from "next/link";
import {
  FaFire,
  FaDumbbell,
  FaAppleAlt,
  FaChartLine,
  FaTrophy,
  FaCalendarAlt,
  FaArrowRight,
  FaBolt,
  FaHeart,
  FaRunning,
} from "react-icons/fa";

const daysOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [totalCalories, setTotalCalories] = useState(0);
  const [daywiseCalories, setDaywiseCalories] = useState([]);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [todayWorkout, setTodayWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workoutLoading, setWorkoutLoading] = useState(true);

  const groupCaloriesByDay = useCallback((history) => {
    const dayMap = new Map();

    history.forEach((entry) => {
      const calories =
        entry.estimated_calories ||
        entry.food_analysis?.estimated_calories ||
        0;
      const caloriesValue =
        typeof calories === "number" ? calories : parseFloat(calories) || 0;

      if (caloriesValue > 0 && entry.created_at) {
        const date = new Date(entry.created_at);
        const dayKey = date.toISOString().split("T")[0];

        if (!dayMap.has(dayKey)) {
          dayMap.set(dayKey, {
            date: dayKey,
            displayDate: date.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            }),
            calories: 0,
            count: 0,
          });
        }

        const dayData = dayMap.get(dayKey);
        dayData.calories += caloriesValue;
        dayData.count += 1;
      }
    });

    return Array.from(dayMap.values()).sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  }, []);

  const loadCaloriesHistory = useCallback(async () => {
    if (!user?.name || !user?.email) return;

    try {
      setLoading(true);
      const response = await profileAPI.getCalorieHistory(
        user.name,
        user.email
      );
      const history = Array.isArray(response) ? response : [];

      const sum = history.reduce((total, entry) => {
        const calories =
          entry.estimated_calories ||
          entry.food_analysis?.estimated_calories ||
          0;
        const caloriesValue =
          typeof calories === "number" ? calories : parseFloat(calories) || 0;
        return total + caloriesValue;
      }, 0);

      setTotalCalories(Math.round(sum));

      const daywise = groupCaloriesByDay(history);
      setDaywiseCalories(daywise);
    } catch (err) {
      console.error("Error loading calories history:", err);
    } finally {
      setLoading(false);
    }
  }, [groupCaloriesByDay, user]);

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

  const getTodayDay = () => {
    const today = new Date();
    const dayIndex = today.getDay();
    const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
    return daysOfWeek[adjustedIndex];
  };

  const loadWorkoutPlan = useCallback(async () => {
    if (!user?.name || !user?.email) return;

    try {
      setWorkoutLoading(true);
      const response = await profileAPI.getWorkoutPlan(user.name, user.email);
      setWorkoutPlan(response);

      if (response?.workout_plan) {
        const todayDay = getTodayDay();
        const todayWorkoutData = response.workout_plan[todayDay];
        setTodayWorkout(todayWorkoutData || null);
      }
    } catch (err) {
      console.error("Error loading workout plan:", err);
    } finally {
      setWorkoutLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.name && user?.email) {
      loadCaloriesHistory();
      loadWorkoutPlan();
    }
  }, [user, loadCaloriesHistory, loadWorkoutPlan]);

  const formatDayName = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const todayCalories =
    daywiseCalories.length > 0 ? daywiseCalories[0].calories : 0;
  const avgCalories =
    daywiseCalories.length > 0
      ? Math.round(
          daywiseCalories.reduce((sum, day) => sum + day.calories, 0) /
            daywiseCalories.length
        )
      : 0;

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
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-500 mb-2">
              Welcome back, {user?.name?.split(" ")[0] || "User"}! 👋
            </h1>
            <p className="text-sm text-gray-400">
              Here's your fitness overview for today
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Calories */}
            <div className="bg-gradient-to-br from-[#f2b705] to-[#d4a004] rounded-2xl p-4 shadow-[0_0_30px_rgba(242,183,5,0.2)]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center">
                  <FaFire className="text-black text-lg" />
                </div>
                <div>
                  <p className="text-xs text-black/70 uppercase tracking-wider font-bold">
                    Total
                  </p>
                  <p className="text-2xl font-bold text-black">
                    {loading ? "..." : totalCalories.toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-xs text-black/70">Calories Tracked</p>
            </div>

            {/* Workout Count */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:border-[#f2b705]/50 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <FaDumbbell className="text-orange-500 text-lg" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">
                    Exercises
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {workoutLoading
                      ? "..."
                      : todayWorkout?.exercises?.length || 0}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-400">Today's Workout</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Today's Workout - Takes 2 columns */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden h-full">
                <div className="bg-gradient-to-r from-[#f2b705] to-[#d4a004] p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center">
                        <FaDumbbell className="text-black text-lg" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-black">
                          Today's Workout
                        </h2>
                        <p className="text-black/70 text-xs">
                          {formatDayName(getTodayDay())}'s routine
                        </p>
                      </div>
                    </div>
                    <Link href="/exercise">
                      <button className="px-4 py-2 bg-black/20 hover:bg-black/30 text-black rounded-xl font-bold text-xs transition-all flex items-center gap-2">
                        View All
                        <FaArrowRight className="text-xs" />
                      </button>
                    </Link>
                  </div>
                </div>

                {workoutLoading ? (
                  <div className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#f2b705] mb-3"></div>
                    <p className="text-gray-400 text-sm">Loading workout...</p>
                  </div>
                ) : todayWorkout ? (
                  <div className="p-5">
                    {todayWorkout.focus && (
                      <div className="bg-[#f2b705]/10 border-l-4 border-[#f2b705] rounded-lg p-3 mb-4">
                        <p className="text-[#f2b705] font-semibold text-sm flex items-center gap-2">
                          <FaBolt className="text-xs" />
                          Focus: {todayWorkout.focus}
                        </p>
                      </div>
                    )}

                    <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                      {todayWorkout.exercises.map((exercise, index) => (
                        <div
                          key={index}
                          className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#f2b705]/50 transition-all"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-6 h-6 rounded-full bg-[#f2b705]/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-[#f2b705] font-bold text-xs">
                                {index + 1}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-bold text-white mb-1">
                                {exercise.name}
                              </h4>
                              {exercise.notes && (
                                <p className="text-xs text-gray-400 italic">
                                  {exercise.notes}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div className="bg-[#f2b705]/10 border border-[#f2b705]/20 rounded-lg p-2 text-center">
                              <div className="text-lg font-bold text-[#f2b705]">
                                {exercise.sets}
                              </div>
                              <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                                Sets
                              </div>
                            </div>
                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2 text-center">
                              <div className="text-lg font-bold text-green-500">
                                {exercise.reps}
                              </div>
                              <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                                Reps
                              </div>
                            </div>
                            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-2 text-center">
                              <div className="text-lg font-bold text-orange-500">
                                {exercise.rest}
                              </div>
                              <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                                Rest (s)
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <FaRunning className="text-5xl text-[#f2b705]/30 mx-auto mb-4" />
                    <p className="text-gray-400 text-sm mb-2">
                      No workout scheduled for today
                    </p>
                    <p className="text-gray-500 text-xs">
                      Take a rest day or check your workout plan!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Calories History */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden h-full">
                <div className="bg-gradient-to-r from-[#f2b705]/20 to-[#f2b705]/10 p-5 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-white mb-1">
                        Calories History
                      </h2>
                      <p className="text-xs text-gray-400">
                        Recent consumption
                      </p>
                    </div>
                    <Link href="/calories-history">
                      <button className="text-[#f2b705] hover:text-[#d4a004] transition-colors">
                        <FaArrowRight className="text-sm" />
                      </button>
                    </Link>
                  </div>
                </div>

                {loading ? (
                  <div className="p-6 text-center">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#f2b705] mb-3"></div>
                    <p className="text-gray-400 text-sm">Loading...</p>
                  </div>
                ) : daywiseCalories.length === 0 ? (
                  <div className="p-6 text-center">
                    <FaChartLine className="text-4xl text-[#f2b705]/30 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm mb-1">
                      No data available yet
                    </p>
                    <p className="text-gray-500 text-xs">
                      Start tracking your meals!
                    </p>
                  </div>
                ) : (
                  <div className="p-4 max-h-[450px] overflow-y-auto custom-scrollbar">
                    {daywiseCalories.slice(0, 7).map((day) => {
                      const maxCalories = Math.max(
                        ...daywiseCalories.map((d) => d.calories),
                        1
                      );
                      const percentage = (day.calories / maxCalories) * 100;

                      return (
                        <div
                          key={day.date}
                          className="mb-3 last:mb-0 bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-all border border-white/10 hover:border-[#f2b705]/30"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-semibold text-white text-sm">
                                {day.displayDate}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {day.count}{" "}
                                {day.count === 1 ? "entry" : "entries"}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-[#f2b705]">
                                {Math.round(day.calories).toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500">kcal</p>
                            </div>
                          </div>
                          <div className="mt-2 h-1.5 bg-black/40 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#f2b705] to-[#d4a004] rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/diet-suggestions">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:border-[#f2b705]/50 hover:bg-white/10 transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-[#f2b705]/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <FaAppleAlt className="text-[#f2b705] text-xl" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Diet Plan</h3>
                <p className="text-xs text-gray-400">View meal suggestions</p>
              </div>
            </Link>

            <Link href="/exercise">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:border-[#f2b705]/50 hover:bg-white/10 transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <FaDumbbell className="text-orange-500 text-xl" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Workouts</h3>
                <p className="text-xs text-gray-400">Exercise routines</p>
              </div>
            </Link>

            <Link href="/calorie-calculate">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:border-[#f2b705]/50 hover:bg-white/10 transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <FaFire className="text-green-500 text-xl" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Calculate</h3>
                <p className="text-xs text-gray-400">Track calories</p>
              </div>
            </Link>

            <Link href="/gym-suggestions">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:border-[#f2b705]/50 hover:bg-white/10 transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <FaTrophy className="text-blue-500 text-xl" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Gyms</h3>
                <p className="text-xs text-gray-400">Find nearby gyms</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
