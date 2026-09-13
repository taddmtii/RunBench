import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: NextRequest) {
  const { code } = await request.json();
  const result = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: `Analyze this algorithm and determine its time complexity (Big O). Explain your reasoning briefly, and then give the final answer in a clear concise way. You must format your response strictly in a JSON shape. For example: {'complexity': 'O(n)', 'explanation': '...'}. This is the algorithm: \`\`\`${code}\`\`\``,
  });
  return NextResponse.json({ result });
}
