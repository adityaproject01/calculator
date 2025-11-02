import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OtpPage.css";

export default function OtpPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState("send");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const BACKEND_URL = "http://localhost:4000";

  async function sendOtp(e) {
    e.preventDefault();
    setMessage("");
    if (!email) return setMessage("Please enter your email ✉️");
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStage("verify");
        setMessage("📩 OTP sent successfully to " + email);
      } else {
        setMessage(data?.error || "Failed to send OTP");
      }
    } catch (err) {
      setMessage("⚠️ Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        const expiryTime = Date.now() + 5 * 60 * 1000; // 5 minutes from now
        localStorage.setItem("otpVerified", "true");
        localStorage.setItem("otpExpiry", expiryTime.toString());
        navigate("/calculator");
      } else {
        setMessage(data?.error || "❌ Invalid OTP");
      }
    } catch (err) {
      setMessage("⚠️ Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="otp-container">
      <div className="otp-card">
        <h1>Email OTP Verification 🔐</h1>

        {stage === "send" && (
          <form onSubmit={sendOtp} className="otp-form">
            <label>
              <span>Email Address</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourmail@example.com"
              />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {stage === "verify" && (
          <form onSubmit={verifyOtp} className="otp-form">
            <div className="otp-info">
              OTP sent to <strong>{email}</strong>
            </div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="otp-input"
            />
            <div className="otp-buttons">
              <button type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                type="button"
                className="back-btn"
                onClick={() => {
                  setStage("send");
                  setOtp("");
                  setMessage("");
                }}>
                Back
              </button>
            </div>
          </form>
        )}

        {message && (
          <p
            className={`message ${
              message.includes("❌") || message.includes("⚠️")
                ? "error"
                : "success"
            }`}></p>
        )}
      </div>
    </div>
  );
}
