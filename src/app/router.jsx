import { createBrowserRouter, RouterProvider, Route, Routes } from "react-router-dom";
import App from "../App.jsx";
import QuizPlay from "../games/quiz/QuizPlay.jsx";
import QuizHomePage from "../games/quiz/QuizHomePage.jsx";
import QuizResult from "../games/quiz/QuizResult.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <QuizHomePage /> },
      { path: "quiz/play", element: <QuizPlay /> },
      { path: "quiz/result", element: <QuizResult /> },
    ],
    },
]);