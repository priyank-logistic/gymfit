"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import AuthInput from "@/components/AuthInput";
import { profileAPI } from "@/services/api";

const TOTAL_STEPS = 5;

const stepIcons = {
  1: "👤",
  2: "💪",
  3: "🥗",
  4: "⏰",
  5: "📍",
};

const stepTitles = {
  1: "Personal Details",
  2: "Fitness & Health",
  3: "Diet Preferences",
  4: "Daily Routine",
  5: "Location",
};

const stepDescriptions = {
  1: "Tell us about yourself",
  2: "Set your fitness goals",
  3: "Your dietary preferences",
  4: "Your daily schedule",
  5: "Where are you located?",
};

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [stepDirection, setStepDirection] = useState("forward");

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
        setStepDirection("forward");
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setStepDirection("backward");
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
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{stepIcons[1]}</div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {stepTitles[1]}
              </h2>
              <p className="text-gray-400">{stepDescriptions[1]}</p>
            </div>
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f2b705] focus:border-transparent transition-all bg-black text-white ${
                  errors.gender
                    ? "border-red-500 focus:ring-red-500"
                    : "border-[#f2b705]/30 hover:border-[#f2b705]/50"
                }`}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
              {errors.gender && (
                <p className="mt-1.5 text-sm text-red-400">{errors.gender}</p>
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
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{stepIcons[2]}</div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {stepTitles[2]}
              </h2>
              <p className="text-gray-400">{stepDescriptions[2]}</p>
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Fitness Goal <span className="text-red-500">*</span>
              </label>
              <select
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f2b705] focus:border-transparent transition-all bg-black text-white ${
                  errors.goal
                    ? "border-red-500 focus:ring-red-500"
                    : "border-[#f2b705]/30 hover:border-[#f2b705]/50"
                }`}
              >
                <option value="">Select your goal</option>
                <option value="weight_loss">Weight Loss</option>
                <option value="weight_gain">Weight Gain</option>
                <option value="maintain_weight">Maintain Weight</option>
              </select>
              {errors.goal && (
                <p className="mt-1.5 text-sm text-red-400">{errors.goal}</p>
              )}
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Activity Level <span className="text-red-500">*</span>
              </label>
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f2b705] focus:border-transparent transition-all bg-black text-white ${
                  errors.activityLevel
                    ? "border-red-500 focus:ring-red-500"
                    : "border-[#f2b705]/30 hover:border-[#f2b705]/50"
                }`}
              >
                <option value="">Select activity level</option>
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="heavy">Heavy</option>
              </select>
              {errors.activityLevel && (
                <p className="mt-1.5 text-sm text-red-400">
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
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{stepIcons[3]}</div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {stepTitles[3]}
              </h2>
              <p className="text-gray-400">{stepDescriptions[3]}</p>
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Diet Type <span className="text-red-500">*</span>
              </label>
              <select
                name="dietType"
                value={formData.dietType}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f2b705] focus:border-transparent transition-all bg-black text-white ${
                  errors.dietType
                    ? "border-red-500 focus:ring-red-500"
                    : "border-[#f2b705]/30 hover:border-[#f2b705]/50"
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
                <p className="mt-1.5 text-sm text-red-400">{errors.dietType}</p>
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
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{stepIcons[4]}</div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {stepTitles[4]}
              </h2>
              <p className="text-gray-400">{stepDescriptions[4]}</p>
            </div>
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
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{stepIcons[5]}</div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {stepTitles[5]}
              </h2>
              <p className="text-gray-400">{stepDescriptions[5]}</p>
            </div>
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Budget Range (Optional)
              </label>
              <select
                name="budgetRange"
                value={formData.budgetRange}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#f2b705]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f2b705] focus:border-transparent transition-all bg-black text-white hover:border-[#f2b705]/50"
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#f2b705]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#f2b705]/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 bg-gradient-to-r from-[#f2b705] to-[#d4a004] bg-clip-text text-transparent">
            Welcome to Your Fitness Journey
          </h1>
          <p className="text-gray-400 text-lg">
            Let&apos;s personalize your experience
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map(
              (step) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300 ${
                        step === currentStep
                          ? "bg-[#f2b705] text-black scale-110 shadow-lg shadow-[#f2b705]/50"
                          : step < currentStep
                          ? "bg-[#f2b705]/80 text-black"
                          : "bg-gray-800 text-gray-400 border-2 border-gray-700"
                      }`}
                    >
                      {step < currentStep ? "✓" : stepIcons[step]}
                    </div>
                    <p
                      className={`mt-2 text-xs font-medium hidden md:block ${
                        step === currentStep
                          ? "text-[#f2b705]"
                          : step < currentStep
                          ? "text-gray-400"
                          : "text-gray-600"
                      }`}
                    >
                      {stepTitles[step].split(" ")[0]}
                    </p>
                  </div>
                  {step < TOTAL_STEPS && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300 ${
                        step < currentStep ? "bg-[#f2b705]" : "bg-gray-800"
                      }`}
                    ></div>
                  )}
                </React.Fragment>
              )
            )}
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">
              Step {currentStep} of {TOTAL_STEPS}
            </span>
            <span className="text-[#f2b705] font-semibold">
              {Math.round((currentStep / TOTAL_STEPS) * 100)}% Complete
            </span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border border-[#f2b705]/20 rounded-3xl shadow-2xl p-6 md:p-10 relative overflow-hidden">
          {/* Card glow effect */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f2b705]/50 to-transparent"></div>

          {/* Step Content */}
          <div className="relative z-10 min-h-[400px]">
            {renderStepContent()}
          </div>

          <div className="flex gap-2 justify-center mt-4">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map(
              (step) => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full transition-all ${
                    step === currentStep
                      ? "bg-[#f2b705] w-8"
                      : step < currentStep
                      ? "bg-[#f2b705]/50"
                      : "bg-gray-700"
                  }`}
                ></div>
              )
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 gap-2 border-t border-gray-800">
            <Button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1 || isLoading}
              variant="secondary"
              className="min-w-[120px]"
            >
              ← Previous
            </Button>

            <Button
              type="button"
              onClick={handleNext}
              loading={isLoading}
              variant="primary"
              className="min-w-[120px]"
            >
              {currentStep === TOTAL_STEPS ? "Complete ✓" : "Next →"}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Your information is secure and will only be used to personalize your
            experience
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
