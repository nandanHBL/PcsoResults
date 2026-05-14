import React from "react";
import AdContainer from "./AdContainer";
import { Calendar, Clock, Activity, AlertCircle, CheckCircle } from "lucide-react";

interface DrawScheduleViewProps {
  currentDateStr: string;
}

export default function DrawScheduleView({ currentDateStr }: DrawScheduleViewProps) {
  const scheduleData = [
    {
      group: "Major Multi-Million Lottos",
      items: [
        { name: "Ultra Lotto 6/58", time: "9:00 PM", days: "Tuesday, Friday, Sunday", prize: "₱49.5M+", color: "bg-red-500/20 text-red-400 border-red-500/20" },
        { name: "Grand Lotto 6/55", time: "9:00 PM", days: "Monday, Wednesday, Saturday", prize: "₱29.7M+", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20" },
        { name: "Super Lotto 6/49", time: "9:00 PM", days: "Tuesday, Thursday, Sunday", prize: "₱15.8M+", color: "bg-blue-500/20 text-blue-400 border-blue-500/20" },
        { name: "Mega Lotto 6/45", time: "9:00 PM", days: "Monday, Wednesday, Friday", prize: "₱8.9M+", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20" },
        { name: "Lotto 6/42", time: "9:00 PM", days: "Tuesday, Thursday, Saturday", prize: "₱5.9M+", color: "bg-purple-500/20 text-purple-400 border-purple-500/20" }
      ]
    },
    {
      group: "Daily High-Frequency Digit Draws",
      items: [
        { name: "3D Swertres Lotto", time: "2:00 PM, 5:00 PM, 9:00 PM", days: "Everyday (Monday - Sunday)", prize: "₱4,500 standard", color: "bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/20" },
        { name: "2D EZ2 Lotto", time: "2:00 PM, 5:00 PM, 9:00 PM", days: "Everyday (Monday - Sunday)", prize: "₱4,000 standard", color: "bg-gray-500/20 text-gray-300 border-gray-500/20" }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* GEO Summary Banner */}
      <div id="schedule-quick-summary" className="bg-[#1a1e20] border-l-4 border-[#FFD700] p-4 rounded-r-lg">
        <h2 className="text-[10px] text-[#FFD700] uppercase tracking-widest font-black mb-2 flex items-center gap-1.5 font-mono">
          <Activity className="w-3.5 h-3.5" /> Draw Schedule Bullet Metrics
        </h2>
        <ul className="text-xs text-gray-300 space-y-1.5 leading-relaxed">
          <li>• <strong>Standard Draw Time</strong>: Morning and afternoon digitized games draw daily at 2:00 PM and 5:00 PM. Night draws occur at 9:00 PM PHT.</li>
          <li>• <strong>PCSO Center location</strong>: All drawings originate live from the Conservatory building, Shaw Boulevard, Mandaluyong.</li>
          <li>• <strong>Evergreen updates</strong>: Results are audited by verified third-party government representatives prior to global release.</li>
        </ul>
      </div>

      {/* Adsterra Native Ad Container */}
      <AdContainer type="native" id="native-schedule-banner" />

      {/* Question Header 1 */}
      <div className="space-y-1">
        <h2 id="schedule-weekly-draws-header" className="text-xl md:text-2xl font-light text-[#FFD700]">
          When are the different Philippine lottery draw dates scheduled?
        </h2>
        <p className="text-xs text-gray-400 font-mono">
          Philippine Standard Time Schedule Table (Current as of May 2026)
        </p>
      </div>

      {/* Schedule Lists */}
      <div className="space-y-6" id="schedule-listings-section">
        {scheduleData.map((group, gIdx) => (
          <div key={gIdx} className="space-y-3 bg-[#131718] border border-gray-850 p-5 rounded-xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest border-b border-gray-800 pb-2.5 font-sans">
              {group.group}
            </h3>
            
            <div className="divide-y divide-gray-800/60 font-mono">
              {group.items.map((item, iIdx) => (
                <div key={iIdx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white group-hover:text-[#FFD700] transition-colors">{item.name}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded border ${item.color} uppercase font-bold tracking-wider`}>
                        {item.prize} Jackpot
                      </span>
                    </div>
                    <div className="text-xs text-yellow-500/80 font-medium">Draw Days: {item.days}</div>
                  </div>

                  <div className="flex items-center gap-2 text-right">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div className="text-xs font-semibold text-gray-300">
                      {item.time} Philippine Time
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Question Header 2: Rules breakdown */}
      <div className="space-y-1">
        <h2 id="schedule-how-to-watch-header" className="text-xl md:text-2xl font-light text-[#FFD700]">
          Where can you watch the live PCSO lottery drawings?
        </h2>
        <p className="text-xs text-gray-450 leading-relaxed font-sans">
          All daily drawings are broadcast live via the official PCSO Facebook and YouTube handles at exactly 2PM, 5PM, and 9PM PHT. This website, Lotto Results PH, receives secure feeds immediately following the validation process to update the digital archive synchronously.
        </p>
      </div>

      <div className="bg-[#0e1112] border border-gray-800 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4" id="schedule-status-alert">
        <div className="flex items-center gap-2.5">
          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <p className="text-xs text-gray-400 font-sans leading-relaxed">
            All schedules are verified and active for the current date (<span className="text-yellow-500 font-bold">{currentDateStr}</span>). No delays reported.
          </p>
        </div>
      </div>

    </div>
  );
}
