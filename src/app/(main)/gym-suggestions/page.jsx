"use client";

import React, { useState, useEffect } from "react";
import { profileAPI } from "@/services/api";
import {
  FaDumbbell,
  FaMapMarkerAlt,
  FaMapPin,
  FaBuilding,
  FaSearch
} from "react-icons/fa";

export default function GymSuggestions() {
  const [gymData, setGymData] = useState(null);
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
    const fetchGymSuggestions = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);
        const response = await profileAPI.getGymSuggestion(user.email);
        setGymData(response);
      } catch (err) {
        console.error("Error fetching gym suggestions:", err);
        setError(
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to load gym suggestions. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchGymSuggestions();
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

  const GymCard = ({ gym, index }) => {
    if (!gym) return null;

    return (
      <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-[#f2b705]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(242,183,5,0.1)] hover:-translate-y-1 overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#f2b705]/10 rounded-full blur-3xl group-hover:bg-[#f2b705]/20 transition-all duration-500" />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#f2b705]/20 rounded-full flex items-center justify-center border border-[#f2b705]/30 group-hover:scale-110 transition-transform duration-300">
                <span className="text-[#f2b705] font-bold text-base">
                  {index + 1}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#f2b705] transition-colors">
                  {gym.name}
                </h3>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-black/20 rounded-lg p-3 border border-white/5">
              <FaMapMarkerAlt className="text-[#f2b705] text-base mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Address
                </p>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {gym.address}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-black/20 rounded-lg p-3 border border-white/5">
              <FaMapPin className="text-orange-500 text-base flex-shrink-0" />
              <div className="flex-1">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Pincode
                </p>
                <p className="text-sm text-white font-semibold">
                  {gym.pincode}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
          <div className="mb-8">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-500 mb-2">
              Gym Suggestions
            </h1>
            <p className="text-sm text-gray-400">
              Recommended gyms based on your location and preferences
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#f2b705] rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="text-gray-400 animate-pulse text-sm">Finding gyms near you...</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center max-w-2xl mx-auto backdrop-blur-sm">
              <p className="text-red-400 font-bold text-lg mb-2">Unable to Load Gyms</p>
              <p className="text-gray-400 text-sm">{error}</p>
            </div>
          ) : gymData?.suggestion?.recommended_gyms ? (
            <div className="space-y-6">
              {/* Summary Header */}
              <div className="bg-gradient-to-r from-[#f2b705] to-[#d4a004] rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-black/20 flex items-center justify-center">
                      <FaDumbbell className="text-black text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-black">
                        Recommended Gyms
                      </h2>
                      {gymData.date && (
                        <p className="text-black/70 text-xs">
                          {formatDate(gymData.date)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-black">
                      {gymData.suggestion.recommended_gyms.length}
                    </p>
                    <p className="text-black/70 text-xs uppercase tracking-wider">
                      Found
                    </p>
                  </div>
                </div>
              </div>

              {/* Gyms Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {gymData.suggestion.recommended_gyms.map((gym, index) => (
                  <GymCard key={index} gym={gym} index={index} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-32 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
              <FaSearch className="text-5xl text-[#f2b705]/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                No Gyms Found
              </h3>
              <p className="text-gray-400 text-sm">
                Unable to find gym suggestions. Please try again later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
