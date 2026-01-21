import { useState , useEffect } from "react";
import QuizHomePage from "./games/quiz/QuizHomePage.jsx";
import "./App.css";
import { motion } from "framer-motion";
import QuizPlay from "./games/quiz/QuizPlay.jsx";
import { account } from "./services/appwrite.jsx";
import QuizResult from "./games/quiz/QuizResult.jsx";

function App() {
  const [quizConfig, setQuizConfig] = useState(null);
  const [userId, setUserId] = useState("");

  const handleStart = (config) => {
    setQuizConfig(config);
    //load quiz box here
  };

  const handleRestart = () => {
    setQuizConfig(null);
    //resets to start screen
  };

  useEffect(() => {
    const loginAnonymously = async () => {
      try {
        const session = await account.createAnonymousSession();
        const user = await account.get();
        setUserId(user.$id);
        console.log("Logged in :", user.$id ? user.$id : session);
      } catch (err) {
        console.error("Login failed:", err);
      }
    };
    loginAnonymously();
  }, []);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 to-blue-600">
        {!quizConfig ? (
          <QuizHomePage onStart={handleStart} userId={userId} />
        ) : (
          <QuizPlay config={quizConfig} onStart={handleRestart} />
        )}
      </div>
    </>
  );
}

export default App;
