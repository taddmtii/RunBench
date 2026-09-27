import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: NextRequest) {
  const { title, description = "" } = await request.json();
  if (!title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const result = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: `Create a LeetCode-style coding problem from this context.
Title: ${title}
Description: ${description || "Write a concise description."}

Return only valid JSON with this shape:
{
  "description": "string",
  "difficulty": "EASY | MEDIUM | HARD",
  "topic": "string",
  "recommendedTimeComplexity": "string",
  "recommendedSpaceComplexity": "string",
  "functionName": "snake_case name used by the runner",
  "functionStubs": {
    "python": "functionName as a snake_case Python function with a # Enter code here comment and pass",
    "javascript": "camelCase function with // Enter code here, then module.exports = { functionName: camelCaseName }",
    "typescript": "typed camelCase function with // Enter code here, then export { camelCaseName as functionName }"
  },
  "testCases": [
    { "input": ["JSON arguments in function parameter order"], "expectedOutput": "JSON-encoded output string" }
  ]
}

Generate as many varied test cases as possible, including edge cases. Do not include solutions or markdown.`,
  });

  const raw = result.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  try {
    return NextResponse.json(JSON.parse(raw.replace(/```json|```/g, "").trim()));
  } catch {
    return NextResponse.json({ error: "Failed to parse model output" }, { status: 500 });
  }
}
