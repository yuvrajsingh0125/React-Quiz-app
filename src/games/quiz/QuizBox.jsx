import React, { useState, useEffect } from "react";
import ScoreCard from "./ScoreCard";
import Spinner from "../../components/Spinner";
import { motion, AnimatePresence } from "framer-motion";
import { account } from "../../services/appwriteConfig";
import { databases } from "../../services/appwriteConfig";
import { ID } from "appwrite";



const QuizBox = ({ config, onRestart }) => {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const amount = Math.min(config.amount || 10, 50);
        const url = `https://the-trivia-api.com/api/questions?limit=${amount}&category=${config.category}`;
        const res = await fetch(url);
        const data = await res.json();

        const formatted = data.map((q) => ({
          question: q.question,
          options: [...q.incorrectAnswers, q.correctAnswer].sort(
            () => Math.random() - 0.5
          ),
          answer: q.correctAnswer,
        }));

        setQuestions(formatted);
      } catch (err) {
        console.error("Error fetching questions:", err);
        // setQuestions([
        //   {
        //     question:
        //       "If AI wrote a love letter, who would it most likely send it to?",
        //     options: ["Electricity", "Wi-Fi", "The Cloud", "The User"],
        //     answer: "The User",
        //   },
        //   {
        //     question:
        //       "Which of these inventions would most likely win 'Most Dramatic Impact on Earth'?",
        //     options: ["Wheel", "Fire", "Internet", "Printing Press"],
        //     answer: "Internet",
        //   },
        // ]);
      }
    };

    fetchQuestions();
  }, [config]);

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
    }
    console.log("Next triggered at index :",index," Selected:" , selected);
  };


  const saveScore = async () => {
    try {
      const user = await account.get();

      await databases.createDocument(
        "quizAppDB", // your DB ID
        "score", // your collection ID
        ID.unique(), // auto-generated ID
        {
          userId: user.$id,
          score: score,
          category: config.category,
          difficulty: config.difficulty,
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
      <ScoreCard
        score={score}
        total={questions.length}
        onRestart={onRestart}
      />
    );

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={questions[index]?.question}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2
              className="text-lg font-bold"
              dangerouslySetInnerHTML={{
                __html: `Q${index + 1}: ${questions[index].question}`,
              }}
            />
            <span className="text-2xl font-bold bg-blue-700 text-white px-4 py-1 rounded-full shadow-lg animate-pulse">
              {timeLeft}s
            </span>
          </div>

          <div className="grid gap-3 mb-4">
            {questions[index].options.map((opt, i) => (
              <button
                key={i}
                className={`p-2 border rounded text-left hover:bg-blue-100 ${
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
            className="w-full bg-blue-700 text-white py-2 font-bold rounded hover:bg-blue-800"
          >
            {index + 1 === questions.length ? "Finish Quiz" : "Next Question"}
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuizBox;
