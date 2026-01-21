import { useState , useEffect } from "react";
import { Outlet } from "react-router-dom";
import './App.css'
import QuizHomePage from "./games/quiz/QuizHomePage.jsx";
import "./App.css";
import { motion } from "framer-motion";
import QuizPlay from "./games/quiz/QuizPlay.jsx";
import { account } from "./services/appwrite.jsx";
import QuizResult from "./games/quiz/QuizResult.jsx";

function App() {
  
  return (
    <>
    <div className="app">
      <Outlet />
    </div>
    <div className="footer">
      <p>Made with ❤️ by Yuvraj</p>
    </div>
    </>
  );
}

export default App;
