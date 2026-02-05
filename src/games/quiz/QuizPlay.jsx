import React, { useState, useEffect, useMemo } from "react";
import QuizResult from "./QuizResult";
import Spinner from "../../components/Spinner";
import { motion, AnimatePresence } from "framer-motion";
import { account } from "../../services/appwrite.jsx";
import { databases } from "../../services/appwrite.jsx";
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
  if (normalized.difficulty) {
    url += `&difficulty=${normalized.difficulty}`;
  }

  const promise = fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
      }
      return res.json();
    })
    .then((data) =>
      data.map((q) => ({
        question: q.question,
        options: [...q.incorrectAnswers, q.correctAnswer].sort(
          () => Math.random() - 0.5
        ),
        answer: q.correctAnswer,
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

const QuizBox = ({ config: configProp, onRestart }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const resolvedConfig = configProp ?? location.state?.config ?? null;
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [showScore, setShowScore] = useState(false);
  const isAnswered = selected !== null;

  useEffect(() => {
    if (!resolvedConfig) {
      navigate("/", { replace: true });
    }
  }, [resolvedConfig, navigate]);

  const configKey = useMemo(() => {
    if (!resolvedConfig) return null;
    return buildConfigKey(resolvedConfig);
  }, [
    resolvedConfig?.amount,
    resolvedConfig?.category,
    resolvedConfig?.difficulty,
  ]);

  useEffect(() => {
    if (!configKey || !resolvedConfig) return;
    let cancelled = false;

    setQuestions([]);
    setIndex(0);
    setScore(0);
    setSelected(null);
    setTimeLeft(15);
    setShowScore(false);

    fetchQuestionsForConfig(resolvedConfig)
      .then((formatted) => {
        if (!cancelled) setQuestions(formatted);
      })
      .catch((err) => {
        if (!cancelled) console.error("Error fetching questions:", err);
      });

    return () => {
      cancelled = true;
    };
  }, [configKey]);

  useEffect(() => {
    if (!questions.length) return;  // 🚫 Don’t run until questions are loaded
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          handleNext();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [index , questions]);

  const handleSelect = (option) => {
    if (selected !== null) return;
    setSelected(option);
    if (option === questions[index].answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setSelected(null);
      setTimeLeft(15);
    } else {
      setShowScore(true);
      saveScore();
      navigate("/quiz/result", {
        state: { score, total: questions.length },
      });
    }
    console.log("Next triggered at index :",index," Selected:" , selected);
  };


  const saveScore = async () => {
    if (!resolvedConfig) return;
    try {
      const user = await account.get();

      await databases.createDocument(
        "quizAppDB", // your DB ID
        "score", // your collection ID
        ID.unique(), // auto-generated ID
        {
          userId: user.$id,
          score: score,
          category: resolvedConfig.category,
          difficulty: resolvedConfig.difficulty,
          createdAt : new Date().toISOString(),
        }
      );

      console.log("✅ Score saved successfully!"); 
    } catch (error) {
      console.error("❌ Error saving score:", error);
    }
  };

  useEffect(() => {
    console.log("Timer started for index: " ,index);
  }, [index])
  

  if (!questions.length) return <Spinner />;

  if (showScore)
    return (
      <QuizResult
        score={score}
        total={questions.length}
        onRestart={onRestart}
      />
    );

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg w-full max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={questions[index]?.question}
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-2">
            <h2
              className="text-lg font-bold text-center flex-1"
              dangerouslySetInnerHTML={{
                __html: `Q${index + 1}: ${questions[index].question}`,
              }}
            />
            <span className="text-2xl font-bold bg-blue-700 text-white px-4 py-1 rounded-full shadow-lg animate-pulse">
              {timeLeft}s
            </span>
          </div>

          <div className="grid gap-3 mb-2">
            {questions[index].options.map((opt, i) => (
              <button
                key={i}
                disabled={isAnswered}
                className={`p-2 border rounded-lg text-left transition-colors ${
                  isAnswered
                    ? selected === opt
                      ? "cursor-not-allowed"
                      : "opacity-60 cursor-not-allowed"
                    : "hover:bg-blue-100"
                } ${
                  selected === opt
                    ? opt === questions[index].answer
                      ? "bg-green-300"
                      : "bg-red-300"
                    : "bg-gray-100"
                }`}
                onClick={() => handleSelect(opt)}
                dangerouslySetInnerHTML={{ __html: opt }}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-blue-700 text-white py-2 font-bold rounded-lg transition-colors hover:bg-blue-800"
          >
            {index + 1 === questions.length ? "Finish Quiz" : "Next Question"}
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuizBox;
