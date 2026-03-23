import React, { useState, useEffect, useMemo } from "react";
import Spinner from "../../components/Spinner";
import { motion, AnimatePresence } from "framer-motion";
import { account, databases } from "../../services/appwrite.jsx";
import { ID } from "appwrite";
import { useLocation, useNavigate } from "react-router-dom";

const questionCache = new Map();

const normalizeConfig = (config = {}) => ({
  amount: Math.min(config.amount || 10, 50),
  category: config.category || "",
  difficulty: config.difficulty || "",
});

const buildConfigKey = (config = {}) => JSON.stringify(normalizeConfig(config));

const fetchQuestionsForConfig = async (config) => {
  const normalized = normalizeConfig(config);
  const key = JSON.stringify(normalized);
  const cached = questionCache.get(key);
  if (cached?.data) return cached.data;
  if (cached?.promise) return cached.promise;

  let url = `https://the-trivia-api.com/api/questions?limit=${normalized.amount}&category=${normalized.category}`;
  if (normalized.difficulty) url += `&difficulty=${normalized.difficulty}`;

  const promise = fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      return res.json();
    })
    .then((data) =>
      data.map((q) => ({
        question: q.question,
        options: [...q.incorrectAnswers, q.correctAnswer].sort(() => Math.random() - 0.5),
        answer: q.correctAnswer,
        category: q.category,
      }))
    )
    .then((formatted) => {
      questionCache.set(key, { data: formatted });
      return formatted;
    })
    .catch((err) => {
      questionCache.delete(key);
      throw err;
    });

  questionCache.set(key, { promise });
  return promise;
};

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function QuizPlay({ config: configProp, onRestart }) {
  const location = useLocation();
  const navigate = useNavigate();
  const resolvedConfig = configProp ?? location.state?.config ?? null;

  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    if (!resolvedConfig) navigate("/", { replace: true });
  }, [resolvedConfig, navigate]);

  const configKey = useMemo(() => {
    if (!resolvedConfig) return null;
    return buildConfigKey(resolvedConfig);
  }, [resolvedConfig?.amount, resolvedConfig?.category, resolvedConfig?.difficulty]);

  useEffect(() => {
    if (!configKey || !resolvedConfig) return;
    let cancelled = false;
    setQuestions([]); setIndex(0); setScore(0); setSelected(null); setTimeLeft(15);

    fetchQuestionsForConfig(resolvedConfig)
      .then((formatted) => { if (!cancelled) setQuestions(formatted); })
      .catch((err) => { if (!cancelled) console.error("Error fetching questions:", err); });

    return () => { cancelled = true; };
  }, [configKey]);

  useEffect(() => {
    if (!questions.length) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) { handleNext(); return 15; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [index, questions]);

  const handleSelect = (option) => {
    if (selected !== null) return;
    setSelected(option);
    if (option === questions[index].answer) setScore((prev) => prev + 1);
  };

  const handleNext = () => {
    const nextScore = selected === questions[index]?.answer ? score : score;
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setSelected(null);
      setTimeLeft(15);
    } else {
      saveScore(nextScore);
      navigate("/quiz/result", { state: { score, total: questions.length } });
    }
  };

  const saveScore = async (finalScore) => {
    if (!resolvedConfig) return;
    try {
      const user = await account.get();
      await databases.createDocument("quizAppDB", "score", ID.unique(), {
        userId: user.$id,
        score: finalScore,
        category: resolvedConfig.category,
        difficulty: resolvedConfig.difficulty,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  if (!questions.length) return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner />
    </div>
  );

  const q = questions[index];
  const isAnswered = selected !== null;
  const progress = ((index) / questions.length) * 100;
  const timerDanger = timeLeft <= 5;

  return (
    <motion.div
      className="pt-28 pb-24 px-6 max-w-5xl mx-auto w-full"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex flex-col gap-8 mb-12">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-[#acaab2] font-[Plus_Jakarta_Sans] text-xs uppercase tracking-widest">
              {q.category || resolvedConfig?.category?.replace(/_/g, " ")} • {resolvedConfig?.difficulty}
            </span>
            <h1 className="text-3xl font-[Plus_Jakarta_Sans] font-extrabold tracking-tight">
              Question {index + 1}
              <span className="text-[#4e62ff]/60 font-medium">/{questions.length}</span>
            </h1>
          </div>
          <div className="flex gap-4 items-center">
            <div className="bg-[#131319] px-6 py-3 rounded-full flex items-center gap-3">
              <span className="material-symbols-outlined text-[#a0fff0]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
              <span className="font-[Plus_Jakarta_Sans] font-bold text-lg">{score * 100}</span>
            </div>
            <div className={`px-6 py-3 rounded-full flex items-center gap-3 border ${timerDanger ? "bg-[#a70138]/20 border-[#ff6e84]/30" : "bg-[#1f1f27] border-[#48474e]/10"}`}>
              <span className={`material-symbols-outlined ${timerDanger ? "text-[#ff6e84]" : "text-[#ff6e84]"}`}>timer</span>
              <span className={`font-[Plus_Jakarta_Sans] font-mono font-bold text-lg ${timerDanger ? "text-[#ff6e84]" : ""}`}>
                00:{String(timeLeft).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="relative w-full h-3 bg-[#25252e] rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#bc87fe] to-[#a0fff0] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={q.question}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="bg-[#191920] p-10 md:p-12 rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.4)] relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#9da7ff]/10 blur-[100px] rounded-full" />
            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 bg-[#1f1f27] rounded-2xl flex items-center justify-center text-[#9da7ff]">
                <span className="material-symbols-outlined text-4xl">quiz</span>
              </div>
              <h2
                className="text-3xl md:text-4xl font-[Plus_Jakarta_Sans] font-bold leading-tight max-w-3xl"
                dangerouslySetInnerHTML={{ __html: q.question }}
              />
              <div className="flex gap-2 flex-wrap justify-center">
                <span className="px-4 py-1.5 bg-[#25252e] text-[#acaab2] rounded-full text-xs font-bold uppercase tracking-wider">
                  {resolvedConfig?.category?.replace(/_/g, " ")}
                </span>
                <span className="px-4 py-1.5 bg-[#25252e] text-[#acaab2] rounded-full text-xs font-bold uppercase tracking-wider">
                  100 XP
                </span>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {q.options.map((opt, i) => {
              const isSelected = selected === opt;
              const isCorrect = opt === q.answer;
              const showCorrect = isAnswered && isCorrect;
              const showWrong = isAnswered && isSelected && !isCorrect;

              return (
                <button
                  key={i}
                  disabled={isAnswered}
                  onClick={() => handleSelect(opt)}
                  className={`group relative flex items-center p-6 rounded-xl transition-all duration-300 text-left overflow-hidden
                    ${!isAnswered ? "bg-[#131319] hover:bg-[#2b2b35] hover:scale-[1.02] active:scale-95" : ""}
                    ${showCorrect ? "bg-[#131319] ring-2 ring-[#a0fff0]/50 shadow-[0_0_40px_rgba(160,255,240,0.15)] scale-[1.02]" : ""}
                    ${showWrong ? "bg-[#131319] ring-2 ring-[#ff6e84]/50 opacity-80" : ""}
                    ${isAnswered && !isSelected && !isCorrect ? "opacity-50" : ""}
                  `}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-[Plus_Jakarta_Sans] font-bold mr-6 flex-shrink-0 transition-colors
                    ${showCorrect ? "bg-[#a0fff0] text-[#00645a]" : ""}
                    ${showWrong ? "bg-[#ff6e84] text-[#490013]" : ""}
                    ${!isAnswered ? "bg-[#1f1f27] text-[#acaab2] group-hover:bg-[#9da7ff] group-hover:text-[#001597]" : ""}
                    ${isAnswered && !isSelected && !isCorrect ? "bg-[#1f1f27] text-[#acaab2]" : ""}
                  `}>
                    {showCorrect ? <span className="material-symbols-outlined">check</span>
                      : showWrong ? <span className="material-symbols-outlined">close</span>
                      : OPTION_LABELS[i]}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-xl font-[Plus_Jakarta_Sans] font-semibold ${showCorrect ? "text-[#a0fff0] font-bold" : ""} ${showWrong ? "text-[#ff6e84] font-bold" : ""}`}
                      dangerouslySetInnerHTML={{ __html: opt }}
                    />
                    {showCorrect && <span className="text-xs font-[Plus_Jakarta_Sans] uppercase tracking-widest text-[#a0fff0]/60">Correct Answer</span>}
                    {showWrong && <span className="text-xs font-[Plus_Jakarta_Sans] uppercase tracking-widest text-[#ff6e84]/60">Selected Wrong</span>}
                  </div>
                  {showCorrect && <div className="absolute inset-0 bg-[#a0fff0]/5" />}
                  {showWrong && <div className="absolute inset-0 bg-[#ff6e84]/5" />}
                  {!isAnswered && <div className="absolute inset-0 bg-[#9da7ff]/5 opacity-0 group-hover:opacity-100 transition-opacity" />}
                </button>
              );
            })}
          </div>

          {/* Footer actions */}
          <div className="mt-12 flex justify-between items-center border-t border-[#48474e]/10 pt-8">
            <button className="flex items-center gap-2 text-[#acaab2] hover:text-[#edeaf2] transition-colors font-[Plus_Jakarta_Sans] font-bold uppercase text-sm tracking-widest">
              <span className="material-symbols-outlined">flag</span>
              Report Issue
            </button>
            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className="px-10 py-4 bg-gradient-to-br from-[#9da7ff] to-[#8c98ff] text-[#001597] rounded-full font-[Plus_Jakarta_Sans] font-extrabold text-lg shadow-[0_8px_24px_rgba(157,167,255,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {index + 1 === questions.length ? "Finish Quiz" : "Continue"}
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
