"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import AuthInput from "@/components/AuthInput";
import { profileAPI } from "@/services/api";

const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const getUserData = () => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          return {
            name: user.name || "",
            email: user.email || "",
          };
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }
    }
    return { name: "", email: "" };
  };

  const userData = getUserData();

  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    age: "",
    gender: "",
    height: "",
    weight: "",

    goal: "",
    activityLevel: "",
    medicalConditions: "",
    injuries: "",

    dietType: "",
    foodAllergies: "",
    foodDislikes: "",

    wakeUpTime: "",
    sleepTime: "",
    breakfastTime: "",
    lunchTime: "",
    dinnerTime: "",
    preferredWorkoutTime: "",

    pincode: "",
    city: "",
    budgetRange: "",
  });

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.age) newErrors.age = "Age is required";
        else if (parseInt(formData.age) < 1 || parseInt(formData.age) > 120)
          newErrors.age = "Please enter a valid age";
        if (!formData.gender) newErrors.gender = "Gender is required";
        if (!formData.height) newErrors.height = "Height is required";
        if (!formData.weight) newErrors.weight = "Weight is required";
        break;

      case 2:
        if (!formData.goal) newErrors.goal = "Fitness goal is required";
        if (!formData.activityLevel)
          newErrors.activityLevel = "Activity level is required";
        break;

      case 3:
        if (!formData.dietType) newErrors.dietType = "Diet type is required";
        break;

      case 4:
        if (!formData.wakeUpTime)
          newErrors.wakeUpTime = "Wake-up time is required";
        if (!formData.sleepTime) newErrors.sleepTime = "Sleep time is required";
        if (!formData.breakfastTime)
          newErrors.breakfastTime = "Breakfast time is required";
        if (!formData.lunchTime) newErrors.lunchTime = "Lunch time is required";
        if (!formData.dinnerTime)
          newErrors.dinnerTime = "Dinner time is required";
        if (!formData.preferredWorkoutTime)
          newErrors.preferredWorkoutTime = "Preferred workout time is required";
        break;

      case 5:
        if (!formData.pincode) newErrors.pincode = "Pincode is required";
        if (!formData.city) newErrors.city = "City is required";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const userData = getUserData();

      const profileData = {
        name: userData.name || formData.name,
        email: userData.email || formData.email,
        age: parseInt(formData.age) || 0,
        gender: formData.gender,
        height: parseFloat(formData.height) || 0,
        weight: parseFloat(formData.weight) || 0,
        goal: formData.goal,
        activity_level: formData.activityLevel,
        medical_conditions: formData.medicalConditions || "none",
        injuries: formData.injuries || "none",
        diet_type: formData.dietType,
        food_allergies: formData.foodAllergies || "",
        food_dislikes: formData.foodDislikes || "",
        wake_up_time: formData.wakeUpTime,
        sleep_time: formData.sleepTime,
        breakfast_time: formData.breakfastTime,
        lunch_time: formData.lunchTime,
        dinner_time: formData.dinnerTime,
        workout_time: formData.preferredWorkoutTime,
        pincode: formData.pincode,
        city: formData.city,
        budget: formData.budgetRange || "",
      };

      await profileAPI.submitProfile(profileData);

      const storedUserData = localStorage.getItem("user");
      if (storedUserData) {
        try {
          const user = JSON.parse(storedUserData);
          user.onboardingCompleted = true;
          user.onboardingData = profileData;
          localStorage.setItem("user", JSON.stringify(user));
        } catch (e) {
          console.error("Error updating user data:", e);
        }
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Onboarding error:", error);
      alert(
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Failed to save onboarding data. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-white mb-6">
              Personal Details
            </h2>
            <AuthInput
              label="Age"
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age"
              error={errors.age}
              required
              min="1"
              max="120"
            />
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f2b705] focus:border-transparent transition-all ${
                  errors.gender
                    ? "border-red-500 focus:ring-red-500"
                    : "border-[#f2b705]/30 hover:border-gray-400"
                }`}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
              {errors.gender && (
                <p className="mt-1.5 text-sm text-red-600">{errors.gender}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <AuthInput
                label="Height (cm)"
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="Height in cm"
                error={errors.height}
                required
                min="50"
                max="250"
                step="0.1"
              />
              <AuthInput
                label="Weight (kg)"
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Weight in kg"
                error={errors.weight}
                required
                min="20"
                max="300"
                step="0.1"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-white mb-6">
              Fitness & Health
            </h2>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Fitness Goal <span className="text-red-500">*</span>
              </label>
              <select
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f2b705] focus:border-transparent transition-all ${
                  errors.goal
                    ? "border-red-500 focus:ring-red-500"
                    : "border-[#f2b705]/30 hover:border-gray-400"
                }`}
              >
                <option value="">Select your goal</option>
                <option value="weight_loss">Weight Loss</option>
                <option value="weight_gain">Weight Gain</option>
                <option value="maintain_weight">Maintain Weight</option>
              </select>
              {errors.goal && (
                <p className="mt-1.5 text-sm text-red-600">{errors.goal}</p>
              )}
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Activity Level <span className="text-red-500">*</span>
              </label>
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f2b705] focus:border-transparent transition-all ${
                  errors.activityLevel
                    ? "border-red-500 focus:ring-red-500"
                    : "border-[#f2b705]/30 hover:border-gray-400"
                }`}
              >
                <option value="">Select activity level</option>
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="heavy">Heavy</option>
              </select>
              {errors.activityLevel && (
                <p className="mt-1.5 text-sm text-red-600">
                  {errors.activityLevel}
                </p>
              )}
            </div>
            <AuthInput
              label="Medical Conditions (Optional)"
              type="text"
              name="medicalConditions"
              value={formData.medicalConditions}
              onChange={handleChange}
              placeholder="e.g., Diabetes, Hypertension"
            />
            <AuthInput
              label="Injuries (Optional)"
              type="text"
              name="injuries"
              value={formData.injuries}
              onChange={handleChange}
              placeholder="e.g., Knee injury, Back pain"
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-white mb-6">Diet</h2>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Diet Type <span className="text-red-500">*</span>
              </label>
              <select
                name="dietType"
                value={formData.dietType}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f2b705] focus:border-transparent transition-all ${
                  errors.dietType
                    ? "border-red-500 focus:ring-red-500"
                    : "border-[#f2b705]/30 hover:border-gray-400"
                }`}
              >
                <option value="">Select diet type</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="eggetarian">Eggetarian</option>
                <option value="jain">Jain</option>
              </select>
              {errors.dietType && (
                <p className="mt-1.5 text-sm text-red-600">{errors.dietType}</p>
              )}
            </div>
            <AuthInput
              label="Food Allergies"
              type="text"
              name="foodAllergies"
              value={formData.foodAllergies}
              onChange={handleChange}
              placeholder="e.g., Nuts, Dairy, Gluten"
            />
            <AuthInput
              label="Food Dislikes (Optional)"
              type="text"
              name="foodDislikes"
              value={formData.foodDislikes}
              onChange={handleChange}
              placeholder="Foods you don't like"
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-white mb-6">
              Daily Routine
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <AuthInput
                label="Wake-up Time"
                type="time"
                name="wakeUpTime"
                value={formData.wakeUpTime}
                onChange={handleChange}
                error={errors.wakeUpTime}
                required
              />
              <AuthInput
                label="Sleep Time"
                type="time"
                name="sleepTime"
                value={formData.sleepTime}
                onChange={handleChange}
                error={errors.sleepTime}
                required
              />
            </div>
            <AuthInput
              label="Breakfast Time"
              type="time"
              name="breakfastTime"
              value={formData.breakfastTime}
              onChange={handleChange}
              error={errors.breakfastTime}
              required
            />
            <AuthInput
              label="Lunch Time"
              type="time"
              name="lunchTime"
              value={formData.lunchTime}
              onChange={handleChange}
              error={errors.lunchTime}
              required
            />
            <AuthInput
              label="Dinner Time"
              type="time"
              name="dinnerTime"
              value={formData.dinnerTime}
              onChange={handleChange}
              error={errors.dinnerTime}
              required
            />
            <AuthInput
              label="Preferred Workout Time"
              type="time"
              name="preferredWorkoutTime"
              value={formData.preferredWorkoutTime}
              onChange={handleChange}
              error={errors.preferredWorkoutTime}
              required
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-white mb-6">Location</h2>
            <AuthInput
              label="Pincode"
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="Enter pincode"
              error={errors.pincode}
              required
            />
            <AuthInput
              label="City"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
              error={errors.city}
              required
            />
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Budget Range (Optional)
              </label>
              <select
                name="budgetRange"
                value={formData.budgetRange}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#f2b705]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f2b705] focus:border-transparent transition-all hover:border-gray-400"
              >
                <option value="">Select budget range</option>
                <option value="low">Low (&lt; ₹2,000/month)</option>
                <option value="medium">Medium (₹2,000 - ₹5,000/month)</option>
                <option value="high">High (&gt; ₹5,000/month)</option>
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-300">
              Step {currentStep} of {TOTAL_STEPS}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / TOTAL_STEPS) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#f2b705] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-black border border-[#f2b705]/20 rounded-2xl shadow-xl p-8">
          {renderStepContent()}

          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1 || isLoading}
              variant="secondary"
              className="max-w-[120px]"
            >
              Previous
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              loading={isLoading}
              variant="primary"
              className="max-w-[120px]"
            >
              {currentStep === TOTAL_STEPS ? "Complete" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
