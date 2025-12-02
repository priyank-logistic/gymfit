"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { profileAPI } from "@/services/api";
import {
  FaDumbbell,
  FaCalendarWeek,
  FaClock,
  FaFire,
  FaCheckCircle,
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

export default function Exercise() {
  const router = useRouter();
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [followUpStatus, setFollowUpStatus] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const checkFollowUpStatus = () => {
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
    checkFollowUpStatus();

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkFollowUpStatus();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const getTodayDay = () => {
      const today = new Date();
      const dayIndex = today.getDay();
      const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
      return daysOfWeek[adjustedIndex];
    };

    const fetchWorkoutPlan = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        const response = await profileAPI.getWorkoutPlan(user.name, user.email);

        setWorkoutPlan(response);
        if (response?.workout_plan) {
          const days = Object.keys(response.workout_plan);
          if (days.length > 0) {
            const todayDay = getTodayDay();
            if (response.workout_plan[todayDay]) {
              setSelectedDay(todayDay);
            } else {
              setSelectedDay(days[0]);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching workout plan:", err);
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Failed to load workout plan. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.name && user?.email) {
      fetchWorkoutPlan();
    } else {
      setLoading(false);
      setError("User information not found. Please login again.");
    }
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDayName = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const handleDownloadPDF = async () => {
    if (!user?.email) {
      setError("User information not found. Please login again.");
      return;
    }

    setDownloading(true);
    try {
      const blob = await profileAPI.downloadWorkoutPlanPDF(user.email);

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `workout-plan-week-${workoutPlan?.week_number || "current"}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading PDF:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to download PDF. Please try again."
      );
    } finally {
      setDownloading(false);
    }
  };

  const handleFollowUpClick = () => {
    if (followUpStatus === "completed") {
      return;
    }
    setShowPopup(true);
  };

  const handleConfirmFollowUp = () => {
    setShowPopup(false);
    router.push("/exercise/verify");
  };

  const handleCancelFollowUp = () => {
    setShowPopup(false);
  };

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
              <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-500">
                Workout Plan
              </h1>
              <p className="text-sm text-gray-400">
                Your personalized weekly exercise routine
              </p>
            </div>
            {workoutPlan?.workout_plan && (
              <div className="flex gap-3">
                <button
                  onClick={handleFollowUpClick}
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
                <button
                  onClick={handleDownloadPDF}
                  disabled={downloading}
                  className="px-6 py-2.5 bg-[#f2b705] text-black rounded-lg font-semibold hover:bg-[#d4a004] transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {downloading ? (
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
                      <span className="text-sm">Downloading...</span>
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
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H4a2 2 0 01-2-2V6a2 2 0 012-2h7.414l2.586 2.586A2 2 0 0116 7.414V18a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="text-sm">Download PDF</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#f2b705] rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="text-gray-400 animate-pulse text-sm">
                Loading your workout plan...
              </p>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center max-w-2xl mx-auto backdrop-blur-sm">
              <p className="text-red-400 font-bold text-lg mb-2">
                Unable to Load Plan
              </p>
              <p className="text-gray-400 text-sm">{error}</p>
            </div>
          ) : workoutPlan?.workout_plan ? (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#f2b705] to-[#d4a004] rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-black/20 flex items-center justify-center">
                    <FaCalendarWeek className="text-black text-xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-black">
                      Week {workoutPlan.week_number}
                    </h2>
                    <p className="text-black/70 text-xs">
                      {formatDate(workoutPlan.week_start)} -{" "}
                      {formatDate(workoutPlan.week_end)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => {
                    const dayData = workoutPlan.workout_plan[day];
                    const isSelected = selectedDay === day;
                    const isActive = !!dayData;

                    if (!isActive) return null;

                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`px-4 py-2 rounded-xl font-bold transition-all text-sm ${
                          isSelected
                            ? "bg-[#f2b705] text-black shadow-[0_0_20px_rgba(242,183,5,0.3)] scale-105"
                            : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                        }`}
                      >
                        {formatDayName(day)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedDay && workoutPlan.workout_plan[selectedDay] && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-[#f2b705] to-[#d4a004] p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center">
                        <FaDumbbell className="text-black text-lg" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-black">
                          {formatDayName(selectedDay)}
                        </h3>
                        <p className="text-sm text-black/70">
                          {workoutPlan.workout_plan[selectedDay].focus}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="space-y-4">
                      {workoutPlan.workout_plan[selectedDay].exercises.map(
                        (exercise, index) => (
                          <div
                            key={index}
                            className="group bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#f2b705]/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(242,183,5,0.1)]"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-full bg-[#f2b705]/20 flex items-center justify-center text-[#f2b705] text-xs font-bold">
                                    {index + 1}
                                  </span>
                                  {exercise.name}
                                </h4>
                                {exercise.notes && (
                                  <p className="text-xs text-gray-400 italic ml-8">
                                    {exercise.notes}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3 mt-3">
                              <div className="bg-[#f2b705]/10 border border-[#f2b705]/20 rounded-lg p-2.5 text-center">
                                <div className="text-xl font-bold text-[#f2b705]">
                                  {exercise.sets}
                                </div>
                                <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">
                                  Sets
                                </div>
                              </div>
                              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2.5 text-center">
                                <div className="text-xl font-bold text-green-500">
                                  {exercise.reps}
                                </div>
                                <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">
                                  Reps
                                </div>
                              </div>
                              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-2.5 text-center">
                                <div className="text-xl font-bold text-orange-500 flex items-center justify-center gap-1">
                                  {exercise.rest}
                                  <FaClock className="text-xs" />
                                </div>
                                <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">
                                  Rest (s)
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <FaFire className="text-[#f2b705]" />
                  Weekly Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {daysOfWeek.map((day) => {
                    const dayData = workoutPlan.workout_plan[day];
                    if (!dayData) return null;

                    return (
                      <div
                        key={day}
                        className={`border-2 rounded-xl p-3 cursor-pointer transition-all hover:shadow-md ${
                          selectedDay === day
                            ? "border-[#f2b705] bg-[#f2b705]/10"
                            : "border-white/10 hover:border-white/20"
                        }`}
                        onClick={() => setSelectedDay(day)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-white text-sm">
                            {formatDayName(day)}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f2b705] text-black">
                            {dayData.exercises.length} ex
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">{dayData.focus}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-32 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
              <FaDumbbell className="text-5xl text-[#f2b705]/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                No Workout Plan Available
              </h3>
              <p className="text-gray-400 text-sm">
                Unable to load your workout plan. Please try again later.
              </p>
            </div>
          )}
        </div>
      </div>

      {showPopup && (
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
                onClick={handleCancelFollowUp}
                className="flex-1 px-4 py-2.5 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmFollowUp}
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
