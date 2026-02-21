import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AITaskBreakdownScreen } from "./Aitaskbreakdownscreen.jsx";
import { AITaskResultsPage } from "./Aitaskresultspage.jsx";

export function AITaskBreakdownPage() {
  const navigate = useNavigate();
  const [taskData, setTaskData] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = (data) => {
    console.log("AI Analysis complete:", data);
    setTaskData(data);
    setShowResults(true);
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
    } else {
      navigate('/');
    }
  };

  const handleEditPrompt = () => {
    setShowResults(false);
  };

  if (showResults && taskData) {
    return (
      <AITaskResultsPage
        taskData={taskData}
        onBack={handleBack}
        onEditPrompt={handleEditPrompt}
      />
    );
  }

  return (
    <AITaskBreakdownScreen 
      onBack={() => navigate('/')} 
      onAnalyze={handleAnalyze} 
    />
  );
}