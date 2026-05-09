import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Calendar, ChevronRight, Sparkles, AlertCircle } from "lucide-react";

export default function CanvasAssignmentsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Grab the assignments passed from the connection page
  const assignments = location.state?.assignments || [];

  const handleCreateBreakdown = async (assignment) => {
    let canvasFile = null;

    // ✨ NEW: If the assignment has an attached file, download it first!
    if (assignment.fileEndpoint) {
        try {
            const token = localStorage.getItem("canvasToken");
            const res = await fetch("http://127.0.0.1:5000/api/canvas/download", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileEndpoint: assignment.fileEndpoint, token })
            });

            if (res.ok) {
                const data = await res.json();
                // 🪄 Magic: Convert the Base64 data back into a native browser File object!
                const byteCharacters = atob(data.base64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: data.mimeType });
                canvasFile = new File([blob], data.fileName, { type: data.mimeType });
            }
        } catch (err) {
            console.error("Failed to auto-attach file:", err);
        }
    }

    // Send the data AND the newly constructed File directly to the AI page!
    navigate("/ai-task-breakdown", { 
        state: { 
            autoPrompt: `Break down this assignment for ${assignment.course_name}: ${assignment.title}. \n\nDetails: ${assignment.description}`,
            assignmentTitle: assignment.title,
            attachedFile: canvasFile // ✨ Pass the native file object!
        } 
    });
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center" style={{ background: "#f5eef8" }}>
      {/* ✨ FIXED: Matched the width to your other pages (80vw) and increased max width! */}
      <div className="max-w-7xl mx-auto space-y-6 w-[80vw]">
        
        {/* Header */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
          style={{ color: "#9575a3" }}>
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>

        <div className="rounded-3xl p-8 shadow-sm flex items-center justify-between"
          style={{ background: "#ffffff", border: "1px solid rgba(179,157,219,0.2)" }}>
          <div>
            <h1 className="text-3xl font-semibold mb-2" style={{ color: "#5a4a61" }}>Canvas Assignments</h1>
            <p style={{ color: "#9575a3" }}>Select an assignment to automatically generate an AI Task Breakdown.</p>
          </div>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm"
            style={{ background: "#e8f5e9" }}>
            <BookOpen className="h-8 w-8 text-green-600" />
          </div>
        </div>

        {/* Assignment List */}
        {assignments.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-purple-300" />
                <h3 className="text-lg font-semibold text-gray-700">No upcoming assignments found</h3>
                <p className="text-gray-500 mt-2">You're all caught up on Canvas!</p>
            </div>
        ) : (
            <div className="space-y-4">
            {assignments.map((assignment) => {
                const dateObj = new Date(assignment.due_date);
                const displayDate = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

                return (
                <div key={assignment.id} 
                    className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(179,157,219,0.2)] hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-purple-500 bg-purple-50 px-3 py-1 rounded-full">
                                {assignment.course_name}
                            </span>
                            <h3 className="text-xl font-bold mt-3 mb-2" style={{ color: "#5a4a61" }}>
                                {assignment.title}
                            </h3>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={16} className="text-purple-400" />
                                    <span>Due: {displayDate}</span>
                                </div>
                                {assignment.points_possible && (
                                    <span className="font-medium text-gray-600">• {assignment.points_possible} Points</span>
                                )}
                            </div>

                            <p className="text-sm text-gray-600 line-clamp-2 pr-8 leading-relaxed">
                                {assignment.description}
                            </p>
                        </div>

                        {/* Generate Button */}
                        <button 
                            onClick={() => handleCreateBreakdown(assignment)}
                            className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white transition-all transform hover:scale-105"
                            style={{ background: "linear-gradient(135deg, #b39ddb, #9575a3)", boxShadow: "0 4px 15px rgba(179,157,219,0.3)" }}
                        >
                            <Sparkles size={18} />
                            <span>AI Breakdown</span>
                        </button>
                    </div>
                </div>
                );
            })}
            </div>
        )}
      </div>
    </div>
  );
}