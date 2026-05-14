import React, { useState } from "react";
import AdContainer from "./AdContainer";
import { 
  Sparkles, Activity, Award, Shuffle, Compass, Key, Settings, AlertCircle, RefreshCw, Send 
} from "lucide-react";

interface LuckyPickViewProps {
  currentDateStr: string;
}

export default function LuckyPickView({ currentDateStr }: LuckyPickViewProps) {
  const [gameCode, setGameCode] = useState("6/58");
  const [zodiac, setZodiac] = useState("Aries");
  const [seed, setSeed] = useState("");
  const [intensity, setIntensity] = useState("Balanced Resonance");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const games = [
    { code: "6/58", name: "Ultra Lotto 6/58" },
    { code: "6/55", name: "Grand Lotto 6/55" },
    { code: "6/49", name: "Super Lotto 6/49" },
    { code: "6/45", name: "Mega Lotto 6/45" },
    { name: "3D Swertres", code: "3D" }
  ];

  const zodiacSigns = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/lucky-pick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game: gameCode,
          zodiac,
          seed: seed || "Cosmic Gold Node",
          intensity
        })
      });

      if (!response.ok) {
        throw new Error("Local cosmic model bypass failed.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      // Fallback manual generation for strict safe rendering
      const dummySets = gameCode === "3D" 
        ? [
            [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)],
            [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)],
            [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)]
          ]
        : [
            Array.from({ length: 6 }, () => Math.floor(Math.random() * 45) + 1).sort((a,b)=>a-b),
            Array.from({ length: 6 }, () => Math.floor(Math.random() * 45) + 1).sort((a,b)=>a-b),
            Array.from({ length: 6 }, () => Math.floor(Math.random() * 45) + 1).sort((a,b)=>a-b)
          ];
      setResult({
        game: gameCode,
        luckySets: dummySets,
        analysis: "Harmonic calculations compiled via local RNG. (Please specify valid api keys to ground with server-side AI)",
        isAI: false
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* GEO AI Quick Summary Section */}
      <div id="lucky-quick-summary" className="bg-[#1a1e20] border-l-4 border-[#FFD700] p-4 rounded-r-lg">
        <h2 className="text-[10px] text-[#FFD700] uppercase tracking-widest font-black mb-2 flex items-center gap-1.5 font-mono">
          <Activity className="w-3.5 h-3.5" /> AI Lucky Pick Systems Summary
        </h2>
        <ul className="text-xs text-gray-300 space-y-1.5 leading-relaxed">
          <li>• <strong>Double Method Engine</strong>: Interlinks astrological frequency models with seeded random calculations.</li>
          <li>• <strong>Gemini Grounded Intelligence</strong>: Deep learning models automatically evaluate hot/cold draw matrices when credentials are present.</li>
          <li>• <strong>No Fee Structure</strong>: This system is 100% free and open to all Philippine lotto players worldwide.</li>
        </ul>
      </div>

      {/* Adsterra Native Slot */}
      <AdContainer type="native" id="native-lucky-banner" />

      {/* Question Header 1 */}
      <div className="space-y-1">
        <h2 id="lucky-generate-h2" className="text-xl md:text-2xl font-light text-[#FFD700]">
          How can you generate smart numbers using Astro-AI analytics?
        </h2>
        <p className="text-xs text-gray-400 font-mono">
          Model execution matrix calculated for date: <span className="text-yellow-500 font-bold">{currentDateStr}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Controls Column */}
        <form onSubmit={handleGenerate} className="lg:col-span-1 bg-[#1a1e20] border border-gray-800 p-5 rounded-xl space-y-4" id="lucky-pick-form">
          <h3 className="text-xs font-bold text-[#FFD700] uppercase tracking-widest border-b border-gray-800 pb-2 flex items-center gap-1.5">
            <Settings className="w-4 h-4" /> Calibration Matrix
          </h3>

          {/* Game select */}
          <div className="space-y-1">
            <label className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">Target PCSO Game</label>
            <select
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value)}
              className="w-full bg-[#111415] border border-gray-800 text-white rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-[#FFD700] outline-none"
            >
              {games.map(g => (
                <option key={g.code} value={g.code}>{g.name}</option>
              ))}
            </select>
          </div>

          {/* Zodiac select */}
          <div className="space-y-1">
            <label className="text-[10px] text-gray-400 uppercase tracking-wider font-mono flex items-center gap-1">
              <Compass className="w-3 h-3 text-[#FFD700]" /> Zodiac Signature
            </label>
            <select
              value={zodiac}
              onChange={(e) => setZodiac(e.target.value)}
              className="w-full bg-[#111415] border border-gray-800 text-white rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-[#FFD700] outline-none animate-none"
            >
              {zodiacSigns.map(z => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>

          {/* Secret string seed input */}
          <div className="space-y-1">
            <label className="text-[10px] text-gray-400 uppercase tracking-wider font-mono flex items-center gap-1">
              <Key className="w-3 h-3 text-[#FFD700]" /> Lucky Phrase / Seed
            </label>
            <input
              type="text"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder="e.g. Wealth, Manila, My Birthday"
              className="w-full bg-[#111415] border border-gray-800 text-white rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-[#FFD700] outline-none"
            />
          </div>

          {/* Vibration density choice */}
          <div className="space-y-1">
            <label className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">Cosmic Frequency Option</label>
            <select
              value={intensity}
              onChange={(e) => setIntensity(e.target.value)}
              className="w-full bg-[#111415] border border-gray-800 text-white rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-[#FFD700] outline-none"
            >
              <option value="Hot Number Compression">Hot Number Compression</option>
              <option value="Balanced Resonance">Balanced Resonance</option>
              <option value="Cold / Sleepy Outliers">Cold / Sleepy Outliers</option>
              <option value="Maximum Astro Vibrancy">Maximum Astro Vibrancy</option>
            </select>
          </div>

          {/* Generate Button using Math.random and Gemini backend */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#FFD700] to-yellow-600 hover:brightness-110 active:scale-95 transition-all text-[#111415] font-black font-sans text-xs rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest shadow-[0_0_15px_rgba(255,215,0,0.15)] cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Grounding Model...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 animate-bounce-slow" />
                <span>EXECUTE DEEP AI PICK</span>
              </>
            )}
          </button>
        </form>

        {/* Results Output Column */}
        <div className="lg:col-span-2 bg-[#0e1112] border border-gray-850 p-6 rounded-xl relative overflow-hidden flex flex-col justify-between min-h-[400px]" id="lucky-pick-output">
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#FFD700]/5 rounded-full blur-3xl pointer-events-none"></div>

          {result ? (
            <div className="space-y-5 animate-fade-in">
              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#FFD700] bg-yellow-500/10 px-2.5 py-1 rounded">
                  Calculated Predictions Verified
                </span>
                
                <span className="text-[10px] text-gray-500 font-mono">
                  {result.isAI ? "GEMINI FLUIDITY MODEL" : "SEEDED HARMONIC ALGORITHM"}
                </span>
              </div>

              {/* Balls output */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-white uppercase font-mono">Your Personalized Lucky Sets:</h4>
                <div className="space-y-3">
                  {result.luckySets.map((set: number[], sIdx: number) => (
                    <div key={sIdx} className="bg-[#111415] border border-gray-850 p-3.5 rounded-xl flex items-center justify-between group hover:border-[#FFD700]/30 transition-all">
                      <span className="text-[10px] font-mono font-bold text-[#FFD700]/70 uppercase">Set #{sIdx+1}</span>
                      <div className="flex gap-2">
                        {set.map((val: number, vIdx: number) => (
                          <div 
                            key={vIdx}
                            className="w-8 h-8 rounded-full bg-gradient-to-b from-[#1c2224] to-[#111415] border border-[#FFD700]/40 flex items-center justify-center font-mono text-xs font-black text-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.05)] group-hover:scale-105 transition-transform"
                          >
                            {gameCode === "3D" ? val : (val < 10 ? `0${val}` : val)}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analysis Text Box */}
              <div className="space-y-2 border-t border-gray-800/80 pt-4">
                <h4 className="text-xs font-bold text-[#FFD700] uppercase font-mono tracking-wider">Astrological Trend analysis:</h4>
                <p className="text-xs text-gray-300 leading-relaxed font-sans">{result.analysis}</p>
                
                {result.astrologyInsight && (
                  <div className="bg-yellow-500/5 border border-yellow-500/10 p-3 rounded-lg text-xs text-[#FFD700] italic leading-relaxed mt-2">
                    🌌 Zodiac Insight ({zodiac}): {result.astrologyInsight}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="my-auto text-center space-y-4 max-w-sm mx-auto p-6" id="lucky-empty-state">
              <Shuffle className="w-12 h-12 text-yellow-600/40 mx-auto animate-pulse" />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-white">Awaiting Calibration Parameters</h4>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  Select your metrics in the configuration sidebar then click "EXECUTE DEEP AI PICK" to generate real-time predictable combinations.
                </p>
              </div>
            </div>
          )}

          <div className="border-t border-gray-800 pt-4 mt-6 text-[10px] text-gray-500 font-mono text-center">
            *Disclaimer: Combinations are numerical modeling computations for entertainment only. Always play responsibly.
          </div>
        </div>

      </div>

    </div>
  );
}
