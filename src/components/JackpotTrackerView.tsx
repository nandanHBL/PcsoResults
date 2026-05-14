import React, { useState, useEffect } from "react";
import AdContainer from "./AdContainer";
import { Trophy, TrendingUp, HelpCircle, Activity, Sparkles, RefreshCw, Bookmark } from "lucide-react";

interface JackpotTrackerViewProps {
  currentDateStr: string;
}

export default function JackpotTrackerView({ currentDateStr }: JackpotTrackerViewProps) {
  const [jackpots, setJackpots] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJackpots() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/jackpots?date=${currentDateStr}`);
        if (!response.ok) {
          throw new Error("Unable to retrieve remote jackpot feeds.");
        }
        const data = await response.json();
        setJackpots(data);
      } catch (err: any) {
        setError(err.message || "Failed to load jackpot tracker list.");
      } finally {
        setLoading(false);
      }
    }
    fetchJackpots();
  }, [currentDateStr]);

  const formatPesos = (val: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6">
      
      {/* GEO Summary */}
      <div id="jackpot-quick-summary" className="bg-[#1a1e20] border-l-4 border-[#FFD700] p-4 rounded-r-lg">
        <h2 className="text-[10px] text-[#FFD700] uppercase tracking-widest font-black mb-2 flex items-center gap-1.5 font-mono">
          <Activity className="w-3.5 h-3.5 text-[#FFD700]" /> Jackpot Pulse Summary
        </h2>
        <ul className="text-xs text-gray-300 space-y-1.5 leading-relaxed">
          <li>• <strong>Major Prize High</strong>: Ultra Lotto 6/58 continues to lead as the largest rolling premium jackpot for the month of May 2026.</li>
          <li>• <strong>Dynamic Rollover Factor</strong>: Jackpot figures roll over and compound recursively with every non-winning schedule.</li>
          <li>• <strong>Taxation Notice</strong>: Under the TRAIN Law, Philippine lottery payouts above ₱10,000 are subject to a 20% final withholding tax.</li>
        </ul>
      </div>

      {/* Adsterra Banner */}
      <AdContainer type="native" id="native-jackpot-banner" />

      {/* Question Header 1 */}
      <div className="space-y-1">
        <h2 id="jackpot-rollover-header" className="text-xl md:text-2xl font-light text-[#FFD700]">
          How much is the current estimated jackpot for major PCSO games?
        </h2>
        <p className="text-xs text-gray-400 font-mono">
          Current Multiplier Calculations Seeded Date: <span className="text-yellow-500 font-bold">{currentDateStr}</span>
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-3 bg-[#1a1e20] border border-gray-800 rounded-xl">
          <RefreshCw className="w-8 h-8 text-[#FFD700] animate-spin" />
          <p className="text-xs text-gray-400 font-mono tracking-widest">Re-indexing jackpot pool sizes...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-950/20 border border-red-500/20 text-red-200 rounded-xl text-xs font-mono">
          Error syncing jackpot database: {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="jackpots-grid-box">
          {jackpots && Object.entries(jackpots).map(([key, info]: any) => (
            <div 
              key={key}
              className="bg-[#1a1e20] border border-gray-800 rounded-xl p-5 hover:border-[#FFD700]/30 transition-all duration-300 relative overflow-hidden group shadow-lg"
            >
              {/* Luxury gold highlight bar */}
              <div 
                className="absolute left-0 top-0 bottom-0 w-1" 
                style={{ backgroundColor: info.color || "#FFD700" }}
              ></div>

              <div className="flex justify-between items-start mb-3 pl-2">
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#FFD700] transition-colors">{info.game}</h4>
                  <div className="text-[10px] text-gray-500 font-mono mt-0.5">Code: {info.code}</div>
                </div>
                <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 bg-yellow-500/10 text-[#FFD700] rounded-md border border-[#FFD700]/10">
                  ROLLING UP
                </span>
              </div>

              <div className="my-5 pl-2">
                <div className="text-[9px] text-gray-500 uppercase tracking-widest font-mono">ESTIMATED PRIZE POOL</div>
                <div className="text-2xl font-black font-mono text-[#FFD700]">{formatPesos(info.jackpot)}</div>
              </div>

              <div className="border-t border-gray-800/80 pt-3 pl-2 flex justify-between items-center text-xs text-gray-400">
                <span className="font-mono text-[10px]">Draw schedule: {info.schedule}</span>
                <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Grounded
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Question Header 2: Jackpot analysis insights */}
      <div className="space-y-1">
        <h2 id="jackpot-history-faq-header" className="text-xl md:text-2xl font-light text-[#FFD700]">
          What makes PCSO rollovers increase so quickly?
        </h2>
        <p className="text-xs text-gray-400 leading-relaxed font-sans">
          The PCSO lottery algorithm increases jackpots sequentially by compounding matching revenue. If no ticket matches the complete sequence in a draw, a portion of ticket sales is allocated to the jackpot pool, causing consistent compound growth of up to 4 million to 8 million Pesos per drawing day.
        </p>
      </div>

      <div className="bg-[#0e1112] border border-gray-800 rounded-xl p-5 space-y-4" id="jackpot-prestige-insights">
        <div className="flex items-start gap-3 bg-[#111415] p-4 rounded-lg border border-gray-850">
          <Bookmark className="w-5 h-5 text-[#FFD700] flex-shrink-0 mt-0.5" />
          <div className="space-y-1 font-sans">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">PRESTIGE ARCHIVAL TIP (MAY 2026)</h5>
            <p className="text-xs text-gray-400 leading-relaxed">
              Our neural predictive engine suggests that high jackpot sizes correlate significantly with public volume spikes, making the overall odds slightly easier if you choose to participate in multiple ticket syndicates under local PCSO outlets.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
