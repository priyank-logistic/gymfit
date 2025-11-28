"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState(0);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
          setIsLoggedIn(true);
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 4);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-[#f2b705] rounded-full blur-[120px] opacity-15 animate-orb-1"></div>
        <div className="absolute bottom-20 left-10 w-[450px] h-[450px] bg-[#f2b705] rounded-full blur-[120px] opacity-12 animate-orb-2"></div>
        <div className="absolute top-1/2 right-1/3 w-[400px] h-[400px] bg-[#f2b705] rounded-full blur-[120px] opacity-10 animate-orb-3"></div>
        <div className="absolute bottom-1/3 left-1/4 w-[480px] h-[480px] bg-[#f2b705] rounded-full blur-[120px] opacity-8 animate-orb-4"></div>
        <div className="absolute top-1/4 left-1/2 w-[420px] h-[420px] bg-[#f2b705] rounded-full blur-[120px] opacity-10 animate-orb-5"></div>

        <div className="absolute top-32 left-20 text-[#f2b705] opacity-15 animate-float-1">
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="6" r="3" fill="currentColor" />
            <path d="M8 8c0-1 1-2 4-2s4 1 4 2v2c0 2-1 3-4 3s-4-1-4-3V8z" />
            <path d="M6 10c-1 0-2 1-2 2v4c0 1 1 2 2 2h1v-8H6z" />
            <path d="M18 10c1 0 2 1 2 2v4c0 1-1 2-2 2h-1v-8h1z" />
            <rect
              x="9"
              y="12"
              width="6"
              height="8"
              rx="1"
              fill="currentColor"
            />
            <rect
              x="7"
              y="14"
              width="2"
              height="4"
              rx="1"
              fill="currentColor"
            />
            <rect
              x="15"
              y="14"
              width="2"
              height="4"
              rx="1"
              fill="currentColor"
            />
            <rect
              x="10"
              y="16"
              width="4"
              height="2"
              rx="0.5"
              fill="currentColor"
            />
            <rect
              x="11"
              y="18"
              width="2"
              height="2"
              rx="0.5"
              fill="currentColor"
            />
          </svg>
        </div>
        <div className="absolute top-32 left-20 text-[#f2b705] opacity-15 animate-float-1">
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.5 2C5.67 2 5 2.67 5 3.5v17c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-17C8 2.67 7.33 2 6.5 2zm11 0c-.83 0-1.5.67-1.5 1.5v17c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-17C19 2.67 18.33 2 17.5 2zM3 7h2v10H3V7zm16 0h2v10h-2V7z" />
          </svg>
        </div>
        {/* Dumbbell 2 */}
        <div className="absolute bottom-40 right-32 text-[#f2b705] opacity-12 animate-float-2">
          <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.5 2C5.67 2 5 2.67 5 3.5v17c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-17C8 2.67 7.33 2 6.5 2zm11 0c-.83 0-1.5.67-1.5 1.5v17c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-17C19 2.67 18.33 2 17.5 2zM3 7h2v10H3V7zm16 0h2v10h-2V7z" />
          </svg>
        </div>
        <div className="absolute bottom-40 right-32 text-[#f2b705] opacity-12 animate-float-2">
          <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
            <rect
              x="2"
              y="14"
              width="20"
              height="4"
              rx="1"
              fill="currentColor"
            />
            <rect
              x="4"
              y="10"
              width="16"
              height="6"
              rx="1"
              fill="currentColor"
            />
            <circle cx="6" cy="12" r="2" fill="currentColor" />
            <rect x="8" y="8" width="2" height="8" rx="1" fill="currentColor" />
            <rect
              x="14"
              y="8"
              width="2"
              height="8"
              rx="1"
              fill="currentColor"
            />
            <circle cx="12" cy="6" r="2.5" fill="currentColor" />
            <rect
              x="10"
              y="4"
              width="4"
              height="2"
              rx="0.5"
              fill="currentColor"
            />
          </svg>
        </div>
        <div className="absolute top-1/2 left-10 text-[#f2b705] opacity-18 animate-float-3">
          <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 24 24">
            <rect x="4" y="8" width="16" height="12" fill="currentColor" />
            <rect x="6" y="10" width="4" height="8" fill="currentColor" />
            <rect x="12" y="10" width="8" height="6" fill="currentColor" />
            <rect x="14" y="12" width="4" height="2" fill="currentColor" />
            <rect x="3" y="20" width="18" height="2" fill="currentColor" />
            <rect x="8" y="4" width="8" height="2" fill="currentColor" />
            <rect x="9" y="2" width="6" height="2" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute top-1/4 right-20 text-[#f2b705] opacity-15 animate-float-4">
          <svg className="w-18 h-18" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="2.5" fill="currentColor" />
            <path d="M9 7c0-0.5 0.5-1 3-1s3 0.5 3 1v2c0 1.5-0.5 2.5-3 2.5s-3-1-3-2.5V7z" />
            <path d="M5 9c-0.5 0-1 0.5-1 1v3c0 0.5 0.5 1 1 1h1v-5H5z" />
            <path d="M19 9c0.5 0 1 0.5 1 1v3c0 0.5-0.5 1-1 1h-1v-5h1z" />
            <rect
              x="9"
              y="11"
              width="6"
              height="7"
              rx="0.5"
              fill="currentColor"
            />
            <rect
              x="7"
              y="13"
              width="1.5"
              height="3"
              rx="0.5"
              fill="currentColor"
            />
            <rect
              x="15.5"
              y="13"
              width="1.5"
              height="3"
              rx="0.5"
              fill="currentColor"
            />
            <rect
              x="10"
              y="15"
              width="4"
              height="1.5"
              rx="0.5"
              fill="currentColor"
            />
            <rect
              x="11"
              y="17"
              width="2"
              height="1.5"
              rx="0.5"
              fill="currentColor"
            />
            <path
              d="M10 6 Q12 5 14 6"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </div>
        <div className="absolute bottom-1/4 right-1/4 text-[#f2b705] opacity-14 animate-float-5">
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
            <rect x="2" y="10" width="20" height="4" rx="2" />
            <rect x="1" y="8" width="4" height="8" rx="2" />
            <rect x="19" y="8" width="4" height="8" rx="2" />
          </svg>
        </div>
        <div className="absolute top-3/4 left-1/3 text-[#f2b705] opacity-16 animate-float-6">
          <svg
            className="w-12 h-12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M3 12h18M6 9l-3 3 3 3M18 9l3 3-3 3" />
          </svg>
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-[#f2b705]/5 via-transparent to-[#f2b705]/5 animate-gradient-shift"></div>
      </div>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-[#f2b705]/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between ">
            <div className="flex items-center gap-2 w-32 min-w-32 h-16">
              <Link href="/" className="flex items-center">
                <img src="/GYMFIT.svg" alt="GymFit Logo" />
              </Link>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="#home"
                className="hover:text-[#f2b705] transition-colors"
              >
                Home
              </Link>
              <Link
                href="#programs"
                className="hover:text-[#f2b705] transition-colors"
              >
                Programs
              </Link>
              <Link
                href="#coaching"
                className="hover:text-[#f2b705] transition-colors"
              >
                Coaching
              </Link>
              <Link
                href="#membership"
                className="hover:text-[#f2b705] transition-colors"
              >
                Membership
              </Link>
              <Link
                href="#about"
                className="hover:text-[#f2b705] transition-colors"
              >
                About Us
              </Link>
            </nav>

            <div className="hidden md:flex items-center gap-4">
              {isLoggedIn && user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="w-8 h-8 bg-[#f2b705] rounded-full flex items-center justify-center text-black font-semibold text-sm">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="text-white font-medium">
                      {user.name?.split(" ")[0] || "User"}
                    </span>
                  </div>
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="px-6 py-2 bg-[#f2b705] text-black rounded-lg font-semibold hover:bg-[#f2b705]/90 transition-colors flex items-center gap-2"
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
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Dashboard
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push("/login")}
                    className="px-4 py-2 hover:text-[#f2b705] transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => router.push("/signup")}
                    className="px-6 py-2 bg-[#f2b705] text-black rounded-lg font-semibold hover:bg-[#f2b705]/90 transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>

            <button
              className="md:hidden text-[#f2b705]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-black border-t border-[#f2b705]/20">
            <div className="container mx-auto px-4 py-4 space-y-3">
              <Link href="#home" className="block hover:text-[#f2b705]">
                Home
              </Link>
              <Link href="#programs" className="block hover:text-[#f2b705]">
                Programs
              </Link>
              <Link href="#coaching" className="block hover:text-[#f2b705]">
                Coaching
              </Link>
              <Link href="#membership" className="block hover:text-[#f2b705]">
                Membership
              </Link>
              <Link href="#about" className="block hover:text-[#f2b705]">
                About Us
              </Link>
              <div className="pt-4 border-t border-gray-800 space-y-2">
                {isLoggedIn && user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-2 mb-2">
                      <div className="w-10 h-10 bg-[#f2b705] rounded-full flex items-center justify-center text-black font-semibold">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {user.name || "User"}
                        </p>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        router.push("/dashboard");
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 bg-[#f2b705] text-black rounded-lg font-semibold flex items-center justify-center gap-2"
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
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      Dashboard
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        router.push("/login");
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left hover:text-[#f2b705]"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        router.push("/signup");
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 bg-[#f2b705] text-black rounded-lg font-semibold"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <section id="home" className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold mb-4">
                Achieve Your <br />
                <span className="text-[#f2b705]">FITNESS GOALS</span>
                <br />
                With GymFit
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Join our community of fitness enthusiasts and get personalized
                workout plans, AI-powered diet suggestions, and expert coaching
                to transform your body and reach your fitness goals faster.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => router.push("/signup")}
                  className="px-8 py-3 bg-[#f2b705] text-black rounded-lg font-semibold hover:bg-[#f2b705]/90 transition-colors"
                >
                  Start Your Journey
                </button>
                <button
                  onClick={() => router.push("/login")}
                  className="px-8 py-3 border-2 border-[#f2b705] text-[#f2b705] rounded-lg font-semibold hover:bg-[#f2b705]/10 transition-colors"
                >
                  Explore Programs
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="relative w-full h-[500px] md:h-[600px] rounded-2xl overflow-hidden border border-[#f2b705]/30">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src="/hero.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-[#f2b705]/30">
                      <p className="text-[#f2b705] font-bold text-2xl">+80</p>
                      <p className="text-sm text-gray-300">Coaches</p>
                    </div>
                    <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-[#f2b705]/30">
                      <p className="text-[#f2b705] font-bold text-2xl">+1300</p>
                      <p className="text-sm text-gray-300">Positive Reviews</p>
                    </div>
                    <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-[#f2b705]/30">
                      <p className="text-[#f2b705] font-bold text-2xl">+1000</p>
                      <p className="text-sm text-gray-300">Workout Videos</p>
                    </div>
                    <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-[#f2b705]/30">
                      <p className="text-[#f2b705] font-bold text-2xl">+1500</p>
                      <p className="text-sm text-gray-300">Trainers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#f2b705] mb-2">96%</p>
              <p className="text-gray-400">Client Satisfaction</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#f2b705] mb-2">+5</p>
              <p className="text-gray-400">Years Of Experience</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#f2b705] mb-2">+800</p>
              <p className="text-gray-400">Active Members</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#f2b705] mb-2">24/7</p>
              <p className="text-gray-400">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section id="programs" className="py-20 px-4 bg-black">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-gray-400 text-lg">
              At This Part You Can Easily Access All Of Our Services...
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Losing Weight",
                desc: "Personalized weight loss programs tailored to your needs",
              },
              {
                title: "Building Muscle",
                desc: "Expert muscle building routines for maximum gains",
              },
              {
                title: "Training At Home",
                desc: "Effective home workout plans with minimal equipment",
              },
              {
                title: "Gym Plan",
                desc: "Comprehensive gym workout plans for all fitness levels",
              },
            ].map((service, idx) => (
              <div
                key={idx}
                className="bg-black border border-[#f2b705]/20 rounded-xl p-6 hover:border-[#f2b705] transition-colors"
              >
                <div className="w-16 h-16 bg-[#f2b705]/20 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-[#f2b705] text-2xl">💪</span>
                </div>
                <h3 className="text-xl font-bold text-[#f2b705] mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-400 mb-4">{service.desc}</p>
                <Link href="/login" className="text-[#f2b705] hover:underline">
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="membership" className="py-20 px-4 bg-black">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Plans</h2>
            <p className="text-gray-400 text-lg">
              Select The Plan That Suits Your Fitness Goals And Let Our Expert
              Coaches Guide You Every Step Of The Way.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "BEGINNER PLAN",
                price: "49",
                border: "border-[#f2b705]",
                features: [
                  "Access To All Exercise Videos",
                  "Progress Tracking",
                  "Supportive Online Community",
                  "Personalized Workout Plans",
                  "Basic Nutrition Guidance",
                ],
                buttonColor: "bg-[#f2b705]",
              },
              {
                name: "PRO PLAN",
                price: "99",
                border: "border-[#f2b705]",
                features: [
                  "Access To All Exercise Videos",
                  "Progress Tracking",
                  "Supportive Online Community",
                  "Advanced Personalized Workout Plans",
                  "Comprehensive Nutrition Coaching",
                  "Access To Advanced Workout Programs",
                  "Body Composition Analysis",
                ],
                buttonColor: "bg-[#f2b705]",
              },
              {
                name: "CUSTOM PLAN",
                price: "149",
                border: "border-[#f2b705]",
                features: [
                  "Fully Tailored Fitness Experience",
                  "One-On-One With Dedicated Trainer",
                  "Weekly Check-In With Your Trainer",
                  "Access To All Platforms",
                ],
                buttonColor: "bg-[#f2b705]",
              },
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`bg-black border-2 ${plan.border} rounded-xl p-8 hover:shadow-lg hover:shadow-[#f2b705]/20 transition-all`}
              >
                <h3 className="text-2xl font-bold text-[#f2b705] mb-2">
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">
                    {plan.price}$
                  </span>
                  <span className="text-gray-400"> USDT</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <span className="text-[#f2b705] mt-1">✓</span>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => router.push("/signup")}
                  className={`w-full py-3 ${plan.buttonColor} text-black rounded-lg font-semibold hover:opacity-90 transition-opacity`}
                >
                  Choose This Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Fitness Tools</h2>
            <p className="text-gray-400 text-lg">
              Access A Variety Of Tools To Help You Reach Your Fitness Goals
              More Effectively.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "CALORIE CALCULATOR", icon: "🧮" },
              { title: "DIET SUGGESTIONS", icon: "🍎" },
              { title: "EXERCISE SUGGESTIONS", icon: "🏋️" },
              { title: "CALORIES HISTORY", icon: "📊" },
            ].map((tool, idx) => (
              <div
                key={idx}
                className="bg-black border border-[#f2b705]/20 rounded-xl p-6 hover:border-[#f2b705] transition-colors text-center"
              >
                <div className="text-5xl mb-4">{tool.icon}</div>
                <h3 className="text-lg font-bold text-[#f2b705] mb-2">
                  {tool.title}
                </h3>
                <Link
                  href="/login"
                  className="text-[#f2b705] hover:underline text-sm"
                >
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-gray-400 text-lg">
              In This Part You Can See Few Of The Many Positive Reviews Of Our
              Customers.
            </p>
          </div>
          <div className="max-w-4xl mx-auto relative">
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentTestimonial * 100}%)`,
                }}
              >
                {[
                  {
                    name: "Steven Haward",
                    role: "Verified Member",
                    text: "GymFit has been a game changer for my fitness journey. The personalized workout plans and AI-powered diet suggestions have helped me achieve results I never thought possible!",
                  },
                  {
                    name: "Sarah Johnson",
                    role: "Premium Member",
                    text: "I've tried many fitness apps, but GymFit stands out. The custom diet plans based on my preferences are amazing, and the workout routines are perfectly tailored to my goals.",
                  },
                  {
                    name: "Michael Chen",
                    role: "Pro Member",
                    text: "The AI-powered recommendations are spot on! I've lost 15 pounds in just 2 months following the personalized plans. The gym suggestions feature helped me find the perfect workout space near me.",
                  },
                  {
                    name: "Emily Rodriguez",
                    role: "Verified Member",
                    text: "As a busy professional, GymFit's convenience is unmatched. I can track my calories, get meal suggestions, and follow workout plans all in one place. Highly recommend!",
                  },
                ].map((testimonial, index) => (
                  <div key={index} className="min-w-full px-4">
                    <div className="bg-black border border-[#f2b705]/20 rounded-xl p-8">
                      <div className="flex items-start gap-6">
                        <div className="w-20 h-20 bg-[#f2b705]/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-3xl">👤</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-300 text-lg mb-4 italic">
                            &ldquo;{testimonial.text}&rdquo;
                          </p>
                          <p className="text-[#f2b705] font-bold">
                            {testimonial.name}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() =>
                setCurrentTestimonial((prev) => (prev - 1 + 4) % 4)
              }
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 md:w-12 md:h-12 bg-[#f2b705] text-black rounded-full flex items-center justify-center hover:bg-[#d4a004] transition-colors shadow-lg z-10"
              aria-label="Previous testimonial"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
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
            </button>
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % 4)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 md:w-12 md:h-12 bg-[#f2b705] text-black rounded-full flex items-center justify-center hover:bg-[#d4a004] transition-colors shadow-lg z-10"
              aria-label="Next testimonial"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {[0, 1, 2, 3].map((index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentTestimonial === index
                      ? "bg-[#f2b705] w-8"
                      : "bg-[#f2b705]/30 hover:bg-[#f2b705]/50"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Trainers */}
      <section id="coaching" className="py-20 px-4 bg-black">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Meet Our Trainers</h2>
            <p className="text-gray-400 text-lg">
              Expert Coaches Ready To Guide You On Your Fitness Journey.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Sam Cole", image: "/trainer1.png" },
              { name: "Michael Harris", image: "/trainer2.png" },
              { name: "John Anderson", image: "/trainer3.png" },
              { name: "Tom Blake", image: "/trainer4.png" },
            ].map((trainer, idx) => (
              <div
                key={idx}
                className="bg-black border border-[#f2b705]/20 rounded-xl overflow-hidden hover:border-[#f2b705] transition-colors"
              >
                <div className="relative h-96 overflow-hidden">
                  <div
                    className="absolute inset-0 z-0"
                    style={
                      {
                        // background:"",
                      }
                    }
                  />
                  <div className="relative w-full h-full">
                    <Image
                      src={trainer.image}
                      alt={trainer.name}
                      fill
                      className="object-cover object-center opacity-90 z-10"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#f2b705] mb-1">
                    {trainer.name}
                  </h3>
                  <p className="text-gray-400 mb-4">Personal Trainer</p>
                  <Link
                    href="/login"
                    className="text-[#f2b705] hover:underline text-sm"
                  >
                    Learn More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      {/* <section className="py-20 px-4 bg-black">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">GymFit Blog Posts</h2>
            <p className="text-gray-400 text-lg">
              Discover Essential Tips To Maximize Your Workout Results And Reach
              Your Fitness Goals Faster.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "5 Essential Exercises For Building Muscle",
                category: "Strength Training",
                date: "August 14",
              },
              {
                title: "The Ultimate Guide To A Balanced Diet",
                category: "Nutrition",
                date: "August 10",
              },
              {
                title: "The Benefits Of HIIT Training",
                category: "Cardio",
                date: "August 8",
              },
            ].map((post, idx) => (
              <div
                key={idx}
                className="bg-black border border-[#f2b705]/20 rounded-xl overflow-hidden hover:border-[#f2b705] transition-colors"
              >
                <div className="h-48 bg-[#f2b705]/10 flex items-center justify-center">
                  <span className="text-4xl">📝</span>
                </div>
                <div className="p-6">
                  <span className="text-[#f2b705] text-sm font-semibold">
                    {post.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{post.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Join Community */}
      <section className="py-20 px-4 bg-black">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Join Our Fitness Community
              </h2>
              <p className="text-gray-400 text-lg">
                Sign Up Now To Unlock Exclusive Access To Personalized Workout
                Plans, Expert Coaching, And A Supportive Community That Will
                Help You Achieve Your Fitness Goals.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="grid grid-cols-2 gap-6">
                {[
                  "Personalized Workout Plans",
                  "Expert Coaching",
                  "Community Support",
                  "Exclusive Resources",
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className="bg-black border border-[#f2b705]/20 rounded-lg p-4"
                  >
                    <div className="w-12 h-12 bg-[#f2b705]/20 rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-[#f2b705] text-xl">✓</span>
                    </div>
                    <p className="text-white font-semibold text-sm">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
              <div className="bg-black border border-[#f2b705]/20 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-[#f2b705] mb-6">
                  Sign Up / Login
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#f2b705]"
                  />
                  <input
                    type="email"
                    placeholder="E-Mail"
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#f2b705]"
                  />
                  <button
                    onClick={() => router.push("/signup")}
                    className="w-full py-3 bg-[#f2b705] text-black rounded-lg font-semibold hover:bg-[#f2b705]/90 transition-colors"
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => router.push("/login")}
                    className="w-full py-3 border border-[#f2b705] text-[#f2b705] rounded-lg font-semibold hover:bg-[#f2b705]/10 transition-colors"
                  >
                    Log In
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12">FAQ</h2>
          <div className="space-y-4">
            {[
              {
                q: "What Is GymFit And How Can It Help Me Reach My Fitness Goals?",
                a: "GymFit is an AI-powered fitness platform that provides personalized workout plans, diet suggestions, and expert coaching to help you achieve your fitness goals faster and more effectively.",
              },
              {
                q: "How Do I Get Started With GymFit?",
                a: "Simply sign up for an account, complete your profile, and our AI will create a personalized fitness plan based on your goals, fitness level, and preferences.",
              },
              {
                q: "What Makes GymFit Different From Other Fitness Apps?",
                a: "GymFit uses advanced AI technology to provide truly personalized recommendations, real-time progress tracking, and access to expert trainers for a comprehensive fitness experience.",
              },
              {
                q: "Can I Cancel My Subscription Anytime?",
                a: "Yes, you can cancel your subscription at any time. There are no long-term commitments, and you'll continue to have access until the end of your billing period.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-black border border-[#f2b705]/20 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#f2b705]/10 transition-colors"
                >
                  <span className="font-semibold text-white">{faq.q}</span>
                  <span className="text-[#f2b705] text-xl">
                    {expandedFAQ === idx ? "−" : "+"}
                  </span>
                </button>
                {expandedFAQ === idx && (
                  <div className="px-6 py-4 border-t border-[#f2b705]/20">
                    <p className="text-gray-300">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-black border-t border-[#f2b705]/20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="/GYMFIT.svg"
                  alt="GymFit Logo"
                  height={60}
                  className="h-16 w-44 min-w-44 object-contain"
                />
              </div>
              <p className="text-gray-400 mb-4">
                Your AI-powered fitness companion for personalized workout
                plans, diet suggestions, and expert coaching to help you achieve
                your fitness goals.
              </p>
              {/* <div className="flex gap-4">
                {["Facebook", "Instagram", "Twitter", "YouTube"].map(
                  (social) => (
                    <div
                      key={social}
                      className="w-10 h-10 bg-[#f2b705]/20 rounded-lg flex items-center justify-center hover:bg-[#f2b705] transition-colors cursor-pointer"
                    >
                      <span className="text-[#f2b705] hover:text-black">
                        📱
                      </span>
                    </div>
                  )
                )}
              </div> */}
            </div>
            <div>
              <h4 className="font-bold text-[#f2b705] mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#about" className="hover:text-[#f2b705]">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#programs" className="hover:text-[#f2b705]">
                    Our Services
                  </Link>
                </li>
                <li>
                  <Link href="#membership" className="hover:text-[#f2b705]">
                    Our Plans
                  </Link>
                </li>
                <li>
                  <Link href="#coaching" className="hover:text-[#f2b705]">
                    Our Team
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#f2b705] mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/calorie-calculate"
                    className="hover:text-[#f2b705]"
                  >
                    Fitness Tools
                  </Link>
                </li>
                <li>
                  <Link href="/exercise" className="hover:text-[#f2b705]">
                    Workout Videos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#f2b705]">
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link href="#membership" className="hover:text-[#f2b705]">
                    Membership
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#f2b705] mb-4">Contact Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  Logistics infotech, 401, jaynath complex, Gondal Road, Rajkot,
                  Gujarat, India
                </li>
                <li>+91 9825**8765</li>
                <li>gymfit@logisticsinfotech.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#f2b705]/20 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} GymFit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
