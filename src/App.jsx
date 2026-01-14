import { useState , useEffect } from "react";
import StartScreen from "./games/quiz/StartScreen.jsx";
import "./App.css";
import { motion } from "framer-motion";
import QuizBox from "./games/quiz/QuizBox.jsx";
import { account } from "./services/appwriteConfig.jsx";

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
          <StartScreen onStart={handleStart} userId={userId} />
        ) : (
          <QuizBox config={quizConfig} onStart={handleRestart} />
        )}
      </div>
    </>
  );
}

export default App;
