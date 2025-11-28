"use client";

import React, { useState, useEffect, useRef } from "react";
import { profileAPI } from "@/services/api";
import { FaRobot, FaTimes, FaPaperPlane, FaSpinner } from "react-icons/fa";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const getOrCreateChatId = () => {
      if (typeof window !== "undefined") {
        let storedId = localStorage.getItem("chatbot_id");
        if (!storedId) {
          storedId = Math.floor(10000000 + Math.random() * 90000000).toString();
          localStorage.setItem("chatbot_id", storedId);
        }
        setChatId(storedId);
      }
    };

    const getUserEmail = () => {
      if (typeof window !== "undefined") {
        const userData = localStorage.getItem("user");
        if (userData) {
          try {
            const user = JSON.parse(userData);
            setUserEmail(user.email);
          } catch (e) {
            console.error("Error parsing user data:", e);
          }
        }
      }
    };

    getOrCreateChatId();
    getUserEmail();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !chatId || !userEmail || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");

    const newUserMessage = {
      type: "user",
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    setIsLoading(true);

    try {
      const response = await profileAPI.sendChatMessage({
        id: chatId,
        email: userEmail,
        message: userMessage,
      });

      const botMessage = {
        type: "bot",
        content: response.response || "Sorry, I couldn't process that.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        type: "bot",
        content:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Sorry, something went wrong. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={handleToggleChat}
        className="fixed bottom-6 right-6 w-16 h-16 bg-[#f2b705] text-black rounded-full shadow-lg hover:bg-[#d4a004] transition-all duration-300 flex items-center justify-center z-50 hover:scale-110 shadow-[0_0_20px_rgba(242,183,5,0.4)]"
        aria-label="Open chatbot"
      >
        {isOpen ? (
          <FaTimes className="h-6 w-6" />
        ) : (
          <FaRobot className="h-7 w-7" />
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-28 right-6 w-96 bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col z-50 border border-white/10 h-[600px] overflow-hidden">
          <div className="bg-gradient-to-r from-[#f2b705] to-[#d4a004] text-black p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center">
                <FaRobot className="text-black text-lg" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Chat Assistant</h3>
                <p className="text-xs text-black/70">Always here to help</p>
              </div>
            </div>
            <button
              onClick={handleToggleChat}
              className="text-black hover:text-black/70 transition-colors p-1 rounded-lg hover:bg-black/10"
              aria-label="Close chat"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-12">
                <div className="w-16 h-16 rounded-full bg-[#f2b705]/10 flex items-center justify-center mx-auto mb-4">
                  <FaRobot className="text-[#f2b705] text-2xl" />
                </div>
                <p className="text-sm font-semibold text-white mb-1">
                  Start a conversation
                </p>
                <p className="text-xs text-gray-500">
                  Ask me anything about your fitness journey!
                </p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl p-3 ${
                      msg.type === "user"
                        ? "bg-gradient-to-r from-[#f2b705] to-[#d4a004] text-black shadow-[0_0_15px_rgba(242,183,5,0.3)]"
                        : "bg-white/5 backdrop-blur-sm text-white border border-white/10"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </p>
                    <p
                      className={`text-xs mt-2 ${
                        msg.type === "user" ? "text-black/60" : "text-gray-400"
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 backdrop-blur-sm text-white rounded-xl p-4 border border-white/10">
                  <div className="flex space-x-2 items-center">
                    <div className="w-2 h-2 bg-[#f2b705] rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-[#f2b705] rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-[#f2b705] rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                    <span className="text-xs text-gray-400 ml-2">
                      Thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSendMessage}
            className="border-t border-white/10 p-4 bg-black/50 backdrop-blur-sm"
          >
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2b705]/50 focus:border-[#f2b705]/50 transition-all"
                disabled={isLoading || !chatId || !userEmail}
              />
              <button
                type="submit"
                disabled={
                  !inputMessage.trim() || isLoading || !chatId || !userEmail
                }
                className="px-5 py-2.5 bg-[#f2b705] text-black rounded-lg hover:bg-[#d4a004] transition-colors disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg hover:shadow-[#f2b705]/30"
              >
                {isLoading ? (
                  <FaSpinner className="h-4 w-4 animate-spin" />
                ) : (
                  <FaPaperPlane className="h-4 w-4" />
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
