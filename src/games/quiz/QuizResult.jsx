import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const QuizResult = ({ score: scoreProp, total: totalProp, onRestart }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const score = scoreProp ?? location.state?.score ?? 0;
  const total = totalProp ?? location.state?.total ?? 0;
  const percentage = total ? Math.round((score / total) * 100) : 0;

  const handleRestart = () => {
    if (typeof onRestart === "function") {
      onRestart();
      return;
    }
    navigate("/", { replace: true });
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg w-full max-w-xl mx-auto text-center space-y-4">
      <h2 className="text-2xl font-bold">Quiz Results</h2>
      <div className="text-lg">
        <span className="font-semibold">{score}</span> correct out of{" "}
        <span className="font-semibold">{total}</span>
      </div>
      <div className="text-sm text-gray-600">Score: {percentage}%</div>
      <button
        onClick={handleRestart}
        className="w-full bg-blue-700 text-white py-2 font-bold rounded-lg transition-colors hover:bg-blue-800"
      >
        Restart Quiz
      </button>
    </div>
  );
};

export default QuizResult;
