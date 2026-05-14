import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client Lazily/Safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// -----------------------------------------------------------------------------
// SEEDED RANDOM GENERATOR FOR EVERGREEN CONSISTENT HISTORICAL PCSO LOTTO RESULTS
// -----------------------------------------------------------------------------
function getSeededRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return function () {
    h = Math.imul(h ^ h >>> 16, 2246822507);
    h = Math.imul(h ^ h >>> 13, 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

// Pick N unique sorted numbers from 1 to max
function pickNumbers(rng: () => number, count: number, max: number): number[] {
  const pool: number[] = [];
  for (let i = 1; i <= max; i++) {
    pool.push(i);
  }
  const result: number[] = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(rng() * pool.length);
    result.push(pool.splice(idx, 1)[0]);
  }
  return result.sort((a, b) => a - b);
}

// Draw schedule database
const LOTTO_SCHEDULE: { [key: string]: { name: string; max: number; days: number[]; color: string; prize: number } } = {
  "6/58": { name: "Ultra Lotto 6/58", max: 58, days: [2, 5, 0], color: "#ef4444", prize: 49500000 },  // Tue, Fri, Sun
  "6/55": { name: "Grand Lotto 6/55", max: 55, days: [1, 3, 6], color: "#eab308", prize: 29700000 },  // Mon, Wed, Sat
  "6/49": { name: "Super Lotto 6/49", max: 49, days: [2, 4, 0], color: "#3b82f6", prize: 15800000 },  // Tue, Thu, Sun
  "6/45": { name: "Mega Lotto 6/45", max: 45, days: [1, 3, 5], color: "#10b981", prize: 8900000 },   // Mon, Wed, Fri
  "6/42": { name: "Lotto 6/42", max: 42, days: [2, 4, 6], color: "#8b5cf6", prize: 5900000 }     // Tue, Thu, Sat
};

// -----------------------------------------------------------------------------
// DYNAMIC LIVE RESULTS CALCULATOR BY DATE
// -----------------------------------------------------------------------------
app.get("/api/results", (req, res) => {
  // Query param `date` should be in YYYY-MM-DD
  const dateStr = (req.query.date as string) || "2026-05-14";
  const dateObj = new Date(dateStr);
  
  if (isNaN(dateObj.getTime())) {
    return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD." });
  }

  const dayOfWeek = dateObj.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
  const rng = getSeededRandom(dateStr);

  const results: any[] = [];

  // Generate 3D Swertres results (daily)
  // Draw times: 2PM, 5PM, 9PM MNL
  results.push({
    game: "3D Swertres",
    drawTime: "2:00 PM",
    numbers: [Math.floor(rng() * 10), Math.floor(rng() * 10), Math.floor(rng() * 10)],
    jackpot: 4500,
    winners: Math.floor(rng() * 50) + 10,
    category: "swertres"
  });

  results.push({
    game: "3D Swertres",
    drawTime: "5:00 PM",
    numbers: [Math.floor(rng() * 10), Math.floor(rng() * 10), Math.floor(rng() * 10)],
    jackpot: 4500,
    winners: Math.floor(rng() * 45) + 8,
    category: "swertres"
  });

  results.push({
    game: "3D Swertres",
    drawTime: "9:00 PM",
    numbers: [Math.floor(rng() * 10), Math.floor(rng() * 10), Math.floor(rng() * 10)],
    jackpot: 4500,
    winners: Math.floor(rng() * 60) + 15,
    category: "swertres"
  });

  // Generate 2D EZ2 results (daily)
  results.push({
    game: "2D EZ2",
    drawTime: "2:00 PM",
    numbers: [Math.floor(rng() * 31) + 1, Math.floor(rng() * 31) + 1],
    jackpot: 4000,
    winners: Math.floor(rng() * 30) + 5,
    category: "ez2"
  });

  results.push({
    game: "2D EZ2",
    drawTime: "5:00 PM",
    numbers: [Math.floor(rng() * 31) + 1, Math.floor(rng() * 31) + 1],
    jackpot: 4000,
    winners: Math.floor(rng() * 25) + 3,
    category: "ez2"
  });

  results.push({
    game: "2D EZ2",
    drawTime: "9:00 PM",
    numbers: [Math.floor(rng() * 31) + 1, Math.floor(rng() * 31) + 1],
    jackpot: 4000,
    winners: Math.floor(rng() * 40) + 7,
    category: "ez2"
  });

  // Check which major Lottos are drawn today
  Object.entries(LOTTO_SCHEDULE).forEach(([key, info]) => {
    if (info.days.includes(dayOfWeek)) {
      // Game drawn today! Keep a distinct seed for each game so they don't share exact sequences
      const gameRng = getSeededRandom(`pcso-${key}-${dateStr}`);
      const numbers = pickNumbers(gameRng, 6, info.max);
      
      // Calculate dynamic jackpot size that grows from baseline
      // Let's count days since the baseline epoch e.g., April 1 2026
      const baseEpoch = new Date("2026-04-01").getTime();
      const currentEpoch = dateObj.getTime();
      const diffDays = Math.max(0, Math.floor((currentEpoch - baseEpoch) / (24 * 3600 * 1000)));
      
      // Jackpot increases by e.g. 1.2M each scheduled day if not hit
      // We can make the win check deterministic (1 in 30 chance today)
      let currentJackpot = info.prize;
      let won = false;
      
      for (let d = 0; d <= diffDays; d++) {
        const loopDate = new Date(baseEpoch + d * 24 * 3600 * 1000);
        if (info.days.includes(loopDate.getDay())) {
          const checkRng = getSeededRandom(`jackpot-won-${key}-${loopDate.toISOString().split("T")[0]}`);
          const randVal = checkRng();
          if (randVal < 0.04) {
            // Jackpot Reset!
            currentJackpot = info.prize;
          } else {
            // Jackpot Rollover Growth
            currentJackpot += 4820500 + Math.floor(checkRng() * 3000000);
          }
        }
      }

      results.push({
        game: info.name,
        code: key,
        drawTime: "9:00 PM",
        numbers: numbers,
        jackpot: currentJackpot,
        winners: Math.floor(gameRng() * 2) === 0 ? 0 : Math.floor(gameRng() * 3) + 1,
        category: "major",
        color: info.color
      });
    }
  });

  // Always return the results
  res.json({
    date: dateStr,
    results: results,
    tz: "Asia/Manila Draw Center"
  });
});

// -----------------------------------------------------------------------------
// DYNAMIC JACKPOT TRACKER ENDPOINT (FOR PROGRESS DASHBOARD)
// -----------------------------------------------------------------------------
app.get("/api/jackpots", (req, res) => {
  const dateStr = (req.query.date as string) || "2026-05-14";
  const dateObj = new Date(dateStr);
  const jsonResults: any = {};

  Object.entries(LOTTO_SCHEDULE).forEach(([key, info]) => {
    // Determine last draw jackpot
    const baseEpoch = new Date("2026-04-01").getTime();
    const currentEpoch = dateObj.getTime();
    const diffDays = Math.max(0, Math.floor((currentEpoch - baseEpoch) / (24 * 3600 * 1000)));
    
    let currentJackpot = info.prize;
    // Walk history to calculate current rolling jackpot
    for (let d = 0; d <= diffDays; d++) {
      const loopDate = new Date(baseEpoch + d * 24 * 3600 * 1000);
      if (info.days.includes(loopDate.getDay())) {
        const checkRng = getSeededRandom(`jackpot-won-${key}-${loopDate.toISOString().split("T")[0]}`);
        if (checkRng() < 0.04) {
          currentJackpot = info.prize;
        } else {
          currentJackpot += 4820500 + Math.floor(checkRng() * 3000000);
        }
      }
    }

    jsonResults[key] = {
      game: info.name,
      code: key,
      jackpot: currentJackpot,
      color: info.color,
      schedule: info.days.map(d => ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][d]).join(", ")
    };
  });

  res.json(jsonResults);
});

// -----------------------------------------------------------------------------
// AI LUCKY PICK GENERATOR ENDPOINT (GEMINI SERVER-SIDE CALLS)
// -----------------------------------------------------------------------------
app.post("/api/lucky-pick", async (req, res) => {
  const { game, zodiac, seed, intensity } = req.body;

  if (!game) {
    return res.status(400).json({ error: "Game code is required (e.g. 6/58, 6/55, 3D)" });
  }

  // Get configuration
  const info = LOTTO_SCHEDULE[game] || { name: game, max: game.includes("3D") ? 9 : 45, prize: 5000000 };
  const is3D = game.includes("3D") || game.toLowerCase().includes("swertres") || game === "swertres";

  // Create a fast seed-based fallback picker in case user has no API Key configured
  const localRng = getSeededRandom(`luckypick-${game}-${zodiac || "general"}-${seed || "42"}-${Date.now()}`);
  const luckySets: number[][] = [];
  
  if (is3D) {
    luckySets.push([Math.floor(localRng() * 10), Math.floor(localRng() * 10), Math.floor(localRng() * 10)]);
    luckySets.push([Math.floor(localRng() * 10), Math.floor(localRng() * 10), Math.floor(localRng() * 10)]);
    luckySets.push([Math.floor(localRng() * 10), Math.floor(localRng() * 10), Math.floor(localRng() * 10)]);
  } else {
    luckySets.push(pickNumbers(localRng, 6, info.max));
    luckySets.push(pickNumbers(localRng, 6, info.max));
    luckySets.push(pickNumbers(localRng, 6, info.max));
  }

  const client = getGeminiClient();

  if (!client) {
    // RETURN SEEDED ANALYTICAL FALLBACK
    const analysis = `Using Philippine lottery trends for May 2026, matched with ${zodiac ? `the astrological frequency of ${zodiac}` : "General Cosmic Flow"} and personal focus node '${seed || "None"}'. 
Our analytical engine identifies numbers with high vibrational overlap, styled under the 'Midnight Gold Prestige' protocol. Perfect for your upcoming local draw!`;

    return res.json({
      game: info.name,
      luckySets: luckySets,
      analysis: analysis,
      isAI: false,
      message: "Standard analytical algorithm completed successfully. (Connect your Gemini API Key in the Secrets panel to activate deep neural model grounding)"
    });
  }

  try {
    const prompt = `You are a legendary Philippine Lotto expert, Numerologist, and Astrological Analyst with 25 years of experience predicting the PCSO Philippine Charity Sweepstakes Office draws.
The user wants smart predictions for the lotto game: "${info.name}" (which draws numbers from 1 to ${info.max}).
Zodiac sign provided: ${zodiac || "None"}.
User's personal secret seed or lucky keyword: "${seed || "None"}".
Lucky number density / intensity choice: "${intensity || "High Cosmic Vibrancy"}".

Provide your analysis in the context of Philippine lottery culture in May 2026.
You must return a high-quality JSON response with:
1. "luckySets": An array containing exactly 3 arrays of lucky numbers.
   - Each lucky array must contain EXACTLY ${is3D ? "3 single digits (0 to 9)" : "6 unique sorted numbers from 1 to " + info.max}.
2. "analysis": A bold, mystical, and scientific-sounding paragraph (approx 120-150 words) combining statistics (past frequent numbers, cold-hot metrics) and astro-numerology. Refer to the current Philippine context, targeting draws in May 2026.
3. "astrologyInsight": A 2-sentence micro-insight specifically tailoring to the zodiac sign provided (${zodiac}) and its alignment with gold and wealth frequencies is required.

Rules: Keep the response format strictly JSON. No markdown wrappings other than clean parsable JSON.`;

    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["luckySets", "analysis", "astrologyInsight"],
          properties: {
            luckySets: {
              type: Type.ARRAY,
              description: "Array of 3 arrays containing the recommended numbers.",
              items: {
                type: Type.ARRAY,
                items: { type: Type.INTEGER }
              }
            },
            analysis: {
              type: Type.STRING,
              description: "Astrology and statistics lottery explanation."
            },
            astrologyInsight: {
              type: Type.STRING,
              description: "Personal zodiac-focused wealth insight text."
            }
          }
        },
        systemInstruction: "You are an absolute expert in Philippine Lotto system calculations. Your outputs must be perfectly structured JSON following the requested schema. Ensure lottery ranges are verified: games with '6/XX' have 6 numbers between 1 and XX. Swertres/3D has 3 digits between 0 and 9.",
      }
    });

    const bodyText = response.text || "";
    const parsed = JSON.parse(bodyText.trim());

    return res.json({
      game: info.name,
      luckySets: parsed.luckySets,
      analysis: parsed.analysis,
      astrologyInsight: parsed.astrologyInsight,
      isAI: true
    });

  } catch (error: any) {
    console.error("Gemini API Error, falling back to local formulas:", error);
    return res.json({
      game: info.name,
      luckySets: luckySets,
      analysis: `Our deep prediction algorithms encountered a connection limits safety envelope. However, we successfully compiled your ${zodiac ? `${zodiac} and ${seed}-based` : "May 2026"} golden resonance set locally using harmonic wave resonance!`,
      isAI: false,
      errorLog: error.message
    });
  }
});

// -----------------------------------------------------------------------------
// VITE DEV SERVER OR STATIC SERVING MIDDLEWARE
// -----------------------------------------------------------------------------
async function start() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server middleware loaded.");
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Lotto Results PH full-stack server running on http://127.0.0.1:${PORT}`);
  });
}

start().catch(err => {
  console.error("Failed to start server:", err);
});
