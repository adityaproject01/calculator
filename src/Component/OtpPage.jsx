// OtpPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OtpPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState("send");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const BACKEND_URL = "http://localhost:4000";

  // Send OTP
  async function sendOtp(e) {
    e.preventDefault();
    setMessage("");
    navigate("/calculator");

    if (!email) return setMessage("Enter your email");
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
      console.error("Network error:", err);
      setMessage("⚠️ Network error. Please check connection.");
    } finally {
      setLoading(false);
    }
  }

  // Verify OTP
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
        navigate("/calculator");
      } else {
        setMessage(data?.error || "❌ Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Network error. Please check connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Email OTP Verification 🔐</h1>

      {/* SEND OTP FORM */}
      {stage === "send" && (
        <form onSubmit={sendOtp}>
          <label>
            <span>Email address</span>
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

      {/* VERIFY OTP FORM */}
      {stage === "verify" && (
        <form onSubmit={verifyOtp}>
          <div>
            OTP sent to <strong>{email}</strong>
          </div>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          <button
            type="button"
            onClick={() => {
              setStage("send");
              setOtp("");
              setMessage("");
            }}>
            Back
          </button>
        </form>
      )}

      {/* STATUS MESSAGE */}
      {message && <p>{message}</p>}
    </div>
  );
}
