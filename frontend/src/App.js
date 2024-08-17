import React from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Header from "./components/header";
import Home from "./components/home";
import Game from "./components/game/game";
import EndGame from "./components/game/endGame";
import Guide from "./components/guide/guide";
import { AuthProvider } from "./contexts/authContext";

function AppRoutes() {
  const routesArray = [
    {
      path: "*",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/game",
      element: <Game />
    },
    {
      path: "/endgame",
      element: <EndGame />
    },
    {
      path: "/guide",
      element: <Guide />
    }
  ];
  return useRoutes(routesArray);
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="w-full h-screen flex flex-col">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
