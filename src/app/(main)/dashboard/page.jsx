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
  FaCheckCircle,
  FaTimes,
  FaClock,
  FaLightbulb,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

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
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [totalCalories, setTotalCalories] = useState(0);
  const [daywiseCalories, setDaywiseCalories] = useState([]);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [todayWorkout, setTodayWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workoutLoading, setWorkoutLoading] = useState(true);
  const [showFollowUpPopup, setShowFollowUpPopup] = useState(false);
  const [showReminderInput, setShowReminderInput] = useState(false);
  const [reminderTime, setReminderTime] = useState("");
  const [followUpStatus, setFollowUpStatus] = useState(null);
  const [showFollowUpConfirmPopup, setShowFollowUpConfirmPopup] =
    useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

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

  const getCurrentWeekDates = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const date = today.getDate();

    const todayLocal = new Date(year, month, date);
    const dayOfWeek = todayLocal.getDay();

    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const mondayLocal = new Date(year, month, date - daysToMonday);

    const formatDate = (dateObj) => {
      const y = dateObj.getFullYear();
      const m = String(dateObj.getMonth() + 1).padStart(2, "0");
      const d = String(dateObj.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    };

    const weekStart = formatDate(mondayLocal);

    const sundayLocal = new Date(mondayLocal);
    sundayLocal.setDate(mondayLocal.getDate() + 6);
    const weekEnd = formatDate(sundayLocal);

    return {
      weekStart,
      weekEnd,
    };
  };

  const loadAnalysis = useCallback(async () => {
    if (!user?.email) return;

    try {
      setAnalysisLoading(true);
      const { weekStart, weekEnd } = getCurrentWeekDates();
      const response = await profileAPI.getAnalysis(
        user.email,
        weekStart,
        weekEnd
      );
      setAnalysisData(response);
    } catch (err) {
      console.error("Error loading analysis:", err);
    } finally {
      setAnalysisLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.name && user?.email) {
      loadCaloriesHistory();
      loadWorkoutPlan();
      loadAnalysis();
    }
  }, [user, loadCaloriesHistory, loadWorkoutPlan, loadAnalysis]);

  useEffect(() => {
    checkFollowUpButtonStatus();

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkFollowUpButtonStatus();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !user) return;

    const checkFollowUpPopupStatus = () => {
      const followUpData = localStorage.getItem("exercise_followup");
      if (followUpData) {
        try {
          const data = JSON.parse(followUpData);
          const today = new Date().toISOString().split("T")[0];
          if (data.date === today && data.completed) {
            localStorage.removeItem("exercise_reminder");
            return;
          }
        } catch (e) {
          console.error("Error parsing follow-up data:", e);
        }
      }

      const reminderData = localStorage.getItem("exercise_reminder");
      if (reminderData) {
        try {
          const reminder = JSON.parse(reminderData);
          const today = new Date().toISOString().split("T")[0];

          if (reminder.date === today && reminder.time) {
            const now = new Date();
            const [hours, minutes] = reminder.time.split(":").map(Number);
            const reminderDateTime = new Date();
            reminderDateTime.setHours(hours, minutes, 0, 0);

            if (now >= reminderDateTime) {
              setShowFollowUpPopup(true);
            }
          } else {
            setShowFollowUpPopup(true);
          }
        } catch (e) {
          console.error("Error parsing reminder data:", e);
          setShowFollowUpPopup(true);
        }
      } else {
        setShowFollowUpPopup(true);
      }
    };

    checkFollowUpPopupStatus();

    const interval = setInterval(() => {
      checkFollowUpPopupStatus();
    }, 60000);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkFollowUpPopupStatus();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user]);

  const formatDayName = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const checkFollowUpButtonStatus = () => {
    if (typeof window !== "undefined") {
      const followUpData = localStorage.getItem("exercise_followup");
      if (followUpData) {
        try {
          const data = JSON.parse(followUpData);
          const today = new Date().toISOString().split("T")[0];
          if (data.date === today) {
            setFollowUpStatus("completed");
            return true;
          }
        } catch (e) {
          console.error("Error parsing follow-up data:", e);
        }
      }
      setFollowUpStatus("pending");
      return false;
    }
    return false;
  };

  const handleDoFollowUpNow = () => {
    setShowFollowUpPopup(false);
    router.push("/exercise/verify");
  };

  const handleDoItLater = () => {
    setShowReminderInput(true);
  };

  const handleSetReminder = () => {
    if (!reminderTime) {
      alert("Please enter a time");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem(
      "exercise_reminder",
      JSON.stringify({
        date: today,
        time: reminderTime,
      })
    );

    setShowFollowUpPopup(false);
    setShowReminderInput(false);
    setReminderTime("");
  };

  const handleCancelReminder = () => {
    setShowReminderInput(false);
    setReminderTime("");
    setShowFollowUpPopup(false);
  };

  const handleDismissPopup = () => {
    setShowFollowUpPopup(false);
  };

  const handleFollowUpButtonClick = () => {
    if (followUpStatus === "completed") {
      return;
    }
    setShowFollowUpConfirmPopup(true);
  };

  const handleConfirmFollowUpButton = () => {
    setShowFollowUpConfirmPopup(false);
    router.push("/exercise/verify");
  };

  const handleCancelFollowUpButton = () => {
    setShowFollowUpConfirmPopup(false);
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
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#f2b705]/10 rounded-full blur-[120px] animate-orb-1" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#f2b705]/5 rounded-full blur-[120px] animate-orb-2" />
        <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-white/5 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="w-full mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-500 mb-2">
                Welcome back, {user?.name?.split(" ")[0] || "User"}!
              </h1>
              <p className="text-sm text-gray-400">
                Here&apos;s your fitness overview for today
              </p>
            </div>
            <button
              onClick={handleFollowUpButtonClick}
              disabled={followUpStatus === "completed"}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg flex items-center space-x-2 ${
                followUpStatus === "completed"
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed opacity-60"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              <FaCheckCircle className="w-4 h-4" />
              <span className="text-sm">
                {followUpStatus === "completed"
                  ? "Follow Up Complete"
                  : "Follow Up Pending"}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
              <p className="text-xs text-gray-400">Today&apos;s Workout</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
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
                          Today&apos;s Workout
                        </h2>
                        <p className="text-black/70 text-xs">
                          {formatDayName(getTodayDay())}&apos;s Routine
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-[#f2b705] to-[#d4a004] p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center">
                      <FaChartLine className="text-black text-lg" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-black">
                        Weekly Exercise Analysis
                      </h2>
                      <p className="text-sm text-black/70">
                        {analysisData
                          ? `${analysisData.week_start} - ${analysisData.week_end}`
                          : "This week's progress"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {analysisLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-[#f2b705] rounded-full border-t-transparent animate-spin"></div>
                      </div>
                      <p className="text-gray-400 animate-pulse text-sm mt-4">
                        Loading analysis...
                      </p>
                    </div>
                  ) : analysisData && analysisData.daily_stats ? (
                    <div className="h-64">
                      <Bar
                        data={{
                          labels: analysisData.daily_stats.map(
                            (stat) => stat.day
                          ),
                          datasets: [
                            {
                              label: "Total Exercises",
                              data: analysisData.daily_stats.map(
                                (stat) => stat.total_exercises
                              ),
                              backgroundColor: "rgba(242, 183, 5, 0.3)",
                              borderColor: "rgba(242, 183, 5, 1)",
                              borderWidth: 2,
                              borderRadius: 8,
                            },
                            {
                              label: "Completed Exercises",
                              data: analysisData.daily_stats.map(
                                (stat) => stat.completed_exercises
                              ),
                              backgroundColor: "rgba(34, 197, 94, 0.6)",
                              borderColor: "rgba(34, 197, 94, 1)",
                              borderWidth: 2,
                              borderRadius: 8,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "top",
                              labels: {
                                color: "#ffffff",
                                font: {
                                  size: 12,
                                },
                                padding: 15,
                                usePointStyle: true,
                              },
                            },
                            tooltip: {
                              backgroundColor: "rgba(0, 0, 0, 0.8)",
                              titleColor: "#f2b705",
                              bodyColor: "#ffffff",
                              borderColor: "#f2b705",
                              borderWidth: 1,
                              padding: 12,
                            },
                          },
                          scales: {
                            x: {
                              ticks: {
                                color: "#9ca3af",
                                font: {
                                  size: 11,
                                },
                              },
                              grid: {
                                color: "rgba(255, 255, 255, 0.1)",
                              },
                            },
                            y: {
                              beginAtZero: true,
                              ticks: {
                                color: "#9ca3af",
                                font: {
                                  size: 11,
                                },
                                stepSize: 1,
                              },
                              grid: {
                                color: "rgba(255, 255, 255, 0.1)",
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <FaChartLine className="text-4xl text-[#f2b705]/30 mb-3" />
                      <p className="text-gray-400 text-sm mb-1">
                        No analysis data available
                      </p>
                      <p className="text-gray-500 text-xs">
                        Complete exercises to see your progress
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden h-full">
                <div className="bg-gradient-to-r from-[#f2b705]/20 to-[#f2b705]/10 p-5 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#f2b705]/20 flex items-center justify-center">
                      <FaLightbulb className="text-[#f2b705] text-lg" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white mb-1">
                        Personalized Advice
                      </h2>
                      <p className="text-xs text-gray-400">
                        Based on your progress
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  {analysisLoading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#f2b705] mb-3"></div>
                      <p className="text-gray-400 text-sm">Loading...</p>
                    </div>
                  ) : analysisData?.advice ? (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-[#f2b705]/10 to-[#f2b705]/5 rounded-xl p-4 border border-[#f2b705]/20">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#f2b705]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <FaLightbulb className="text-[#f2b705] text-sm" />
                          </div>
                          <p className="text-sm text-gray-200 leading-relaxed">
                            {analysisData.advice}
                          </p>
                        </div>
                      </div>

                      {analysisData.daily_stats && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                            <span>Week Summary</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                              <p className="text-xs text-gray-400 mb-1">
                                Total Exercises
                              </p>
                              <p className="text-lg font-bold text-white">
                                {analysisData.daily_stats.reduce(
                                  (sum, stat) => sum + stat.total_exercises,
                                  0
                                )}
                              </p>
                            </div>
                            <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                              <p className="text-xs text-gray-400 mb-1">
                                Completed
                              </p>
                              <p className="text-lg font-bold text-green-400">
                                {analysisData.daily_stats.reduce(
                                  (sum, stat) => sum + stat.completed_exercises,
                                  0
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <FaLightbulb className="text-4xl text-[#f2b705]/30 mb-3" />
                      <p className="text-gray-400 text-sm mb-1">
                        No advice available
                      </p>
                      <p className="text-gray-500 text-xs">
                        Complete exercises to get personalized tips
                      </p>
                    </div>
                  )}
                </div>
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

      {/* Exercise Follow-Up Popup */}
      {showFollowUpPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 md:p-8 max-w-md w-full mx-4 shadow-2xl">
            {!showReminderInput ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#f2b705]/20 flex items-center justify-center">
                    <FaDumbbell className="text-[#f2b705] text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Exercise Follow-Up
                    </h3>
                    <p className="text-sm text-gray-400">
                      Complete your workout tracking
                    </p>
                  </div>
                </div>

                <p className="text-gray-300 mb-6">
                  Have you completed your exercise today? Please do the
                  follow-up exercise if you have completed your workout. This
                  helps us track your progress accurately.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={handleDismissPopup}
                    className="flex-1 px-4 py-2.5 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/10"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={handleDoItLater}
                    className="flex-1 px-4 py-2.5 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/10"
                  >
                    I&apos;ll Do It Later
                  </button>
                  <button
                    onClick={handleDoFollowUpNow}
                    className="flex-1 px-4 py-2.5 bg-[#f2b705] text-black rounded-lg font-semibold hover:bg-[#d4a004] transition-colors shadow-md hover:shadow-lg"
                  >
                    Do Follow-Up
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#f2b705]/20 flex items-center justify-center">
                    <FaClock className="text-[#f2b705] text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Set Reminder
                    </h3>
                    <p className="text-sm text-gray-400">
                      When should we remind you?
                    </p>
                  </div>
                </div>

                <p className="text-gray-300 mb-4">
                  What time for exercise today? I will remind you again.
                </p>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Exercise Time
                  </label>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f2b705]/50 focus:border-[#f2b705]/50 transition-all"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCancelReminder}
                    className="flex-1 px-4 py-2.5 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSetReminder}
                    className="flex-1 px-4 py-2.5 bg-[#f2b705] text-black rounded-lg font-semibold hover:bg-[#d4a004] transition-colors shadow-md hover:shadow-lg"
                  >
                    Set Reminder
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Follow-Up Button Confirmation Popup */}
      {showFollowUpConfirmPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 md:p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">
                Follow Up Reminder
              </h3>
            </div>
            <p className="text-gray-300 mb-2">
              <strong className="text-white">Important:</strong> You can only
              give follow-up{" "}
              <strong className="text-[#f2b705]">once per day</strong>.
            </p>
            <p className="text-gray-400 text-sm mb-6">
              Please make sure you have completed your workout before submitting
              your follow-up. This helps us provide accurate analysis of your
              exercise progress.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelFollowUpButton}
                className="flex-1 px-4 py-2.5 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmFollowUpButton}
                className="flex-1 px-4 py-2.5 bg-[#f2b705] text-black rounded-lg font-semibold hover:bg-[#d4a004] transition-colors shadow-md hover:shadow-lg"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
