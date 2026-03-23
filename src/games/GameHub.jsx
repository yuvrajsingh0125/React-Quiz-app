import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const UPCOMING = [
  { icon: "psychology", color: "text-[#9da7ff]", title: "Mental Lab", desc: "Complex logic puzzles and spatial reasoning challenges.", level: 50 },
  { icon: "language", color: "text-[#bc87fe]", title: "Linguist Arena", desc: "Master global dialects through competitive scenarios.", level: 65 },
  { icon: "function", color: "text-[#a0fff0]", title: "Code Breaker", desc: "A high-stakes cybersecurity simulation.", level: 80 },
];

export default function GameHub() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero */}
      <header className="mb-16">
        <span className="text-[#bc87fe] font-[Plus_Jakarta_Sans] text-xs uppercase tracking-widest font-bold">
          The Ethereal Arcade
        </span>
        <h1 className="text-5xl md:text-7xl font-[Plus_Jakarta_Sans] font-extrabold tracking-tight text-[#edeaf2] mt-2">
          Game Hub
        </h1>
        <p className="text-[#acaab2] text-lg max-w-2xl mt-4 leading-relaxed">
          Elevate your knowledge through immersive experiences. Choose a quest below and start your journey to mastery.
        </p>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Featured Quiz Card */}
        <div className="md:col-span-8 group relative overflow-hidden rounded-2xl bg-[#191920] border border-[#48474e]/10 hover:border-[#9da7ff]/20 transition-all duration-500 hover:scale-[1.01]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#9da7ff]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-col md:flex-row h-full">
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-between relative z-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#a0fff0]/10 text-[#a0fff0] text-xs font-bold mb-6">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  FEATURED EXPERIENCE
                </div>
                <h2 className="text-3xl md:text-4xl font-[Plus_Jakarta_Sans] font-bold text-[#edeaf2] mb-4">Quiz Game</h2>
                <p className="text-[#acaab2] leading-relaxed mb-8">
                  Challenge your intellect with adaptive learning modules designed to stimulate memory and critical thinking.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/quiz/home")}
                  className="bg-gradient-to-br from-[#9da7ff] to-[#8c98ff] text-[#001597] font-bold px-8 py-4 rounded-full flex items-center gap-2 group/btn transition-all duration-300 hover:shadow-[0_0_20px_rgba(157,167,255,0.4)]"
                >
                  Start Quiz
                  <span className="material-symbols-outlined group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                </button>
                <span className="text-[#acaab2] text-sm font-medium">4.2k Active Players</span>
              </div>
            </div>
            <div className="md:w-1/2 h-64 md:h-auto relative bg-gradient-to-br from-[#9da7ff]/20 via-[#bc87fe]/10 to-[#a0fff0]/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#9da7ff]/30" style={{ fontSize: "10rem" }}>quiz</span>
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#191920] hidden md:block" />
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <div className="md:col-span-4 rounded-2xl bg-[#1f1f27] p-8 flex flex-col justify-between border border-[#48474e]/5">
          <div>
            <h3 className="font-[Plus_Jakarta_Sans] font-bold text-xl mb-6">Your Progress</h3>
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-bold font-[Plus_Jakarta_Sans] uppercase text-[#acaab2] tracking-wider">
                  <span>Level 42 Mage</span>
                  <span>85%</span>
                </div>
                <div className="h-2 w-full bg-[#25252e] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#bc87fe] to-[#a0fff0] w-[85%] rounded-full shadow-[0_0_10px_rgba(188,135,254,0.3)]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-[#191920] flex flex-col gap-1">
                  <span className="text-[#9da7ff] text-2xl font-bold">1,240</span>
                  <span className="text-[10px] uppercase font-bold text-[#acaab2]">Total XP</span>
                </div>
                <div className="p-4 rounded-xl bg-[#191920] flex flex-col gap-1">
                  <span className="text-[#a0fff0] text-2xl font-bold">12</span>
                  <span className="text-[10px] uppercase font-bold text-[#acaab2]">Streak</span>
                </div>
              </div>
            </div>
          </div>
          <button className="w-full mt-8 py-3 rounded-full bg-[#25252e] text-[#9da7ff] font-bold text-sm hover:bg-[#2b2b35] transition-colors">
            View Leaderboard
          </button>
        </div>

        {/* Upcoming Missions */}
        <div className="md:col-span-12 mt-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-[Plus_Jakarta_Sans] font-bold">Upcoming Missions</h3>
            <div className="h-px flex-grow mx-8 bg-[#25252e]" />
            <span className="text-[#acaab2] text-xs font-bold uppercase tracking-widest">3 LOCKED</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {UPCOMING.map(({ icon, color, title, desc, level }) => (
              <div key={title} className="group relative rounded-2xl bg-[#131319] border border-[#48474e]/10 p-6 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                <div className="flex justify-between items-start mb-12">
                  <div className="w-12 h-12 rounded-xl bg-[#1f1f27] flex items-center justify-center">
                    <span className={`material-symbols-outlined text-3xl ${color}`}>{icon}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#25252e] text-[10px] font-bold text-[#acaab2]">COMING SOON</span>
                </div>
                <h4 className="text-xl font-bold mb-2">{title}</h4>
                <p className="text-[#acaab2] text-sm line-clamp-2">{desc}</p>
                <div className="mt-8 pt-6 border-t border-[#48474e]/5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#acaab2]">
                    <span className="material-symbols-outlined text-sm">lock</span>
                    Unlocks at Level {level}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
