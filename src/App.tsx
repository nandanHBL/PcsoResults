import React, { useState, useEffect } from "react";
import HomeView from "./components/HomeView";
import UltraLottoView from "./components/UltraLottoView";
import GrandLottoView from "./components/GrandLottoView";
import SwertresView from "./components/SwertresView";
import JackpotTrackerView from "./components/JackpotTrackerView";
import DrawScheduleView from "./components/DrawScheduleView";
import LuckyPickView from "./components/LuckyPickView";
import AdContainer from "./components/AdContainer";

import { 
  Trophy, Calendar, Clock, Sparkles, Smartphone, Menu, X, 
  Flame, CheckCircle, ChevronRight, Activity, Globe, Compass 
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Format current date to YYYY-MM-DD
  // Defaulting target static date to May 14, 2026 if it doesn't match real calendar day sequence
  const getInitialDateStr = () => {
    const today = new Date();
    // If the system year is 2026, we can use the exact date, otherwise default to target user date "2026-05-14"
    if (today.getFullYear() === 2026) {
      return today.toISOString().split("T")[0];
    }
    return "2026-05-14";
  };

  const [dateStr, setDateStr] = useState(getInitialDateStr());
  const [prevJackpots, setPrevJackpots] = useState<any>(null);

  // Sync dates cleanly
  useEffect(() => {
    // Inject PWA Service Worker gracefully
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then(
          (reg) => console.log("Lotto SW Registered: ", reg.scope),
          (err) => console.log("Lotto SW Registration Failed: ", err)
        );
      });
    }

    // Lazy load baseline jackpots for sidebar display
    async function loadJackpots() {
      try {
        const response = await fetch(`/api/jackpots?date=${dateStr}`);
        if (response.ok) {
          const data = await response.json();
          setPrevJackpots(data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadJackpots();
  }, [dateStr]);

  // Convert Date String to readable Philippines locale date format
  const formatReadableDate = (input: string) => {
    const d = new Date(input);
    if (isNaN(d.getTime())) return "May 14, 2026";
    return d.toLocaleDateString("en-PH", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const handleSetTab = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const menuItems = [
    { id: "home", label: "Home Base" },
    { id: "6/58", label: "Ultra 6/58" },
    { id: "6/55", label: "Grand 6/55" },
    { id: "swertres", label: "3D Swertres" },
    { id: "jackpot", label: "Jackpot Radar" },
    { id: "schedule", label: "Draw Schedule" },
    { id: "lucky-pick", label: "AI Lucky Pick" }
  ];

  return (
    <div className="min-h-screen bg-[#111415] text-white flex flex-col font-sans antialiased text-gray-200">
      
      {/* Dynamic Top Bar Alerts */}
      <div className="bg-[#FFD700] text-[#111415] text-[10px] md:text-xs py-1.5 px-4 text-center font-bold tracking-wider uppercase flex items-center justify-center gap-2">
        <Activity className="w-3.5 h-3.5 animate-pulse" />
        <span>PCSO Live Draw Broadcaster Active: 2PM • 5PM • 9PM PHT SYNCED</span>
      </div>

      {/* Main Luxury Header */}
      <header className="border-b border-[#FFD700]/10 bg-[#111415] sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#FFD700] flex items-center justify-center rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.3)] transform hover:rotate-12 transition">
              <span className="text-[#111415] font-black text-2xl font-sans">L</span>
            </div>
            <div>
              <h1 className="text-[#FFD700] text-lg font-black tracking-tight leading-none">LOTTO RESULTS PH</h1>
              <p className="text-[9px] text-gray-500 uppercase tracking-widest mt-1 font-mono">Premium Audited Live Hub</p>
            </div>
          </div>

          {/* Desktop Nav Actions */}
          <nav className="hidden lg:flex items-center gap-6">
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSetTab(item.id)}
                className={`text-xs font-bold uppercase tracking-wider transition-all duration-250 pb-1 cursor-pointer hover:text-[#FFD700] ${
                  activeTab === item.id 
                    ? "text-[#FFD700] border-b-2 border-[#FFD700]" 
                    : "text-gray-400"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Header Metadata Credentials & Date Controls */}
          <div className="hidden md:flex flex-col items-end gap-1 text-right">
            <div className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
              <span>Author:</span> <strong className="text-gray-300">Abhi C</strong>
            </div>
            
            <div className="flex items-center gap-2">
              <label htmlFor="draw-date-picker" className="sr-only">Choose Draw Date</label>
              <input
                id="draw-date-picker"
                type="date"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="bg-[#1a1e20] border border-gray-800 text-xs px-2 py-1 rounded text-yellow-500 font-mono outline-none focus:border-[#FFD700]"
                title="Select historical draw date"
              />
            </div>
          </div>

          {/* Mobile responsive triggers */}
          <div className="flex lg:hidden items-center gap-2">
            <input
              type="date"
              value={dateStr}
              aria-label="Target Date Selection"
              onChange={(e) => setDateStr(e.target.value)}
              className="bg-[#1a1e20] border border-gray-800 text-xs px-2 py-1.5 rounded text-yellow-500 font-mono outline-none"
            />
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-white rounded-lg border border-gray-800 cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile view responsive drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#161a1c] border-b border-gray-800 p-4 space-y-3 animate-fade-in">
          <div className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSetTab(item.id)}
                className={`w-full py-2.5 px-4 rounded-lg text-left text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === item.id 
                    ? "bg-[#FFD700]/10 text-[#FFD700] border-l-4 border-[#FFD700]" 
                    : "text-gray-300 hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          
          <div className="pt-3 border-t border-gray-800 flex justify-between items-center text-[10px] text-gray-500 font-mono px-2">
            <span>Author Credit: Abhi C</span>
            <span>May 14, 2026</span>
          </div>
        </div>
      )}

      {/* Main App Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full flex flex-col lg:flex-row gap-8">
        
        {/* Dynamic Nav Body content area */}
        <main className="flex-1 min-w-0 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-800/60 pb-4 gap-3">
            <div>
              <h2 className="text-2xl font-light text-white font-sans tracking-tight">
                {activeTab === "home" && "Dynamic Board Feed"}
                {activeTab === "6/58" && "Ultra Lotto 6/58 Portal"}
                {activeTab === "6/55" && "Grand Lotto 6/55 Portal"}
                {activeTab === "swertres" && "3D Swertres Studio"}
                {activeTab === "jackpot" && "Prestige Jackpot Tracker"}
                {activeTab === "schedule" && "Philippine PCSO Draw Schedule"}
                {activeTab === "lucky-pick" && "Astrological AI Lucky Numbers"}
              </h2>
              <p className="text-xs text-gray-450 font-mono mt-1">
                Target Date Filter: <span className="text-[#FFD700] font-semibold">{formatReadableDate(dateStr)}</span>
              </p>
            </div>
            
            <span className="flex items-center gap-1.5 text-[10px] font-mono bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-md text-[#FFD700] uppercase">
              <Globe className="w-3.5 h-3.5 animate-spin-slow" /> Manila Draw Center
            </span>
          </div>

          <div id="dynamic-viewport-container">
            {activeTab === "home" && <HomeView currentDateStr={dateStr} onSetTab={handleSetTab} />}
            {activeTab === "6/58" && <UltraLottoView currentDateStr={dateStr} />}
            {activeTab === "6/55" && <GrandLottoView currentDateStr={dateStr} />}
            {activeTab === "swertres" && <SwertresView currentDateStr={dateStr} />}
            {activeTab === "jackpot" && <JackpotTrackerView currentDateStr={dateStr} />}
            {activeTab === "schedule" && <DrawScheduleView currentDateStr={dateStr} />}
            {activeTab === "lucky-pick" && <LuckyPickView currentDateStr={dateStr} />}
          </div>
        </main>

        {/* Global Sidebar (Desktop Exclusive) */}
        <aside className="w-full lg:w-[325px] flex-shrink-0 space-y-6">
          
          {/* Quick AI Predictor Trigger Widget */}
          <div className="bg-gradient-to-br from-[#1a1e20] to-[#111415] border border-[#FFD700]/20 p-5 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#FFD700]/5 rounded-full blur-xl pointer-events-none"></div>
            
            <h3 className="text-xs font-bold text-[#FFD700] uppercase tracking-widest mb-2 font-mono flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FFD700] animate-bounce-slow" /> AI Lucky Pick Preview
            </h3>
            <p className="text-[11px] text-gray-450 leading-relaxed mb-4">
              Engage high-end neural astrological prediction modeling tailored precisely around May 2026 cosmic trends.
            </p>
            
            <button
              onClick={() => handleSetTab("lucky-pick")}
              className="w-full py-2.5 bg-[#FFD700] hover:brightness-110 active:scale-95 text-[#111415] font-black text-xs font-mono rounded-xl uppercase tracking-widest transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Instant AI Pick</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Rolling rollovers display board */}
          <div className="bg-[#131718] border border-gray-850 p-5 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest border-b border-gray-800 pb-2 flex items-center gap-1.5 font-sans">
              <Trophy className="w-4 h-4 text-yellow-500" /> Rollover Leaderboard
            </h3>

            <div className="space-y-3.5">
              {prevJackpots ? (
                Object.entries(prevJackpots).slice(0, 3).map(([key, item]: any) => (
                  <div key={key} className="flex justify-between items-center text-xs border-b border-gray-800/50 pb-2.5">
                    <div>
                      <span className="text-white font-semibold block">{item.game}</span>
                      <span className="text-[10px] text-yellow-500/80 font-mono">{item.schedule}</span>
                    </div>
                    
                    <span className="text-emerald-400 font-bold font-mono text-xs">
                      ₱{(item.jackpot / 1000000).toFixed(1)}M
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-[11px] text-gray-500 font-mono py-2">Syncing prize values...</div>
              )}
            </div>

            <button 
              onClick={() => handleSetTab("jackpot")}
              className="text-xs text-yellow-500 hover:text-[#FFD700] font-mono flex items-center gap-1 hover:underline mt-2 cursor-pointer"
            >
              <span>View details radar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sidebar 300x250 Ad Slot */}
          <AdContainer type="sidebar" id="sidebar-ad-slot-archive" />

        </aside>

      </div>

      {/* High-End Polished Footer info */}
      <footer className="bg-[#0b0c0d] border-t border-gray-850 py-6 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-800/50 pb-5 gap-4">
            
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 uppercase">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span>PWA Sandbox Enabled</span>
              </div>
              <span className="text-gray-700 hidden md:inline">|</span>
              <div className="flex items-center gap-1 text-[11px] font-mono text-sky-400 uppercase">
                <Smartphone className="w-4 h-4 text-sky-450" />
                <span>Optimized for Android 5G viewports</span>
              </div>
              <span className="text-gray-700 hidden md:inline">|</span>
              <span className="text-[11px] text-gray-500 font-mono uppercase">SECURE-v2.0-MAY2026</span>
            </div>

            <div className="text-xs font-mono text-gray-500">
              Platform Author: <strong className="text-white hover:text-[#FFD705] transition-colors">Abhi C</strong>
            </div>

          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 gap-3 text-center md:text-left">
            <p className="max-w-2xl leading-relaxed">
              Lotto Results PH is a premium multi-page analytical publication of historical sweepstakes calculations. All content is for informational and educational modeling use only. We are not representing the official PCSO Sweepstakes board.
            </p>
            <p className="uppercase tracking-widest hover:text-white transition-colors cursor-default select-none">
              &copy; 2026 Lotto Results PH • Midnight Gold Prestige
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
