import React, { useState } from "react";
import { Sparkles, ArrowUpRight, ShieldCheck, RefreshCw } from "lucide-react";

interface AdProps {
  type: "native" | "sidebar";
  id?: string;
}

export default function AdContainer({ type, id = "adsterra-placeholder" }: AdProps) {
  const [adTriggerCount, setAdTriggerCount] = useState(0);

  const nativeAds = [
    {
      title: "PRESTIGE LANDMARKS: Century Properties",
      description: "Own an elite luxury estate in Manila's golden district. Dynamic smart security & structural infinity pool.",
      tag: "ESTATE",
      cta: "Enquire Suite",
      benefit: "PWA Member Exclusive 10% Gold Rebate"
    },
    {
      title: "THE ROLEX OYSTER PRESTIGE COLLECTION",
      description: "Midnight gold chronometers engineered for absolute cosmic precision. Available at official Manila boutiques.",
      tag: "CHRONO",
      cta: "Explore Gallery",
      benefit: "Synchronized with May 14, 2026 PCSO Clock"
    },
    {
      title: "METRO 5G PREMIUM ANDROID POWERHOUSE",
      description: "Experience ultra-low latency 5G connectivity. Ideal structure for instant 2PM, 5PM, and 9PM Swertres alerts.",
      tag: "5G TECH",
      cta: "Order Now",
      benefit: "Optimized for Android 5G Mobile Viewports"
    }
  ];

  const currentAd = nativeAds[adTriggerCount % nativeAds.length];

  const rotateAd = () => {
    setAdTriggerCount((prev) => prev + 1);
  };

  if (type === "native") {
    return (
      <div 
        id={id}
        className="w-full min-h-[160px] bg-[#0d0f10] border border-yellow-600/10 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between relative overflow-hidden group hover:border-[#FFD700]/30 transition-all duration-300"
      >
        {/* Decorative corner accents for Midnight Gold Prestige theme */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#FFD700]/30"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#FFD700]/30"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#FFD700]/30"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#FFD700]/30"></div>

        {/* Ad Body */}
        <div className="flex-1 pr-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono tracking-widest text-gray-500 uppercase bg-gray-550/10 border border-gray-800 px-1.5 py-0.5 rounded text-white/50">
              ADVERTISEMENT
            </span>
            <span className="text-[10px] text-[#FFD700] font-sans font-medium tracking-wide flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#FFD700]" /> Sponsored Premium Partner
            </span>
          </div>
          
          <h3 className="text-sm font-semibold text-white group-hover:text-[#FFD700] transition-colors">
            {currentAd.title}
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed max-w-2xl">
            {currentAd.description}
          </p>
          <div className="text-[10px] text-gray-500 font-mono">
            {currentAd.benefit}
          </div>
        </div>

        {/* Ad CTA & Action Controls */}
        <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-2.5 mt-4 md:mt-0 w-full md:w-auto">
          <button
            onClick={() => window.open("https://pcso.gov.ph", "_blank")}
            className="px-4 py-2.5 bg-gradient-to-r from-[#FFD700] to-yellow-600 text-[#111415] font-bold text-xs rounded-lg hover:brightness-110 flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(255,215,0,0.15)] active:scale-95 cursor-pointer"
          >
            <span>{currentAd.cta}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          
          <button 
            type="button"
            onClick={rotateAd}
            className="text-[10px] text-gray-400 hover:text-white flex items-center justify-center gap-1 py-1 hover:underline cursor-pointer"
            title="Rotate to see another premium deal"
          >
            <RefreshCw className="w-3 h-3 text-yellow-600/80 animate-spin-slow" />
            <span>Next Premium Offer</span>
          </button>
        </div>
      </div>
    );
  }

  // Sidebar 300x250 fixed format slot
  return (
    <div 
      id={id}
      className="w-full h-[250px] bg-gradient-to-b from-[#161a1c] to-[#0c0e0f] border border-[#FFD700]/10 rounded-xl p-5 flex flex-col justify-between relative overflow-hidden group hover:border-[#FFD700]/30 transition-all duration-300"
    >
      <div className="absolute top-0 right-0 py-1 px-2.5 bg-yellow-600/10 border-l border-b border-yellow-600/10 text-[8px] font-mono tracking-wider text-[#FFD700]">
        ADSTERRA 300X250
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-1 text-[9px] text-[#FFD700]/60 font-mono uppercase tracking-wider">
          <ShieldCheck className="w-3 h-3 text-[#FFD700]" /> VERIFIED SECURE AD
        </div>
        
        <h4 className="text-xs font-bold text-white group-hover:text-[#FFD700] transition-all">
          Century Prestige Club: Sky Villas
        </h4>
        <p className="text-[11px] text-gray-400 leading-relaxed">
          Premium high-impact residency models available in Manila designed with modern luxury, and private secure terraces. Open for May 2026 scheduling.
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-gray-800/80 pt-3">
        <div className="text-[9px] text-gray-500 font-mono">
          Author Partner: Abhi C
        </div>
        <button
          onClick={() => window.open("https://pcso.gov.ph", "_blank")}
          className="px-3 py-1.5 bg-[#111415] border border-[#FFD700]/30 hover:border-[#FFD700] rounded-md text-[10px] text-[#FFD700] font-bold flex items-center gap-1 bg-yellow-600/5 hover:bg-yellow-600/10 cursor-pointer"
        >
          <span>Claim VIP Spot</span>
          <ArrowUpRight className="w-2.5 h-2.5" />
        </button>
      </div>
    </div>
  );
}
