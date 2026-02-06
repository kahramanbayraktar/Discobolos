import { getGeminiModel } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { player } = await req.json();

    if (!player) {
      return NextResponse.json({ error: "Player data is required" }, { status: 400 });
    }

    const model = getGeminiModel(); // Uses env GEMINI_MODEL_NAME or defaults to gemini-2.5-flash

    const prompt = `
      You are an enthusiastic sports announcer and "Hype Man" for an Ultimate Frisbee team called "Halikarnassos Discobolos".
      
      Generate 3 short, punchy, and fun "Fun Facts" or "Bios" (max 15-20 words each) for a player with these stats:
      - Name: ${player.name}
      - Nickname: ${player.nickname || "N/A"}
      - Position: ${player.position}
      - Year Joined: ${player.yearJoined}
      
      The tone should be epic, slightly humorous, and very supportive.
      **IMPORTANT: Write the result in Turkish language.**
      Return ONLY a JSON array of strings, like this: ["Bio 1", "Bio 2", "Bio 3"].
      Do not include markdown formatting like \`\`\`json.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up markdown if present
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    let bios: string[] = [];
    try {
      bios = JSON.parse(cleanedText);
    } catch (e) {
      console.error("Failed to parse JSON from AI", text);
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    return NextResponse.json({ bios });
  } catch (error) {
    console.error("AI Bio Generation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
