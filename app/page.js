"use client";

import { useState } from "react";

const EXAMPLES = {
  text: `Hey, this is your bank. We noticed suspicious activity on your account. Click this link immediately to verify your identity or your account will be frozen: bit.ly/x8kz2m`,
  email: `From: support@amaz0n-security.com
Subject: Your Account Has Been Compromised - Immediate Action Required

Dear Valued Customer,

We have detected unusual sign-in activity on your Amazon account. Your account has been temporarily limited until you verify your information.

Please click below to restore your account access within 24 hours or your account will be permanently suspended:

http://amazon-verify-account.suspicious-domain.com/login

Thank you,
Amazon Security Team`,
  voicemail: `Hi, this is Officer Johnson from the IRS. We've been trying to reach you regarding your tax return. There is a warrant out for your arrest due to unpaid taxes. You need to call us back immediately at 1-800-555-0199 and provide your Social Security number to resolve this matter before law enforcement is dispatched to your location.`,
};

const INDICATOR_ICONS = {
  "Urgency / Threats": "⏰",
  "Suspicious Links": "🔗",
  Impersonation: "🎭",
  "Personal Info Request": "🔐",
  "Too Good To Be True": "💎",
  "Grammar / Spelling": "✏️",
};

export default function Home() {
  const [input, setInput] = useState("");
  const [type, setType] = useState("text");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, type }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e) {
      setError(e.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verdictStyle = {
    SCAM: { bg: "#FF2D2D", emoji: "🚨" },
    SUSPICIOUS: { bg: "#FF9500", emoji: "⚠️" },
    "LIKELY SAFE": { bg: "#34C759", emoji: "✅" },
  };

  return (
    <main
      style={{
        padding: "32px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", maxWidth: 500 }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>🛡️</div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: 3,
            margin: 0,
          }}
        >
          SCAM SHIELD
        </h1>
        <p
          style={{
            color: "#64748b",
            fontSize: 14,
            marginTop: 8,
            lineHeight: 1.5,
          }}
        >
          Paste a suspicious text, email, or voicemail transcript to analyze it
          for scam indicators.
        </p>
      </div>

      {/* Input Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 540,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16,
          padding: 20,
        }}
      >
        {/* Type selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {["text", "email", "voicemail"].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              style={{
                flex: 1,
                padding: "8px 0",
                border: `1px solid ${type === t ? "#6366f1" : "#1e293b"}`,
                borderRadius: 8,
                background:
                  type === t ? "rgba(99,102,241,0.15)" : "transparent",
                color: type === t ? "#a5b4fc" : "#64748b",
                fontSize: 13,
                cursor: "pointer",
                fontWeight: 500,
                fontFamily: "inherit",
              }}
            >
              {t === "text" ? "📱 " : t === "email" ? "📧 " : "🎙️ "}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <textarea
          rows={7}
          placeholder={`Paste your suspicious ${type} here...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            background: "rgba(0,0,0,0.3)",
            border: "1px solid #1e293b",
            borderRadius: 10,
            color: "#e2e8f0",
            fontSize: 14,
            padding: 14,
            resize: "vertical",
            fontFamily: "inherit",
            lineHeight: 1.6,
            outline: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 12,
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={() => setInput(EXAMPLES[type])}
            style={{
              padding: "10px 16px",
              border: "1px solid #1e293b",
              borderRadius: 8,
              background: "transparent",
              color: "#64748b",
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Load Example
          </button>
          <button
            onClick={analyze}
            disabled={loading || !input.trim()}
            style={{
              padding: "10px 24px",
              border: "none",
              borderRadius: 8,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              cursor:
                loading || !input.trim() ? "not-allowed" : "pointer",
              letterSpacing: 0.5,
              opacity: loading || !input.trim() ? 0.5 : 1,
              fontFamily: "inherit",
            }}
          >
            {loading ? "Analyzing..." : "🔍 Analyze"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ color: "#ff6b6b", fontSize: 14 }}>{error}</div>
      )}

      {/* Loading */}
      {loading && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: 20,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12,
            width: "100%",
            maxWidth: 540,
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              border: "3px solid #1e293b",
              borderTop: "3px solid #6366f1",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              flexShrink: 0,
            }}
          />
          <p style={{ color: "#94a3b8", margin: 0 }}>
            Running AI scam analysis...
          </p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div
          style={{
            width: "100%",
            maxWidth: 540,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            overflow: "hidden",
            animation: "fadeUp 0.4s ease",
          }}
        >
          {/* Verdict banner */}
          <div
            style={{
              padding: "16px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: verdictStyle[result.verdict]?.bg || "#6366f1",
            }}
          >
            <span
              style={{
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: 1,
              }}
            >
              {verdictStyle[result.verdict]?.emoji} {result.verdict}
            </span>
            <span
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.85)",
                fontWeight: 600,
              }}
            >
              {result.confidence}% confidence
            </span>
          </div>

          {/* Summary */}
          <p
            style={{
              padding: "16px 20px 8px",
              color: "#cbd5e1",
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            {result.summary}
          </p>

          {/* Indicator grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 8,
              padding: "12px 20px",
            }}
          >
            {result.indicators?.map((ind, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  padding: "10px 6px",
                  borderRadius: 10,
                  border: `1px solid ${ind.found ? "#FF2D2D" : "#2a3042"}`,
                  background: ind.found
                    ? "rgba(255,45,45,0.08)"
                    : "rgba(255,255,255,0.02)",
                  textAlign: "center",
                }}
              >
                <span style={{ fontSize: 20 }}>
                  {INDICATOR_ICONS[ind.name] || "❓"}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: ind.found ? "#ff6b6b" : "#64748b",
                    fontWeight: ind.found ? 700 : 400,
                  }}
                >
                  {ind.name}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: ind.found ? "#ff6b6b" : "#475569",
                    fontWeight: 600,
                    letterSpacing: 0.5,
                  }}
                >
                  {ind.found ? "DETECTED" : "Not found"}
                </span>
              </div>
            ))}
          </div>

          {/* Advice */}
          <div
            style={{
              margin: "8px 20px 20px",
              padding: 14,
              background: "rgba(99,102,241,0.08)",
              borderRadius: 10,
              border: "1px solid rgba(99,102,241,0.15)",
            }}
          >
            <strong>💡 Recommended Action</strong>
            <p
              style={{
                color: "#94a3b8",
                margin: "6px 0 0",
                fontSize: 14,
                lineHeight: 1.5,
              }}
            >
              {result.advice}
            </p>
          </div>
        </div>
      )}

      <p style={{ color: "#475569", fontSize: 11, marginTop: 8 }}>
        Powered by Claude AI · Not a substitute for professional judgment
      </p>
    </main>
  );
}
