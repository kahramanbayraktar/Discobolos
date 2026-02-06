import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Initialize Supabase Admin Client for uploading files
// We do this check inside the handler or use a safe init to avoid top-level crash
const getSupabaseAdmin = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  // Support both modern "Secret Key" and legacy "Service Role" variable names
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return null;
  return createClient(url, key);
};

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json(); // 'style' is ignored now as per strict "Proven Prompt" strategy

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // ---------------------------------------------------------
    // STRATEGY: Randomly pick a PROVEN "Discobolos" prompt
    // ---------------------------------------------------------
    
    const PROVEN_PROMPTS = [
      "A stylized, modern, and energetic illustration of the Discobolos statue (the Discus Thrower). The statue is wearing modern sports sunglasses and a headband in vibrant primary colors. The overall style is clean vector art with a dynamic gradient background (deep blue to violet). The statue is holding a modern ultimate frisbee instead of a heavy discus. High quality, premium feels, premium sports aesthetic.",
      "A stylized, modern illustration of the Discobolos statue. The statue is wearing vibrant orange sports sunglasses and a backwards baseball cap. He is holding a colorful ultimate frisbee disc. Clean vector art, dynamic blue and purple gradient background. Premium sports aesthetic, high quality.",
      "A stylized, modern illustration of the Discobolos statue. The statue is wearing large over-ear wireless headphones and a neon green headband. He is holding a modern ultimate frisbee disc with a geometric pattern. Clean vector art, dynamic teal and dark blue gradient background. Premium sports aesthetic, high quality.",
      "A stylized, modern illustration of the Discobolos statue. The statue is wearing futuristic pink and yellow visor sunglasses. The statue is holding a glowing ultimate frisbee disc. Clean vector art, dynamic sunset orange and pink gradient background. Premium sports aesthetic, high quality.",
      "A stylized, modern illustration of the Discobolos statue. The statue is wearing a digital smartwatch and a sleek headband. He is holding a modern ultimate frisbee disc with a team logo. Clean vector art, dynamic purple and magenta gradient background. Premium sports aesthetic, high quality.",
      "A stylized, modern illustration of a female athlete statue in the pose of the Discobolos. She has a strong, athletic build, wearing vibrant pink sports sunglasses and a teal headband. She is holding a colorful ultimate frisbee disc. Clean vector art, dynamic purple and orange gradient background. Premium sports aesthetic, high quality.",
      "A futuristic cyberpunk Discobolos statue illustration. Metallic skin sheen, glowing neon circuit patterns on the body. Wearing a high-tech augmented reality visor. Holding a holographic ultimate frisbee disc. Dark city neon background, cyan and magenta lighting. Clean vector style, premium sci-fi sports aesthetic.",
      "A street-art inspired Discobolos statue illustration. The classic statue is covered in vibrant, artistic graffiti tattoos. Wearing a street-style bucket hat and oversized gold chain. Holding a spray-paint styled ultimate frisbee. Urban abstract background with splashes of paint. Vibrant, rebellious, clean vector art.",
      "A cosmic, ethereal female athlete statue in Discobolos pose. Her skin resembles a starry night sky or galaxy quartz. She is wearing a diadem made of starlight. Holding a frisbee that looks like a swirling galaxy or Saturn's rings. Deep space background with nebulae. Mystical, premium, clean vector art.",
      "A vaporwave aesthetic female Discobolos statue. Paste colors, marble texture but with glitch effects. Wearing 80s aerobic headband and leg warmers. Holding a disk that looks like a vinyl record or CD. Background features retro grid lines and a sunset sun. Nostalgic, stylish, clean vector art."
    ];

    // 1. Pick a random base template
    const randomIndex = Math.floor(Math.random() * PROVEN_PROMPTS.length);
    const selectedTemplate = PROVEN_PROMPTS[randomIndex];

    // 2. Append User Input DIRECTLY (No translation, no AI processing)
    // We add it as "Additional specific details" to guide the generation without breaking the style
    const finalPrompt = `${selectedTemplate} ${prompt} 1:1 aspect ratio`;

    console.log("Selected Template Index:", randomIndex);
    console.log("Final Prompt:", finalPrompt);

    // 3. Call AI Model (Imagen or Gemini/Banana)
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    // Allow user to override model via env, default to the fast Imagen model
    const modelName = process.env.IMAGE_MODEL_NAME || "imagen-4.0-fast-generate-001"; 
    
    console.log("Using Model:", modelName);

    // Determine endpoint type: "predict" (Imagen) vs "generateContent" (Gemini/Banana)
    // Most newer models (Nano Banana, etc.) use generateContent
    const isPredictModel = modelName.includes("imagen") && !modelName.includes("preview"); 
    // Note: Some imagen previews use generateContent too. 
    // Safer heuristic: based on user's error, 'nano-banana' needs generateContent.
    // Let's assume if it's explicitly "imagen-3" or "imagen-4" without "generate-content" quirk, use predict.
    // Actually, 'imagen-4.0-fast-generate-001' worked with predict. 
    // 'nano-banana' failed with predict.
    
    let url = ""; 
    let body = {};

    if (modelName.includes("imagen") && !modelName.includes("banana")) {
       // Legacy Imagen 'predict' endpoint
       url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:predict?key=${apiKey}`;
       body = {
        instances: [{ prompt: finalPrompt }],
        parameters: { sampleCount: 1, aspectRatio: "1:1" }
       };
    } else {
       // Modern Gemini / Banana 'generateContent' endpoint
       url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
       body = {
        contents: [{ parts: [{ text: finalPrompt }] }],
       };
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI API Error:", errText);
      throw new Error(`AI API Error (${modelName}): ${errText}`);
    }

    const data = await response.json();
    
    // Extract Image Data (Handle both schemas)
    let base64Image = null;

    if (data.predictions) {
        // Imagen 'predict' schema
        base64Image = data.predictions?.[0]?.bytesBase64Encoded || data.predictions?.[0]?.bytesBase64;
    } else if (data.candidates) {
        // Gemini 'generateContent' schema
        // Look for inline data
        const part = data.candidates[0]?.content?.parts?.[0];
        if (part?.inlineData) {
            base64Image = part.inlineData.data;
        } else if (part?.text) {
             throw new Error("Model returned text instead of image: " + part.text.substring(0, 100));
        }
    }

    if (!base64Image) {
      console.error("No image data in response:", JSON.stringify(data).substring(0, 200));
      throw new Error("No image data received from AI");
    }

    // 3. Upload to Supabase
    const buffer = Buffer.from(base64Image, 'base64');
    const fileName = `avatars/ai-gen-${Date.now()}.png`;

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
      return NextResponse.json({ error: "Server configuration error: Missing Service Role Key" }, { status: 500 });
    }

    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from('avatars') // Assuming a public bucket exists, often named 'avatars'
      .upload(fileName, buffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
      console.error("Supabase Upload Error:", uploadError);
      throw uploadError;
    }

    // Get Public URL
    const { data: publicUrlData } = supabaseAdmin
      .storage
      .from('avatars')
      .getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrlData.publicUrl });

  } catch (error: any) {
    console.error("Avatar Gen Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate avatar" }, { status: 500 });
  }
}
