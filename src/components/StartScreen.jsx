import React from "react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const StartScreen = ({ onStart, userId }) => {
  const [difficulty, setDifficulty] = useState("easy");
  const [category, setCategory] = useState("");

  const categories = [
    "science",
    "history",
    "film_and_tv",
    "arts_and_literature",
    "music",
    "food_and_drink",
    "society_and_culture",
    "geography",
  ];

  const handleStart = () => {
    if (!category) return alert("Please select a category.");
    onStart({ difficulty, category });
  };

  return (
    <motion.div
      className="p-6 bg-white rounded-2xl shadow-lg w-full max-w-md mx-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Start Quiz</h2>

      {userId && (
        <p className="text-sm text-center text-gray-500 mb-2">
          👤 Logged in as Guest #{userId.slice(0, 6)}
        </p>
      )}

      <label className="block mb-2">Select Difficulty:</label>
      <input
        type="range"
        min={0}
        max={2}
        value={["easy", "medium", "hard"].indexOf(difficulty)}
        onChange={(e) =>
          setDifficulty(["easy", "medium", "hard"][e.target.value])
        }
        className="w-full mb-2"
      />
      <label className="block mb-2">Select Category:</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="">--Choose a Category--</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </option>
        ))}
      </select>

      <button
        onClick={handleStart}
        className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
      >
        Start Quiz
      </button>
    </motion.div>
  );
};

export default StartScreen;
