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

    // Use JSON mode if supported by the model (Gemini 1.5/2.0+ supports this)
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json" 
      }
    });

    const response = await result.response;
    const text = response.text();
    console.log("AI Bio Response:", text); // Debug log

    let bios: string[] = [];
    try {
      // 1. Try direct parse
      bios = JSON.parse(text);
    } catch (e) {
      console.warn("Direct JSON parse failed, trying regex extraction...");
      // 2. Try extracting array from text (e.g. if wrapped in ```json ... ```)
      // /s flag replacement: [\s\S]* matches any character including newlines
      const match = text.match(/\[[\s\S]*\]/); 
      if (match) {
        try {
          bios = JSON.parse(match[0]);
        } catch (e2) {
          console.error("Regex extraction parse failed:", e2);
        }
      }
    }

    if (!Array.isArray(bios) || bios.length === 0) {
       console.error("Parsed data is not a valid array:", bios);
       console.error("Original Text:", text); // Log original text for debugging
       return NextResponse.json({ error: "Invalid AI response format" }, { status: 500 });
    }

    return NextResponse.json({ bios });
  } catch (error) {
    console.error("AI Bio Generation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
