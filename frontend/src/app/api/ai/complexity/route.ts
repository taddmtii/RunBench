import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: NextRequest) {
  const { code } = await request.json();
  const result = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: `Analyze this algorithm and determine its time complexity (Big O). Explain your reasoning briefly, and then give the final answer in a clear concise way. You must format your response strictly in a JSON shape. For example: {'timeComplexity': 'O(n)', 'spaceComplexity': 'O(1)', 'explanation': '...'}. This is the algorithm: \`\`\`${code}\`\`\``,
  });

  const rawText = result.candidates[0].content.parts[0].text;
  const cleaned = rawText?.replace(/```json|```/g, "").trim();
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    return NextResponse.json(
      {
        error: "Failed to parse model output",
        raw: rawText,
      },
      { status: 500 },
    );
  }

  return NextResponse.json(parsed);
}
