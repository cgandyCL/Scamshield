import { NextResponse } from "next/server";

export async function POST(req) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 500 }
    );
  }

  try {
    const { message, type } = await req.json();

    if (!message || typeof message !== "string" || message.length > 10000) {
      return NextResponse.json(
        { error: "Invalid or too-long message" },
        { status: 400 }
      );
    }

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `You are a scam detection expert. Analyze this ${type || "text"} message and respond ONLY with a JSON object (no markdown, no backticks). The JSON must have these fields:
- "verdict": one of "SCAM", "SUSPICIOUS", or "LIKELY SAFE"
- "confidence": number 0-100
- "summary": 1-2 sentence explanation
- "indicators": array of objects with "name" (string) and "found" (boolean) for each of these categories: "Urgency / Threats", "Suspicious Links", "Impersonation", "Personal Info Request", "Too Good To Be True", "Grammar / Spelling"
- "advice": string with what the recipient should do

Message to analyze:
"""
${message}
"""`,
          },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Anthropic API error:", err);
      return NextResponse.json(
        { error: "AI analysis failed" },
        { status: 502 }
      );
    }

    const data = await res.json();
    const text = data.content?.map((c) => c.text || "").join("") || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json(parsed);
  } catch (e) {
    console.error("Analyze error:", e);
    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}
