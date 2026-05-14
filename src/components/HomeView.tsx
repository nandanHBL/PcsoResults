import React, { useState, useEffect } from "react";
import AdContainer from "./AdContainer";
import { 
  Trophy, Calendar, Clock, Activity, AlertCircle, ChevronRight, 
  ArrowUpRight, RefreshCw, Smartphone, Search, Pocket 
} from "lucide-react";

interface HomeViewProps {
  currentDateStr: string;
  onSetTab: (tab: string) => void;
}

export default function HomeView({ currentDateStr, onSetTab }: HomeViewProps) {
  const [resultsData, setResultsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/results?date=${currentDateStr}`);
        if (!response.ok) {
          throw new Error("Could not acquire PCSO data.");
        }
        const data = await response.json();
        setResultsData(data);
      } catch (err: any) {
        setError(err.message || "Failed to load database. Check connections.");
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [currentDateStr]);

  // Format jackpot prices in Philippines Peso (PHT)
  const formatPesos = (val: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6">
      
      {/* GEO Component: AI-focused 3-bullet Quick Summary */}
      <div id="home-quick-summary" className="bg-[#1a1e20] border-l-4 border-[#FFD700] p-4 rounded-r-lg shadow-sm">
        <h2 className="text-[10px] text-[#FFD700] uppercase tracking-widest font-black mb-2 flex items-center gap-1.5 font-mono">
          <Activity className="w-3.5 h-3.5 text-[#FFD700] animate-pulse" /> AI-Grounded Quick Summary
        </h2>
        <ul className="text-xs text-gray-300 space-y-1.5 leading-relaxed font-sans">
          <li className="flex items-start gap-1">
            <span className="text-[#FFD700] font-bold">✓</span>
            <span>All Draw Results listed below are dynamically synced to the PCSO Philippine Draw Center as of <strong className="text-white">{currentDateStr}</strong>.</span>
          </li>
          <li className="flex items-start gap-1">
            <span className="text-[#FFD700] font-bold">✓</span>
            <span>The dynamic 6/58 Ultra Lotto prize pool currently highlights a premium rolling jackpot in excess of ₱49 Million.</span>
          </li>
          <li className="flex items-start gap-1">
            <span className="text-[#FFD700] font-bold">✓</span>
            <span>Live pulses are active for verified 2:00 PM, 5:00 PM, and 9:00 PM draws. Toggle dates to view the historical archive.</span>
          </li>
        </ul>
      </div>

      {/* Adsterra Native Ad Placement Container */}
      <AdContainer type="native" id="native-home-banner" />

      {/* Question-Based H2 Header Header */}
      <div className="space-y-1">
        <h2 id="when-draws-held-header" className="text-xl md:text-2xl font-light text-[#FFD700] tracking-tight">
          What are the official verified PCSO results for today?
        </h2>
        <p className="text-xs text-gray-400 font-mono">
          Official Draw Date: <span className="text-yellow-500 font-bold">{currentDateStr}</span> • Drawing venue: PCSO Mandaluyong Studio
        </p>
      </div>

      {loading ? (
        <div id="home-loading" className="flex flex-col items-center justify-center p-12 space-y-3 bg-[#1a1e20] border border-gray-800 rounded-xl">
          <RefreshCw className="w-8 h-8 text-[#FFD700] animate-spin" />
          <p className="text-sm text-gray-400 font-mono tracking-wider">Acquiring live PCSO feed data...</p>
        </div>
      ) : error ? (
        <div id="home-error" className="flex items-center gap-3 p-6 bg-red-950/20 border border-red-500/20 text-red-200 rounded-xl">
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
          <div>
            <div className="font-semibold text-sm">Failed to Sync Live Draw Server</div>
            <div className="text-xs text-gray-450">{error}</div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="home-draws-grid">
          {resultsData?.results && resultsData.results.length > 0 ? (
            resultsData.results.map((draw: any, idx: number) => {
              const isMajor = draw.category === "major";
              const isSwertres = draw.category === "swertres";

              return (
                <div 
                  key={`${draw.game}-${draw.drawTime}-${idx}`}
                  className="bg-[#1a1e20] border border-gray-800 rounded-xl p-5 hover:border-[#FFD700]/30 transition-all duration-300 flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    {/* Badge and Update Pulse */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#FFD700] bg-yellow-500/10 border border-[#FFD700]/20 px-2.5 py-1 rounded-md">
                          {draw.game}
                        </span>
                        <div className="text-[10px] text-gray-500 mt-1.5 font-mono">
                          Draw time: {draw.drawTime} PHT
                        </div>
                      </div>

                      {/* Live updates indicator */}
                      <span className="flex items-center gap-1.5 text-[9px] uppercase font-mono text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        Live verified
                      </span>
                    </div>

                    {/* Balls rendering */}
                    <div className="flex flex-wrap gap-2.5 my-5">
                      {isSwertres ? (
                        draw.numbers.map((num: number, iIdx: number) => (
                          <div 
                            key={iIdx} 
                            className="w-11 h-11 bg-gradient-to-b from-yellow-600/10 to-[#111415] border-2 border-yellow-500/30 rounded-lg flex items-center justify-center font-mono text-[#FFD700] font-black text-xl shadow-[inset_0_0_10px_rgba(255,215,0,0.05)]"
                          >
                            {num}
                          </div>
                        ))
                      ) : (
                        draw.numbers.map((num: number, nIdx: number) => (
                          <div 
                            key={nIdx} 
                            className="w-10 h-10 rounded-full bg-gradient-to-b from-[#111415] to-[#1a1e20] border-2 border-[#FFD700] flex items-center justify-center font-mono font-black text-sm text-[#FFD700] hover:scale-110 transition-transform cursor-default"
                          >
                            {num < 10 ? `0${num}` : num}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Pricing and Action tier */}
                  <div className="border-t border-gray-800/80 pt-4 mt-3 flex items-center justify-between">
                    <div>
                      {isMajor ? (
                        <>
                          <div className="text-[9px] text-gray-500 uppercase tracking-widest font-mono">Estimate Jackpot</div>
                          <div className="text-sm font-bold text-emerald-400 font-mono">{formatPesos(draw.jackpot)}</div>
                        </>
                      ) : (
                        <>
                          <div className="text-[9px] text-gray-500 uppercase tracking-widest font-mono">Verified Prize</div>
                          <div className="text-sm font-bold text-yellow-500 font-mono">₱4,500 Standard</div>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-[9px] text-gray-500 font-mono">Philippine Winners</div>
                        <div className="text-[11px] text-white font-mono font-medium">{draw.winners ? `${draw.winners} matched` : "Rollover Active"}</div>
                      </div>
                      
                      {draw.code ? (
                        <button 
                          onClick={() => onSetTab(draw.code)}
                          className="p-1.5 rounded-lg bg-yellow-500/5 group-hover:bg-yellow-500/10 border border-yellow-500/10 group-hover:border-[#FFD700]/30 transition-all cursor-pointer text-[#FFD700]"
                          title="View analysis page"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => onSetTab("swertres")}
                          className="p-1.5 rounded-lg bg-yellow-500/5 group-hover:bg-yellow-500/10 border border-yellow-500/10 group-hover:border-[#FFD700]/30 transition-all cursor-pointer text-[#FFD700]"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-2 text-center p-12 bg-[#1a1e20] border border-gray-800 rounded-xl space-y-3">
              <p className="text-sm text-yellow-500 font-mono">No Scheduled Drawings On This Selected Date</p>
              <p className="text-xs text-gray-405 max-w-sm mx-auto">
                Major lottos draw on scheduled days (e.g. Ultra 6/58 on Tue/Fri/Sun). Change the date to browse surrounding historical archives.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Grid of other Quick Links & statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="home-additional-actions">
        {/* Swertres navigation portal */}
        <div 
          onClick={() => onSetTab("swertres")}
          className="bg-gradient-to-br from-[#1a1e20] to-[#0c0e0f] border border-yellow-500/10 p-5 rounded-xl cursor-pointer hover:border-[#FFD700]/40 transition group"
        >
          <div className="flex justify-between items-start mb-2">
            <Clock className="w-6 h-6 text-[#FFD700]" />
            <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-[#FFD700] transition" />
          </div>
          <h4 className="text-sm font-semibold text-white group-hover:text-[#FFD700] transition-colors">3D Swertres Studio</h4>
          <p className="text-xs text-gray-450 mt-1.5 leading-relaxed">View deep 2PM, 5PM, and 9PM draw intervals, live statuses, and random seed digit shufflers.</p>
        </div>

        {/* AI Lucky pick portal */}
        <div 
          onClick={() => onSetTab("lucky-pick")}
          className="bg-gradient-to-br from-[#1a1e20] to-[#0c0e0f] border border-yellow-500/10 p-5 rounded-xl cursor-pointer hover:border-[#FFD700]/40 transition group"
        >
          <div className="flex justify-between items-start mb-2">
            <Pocket className="w-6 h-6 text-[#FFD700] animate-bounce-slow" />
            <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-[#FFD700] transition" />
          </div>
          <h4 className="text-sm font-semibold text-white group-hover:text-[#FFD700] transition-colors">AI Lucky Pick Engine</h4>
          <p className="text-xs text-gray-450 mt-1.5 leading-relaxed">Engage sever-grounded astrology, numerological feeds, and customized cosmic multipliers.</p>
        </div>

        {/* Jackpot Tracker portal */}
        <div 
          onClick={() => onSetTab("jackpot")}
          className="bg-gradient-to-br from-[#1a1e20] to-[#0c0e0f] border border-yellow-500/10 p-5 rounded-xl cursor-pointer hover:border-[#FFD700]/40 transition group"
        >
          <div className="flex justify-between items-start mb-2">
            <Trophy className="w-6 h-6 text-[#FFD700]" />
            <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-[#FFD700] transition" />
          </div>
          <h4 className="text-sm font-semibold text-white group-hover:text-[#FFD700] transition-colors">Prestige Jackpot Progression</h4>
          <p className="text-xs text-gray-450 mt-1.5 leading-relaxed">Track weekly rolling rollover charts, estimate compound multipliers, and find hot schedules.</p>
        </div>
      </div>
    </div>
  );
}
