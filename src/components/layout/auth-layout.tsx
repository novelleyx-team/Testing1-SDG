"use client";

import { Globe2, Target, Users, Wheat, Heart, BookOpen, Scale, Droplet, Zap, TrendingUp, Building2, Equal, Home, Recycle, CloudRain, Fish, TreePine, ShieldCheck, Handshake, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  // SDG Colors standard palette for the 17 goals
  const sdgs = [
    { name: "No Poverty", color: "#E5243B", icon: Users },
    { name: "Zero Hunger", color: "#DDA63A", icon: Wheat },
    { name: "Good Health and Well-being", color: "#4C9F38", icon: Heart },
    { name: "Quality Education", color: "#C5192D", icon: BookOpen },
    { name: "Gender Equality", color: "#FF3A21", icon: Scale },
    { name: "Clean Water and Sanitation", color: "#26BDE2", icon: Droplet },
    { name: "Affordable and Clean Energy", color: "#FCC30B", icon: Zap },
    { name: "Decent Work & Economic Growth", color: "#A21942", icon: TrendingUp },
    { name: "Industry, Innovation & Infrastructure", color: "#FD6925", icon: Building2 },
    { name: "Reduced Inequality", color: "#DD1367", icon: Equal },
    { name: "Sustainable Cities and Communities", color: "#FD9D24", icon: Home },
    { name: "Responsible Consumption", color: "#BF8B2E", icon: Recycle },
    { name: "Climate Action", color: "#3F7E44", icon: CloudRain },
    { name: "Life Below Water", color: "#0A97D9", icon: Fish },
    { name: "Life on Land", color: "#56C02B", icon: TreePine },
    { name: "Peace, Justice & Strong Institutions", color: "#00689D", icon: ShieldCheck },
    { name: "Partnerships for the Goals", color: "#19486A", icon: Handshake }
  ];

  return (
    <div className="h-[100dvh] w-full overflow-hidden flex font-sans bg-gradient-to-br from-blue-50 via-white to-sky-100">
      {/* Left Pane - Branding & SDGs (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-transparent text-gray-900 flex-col p-8 xl:p-12 relative overflow-hidden">
        {/* Abstract background effect */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-[#2563EB] opacity-10 blur-[120px]"></div>
        
        <div className="relative z-10 shrink-0">
          <div className="flex items-center gap-3 mb-6 xl:mb-10">
            <div className="w-10 h-10 rounded-[10px] bg-[#2563EB] flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Globe2 className="text-white h-6 w-6" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight">NOVELLEYX</span>
          </div>

          <div className="w-full xl:max-w-2xl">
            {/* UN-Style SDG Logo Recreation */}
            <div className="flex flex-col mb-8 xl:mb-10 select-none">
              <div className="flex items-center gap-2 xl:gap-3">
                <Globe2 className="w-12 h-12 xl:w-16 xl:h-16 text-[#26BDE2] shrink-0" strokeWidth={1.5} />
                <div className="flex flex-col">
                  <span className="text-[26px] xl:text-[36px] font-black text-[#0F172A] tracking-wide leading-none">
                    SUSTAINABLE
                  </span>
                  <span className="text-[26px] xl:text-[36px] font-black text-[#0F172A] tracking-wide leading-none mt-1">
                    DEVELOPMENT
                  </span>
                </div>
              </div>
              <div className="flex items-center mt-2 xl:mt-3">
                <span className="text-[60px] xl:text-[84px] font-black text-[#0F172A] leading-none tracking-widest">
                  G
                </span>
                {/* CSS Conic-Gradient Color Wheel for the 'O' */}
                <div 
                  className="w-[50px] h-[50px] xl:w-[70px] xl:h-[70px] rounded-full mx-1 relative flex items-center justify-center shrink-0 shadow-lg"
                  style={{
                    background: `conic-gradient(
                      #E5243B 0deg 21.17deg, #DDA63A 21.17deg 42.35deg, #4C9F38 42.35deg 63.52deg, 
                      #C5192D 63.52deg 84.7deg, #FF3A21 84.7deg 105.88deg, #26BDE2 105.88deg 127.05deg, 
                      #FCC30B 127.05deg 148.23deg, #A21942 148.23deg 169.41deg, #FD6925 169.41deg 190.58deg, 
                      #DD1367 190.58deg 211.76deg, #FD9D24 211.76deg 232.94deg, #BF8B2E 232.94deg 254.11deg, 
                      #3F7E44 254.11deg 275.29deg, #0A97D9 275.29deg 296.47deg, #56C02B 296.47deg 317.64deg, 
                      #00689D 317.64deg 338.82deg, #19486A 338.82deg 360deg
                    )`
                  }}
                >
                  <div className="w-[60%] h-[60%] bg-white/90 rounded-full shadow-inner"></div>
                </div>
                <span className="text-[60px] xl:text-[84px] font-black text-[#0F172A] leading-none tracking-widest">
                  ALS
                </span>
              </div>
            </div>
            <h1 className="text-3xl xl:text-4xl font-bold leading-tight mb-3 text-gray-900">
              Empowering Academic Impact
            </h1>
            <p className="text-slate-600 text-base xl:text-lg leading-relaxed mb-6 xl:mb-8 pr-4">
              The premier AI-assisted platform aligning institutional research and student projects with the 17 UN Sustainable Development Goals.
            </p>
          </div>
        </div>

        {/* SDG Grid Display */}
        <div className="relative z-10 w-full flex-1 min-h-0 flex flex-col">
          <div className="flex items-center gap-3 mb-4 shrink-0">
            <Target className="w-5 h-5 xl:w-6 xl:h-6 text-[#2563EB]" />
            <span className="text-[15px] xl:text-[17px] font-extrabold text-gray-800 uppercase tracking-widest leading-none">
              THE 17 SUSTAINABLE DEVELOPMENT GOALS (SDG)
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 flex-1 overflow-y-auto pr-2 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {sdgs.map((sdg, index) => {
              const Icon = sdg.icon;
              return (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-white/60 border border-blue-100/50 hover:bg-white transition-colors shadow-sm"
                >
                  <div 
                    className="w-9 h-9 shrink-0 rounded-[6px] flex items-center justify-center text-white shadow-sm"
                    style={{ backgroundColor: sdg.color }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">GOAL {index + 1}</span>
                    <span className="text-xs font-semibold text-slate-700 leading-tight">{sdg.name}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="flex flex-1 flex-col px-4 sm:px-6 py-12 lg:px-8 bg-transparent relative overflow-y-auto">
        <div className="flex-1 flex flex-col justify-center min-h-full pt-16 sm:pt-0">
        <Link 
          href="/" 
          className="absolute top-6 left-6 sm:top-8 sm:left-12 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors group z-20"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm group-hover:bg-gray-50 transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span className="hidden sm:inline">Back to Home</span>
        </Link>
          <div className="w-full max-w-[420px] mx-auto">
          {/* Mobile logo (visible only on small screens) */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="w-10 h-10 rounded-[10px] bg-[#2563EB] flex items-center justify-center shadow-md mb-3">
              <Globe2 className="text-white h-6 w-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">NOVELLEYX</h2>
            <p className="text-sm text-gray-500 mt-1">SDG AI Assistance Platform</p>
          </div>
          
          <div className="bg-white py-10 px-4 sm:px-10 shadow-sm rounded-2xl border border-gray-100 w-full">
            {children}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
