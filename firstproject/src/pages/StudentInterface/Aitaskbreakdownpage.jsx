import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AITaskBreakdownScreen } from "./Aitaskbreakdownscreen.jsx";
import { AITaskResultsPage } from "./Aitaskresultspage.jsx";
import { useLocation } from "react-router-dom";

export function AITaskBreakdownPage() {
  const navigate = useNavigate();
  const [taskData, setTaskData] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const location = useLocation();
  const [promptText, setPromptText] = useState(location.state?.autoPrompt || "");
  const [taskTitle, setTaskTitle] = useState(location.state?.assignmentTitle || "");
  const [canvasFile, setCanvasFile] = useState(location.state?.attachedFile || null);

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
      // ✨ Pass the data down to the child component!
      initialPrompt={promptText}
      initialTitle={taskTitle}
      initialFile={canvasFile}
    />
  );
}