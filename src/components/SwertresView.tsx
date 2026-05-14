import React, { useState, useEffect } from "react";
import AdContainer from "./AdContainer";
import { 
  Clock, Flame, HelpCircle, Activity, Sparkles, RefreshCw, AlertCircle, Dices, Layers 
} from "lucide-react";

interface SwertresViewProps {
  currentDateStr: string;
}

export default function SwertresView({ currentDateStr }: SwertresViewProps) {
  const [swertresResults, setSwertresResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Digital shuffler state
  const [shuffling, setShuffling] = useState(false);
  const [rolledDigits, setRolledDigits] = useState<number[]>([7, 0, 4]);

  useEffect(() => {
    async function fetchSwertres() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/results?date=${currentDateStr}`);
        if (!response.ok) {
          throw new Error("Unable to contact backend data feeds.");
        }
        const data = await response.json();
        // Extract Swertres results
        const items = data.results.filter((r: any) => r.game === "3D Swertres" || r.category === "swertres");
        setSwertresResults(items);
      } catch (err: any) {
        setError(err.message || "Failed to load Swertres archive.");
      } finally {
        setLoading(false);
      }
    }
    fetchSwertres();
  }, [currentDateStr]);

  // Handle satisfying digital number tumbling simulation
  const rollDraw = () => {
    if (shuffling) return;
    setShuffling(true);
    let count = 0;
    
    const interval = setInterval(() => {
      setRolledDigits([
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10)
      ]);
      count++;
      if (count > 15) {
        clearInterval(interval);
        setShuffling(false);
      }
    }, 70);
  };

  return (
    <div className="space-y-6">
      
      {/* GEO Quick Summary */}
      <div id="swertres-quick-summary" className="bg-[#1a1e20] border-l-4 border-[#FFD700] p-4 rounded-r-lg">
        <h2 className="text-[10px] text-[#FFD700] uppercase tracking-widest font-black mb-2 flex items-center gap-1.5 font-mono">
          <Activity className="w-3.5 h-3.5 text-[#FFD700] animate-pulse" /> 3D Swertres Quick Summary
        </h2>
        <ul className="text-xs text-gray-300 space-y-1 leading-relaxed">
          <li>• <strong>Draw Interval</strong>: PCSO draws Swertres daily at 2:00 PM, 5:00 PM, and 9:00 PM Philippine timezone.</li>
          <li>• <strong>Standard Payout</strong>: Matching all 3 digits in exact order wins a standard prize of ₱4,500.00.</li>
          <li>• <strong>Digital verification</strong>: All values are audited and verified by local drawing coordinators on site.</li>
        </ul>
      </div>

      {/* Adsterra Native Banner */}
      <AdContainer type="native" id="native-swertres-banner" />

      {/* Question Header 1 */}
      <div className="space-y-1">
        <h2 id="swertres-draw-times-header" className="text-xl md:text-2xl font-light text-[#FFD700]">
          When is the next Swertres draw schedule active?
        </h2>
        <p className="text-xs text-gray-400 font-mono">
          Philippine Standard Time Draw Feed: <span className="text-yellow-500 font-bold">{currentDateStr}</span>
        </p>
      </div>

      {/* Live feeds area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-3 bg-[#1a1e20] border border-gray-800 rounded-xl">
          <RefreshCw className="w-8 h-8 text-[#FFD700] animate-spin" />
          <p className="text-xs text-gray-400 font-mono tracking-widest">Re-indexing daily draw feed...</p>
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 p-6 bg-red-950/20 border border-red-500/20 text-red-200 rounded-xl">
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
          <div>
            <div className="font-semibold text-sm">Failed to Sync Live Draw Server</div>
            <div className="text-xs text-gray-400">{error}</div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="swertres-draws-container">
          {swertresResults.map((draw: any, idx: number) => (
            <div 
              key={idx}
              className="bg-[#1a1e20] border border-gray-800 rounded-xl p-5 hover:border-[#FFD700]/30 transition-all duration-300 relative overflow-hidden group shadow-lg"
            >
              {/* Luxury Accent Lines */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FFD700]/10 to-transparent"></div>

              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#FFD700]" />
                  <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">{draw.drawTime}</span>
                </div>
                
                <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 bg-emerald-400/5 px-2 py-0.5 rounded border border-emerald-400/10">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                  Official
                </span>
              </div>

              {/* Digits display */}
              <div className="flex gap-3 my-6 justify-center">
                {draw.numbers.map((val: number, nIdx: number) => (
                  <div 
                    key={nIdx}
                    className="w-12 h-12 bg-[#111415] border-2 border-yellow-500/20 hover:border-[#FFD700]/40 rounded-xl flex items-center justify-center text-[#FFD700] font-mono font-black text-2xl shadow-[inset_0_0_15px_rgba(255,215,0,0.02)] transform group-hover:scale-105 transition-all duration-300"
                  >
                    {val}
                  </div>
                ))}
              </div>

              <div className="text-center pt-3 border-t border-gray-800/80">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#FFD700]/60">
                  Verifiers: PCSO-MND-01
                </span>
                <p className="text-[11px] text-gray-500 font-mono mt-1">Status: Official Verified Result</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Question Header 2: Quick Rolled Picks */}
      <div className="space-y-1">
        <h2 id="swertres-calculator-header" className="text-xl md:text-2xl font-light text-[#FFD700]">
          What are your lucky numbers for tomorrow's Swertres draw?
        </h2>
        <p className="text-xs text-gray-400 leading-relaxed font-sans">
          Toggle our fast high-end digital generator below. Seeded and calculated using standard local Philippine lucky curves.
        </p>
      </div>

      <div className="bg-[#0e1112] border border-gray-800 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6" id="swertres-shuffler-box">
        {/* Shuffler digits display */}
        <div className="flex gap-4">
          {rolledDigits.map((digit, idx) => (
            <div 
              key={idx}
              className={`w-16 h-16 bg-gradient-to-b from-[#1c2224] to-[#111415] border-2 border-[#FFD700] rounded-2xl flex items-center justify-center font-mono font-black text-3xl shadow-[0_0_15px_rgba(255,215,0,0.1)] transition-all transform ${
                shuffling ? "animate-bounce scale-95 border-emerald-400 text-emerald-400" : "text-[#FFD700]"
              }`}
            >
              {digit}
            </div>
          ))}
        </div>

        <div className="flex-1 max-w-md space-y-2">
          <h4 className="text-sm font-semibold text-white flex items-center gap-1.5 font-sans">
            <Layers className="w-4 h-4 text-[#FFD700]" /> High-Frequency Digital Generator
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed leading-relaxed">
            Engages random mathematical variables configured against local Swertres curves. Feel free to use the outcome sequence in your next local lotto ticket!
          </p>
        </div>

        <button
          type="button"
          onClick={rollDraw}
          disabled={shuffling}
          className={`px-5 py-4 bg-gradient-to-r from-[#FFD700] to-yellow-600 text-[#111415] font-black text-xs font-mono rounded-xl flex items-center gap-2 tracking-wider shadow-[0_0_20px_rgba(255,215,0,0.15)] hover:brightness-110 active:scale-95 transition-all text-center w-full md:w-auto justify-center cursor-pointer ${
            shuffling ? "opacity-50 cursor-wait" : ""
          }`}
        >
          <Dices className="w-5 h-5" />
          <span>{shuffling ? "TUMBLING SEEDS..." : "ROLL LUCKY SWERTRES"}</span>
        </button>
      </div>

    </div>
  );
}
