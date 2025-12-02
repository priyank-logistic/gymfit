import axios from "axios";

const PROFILE_API_URL =
  process.env.NEXT_PUBLIC_PROFILE_API_URL || "http://192.168.0.25:8000";
const AUTH_API_URL =
  process.env.NEXT_PUBLIC_PROFILE_API_URL || "http://192.168.0.25:8000";
const baseURL = process.env.NEXT_PUBLIC_API_URL || "/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" && localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const isAuthRequest =
          error.config?.url?.includes("/auth/login") ||
          error.config?.url?.includes("/auth/signup");
        const isOnLoginPage = window.location.pathname === "/login";
        const isOnSignupPage = window.location.pathname === "/signup";

        if (!isAuthRequest && !isOnLoginPage && !isOnSignupPage) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials) => {
    const response = await axios.post(
      `${AUTH_API_URL}/auth/login`,
      credentials,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },

  signup: async (userData) => {
    const response = await axios.post(`${AUTH_API_URL}/auth/signup`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },
};

export const profileAPI = {
  submitProfile: async (profileData) => {
    const token =
      typeof window !== "undefined" && localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await axios.post(
      `${PROFILE_API_URL}/profile`,
      profileData,
      { headers }
    );
    return response.data;
  },

  getDietPlan: async (name, email) => {
    const token =
      typeof window !== "undefined" && localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await axios.post(
      `${PROFILE_API_URL}/profile/diet-plan`,
      { name, email },
      { headers }
    );
    return response.data;
  },

  getDietHistory: async (name, email) => {
    const token =
      typeof window !== "undefined" && localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await axios.post(
      `${PROFILE_API_URL}/profile/diet-history`,
      { name, email },
      { headers }
    );
    return response.data;
  },

  getWorkoutPlan: async (name, email) => {
    const token =
      typeof window !== "undefined" && localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await axios.post(
      `${PROFILE_API_URL}/profile/workout-plan`,
      { name, email },
      { headers }
    );
    return response.data;
  },

  getProfileSummary: async (name, email) => {
    const token =
      typeof window !== "undefined" && localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await axios.post(
      `${PROFILE_API_URL}/profile/summary`,
      { name, email },
      { headers }
    );
    return response.data;
  },

  detectCalories: async (file, name, email) => {
    const token =
      typeof window !== "undefined" && localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("email", email);

    const headers = {
      "Content-Type": "multipart/form-data",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await axios.post(
      `${PROFILE_API_URL}/profile/calorie/detect`,
      formData,
      { headers }
    );
    return response.data;
  },

  getCalorieHistory: async (name, email) => {
    const token =
      typeof window !== "undefined" && localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await axios.post(
      `${PROFILE_API_URL}/profile/calorie/history`,
      { name, email },
      { headers }
    );
    return response.data;
  },

  deleteCalorieEntry: async (id, name, email) => {
    const token =
      typeof window !== "undefined" && localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await axios.delete(
      `${PROFILE_API_URL}/profile/calorie/delete`,
      {
        headers,
        data: { id, name, email },
      }
    );
    return response.data;
  },

  updateProfile: async (updateData) => {
    const token =
      typeof window !== "undefined" && localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await axios.patch(
      `${PROFILE_API_URL}/profile/update`,
      updateData,
      { headers }
    );
    return response.data;
  },

  sendChatMessage: async (chatData) => {
    const token =
      typeof window !== "undefined" && localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await axios.post(
      `${PROFILE_API_URL}/profile/chat/`,
      chatData,
      { headers }
    );
    return response.data;
  },

  getGymSuggestion: async (email) => {
    const token =
      typeof window !== "undefined" && localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await axios.post(
      `${PROFILE_API_URL}/profile/gym-suggestion`,
      { email },
      { headers }
    );
    return response.data;
  },

  getCustomDiet: async (email, ingredients) => {
    const token =
      typeof window !== "undefined" && localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await axios.post(
      `${PROFILE_API_URL}/profile/custom-diet`,
      { email, ingredients },
      { headers }
    );
    return response.data;
  },

  downloadWorkoutPlanPDF: async (email) => {
    const token =
      typeof window !== "undefined" && localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await axios.post(
      `${PROFILE_API_URL}/profile/workout-plan/pdf-download`,
      { email },
      {
        headers,
        responseType: "blob",
      }
    );
    return response.data;
  },

  validateExercise: async (file, email) => {
    const token =
      typeof window !== "undefined" && localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);

    const headers = {
      "Content-Type": "multipart/form-data",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await axios.post(
      `${PROFILE_API_URL}/profile/exercise/validate`,
      formData,
      { headers }
    );
    return response.data;
  },

  submitExerciseFollowUp: async (followUpData) => {
    const token =
      typeof window !== "undefined" && localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await axios.post(
      `${PROFILE_API_URL}/profile/exercise/follow-up`,
      followUpData,
      { headers }
    );
    return response.data;
  },

  getAnalysis: async (email, weekStart, weekEnd) => {
    const token =
      typeof window !== "undefined" && localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await axios.post(
      `${PROFILE_API_URL}/profile/analysis`,
      { email, week_start: weekStart, week_end: weekEnd },
      { headers }
    );
    return response.data;
  },
};

export default api;
