import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CATEGORIES = [
  { id: "general_knowledge", label: "General Knowledge", icon: "public", bg: "lightbulb", desc: "Broad spectrum of trivia and facts." },
  { id: "science", label: "Science & Nature", icon: "biotech", bg: "science", desc: "Physics, biology, and the cosmos." },
  { id: "film_and_tv", label: "Pop Culture", icon: "theaters", bg: "movie", desc: "Movies, music, and celebrity icons." },
  { id: "history", label: "World History", icon: "museum", bg: "history", desc: "Past civilizations and turning points." },
];

const DIFFICULTIES = [
  { value: "easy", label: "Easy", tag: "Beginner", tagColor: "text-[#a0fff0]" },
  { value: "medium", label: "Medium", tag: "Balanced", tagColor: "text-[#9da7ff]" },
  { value: "hard", label: "Hard", tag: "Expert", tagColor: "text-[#ff6e84]" },
];

export default function QuizHomePage() {
  const [category, setCategory] = useState("general_knowledge");
  const [difficulty, setDifficulty] = useState("medium");
  const [amount, setAmount] = useState(10);
  const navigate = useNavigate();

  const handleLaunch = () => {
    navigate("/quiz/play", { state: { config: { category, difficulty, amount } } });
  };

  return (
    <motion.div
      className="lg:ml-0 pt-28 pb-20 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <header className="mb-12">
        <span className="font-[Plus_Jakarta_Sans] text-xs uppercase tracking-[0.2em] text-[#acaab2] mb-2 block">
          Level Up Your Mind
        </span>
        <h1 className="font-[Plus_Jakarta_Sans] text-5xl md:text-6xl font-extrabold tracking-tighter text-[#edeaf2] mb-4">
          Start Quiz
        </h1>
        <p className="text-[#acaab2] max-w-xl text-lg">
          Select your parameters and jump into an immersive educational experience.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Category Selection */}
        <section className="lg:col-span-8 space-y-6">
          <h2 className="font-[Plus_Jakarta_Sans] text-xl font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[#9da7ff]">category</span>
            Choose Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CATEGORIES.map(({ id, label, icon, bg, desc }) => (
              <button
                key={id}
                onClick={() => setCategory(id)}
                className={`group relative flex flex-col items-start p-6 rounded-xl transition-all duration-300 overflow-hidden text-left ${
                  category === id
                    ? "bg-[#1f1f27] ring-2 ring-[#9da7ff]"
                    : "bg-[#191920] hover:bg-[#1f1f27]"
                }`}
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-6xl">{bg}</span>
                </div>
                <span className={`material-symbols-outlined mb-4 transition-colors ${category === id ? "text-[#9da7ff]" : "text-[#acaab2] group-hover:text-[#9da7ff]"}`}>
                  {icon}
                </span>
                <h3 className="font-[Plus_Jakarta_Sans] font-bold text-lg mb-1">{label}</h3>
                <p className="text-sm text-[#acaab2]">{desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Settings */}
        <section className="lg:col-span-4 space-y-8">
          {/* Difficulty */}
          <div className="space-y-4">
            <h2 className="font-[Plus_Jakarta_Sans] text-xl font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[#bc87fe]">speed</span>
              Difficulty
            </h2>
            <div className="flex flex-col gap-3">
              {DIFFICULTIES.map(({ value, label, tag, tagColor }) => (
                <label
                  key={value}
                  className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors ${
                    difficulty === value
                      ? "bg-[#191920] ring-1 ring-[#9da7ff]/30"
                      : "bg-[#131319] hover:bg-[#191920]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="difficulty"
                      value={value}
                      checked={difficulty === value}
                      onChange={() => setDifficulty(value)}
                      className="w-5 h-5 accent-[#9da7ff]"
                    />
                    <span className="font-medium text-[#edeaf2]">{label}</span>
                  </div>
                  <span className={`text-xs font-[Plus_Jakarta_Sans] font-bold uppercase ${tagColor}`}>{tag}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Length */}
          <div className="space-y-4">
            <h2 className="font-[Plus_Jakarta_Sans] text-xl font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[#a0fff0]">numbers</span>
              Length
            </h2>
            <div className="flex gap-4">
              {[5, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => setAmount(n)}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                    amount === n
                      ? "bg-[#9da7ff] text-[#001597] shadow-[0_4px_20px_rgba(157,167,255,0.3)]"
                      : "bg-[#191920] hover:bg-[#1f1f27] text-[#edeaf2] border border-transparent hover:border-[#9da7ff]/20"
                  }`}
                >
                  {n} Questions
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="pt-4">
            <button
              onClick={handleLaunch}
              className="w-full bg-gradient-to-br from-[#9da7ff] to-[#8c98ff] text-[#001597] py-5 rounded-full font-[Plus_Jakarta_Sans] font-extrabold text-lg flex items-center justify-center gap-3 shadow-[0_12px_48px_rgba(157,167,255,0.25)] hover:scale-[1.03] active:scale-95 transition-all"
            >
              Launch Quiz
              <span className="material-symbols-outlined">rocket_launch</span>
            </button>
            <p className="text-center text-xs text-[#acaab2] mt-4 font-[Plus_Jakarta_Sans] uppercase tracking-widest">
              Est. Time: {amount < 10 ? "4" : "8"} Minutes
            </p>
          </div>
        </section>
      </div>

      {/* Weekly Challenge Banner */}
      <section className="mt-20">
        <div className="rounded-3xl p-8 bg-[#131319] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#9da7ff]/5 rounded-full blur-[100px] -mr-32 -mt-32" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <h3 className="font-[Plus_Jakarta_Sans] text-2xl font-bold mb-2">Weekly Challenge</h3>
              <p className="text-[#acaab2] mb-6 md:mb-0">
                Participate in the "Quantum Physics" quiz and earn double XP all week.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-black text-[#a0fff0]">2.4k</p>
                <p className="text-[10px] uppercase tracking-widest text-[#acaab2] font-[Plus_Jakarta_Sans]">Participants</p>
              </div>
              <div className="w-px h-10 bg-[#48474e]/30" />
              <div className="text-center">
                <p className="text-3xl font-black text-[#bc87fe]">500</p>
                <p className="text-[10px] uppercase tracking-widest text-[#acaab2] font-[Plus_Jakarta_Sans]">Bonus XP</p>
              </div>
              <button className="ml-4 px-6 py-3 bg-[#25252e] text-[#9da7ff] rounded-full font-bold hover:bg-[#2b2b35] transition-colors">
                View Details
              </button>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
