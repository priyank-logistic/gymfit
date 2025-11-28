"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { profileAPI } from "@/services/api";
import {
  FaCheckCircle,
  FaDumbbell,
  FaClock,
  FaSpinner,
  FaCheck,
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

export default function TakeFollowUp() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [todayExercises, setTodayExercises] = useState([]);
  const [completedExercises, setCompletedExercises] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const checkAccess = () => {
      if (typeof window !== "undefined") {
        const verifySuccess = sessionStorage.getItem("exercise_verify_success");

        if (!verifySuccess) {
          router.push("/exercise/verify");
          return false;
        }

        try {
          const data = JSON.parse(verifySuccess);
          const now = Date.now();
          if (now - data.timestamp > 10 * 60 * 1000) {
            sessionStorage.removeItem("exercise_verify_success");
            router.push("/exercise/verify");
            return false;
          }
        } catch (e) {
          console.error("Error parsing verify success data:", e);
          router.push("/exercise/verify");
          return false;
        }
      }
      return true;
    };

    if (!checkAccess()) {
      return;
    }

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
  }, [router]);

  useEffect(() => {
    const getTodayDay = () => {
      const today = new Date();
      const dayIndex = today.getDay();
      const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
      return daysOfWeek[adjustedIndex];
    };

    const fetchTodayWorkout = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        const response = await axios.post(
          "http://192.168.0.25:8000/profile/workout-plan",
          {
            name: user.name,
            email: user.email,
          }
        );

        setWorkoutPlan(response.data);
        if (response.data?.workout_plan) {
          const todayDay = getTodayDay();
          const todayWorkout = response.data.workout_plan[todayDay];

          if (todayWorkout && todayWorkout.exercises) {
            setTodayExercises(todayWorkout.exercises);
            const initialCompleted = {};
            todayWorkout.exercises.forEach((_, index) => {
              initialCompleted[index] = false;
            });
            setCompletedExercises(initialCompleted);
          } else {
            setError(
              "No workout plan available for today. Please check back tomorrow!"
            );
          }
        }
      } catch (err) {
        console.error("Error fetching workout plan:", err);
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Failed to load today's workout. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.name && user?.email) {
      fetchTodayWorkout();
    } else {
      setLoading(false);
      setError("User information not found. Please login again.");
    }
  }, [user]);

  const formatDayName = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const getTodayDay = () => {
    const today = new Date();
    const dayIndex = today.getDay();
    const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
    return daysOfWeek[adjustedIndex];
  };

  const toggleExercise = (index) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSubmit = async () => {
    if (!user?.email) {
      setError("User information not found. Please login again.");
      return;
    }

    const completedCount = Object.values(completedExercises).filter(
      (val) => val === true
    ).length;

    if (completedCount === 0) {
      setError("Please mark at least one exercise as completed.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const followUpData = {
        email: user.email,
        date: new Date().toISOString().split("T")[0],
        day: getTodayDay(),
        exercises: todayExercises.map((exercise, index) => ({
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          rest: exercise.rest,
          completed: completedExercises[index] || false,
        })),
        total_exercises: todayExercises.length,
        completed_exercises: completedCount,
        completion_rate: (completedCount / todayExercises.length) * 100,
      };

      await profileAPI.submitExerciseFollowUp(followUpData);

      if (typeof window !== "undefined") {
        const today = new Date().toISOString().split("T")[0];
        localStorage.setItem(
          "exercise_followup",
          JSON.stringify({
            date: today,
            email: user.email,
            completed: true,
          })
        );

        sessionStorage.removeItem("exercise_verify_success");
      }

      setSuccess(true);

      setTimeout(() => {
        router.push("/exercise");
      }, 2000);
    } catch (err) {
      console.error("Error submitting follow-up:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to submit follow-up. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const allCompleted =
    todayExercises.length > 0 &&
    Object.values(completedExercises).every((val) => val === true);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#f2b705]/10 rounded-full blur-[120px] animate-orb-1" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#f2b705]/5 rounded-full blur-[120px] animate-orb-2" />
        <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-white/5 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="w-full max-w-4xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => router.push("/exercise")}
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
              Back to Exercise
            </button>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <FaCheckCircle className="text-green-500 text-xl" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-500">
                  Exercise Follow Up
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                  Mark the exercises you completed today for analysis
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#f2b705] rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="text-gray-400 animate-pulse text-sm">
                Loading today&apos;s workout...
              </p>
            </div>
          ) : error && !workoutPlan ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center backdrop-blur-sm">
              <p className="text-red-400 font-bold text-lg mb-2">
                Unable to Load Workout
              </p>
              <p className="text-gray-400 text-sm">{error}</p>
            </div>
          ) : success ? (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-green-500 text-4xl" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Follow Up Submitted!
              </h2>
              <p className="text-gray-400 mb-4">
                Your exercise data has been recorded successfully.
                Redirecting...
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {workoutPlan && (
                <div className="bg-gradient-to-r from-[#f2b705] to-[#d4a004] rounded-2xl p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-black/20 flex items-center justify-center">
                      <FaDumbbell className="text-black text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-black">
                        {formatDayName(getTodayDay())}&apos;s Workout
                      </h2>
                      <p className="text-black/70 text-xs">
                        {workoutPlan.workout_plan[getTodayDay()]?.focus ||
                          "Today's exercises"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {todayExercises.length > 0 && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-300">
                      Progress
                    </span>
                    <span className="text-sm font-bold text-[#f2b705]">
                      {
                        Object.values(completedExercises).filter(
                          (val) => val === true
                        ).length
                      }{" "}
                      / {todayExercises.length} completed
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#f2b705] to-[#d4a004] h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          (Object.values(completedExercises).filter(
                            (val) => val === true
                          ).length /
                            todayExercises.length) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FaDumbbell className="text-[#f2b705]" />
                    Today&apos;s Exercises
                  </h3>
                  <div className="space-y-3">
                    {todayExercises.map((exercise, index) => {
                      const isCompleted = completedExercises[index] || false;
                      return (
                        <div
                          key={index}
                          className={`group bg-white/5 border rounded-xl p-4 transition-all duration-300 ${
                            isCompleted
                              ? "border-green-500/50 bg-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                              : "border-white/10 hover:border-[#f2b705]/50 hover:shadow-[0_0_20px_rgba(242,183,5,0.1)]"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <button
                              onClick={() => toggleExercise(index)}
                              className={`mt-1 flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                isCompleted
                                  ? "bg-green-500 border-green-500"
                                  : "border-white/30 hover:border-[#f2b705]"
                              }`}
                            >
                              {isCompleted && (
                                <FaCheck className="text-white text-xs" />
                              )}
                            </button>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="w-6 h-6 rounded-full bg-[#f2b705]/20 flex items-center justify-center text-[#f2b705] text-xs font-bold">
                                  {index + 1}
                                </span>
                                <h4
                                  className={`text-base font-bold flex-1 ${
                                    isCompleted
                                      ? "text-green-400 line-through"
                                      : "text-white"
                                  }`}
                                >
                                  {exercise.name}
                                </h4>
                              </div>
                              {exercise.notes && (
                                <p className="text-xs text-gray-400 italic ml-8 mb-3">
                                  {exercise.notes}
                                </p>
                              )}

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
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                  <FaCheckCircle className="text-red-400 text-xl flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-400 font-semibold">Error</p>
                    <p className="text-red-300 text-sm mt-1">{error}</p>
                  </div>
                </div>
              )}

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-white font-semibold mb-1">
                      Ready to submit your follow-up?
                    </p>
                    <p className="text-gray-400 text-sm">
                      {allCompleted
                        ? "Great job! You completed all exercises! 🎉"
                        : `You've completed ${
                            Object.values(completedExercises).filter(
                              (val) => val === true
                            ).length
                          } out of ${todayExercises.length} exercises.`}
                    </p>
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={
                      submitting ||
                      Object.values(completedExercises).filter(
                        (val) => val === true
                      ).length === 0
                    }
                    className="px-8 py-3 bg-[#f2b705] text-black rounded-lg font-semibold hover:bg-[#d4a004] transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 min-w-[180px] justify-center"
                  >
                    {submitting ? (
                      <>
                        <FaSpinner className="animate-spin text-lg" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <FaCheckCircle className="text-lg" />
                        <span>Submit Follow Up</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
