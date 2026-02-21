import { useState } from "react";
import { ArrowLeft, Sparkles, Calendar as CalendarIcon, AlertTriangle, Save, CheckCircle, RotateCcw, Flame, Target, Zap, ListTodo, Check, ChevronLeft, ChevronRight, GripVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../usercontext";

export function AITaskResultsPage({ taskData, onBack, onEditPrompt }) {
  const navigate = useNavigate();
  const { addPoints, updateStreak } = useUser();
  const [selectedQuadrant, setSelectedQuadrant] = useState("schedule");
  const [dueDate, setDueDate] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentWeek, setCurrentWeek] = useState(0);
  const [draggedSubtask, setDraggedSubtask] = useState(null);
  const [scheduledSubtasks, setScheduledSubtasks] = useState({});

  // Generate AI subtasks
  const aiSubtasks = [
    { id: "st1", title: "Research and gather information", duration: "45min", estimated_minutes: 45 },
    { id: "st2", title: "Create an outline", duration: "30min", estimated_minutes: 30 },
    { id: "st3", title: "Draft initial version", duration: "120min", estimated_minutes: 120 },
    { id: "st4", title: "Review and refine", duration: "60min", estimated_minutes: 60 },
    { id: "st5", title: "Final polish and submission", duration: "30min", estimated_minutes: 30 }
  ];

  const quadrants = [
    { id: "do-now", title: "Do Now", subtitle: "Urgent & Important", icon: Flame, iconColor: "#ef4444" },
    { id: "schedule", title: "Schedule", subtitle: "Important, Not Urgent", icon: Target, iconColor: "#3b82f6" },
    { id: "delegate", title: "Delegate", subtitle: "Urgent, Not Important", icon: Zap, iconColor: "#eab308" },
    { id: "defer", title: "Defer", subtitle: "Not Urgent, Not Important", icon: ListTodo, iconColor: "#22c55e" }
  ];

  const getWeekDates = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (currentWeek * 7));
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const weekDates = getWeekDates();
  const monthYear = weekDates[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handleDragStart = (e, subtask) => {
    setDraggedSubtask(subtask);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, day, hour) => {
    e.preventDefault();
    if (draggedSubtask) {
      const dateKey = day.toISOString().split('T')[0];
      const timeKey = `${hour}:00`;
      setScheduledSubtasks(prev => ({
        ...prev,
        [draggedSubtask.id]: {
          date: dateKey,
          time: timeKey,
          day: day.toLocaleDateString('en-US', { weekday: 'short' }),
          displayDate: day.getDate(),
          title: draggedSubtask.title,
          duration: draggedSubtask.duration
        }
      }));
      setDraggedSubtask(null);
    }
  };

  const handleConfirmAndAdd = () => {
    if (!selectedQuadrant || !dueDate) {
      setErrorMessage("Please select a priority quadrant and due date");
      setShowErrorModal(true);
      return;
    }

    try {
      const taskId = `ai-task-${Date.now()}`;
      
      // Create upcoming assignments for each subtask
      const upcomingAssignments = [];
      
      aiSubtasks.forEach((subtask, index) => {
        const scheduledInfo = scheduledSubtasks[subtask.id];
        const subtaskDueDate = scheduledInfo ? scheduledInfo.date : dueDate;
        
        upcomingAssignments.push({
          id: `${taskId}-st${index}-${Date.now()}`,
          title: subtask.title,
          course: "AI Breakdown",
          status: "In Progress",
          priority: selectedQuadrant === "do-now" ? "High Priority" : selectedQuadrant === "schedule" ? "Medium Priority" : selectedQuadrant === "delegate" ? "Medium Priority" : "Low Priority",
          progress: 0,
          dueDate: subtaskDueDate,
          notes: `Estimated: ${subtask.duration}`,
          createdAt: new Date().toISOString()
        });
      });

      // Get existing assignments and merge
      const existingStr = localStorage.getItem("upcomingAssignments");
      let allAssignments = [];
      
      if (existingStr) {
        try {
          allAssignments = JSON.parse(existingStr);
        } catch (e) {
          console.error("Error parsing existing assignments:", e);
          allAssignments = [];
        }
      }
      
      // Add new assignments
      const finalAssignments = [...allAssignments, ...upcomingAssignments];
      localStorage.setItem("upcomingAssignments", JSON.stringify(finalAssignments));
      
      console.log("Saved to upcomingAssignments:", finalAssignments);

      // Award points
      if (addPoints && typeof addPoints === "function") {
        addPoints(20, "Completed AI task breakdown");
      }
      if (updateStreak && typeof updateStreak === "function") {
        updateStreak();
      }

      // Dispatch events for all views to update
      window.dispatchEvent(new Event("eisenhowerSaved"));
      window.dispatchEvent(new Event("weeklyProgressUpdated"));

      // Show success and navigate
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        navigate('/');
      }, 2000);
      
    } catch (error) {
      console.error("Error saving task:", error);
      setErrorMessage("There was an error saving your task. Please try again.");
      setShowErrorModal(true);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ background: '#f5eef8' }}>
      <div className="max-w-[1800px] mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={onBack || (() => navigate('/'))} className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-80" style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.2)' }}>
            <ArrowLeft className="h-4 w-4" style={{ color: '#9575a3' }} />
          </button>
          <div className="flex-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#b39ddb' }}>
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold" style={{ color: '#5a4a61' }}>Task Breakdown & Scheduling</h1>
              <p style={{ color: '#9575a3', fontSize: '13px' }}>Drag subtasks to the calendar to schedule them on specific days</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-4">
          {/* Left: Subtasks List */}
          <div className="col-span-3">
            <div className="rounded-3xl p-5 shadow-sm h-full" style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.2)' }}>
              <h3 className="font-semibold mb-4 text-sm" style={{ color: '#5a4a61' }}>Subtasks to Schedule</h3>
              <div className="space-y-2">
                {aiSubtasks.map((subtask) => {
                  const isScheduled = !!scheduledSubtasks[subtask.id];
                  return (
                    <div 
                      key={subtask.id} 
                      draggable={!isScheduled}
                      onDragStart={(e) => !isScheduled && handleDragStart(e, subtask)}
                      className={`p-3 rounded-2xl transition-all ${!isScheduled ? 'cursor-move hover:shadow-md' : 'opacity-60'}`} 
                      style={{ background: '#fce4ec', border: '1px solid rgba(248, 187, 208, 0.3)' }}
                    >
                      <div className="flex items-start gap-2">
                        {!isScheduled && <GripVertical className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: '#f8bbd0' }} />}
                        {isScheduled && <Check className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: '#22c55e' }} />}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-xs mb-1" style={{ color: '#5a4a61' }}>{subtask.title}</div>
                          <div className="text-[10px] font-medium" style={{ color: '#f8bbd0' }}>{subtask.duration}</div>
                          {isScheduled && (
                            <div className="text-[10px] mt-1 px-1.5 py-0.5 rounded" style={{ background: '#c8e6c9', color: '#2e7d32' }}>
                              ✓ {scheduledSubtasks[subtask.id].day}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(179, 157, 219, 0.2)' }}>
                <p className="text-xs" style={{ color: '#9575a3' }}>
                  📌 Drag subtasks to schedule them. Unscheduled tasks use the main due date.
                </p>
              </div>
            </div>
          </div>

          {/* Center: Calendar Week View */}
          <div className="col-span-6">
            <div className="rounded-3xl p-5 shadow-sm h-full" style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.2)' }}>
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setCurrentWeek(currentWeek - 1)} className="p-2 rounded-xl hover:opacity-80 transition-opacity" style={{ background: '#f3e5f5' }}>
                  <ChevronLeft className="h-4 w-4" style={{ color: '#b39ddb' }} />
                </button>
                <div className="text-center">
                  <div className="font-semibold text-base" style={{ color: '#5a4a61' }}>{monthYear}</div>
                  <div className="text-xs" style={{ color: '#9575a3' }}>Week view</div>
                </div>
                <button onClick={() => setCurrentWeek(currentWeek + 1)} className="p-2 rounded-xl hover:opacity-80 transition-opacity" style={{ background: '#f3e5f5' }}>
                  <ChevronRight className="h-4 w-4" style={{ color: '#b39ddb' }} />
                </button>
              </div>

              <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                <div className="flex gap-1 mb-2 text-xs sticky top-0" style={{ background: '#ffffff', zIndex: 10, color: '#9575a3' }}>
                  <div className="w-16 flex-shrink-0"></div>
                  {weekDates.map((date, i) => (
                    <div key={i} className="flex-1 text-center min-w-[80px]">
                      <div className="font-medium">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}</div>
                      <div className="text-base font-semibold" style={{ color: '#5a4a61' }}>{date.getDate()}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-1">
                  {Array.from({ length: 14 }, (_, i) => 8 + i).map(hour => (
                    <div key={hour} className="flex gap-1">
                      <div className="w-16 flex-shrink-0 text-[10px] pt-1" style={{ color: '#9575a3' }}>
                        {hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? '12:00 PM' : `${hour}:00 AM`}
                      </div>
                      {weekDates.map((day, dayIdx) => {
                        const scheduledHere = Object.values(scheduledSubtasks).find(s => s.date === day.toISOString().split('T')[0] && parseInt(s.time.split(':')[0]) === hour);
                        return (
                          <div 
                            key={dayIdx} 
                            className="flex-1 h-12 rounded-lg transition-all min-w-[80px] relative" 
                            style={{ 
                              border: '1px solid rgba(179, 157, 219, 0.1)', 
                              background: scheduledHere ? '#e1f5fe' : 'transparent' 
                            }} 
                            onDragOver={handleDragOver} 
                            onDrop={(e) => handleDrop(e, day, hour)}
                          >
                            {scheduledHere && (
                              <div className="absolute inset-0 p-1">
                                <div className="text-[9px] font-medium truncate" style={{ color: '#01579b' }}>{scheduledHere.title}</div>
                                <div className="text-[8px]" style={{ color: '#0277bd' }}>{scheduledHere.duration}</div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="col-span-3 space-y-3">
            {/* Due Date */}
            <div className="rounded-3xl p-5 shadow-sm" style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.2)' }}>
              <h3 className="flex items-center gap-2 font-semibold mb-3 text-sm" style={{ color: '#5a4a61' }}>
                <CalendarIcon className="h-4 w-4" style={{ color: '#b39ddb' }} />
                Main Due Date
              </h3>
              <input 
                type="date" 
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)} 
                className="w-full p-2 rounded-xl focus:outline-none text-sm" 
                style={{ background: '#fdf7fd', border: '1px solid rgba(179, 157, 219, 0.2)', color: '#5a4a61' }} 
                min={new Date().toISOString().split('T')[0]} 
              />
              <p className="text-xs mt-2" style={{ color: '#9575a3' }}>For unscheduled subtasks</p>
            </div>

            {/* Priority */}
            <div className="rounded-3xl p-5 shadow-sm" style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.2)' }}>
              <h3 className="flex items-center gap-2 font-semibold mb-3 text-sm" style={{ color: '#5a4a61' }}>
                <AlertTriangle className="h-4 w-4" style={{ color: '#b39ddb' }} />
                Priority
              </h3>
              <div className="space-y-2">
                {quadrants.map((quadrant) => {
                  const Icon = quadrant.icon;
                  return (
                    <button 
                      key={quadrant.id} 
                      onClick={() => setSelectedQuadrant(quadrant.id)} 
                      className="w-full p-2.5 rounded-xl text-left transition-all flex items-center gap-2" 
                      style={{ 
                        background: selectedQuadrant === quadrant.id ? '#f3e5f5' : '#fdf7fd', 
                        border: selectedQuadrant === quadrant.id ? '2px solid #b39ddb' : '1px solid rgba(179, 157, 219, 0.2)' 
                      }}
                    >
                      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <Icon className="h-3.5 w-3.5" style={{ color: quadrant.iconColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-xs" style={{ color: '#5a4a61' }}>{quadrant.title}</div>
                        <div className="text-[10px] truncate" style={{ color: '#9575a3' }}>{quadrant.subtitle}</div>
                      </div>
                      {selectedQuadrant === quadrant.id && <Check className="h-4 w-4 flex-shrink-0" style={{ color: '#b39ddb' }} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Save Button */}
            <button 
              onClick={handleConfirmAndAdd}
              disabled={!selectedQuadrant || !dueDate} 
              className="w-full h-12 rounded-2xl text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg flex items-center justify-center gap-2" 
              style={{ background: (!selectedQuadrant || !dueDate) ? '#e1bee7' : '#b39ddb' }}
            >
              <Save className="h-4 w-4" />
              Save to Calendar
            </button>

            <div className="text-xs p-3 rounded-lg" style={{ background: '#fffbeb', color: '#92400e' }}>
              ✓ {Object.keys(scheduledSubtasks).length}/{aiSubtasks.length} scheduled
              <br />
              ✓ All will appear in Calendar, Upcoming Assignments & Weekly Progress
            </div>

            {onEditPrompt && (
              <button onClick={onEditPrompt} className="w-full py-2 text-xs flex items-center justify-center gap-2 transition-colors hover:opacity-80" style={{ color: '#9575a3' }}>
                <RotateCcw className="h-3.5 w-3.5" />
                Edit Prompt
              </button>
            )}
          </div>
        </div>

        {/* Error Modal */}
        {showErrorModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="bg-white px-8 py-6 rounded-3xl shadow-2xl flex flex-col items-center gap-4" style={{ maxWidth: '400px' }}>
              <AlertTriangle className="h-12 w-12" style={{ color: '#ef4444' }} />
              <div className="text-center">
                <div className="text-lg font-semibold mb-1" style={{ color: '#5a4a61' }}>Error</div>
                <div className="text-sm" style={{ color: '#9575a3' }}>{errorMessage}</div>
              </div>
              <button
                onClick={() => setShowErrorModal(false)}
                className="px-6 py-2 rounded-full text-white font-medium"
                style={{ background: '#b39ddb' }}
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* Success Toast */}
        {showSuccessToast && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="text-white px-8 py-6 rounded-3xl shadow-2xl flex flex-col items-center gap-4" style={{ background: '#22c55e', maxWidth: '400px' }}>
              <CheckCircle className="h-12 w-12" />
              <div className="text-center">
                <div className="text-lg font-semibold mb-1">Success! ✨</div>
                <div className="text-sm opacity-90">
                  {aiSubtasks.length} subtasks saved to calendar
                </div>
                <div className="text-xs opacity-75 mt-2">
                  Check Calendar • Upcoming Assignments • Weekly Progress
                </div>
              </div>
              <div className="text-xs opacity-75">Redirecting...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}