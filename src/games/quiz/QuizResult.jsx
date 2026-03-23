import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function QuizResult({ score: scoreProp, total: totalProp, onRestart }) {
  const location = useLocation();
  const navigate = useNavigate();
  const score = scoreProp ?? location.state?.score ?? 0;
  const total = totalProp ?? location.state?.total ?? 0;
  const percentage = total ? Math.round((score / total) * 100) : 0;
  const xp = score * 50;

  const getMessage = () => {
    if (percentage >= 80) return "Great Job!";
    if (percentage >= 50) return "Good Effort!";
    return "Keep Practicing!";
  };

  const handleRestart = () => {
    if (typeof onRestart === "function") { onRestart(); return; }
    navigate("/", { replace: true });
  };

  // conic-gradient percentage for circular progress
  const conicStyle = {
    background: `radial-gradient(closest-side, #191920 79%, transparent 80% 100%), conic-gradient(#bc87fe ${percentage}%, #25252e 0)`,
  };

  return (
    <motion.div
      className="pt-28 pb-24 px-6 md:px-24 max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center space-y-12 py-12">
        {/* Background glows */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#9da7ff]/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-[#bc87fe]/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-[#a0fff0]/10 rounded-full blur-[100px]" />
        </div>

        <div className="space-y-4">
          <h1 className="font-[Plus_Jakarta_Sans] text-5xl md:text-7xl font-extrabold tracking-tight text-[#edeaf2]">
            {getMessage()}
          </h1>
          <p className="font-[Plus_Jakarta_Sans] text-xl text-[#acaab2] uppercase tracking-widest font-semibold">
            You've mastered this quest
          </p>
        </div>

        {/* Stats bento */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-5xl">
          {/* Time stat */}
          <div className="bg-[#131319] rounded-2xl p-8 flex flex-col items-center justify-center space-y-2 shadow-[0_8px_40px_rgba(157,167,255,0.06)]">
            <span className="material-symbols-outlined text-[#a0fff0] text-4xl">timer</span>
            <span className="text-3xl font-[Plus_Jakarta_Sans] font-bold">{score}/{total}</span>
            <span className="text-[#acaab2] text-sm uppercase tracking-wider">Correct Answers</span>
          </div>

          {/* Circular score */}
          <div className="bg-[#191920] rounded-2xl p-12 flex flex-col items-center justify-center space-y-8 shadow-[0_8px_40px_rgba(157,167,255,0.06)] ring-1 ring-[#48474e]/15 scale-105 z-10">
            <div
              className="w-48 h-48 rounded-full flex items-center justify-center"
              style={conicStyle}
            >
              <div className="flex flex-col items-center justify-center">
                <span className="text-6xl font-[Plus_Jakarta_Sans] font-black bg-gradient-to-br from-[#9da7ff] to-[#bc87fe] bg-clip-text text-transparent">
                  {percentage}%
                </span>
                <span className="text-[#acaab2] font-bold text-xl">{score}/{total}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 px-6 py-2 bg-[#2b2b35] rounded-full">
              <span className="material-symbols-outlined text-[#a0fff0]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
              <span className="font-[Plus_Jakarta_Sans] font-bold text-[#edeaf2]">+{xp} XP</span>
            </div>
          </div>

          {/* Streak stat */}
          <div className="bg-[#131319] rounded-2xl p-8 flex flex-col items-center justify-center space-y-2 shadow-[0_8px_40px_rgba(157,167,255,0.06)]">
            <span className="material-symbols-outlined text-[#bc87fe] text-4xl">bolt</span>
            <span className="text-3xl font-[Plus_Jakarta_Sans] font-bold">{percentage >= 80 ? "Perfect!" : percentage >= 50 ? "Good" : "Try Again"}</span>
            <span className="text-[#acaab2] text-sm uppercase tracking-wider">Performance</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-md justify-center">
          <button
            onClick={handleRestart}
            className="flex-1 bg-gradient-to-br from-[#9da7ff] to-[#8c98ff] text-[#001597] px-8 py-5 rounded-full font-[Plus_Jakarta_Sans] font-bold text-lg hover:shadow-[0_0_20px_rgba(157,167,255,0.4)] transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined">replay</span>
            Play Again
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-[#25252e] text-[#9da7ff] px-8 py-5 rounded-full font-[Plus_Jakarta_Sans] font-bold text-lg hover:bg-[#2b2b35] transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined">grid_view</span>
            Back to Hub
          </button>
        </div>
      </section>

      {/* Performance breakdown */}
      <section className="mt-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8 bg-[#131319] rounded-2xl p-8 ring-1 ring-[#48474e]/15">
            <h2 className="font-[Plus_Jakarta_Sans] text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#9da7ff]">insights</span>
              Performance Breakdown
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#1f1f27] rounded-full flex items-center justify-center text-[#9da7ff] font-bold">01</div>
                  <div>
                    <p className="font-bold">Correct Answers</p>
                    <p className="text-sm text-[#acaab2]">{score}/{total} Correct</p>
                  </div>
                </div>
                <div className="w-32 h-2 bg-[#25252e] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#bc87fe] to-[#a0fff0]" style={{ width: `${percentage}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#1f1f27] rounded-full flex items-center justify-center text-[#9da7ff] font-bold">02</div>
                  <div>
                    <p className="font-bold">Wrong Answers</p>
                    <p className="text-sm text-[#acaab2]">{total - score}/{total} Incorrect</p>
                  </div>
                </div>
                <div className="w-32 h-2 bg-[#25252e] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#ff6e84] to-[#d73357]" style={{ width: `${100 - percentage}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 bg-gradient-to-br from-[#191920] to-[#1f1f27] rounded-2xl p-8 ring-1 ring-[#48474e]/15 flex flex-col justify-between">
            <div>
              <h3 className="font-[Plus_Jakarta_Sans] text-xl font-bold mb-2">Next Rank Up</h3>
              <p className="text-[#acaab2] text-sm mb-6">Keep playing to earn more XP and unlock new levels.</p>
            </div>
            <div className="flex -space-x-3 mb-6">
              {[
                { icon: "shield", color: "text-[#9da7ff]" },
                { icon: "auto_awesome", color: "text-[#bc87fe]" },
                { icon: "military_tech", color: "text-[#a0fff0]" },
              ].map(({ icon, color }) => (
                <div key={icon} className="w-10 h-10 rounded-full border-2 border-[#0e0e14] bg-[#25252e] flex items-center justify-center">
                  <span className={`material-symbols-outlined text-xs ${color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/")}
              className="text-[#9da7ff] font-bold text-sm uppercase tracking-widest hover:underline decoration-[#bc87fe] transition-all flex items-center gap-2"
            >
              Play More Quizzes
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
