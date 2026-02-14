import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { EisenhowerMatrix } from "./Eisenhowermatrix.jsx";

export function EisenhowerMatrixPage() {
  const navigate = useNavigate();

  const handleSaveToCalendar = (tasks) => {
    console.log("Tasks saved to calendar:", tasks);
    // Handle calendar integration here
  };

  return (
    <div className="min-h-screen p-8" style={{ background: '#f5eef8' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          style={{ color: '#9575a3' }}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>

        {/* Header */}
        <div className="rounded-3xl p-8 shadow-sm" style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.2)' }}>
          <h1 className="text-3xl font-semibold mb-2" style={{ color: '#5a4a61' }}>Eisenhower Matrix</h1>
          <p className="italic" style={{ color: '#b39ddb' }}>
            Organize your tasks by urgency and importance using the 4-quadrant system
          </p>
        </div>

        <EisenhowerMatrix onSaveAndAddToCalendar={handleSaveToCalendar} />
      </div>
    </div>
  );
}