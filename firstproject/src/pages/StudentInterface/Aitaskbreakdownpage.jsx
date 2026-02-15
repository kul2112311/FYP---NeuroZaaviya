import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AITaskBreakdownScreen } from "./Aitaskbreakdownscreen.jsx";

export function AITaskBreakdownPage() {
  const navigate = useNavigate();

  const handleAnalyze = (taskData) => {
    console.log("AI Analysis complete:", taskData);
    // Here you would navigate to the AI results page
    // For now, navigate back to dashboard
    navigate('/');
  };

  return (
    <AITaskBreakdownScreen 
      onBack={() => navigate('/')} 
      onAnalyze={handleAnalyze} 
    />
  );
}