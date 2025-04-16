import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home";
import Tuner from "./components/Tuner";
import TimerHome from "./components/TimerHome";
import { TimerProvider } from "./context/TimerContext";

const App: React.FC = () => {
  return (
    <TimerProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tuner" element={<Tuner />} />
          <Route path="/timer" element={<TimerHome />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </TimerProvider>
  );
};

export default App;
