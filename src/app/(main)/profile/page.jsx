"use client";

import React, { useState, useEffect } from "react";
import { profileAPI } from "@/services/api";

export default function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

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
    const fetchProfileSummary = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);
        const response = await profileAPI.getProfileSummary(
          user.name,
          user.email
        );
        setProfileData(response);
      } catch (err) {
        console.error("Error fetching profile summary:", err);
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Failed to load profile. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.name && user?.email) {
      fetchProfileSummary();
    } else {
      setLoading(false);
      setError("User information not found. Please login again.");
    }
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    // Assuming time is in HH:MM format
    return timeString;
  };

  const formatText = (text) => {
    if (!text) return "N/A";
    return text
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleEdit = () => {
    if (!profileData) return;
    setEditFormData({
      height: profileData.personal_info?.height || "",
      weight: profileData.personal_info?.weight || "",
      goal: profileData.fitness_profile?.goal || "",
      activity_level: profileData.fitness_profile?.activity_level || "",
      medical_conditions: profileData.fitness_profile?.medical_conditions || "",
      injuries: profileData.fitness_profile?.injuries || "",
      workout_time_available:
        profileData.fitness_profile?.workout_time_available || "",
      diet_type: profileData.diet_preferences?.type || "",
      allergies: profileData.diet_preferences?.allergies || "",
      dislikes: profileData.diet_preferences?.dislikes || "",
      budget: profileData.diet_preferences?.budget || "",
      breakfast_time: profileData.diet_preferences?.meal_times?.breakfast || "",
      lunch_time: profileData.diet_preferences?.meal_times?.lunch || "",
      dinner_time: profileData.diet_preferences?.meal_times?.dinner || "",
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData(null);
  };

  const handleSave = async () => {
    if (!user?.name || !user?.email || !editFormData) return;

    try {
      setIsSaving(true);
      setError(null);

      const updateData = {
        name: user.name,
        email: user.email,
        height: parseFloat(editFormData.height),
        weight: parseFloat(editFormData.weight),
        goal: editFormData.goal,
        activity_level: editFormData.activity_level,
        medical_conditions: editFormData.medical_conditions,
        injuries: editFormData.injuries,
        workout_time_available: editFormData.workout_time_available,
        diet_type: editFormData.diet_type,
        allergies: editFormData.allergies,
        dislikes: editFormData.dislikes,
        budget: editFormData.budget,
        breakfast_time: editFormData.breakfast_time,
        lunch_time: editFormData.lunch_time,
        dinner_time: editFormData.dinner_time,
      };

      await profileAPI.updateProfile(updateData);

      // Reload profile data
      const response = await profileAPI.getProfileSummary(
        user.name,
        user.email
      );
      setProfileData(response);
      setIsEditing(false);
      setEditFormData(null);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const InfoCard = ({ title, children, icon }) => {
    return (
      <div className="bg-gradient-to-br from-black via-gray-900 to-black border border-[#f2b705]/30 rounded-xl shadow-xl p-4">
        <div className="flex items-center space-x-2 mb-3">
          {icon}
          <h3 className="text-base font-bold text-white">{title}</h3>
        </div>
        <div className="space-y-2">{children}</div>
      </div>
    );
  };

  const InfoRow = ({ label, value }) => {
    return (
      <div className="flex items-start justify-between py-2 border-b border-[#f2b705]/10 last:border-0">
        <span className="text-xs font-medium text-gray-400">{label}:</span>
        <span className="text-xs font-semibold text-white text-right max-w-[60%]">
          {value}
        </span>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 bg-black min-h-screen">
      <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
            Profile
          </h1>
          <p className="text-gray-400 text-sm">Your complete fitness profile</p>
        </div>
        {profileData && !isEditing && (
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-[#f2b705] text-black rounded-lg font-semibold hover:bg-[#d4a004] transition-colors flex items-center space-x-2"
          >
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span className="text-sm">Edit Profile</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#f2b705] mb-3"></div>
            <p className="text-gray-400 text-sm">Loading your profile...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <p className="text-red-400 font-semibold mb-1 text-sm">Error</p>
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      ) : profileData ? (
        <div className="space-y-4">
          {isEditing ? (
            <div className="bg-gradient-to-br from-black via-gray-900 to-black border border-[#f2b705]/30 rounded-xl shadow-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Edit Profile</h2>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-500 hover:text-gray-300"
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

              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                {/* Height and Weight */}
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        value={editFormData?.height || ""}
                        onChange={(e) =>
                          handleInputChange("height", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#f2b705] focus:border-transparent text-sm"
                        placeholder="Enter height"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        value={editFormData?.weight || ""}
                        onChange={(e) =>
                          handleInputChange("weight", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#f2b705] focus:border-transparent text-sm"
                        placeholder="Enter weight"
                      />
                    </div>
                  </div>
                </div>

                {/* Fitness Profile */}
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">
                    Fitness Profile
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        Goal
                      </label>
                      <select
                        value={editFormData?.goal || ""}
                        onChange={(e) =>
                          handleInputChange("goal", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#f2b705] focus:border-transparent text-sm"
                      >
                        <option value="">Select goal</option>
                        <option value="weight_loss">Weight Loss</option>
                        <option value="weight_gain">Weight Gain</option>
                        <option value="muscle_gain">Muscle Gain</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="endurance">Endurance</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        Activity Level
                      </label>
                      <select
                        value={editFormData?.activity_level || ""}
                        onChange={(e) =>
                          handleInputChange("activity_level", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#f2b705] focus:border-transparent text-sm"
                      >
                        <option value="">Select activity level</option>
                        <option value="sedentary">Sedentary</option>
                        <option value="light">Light</option>
                        <option value="moderate">Moderate</option>
                        <option value="active">Active</option>
                        <option value="very_active">Very Active</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        Medical Conditions
                      </label>
                      <input
                        type="text"
                        value={editFormData?.medical_conditions || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "medical_conditions",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#f2b705] focus:border-transparent text-sm"
                        placeholder="Enter medical conditions (or 'none')"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        Injuries
                      </label>
                      <input
                        type="text"
                        value={editFormData?.injuries || ""}
                        onChange={(e) =>
                          handleInputChange("injuries", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#f2b705] focus:border-transparent text-sm"
                        placeholder="Enter injuries (or 'none')"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        Workout Time Available
                      </label>
                      <input
                        type="time"
                        value={editFormData?.workout_time_available || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "workout_time_available",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#f2b705] focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Diet Preferences */}
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">
                    Diet Preferences
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        Diet Type
                      </label>
                      <select
                        value={editFormData?.diet_type || ""}
                        onChange={(e) =>
                          handleInputChange("diet_type", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#f2b705] focus:border-transparent text-sm"
                      >
                        <option value="">Select diet type</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="vegan">Vegan</option>
                        <option value="non_vegetarian">Non-Vegetarian</option>
                        <option value="pescatarian">Pescatarian</option>
                        <option value="keto">Keto</option>
                        <option value="paleo">Paleo</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        Allergies
                      </label>
                      <input
                        type="text"
                        value={editFormData?.allergies || ""}
                        onChange={(e) =>
                          handleInputChange("allergies", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#f2b705] focus:border-transparent text-sm"
                        placeholder="Enter allergies (or leave empty)"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        Dislikes
                      </label>
                      <input
                        type="text"
                        value={editFormData?.dislikes || ""}
                        onChange={(e) =>
                          handleInputChange("dislikes", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#f2b705] focus:border-transparent text-sm"
                        placeholder="Enter food dislikes (or leave empty)"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        Budget
                      </label>
                      <select
                        value={editFormData?.budget || ""}
                        onChange={(e) =>
                          handleInputChange("budget", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#f2b705] focus:border-transparent text-sm"
                      >
                        <option value="">Select budget</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 mb-2">
                        Meal Times
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1.5">
                            Breakfast
                          </label>
                          <input
                            type="time"
                            value={editFormData?.breakfast_time || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "breakfast_time",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#f2b705] focus:border-transparent text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1.5">
                            Lunch
                          </label>
                          <input
                            type="time"
                            value={editFormData?.lunch_time || ""}
                            onChange={(e) =>
                              handleInputChange("lunch_time", e.target.value)
                            }
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#f2b705] focus:border-transparent text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1.5">
                            Dinner
                          </label>
                          <input
                            type="time"
                            value={editFormData?.dinner_time || ""}
                            onChange={(e) =>
                              handleInputChange("dinner_time", e.target.value)
                            }
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-[#f2b705] focus:border-transparent text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-[#f2b705]/10">
                  <button
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-[#f2b705] text-black rounded-lg font-semibold hover:bg-[#d4a004] transition-colors disabled:opacity-50 flex items-center space-x-2 text-sm"
                  >
                    {isSaving ? (
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
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Personal Information */}
              <InfoCard
                title="Personal Information"
                icon={
                  <svg
                    className="w-5 h-5 text-[#f2b705]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                }
              >
                <InfoRow label="Name" value={profileData.personal_info?.name} />
                <InfoRow
                  label="Email"
                  value={profileData.personal_info?.email}
                />
                <InfoRow label="Age" value={profileData.personal_info?.age} />
                <InfoRow
                  label="Gender"
                  value={formatText(profileData.personal_info?.gender)}
                />
                <InfoRow
                  label="Height"
                  value={`${profileData.personal_info?.height} cm`}
                />
                <InfoRow
                  label="Weight"
                  value={`${profileData.personal_info?.weight} kg`}
                />
                <InfoRow
                  label="City"
                  value={profileData.personal_info?.location?.city}
                />
                <InfoRow
                  label="Pincode"
                  value={profileData.personal_info?.location?.pincode}
                />
              </InfoCard>

              {/* Fitness Profile */}
              <InfoCard
                title="Fitness Profile"
                icon={
                  <svg
                    className="w-5 h-5 text-[#f2b705]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                }
              >
                <InfoRow
                  label="Goal"
                  value={formatText(profileData.fitness_profile?.goal)}
                />
                <InfoRow
                  label="Activity Level"
                  value={formatText(
                    profileData.fitness_profile?.activity_level
                  )}
                />
                <InfoRow
                  label="Medical Conditions"
                  value={
                    profileData.fitness_profile?.medical_conditions || "None"
                  }
                />
                <InfoRow
                  label="Injuries"
                  value={profileData.fitness_profile?.injuries || "None"}
                />
                <InfoRow
                  label="Workout Time Available"
                  value={formatTime(
                    profileData.fitness_profile?.workout_time_available
                  )}
                />
              </InfoCard>

              {/* Diet Preferences */}
              <InfoCard
                title="Diet Preferences"
                icon={
                  <svg
                    className="w-5 h-5 text-[#f2b705]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
              >
                <InfoRow
                  label="Diet Type"
                  value={formatText(profileData.diet_preferences?.type)}
                />
                <InfoRow
                  label="Allergies"
                  value={profileData.diet_preferences?.allergies || "None"}
                />
                <InfoRow
                  label="Dislikes"
                  value={profileData.diet_preferences?.dislikes || "None"}
                />
                <InfoRow
                  label="Budget"
                  value={formatText(profileData.diet_preferences?.budget)}
                />
                <div className="pt-2">
                  <p className="text-xs font-semibold text-gray-400 mb-2">
                    Meal Times:
                  </p>
                  <div className="space-y-2 pl-4">
                    <InfoRow
                      label="Breakfast"
                      value={formatTime(
                        profileData.diet_preferences?.meal_times?.breakfast
                      )}
                    />
                    <InfoRow
                      label="Lunch"
                      value={formatTime(
                        profileData.diet_preferences?.meal_times?.lunch
                      )}
                    />
                    <InfoRow
                      label="Dinner"
                      value={formatTime(
                        profileData.diet_preferences?.meal_times?.dinner
                      )}
                    />
                  </div>
                </div>
              </InfoCard>

              {/* Sleep Schedule */}
              <InfoCard
                title="Sleep Schedule"
                icon={
                  <svg
                    className="w-5 h-5 text-[#f2b705]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                }
              >
                <InfoRow
                  label="Wake Up Time"
                  value={formatTime(profileData.sleep_schedule?.wake_up)}
                />
                <InfoRow
                  label="Sleep Time"
                  value={formatTime(profileData.sleep_schedule?.sleep)}
                />
              </InfoCard>

              {/* Current Status */}
              <InfoCard
                title="Current Status"
                icon={
                  <svg
                    className="w-5 h-5 text-[#f2b705]"
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
                }
              >
                <InfoRow
                  label="Latest Diet Date"
                  value={formatDate(
                    profileData.current_status?.latest_diet_date
                  )}
                />
                <InfoRow
                  label="Current Workout Week"
                  value={profileData.current_status?.current_workout_week}
                />
                <InfoRow
                  label="Current Workout Start"
                  value={formatDate(
                    profileData.current_status?.current_workout_start
                  )}
                />
              </InfoCard>
            </>
          )}
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="text-lg font-semibold text-white mb-2">
            No Profile Data Available
          </h3>
          <p className="text-gray-400 text-sm">
            Unable to load your profile. Please try again later.
          </p>
        </div>
      )}
    </div>
  );
}
