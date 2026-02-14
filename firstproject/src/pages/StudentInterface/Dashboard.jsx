import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Award, TrendingUp, Calendar, ChevronLeft, ChevronRight, Sparkles, Brain, Grid3x3, Clock, CheckCircle2 } from "lucide-react";

function Dashboard() {
  // Navigation
  const navigate = useNavigate();
  
  // ALL STATE DECLARATIONS AT THE TOP
  const [progress, setProgress] = useState({
    Mon: 85,
    Tue: 70,
    Wed: 90,
    Thu: 75,
    Fri: 80,
    Sat: 65,
    Sun: 70,
  });
  const [weekAssignments, setWeekAssignments] = useState({});
  const [view, setView] = useState("week");
  const [tasks, setTasks] = useState([
    { id: 1, text: "Review chapter 5", completed: false },
    { id: 2, text: "Finish project draft", completed: false },
    { id: 3, text: "Practice mindfulness", completed: true },
  ]);
  const [newTask, setNewTask] = useState("");
  const [currentDate] = useState(new Date(2026, 0, 26));

  const weeklyProgress = Object.values(progress).reduce((a, b) => a + b, 0) / 7;

  const badges = [
    { name: "Early Bird", bgColor: '#f8bbd0', icon: Star },
    { name: "Study Streak", bgColor: '#b39ddb', icon: Award },
    { name: "Progress Hero", bgColor: '#4ade80', icon: TrendingUp },
    { name: "Motivation", bgColor: '#e57373', icon: Sparkles },
  ];

  // Get all upcoming assignments (not completed, sorted by priority)
  const getUpcomingAssignments = () => {
    const allAssignments = [];
    Object.entries(weekAssignments).forEach(([day, assignments]) => {
      if (assignments && Array.isArray(assignments)) {
        assignments.forEach(assignment => {
          if (assignment.status !== "Completed") {
            allAssignments.push({ ...assignment, day });
          }
        });
      }
    });
    
    // Sort by priority and then by progress
    return allAssignments.sort((a, b) => {
      const priorityOrder = { "High Priority": 0, "Medium Priority": 1, "Low Priority": 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return a.progress - b.progress;
    }).slice(0, 5); // Show top 5
  };

  // Get assignments for calendar display
  const getAssignmentsForDay = (dayNumber) => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber).getDay();
    const dayName = daysOfWeek[dayIndex];
    
    // Map Mon-Sun to actual calendar days
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());
    const targetDate = new Date(weekStart);
    targetDate.setDate(weekStart.getDate() + dayIndex);
    
    if (weekAssignments[dayName] && Array.isArray(weekAssignments[dayName])) {
      return weekAssignments[dayName].length;
    }
    return 0;
  };

  // Handle updates from DetailedProgress
  const handleProgressUpdate = (dayProgress, assignments) => {
    setProgress(dayProgress);
    setWeekAssignments(assignments);
  };

  // Handle saving tasks from Eisenhower Matrix to calendar
  const handleSaveToCalendar = (eisenhowerTasks) => {
    console.log("Tasks saved to calendar:", eisenhowerTasks);
    // You can implement calendar integration here
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  const handleToggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  const getDaysInMonth = () => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  };

  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day.getDate());
    }
    return days;
  };

  const getPriorityColor = (priority) => {
    if (priority === "High Priority") return { bg: '#ffebee', text: '#c62828' };
    if (priority === "Medium Priority") return { bg: '#fff8e1', text: '#f57c00' };
    return { bg: '#e8f5e9', text: '#2e7d32' };
  };

  const upcomingAssignments = getUpcomingAssignments();

  return (
    <div className="min-h-screen p-8" style={{ background: '#f5eef8' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="rounded-3xl p-8 shadow-sm" style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.2)' }}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-semibold mb-2" style={{ color: '#5a4a61' }}>
                Welcome back, Ushna! ✨
              </h1>
              <p className="italic mb-4" style={{ color: '#b39ddb' }}>
                You're doing better than you think. Keep going! 🌸
              </p>
              <div className="flex gap-6 text-sm" style={{ color: '#9575a3' }}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: '#5a4a61' }}></span>
                  <span>OAP Advisor: <span className="font-medium" style={{ color: '#5a4a61' }}>Dr. Fatima Khan</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: '#4ade80' }}></span>
                  <span>Wellness Counsellor: <span className="font-medium" style={{ color: '#5a4a61' }}>Sara Ali</span></span>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex gap-3">
              {badges.map((badge, idx) => (
                <div
                  key={idx}
                  className="relative flex flex-col items-center gap-2 p-4 rounded-2xl shadow-md hover:scale-105 transition-transform cursor-pointer"
                  style={{ background: badge.bgColor }}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(255, 255, 255, 0.9)' }}>
                    <badge.icon className="h-6 w-6" style={{ color: '#b39ddb' }} />
                  </div>
                  <span className="text-xs font-medium text-center" style={{ color: '#ffffff' }}>
                    {badge.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Grid - Optimized for better space usage */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column - Progress (takes 3/5 of space) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Weekly Progress - Clickable */}
            <div className="rounded-3xl p-8 shadow-sm" style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.2)' }}>
              <button
                onClick={() => navigate('/detailed-progress')}
                className="w-full flex items-center gap-3 mb-6 rounded-2xl p-4 hover:opacity-90 transition-opacity cursor-pointer"
                style={{ background: '#f3e5f5', border: 'none' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm" style={{ background: '#ffffff' }}>
                  <TrendingUp className="h-6 w-6" style={{ color: '#b39ddb' }} />
                </div>
                <div className="text-left flex-1">
                  <h2 className="text-xl font-semibold" style={{ color: '#5a4a61' }}>Weekly Progress</h2>
                  <p className="text-sm" style={{ color: '#9575a3' }}>Click to view and edit daily assignments</p>
                </div>
                <ChevronRight className="h-6 w-6" style={{ color: '#b39ddb' }} />
              </button>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm" style={{ color: '#9575a3' }}>Overall Completion</span>
                  <span className="text-2xl font-semibold" style={{ color: '#b39ddb' }}>
                    {Math.round(weeklyProgress)}%
                  </span>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: '#e1bee7' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${weeklyProgress}%`, background: '#b39ddb' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-7 gap-4">
                {Object.entries(progress).map(([day, value]) => (
                  <div key={day} className="text-center">
                    <div className="text-xs mb-2 font-medium" style={{ color: '#9575a3' }}>{day}</div>
                    <div className="relative w-full aspect-square">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="50%"
                          cy="50%"
                          r="45%"
                          fill="none"
                          stroke="#e1bee7"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50%"
                          cy="50%"
                          r="45%"
                          fill="none"
                          stroke="#b39ddb"
                          strokeWidth="8"
                          strokeDasharray={`${value * 2.83} 283`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-semibold" style={{ color: '#b39ddb' }}>
                          {value}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Task Breakdown - Now Functional - More Compact */}
            <div className="rounded-3xl p-6 shadow-sm" style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.2)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#e1bee7' }}>
                  <Brain className="h-5 w-5" style={{ color: '#b39ddb' }} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: '#5a4a61' }}>AI Task Breakdown</h3>
                  <p className="text-xs" style={{ color: '#9575a3' }}>Smart planning assistant</p>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/ai-task-breakdown')}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl hover:opacity-90 transition-opacity" 
                  style={{ background: '#f3e5f5', border: '1px solid rgba(179, 157, 219, 0.2)' }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#ffffff' }}>
                    <Sparkles className="h-5 w-5" style={{ color: '#b39ddb' }} />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-medium text-sm" style={{ color: '#5a4a61' }}>AI Smart Breakdown</div>
                    <div className="text-xs" style={{ color: '#9575a3' }}>Let AI analyze and organize your tasks</div>
                  </div>
                </button>

                <button 
                  onClick={() => navigate('/eisenhower-matrix')}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl hover:opacity-90 transition-opacity" 
                  style={{ background: '#fce4ec', border: '1px solid rgba(248, 187, 208, 0.3)' }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#ffffff' }}>
                    <Grid3x3 className="h-5 w-5" style={{ color: '#f8bbd0' }} />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-medium text-sm" style={{ color: '#5a4a61' }}>Eisenhower Matrix</div>
                    <div className="text-xs" style={{ color: '#9575a3' }}>Manual priority-based organization</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Calendar & Tasks (takes 2/5 of space) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Calendar with Assignment Indicators */}
            <div className="rounded-3xl p-6 shadow-sm" style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.2)' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold" style={{ color: '#5a4a61' }}>
                  {view === "week" ? "Week" : "Month"} View - January 2026
                </h3>
                <div className="flex items-center gap-2">
                  <button className="p-1 rounded-lg transition-colors" style={{ background: '#f3e5f5' }}>
                    <ChevronLeft className="h-4 w-4" style={{ color: '#9575a3' }} />
                  </button>
                  <button className="p-1 rounded-lg transition-colors" style={{ background: '#f3e5f5' }}>
                    <ChevronRight className="h-4 w-4" style={{ color: '#9575a3' }} />
                  </button>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setView("week")}
                  className="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    background: view === "week" ? '#e1bee7' : '#fdf7fd',
                    color: view === "week" ? '#b39ddb' : '#9575a3'
                  }}
                >
                  Week
                </button>
                <button
                  onClick={() => setView("month")}
                  className="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    background: view === "month" ? '#e1bee7' : '#fdf7fd',
                    color: view === "month" ? '#b39ddb' : '#9575a3'
                  }}
                >
                  Month
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-xs font-medium" style={{ color: '#9575a3' }}>
                    {day}
                  </div>
                ))}
              </div>

              {view === "week" ? (
                <div className="grid grid-cols-7 gap-2">
                  {getWeekDays().map((day, idx) => {
                    const assignmentCount = getAssignmentsForDay(day);
                    return (
                      <div
                        key={idx}
                        className="aspect-square flex flex-col items-center justify-center rounded-lg text-sm cursor-pointer transition-colors relative"
                        style={{
                          background: day === 26 ? '#b39ddb' : '#fdf7fd',
                          color: day === 26 ? '#ffffff' : '#5a4a61',
                          fontWeight: day === 26 ? '600' : '400'
                        }}
                      >
                        <span>{day}</span>
                        {assignmentCount > 0 && (
                          <span className="text-xs mt-1" style={{ 
                            background: day === 26 ? 'rgba(255,255,255,0.3)' : '#b39ddb',
                            color: day === 26 ? '#ffffff' : '#ffffff',
                            padding: '1px 4px',
                            borderRadius: '4px'
                          }}>
                            {assignmentCount}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: getDaysInMonth() }, (_, i) => {
                    const day = i + 1;
                    const assignmentCount = getAssignmentsForDay(day);
                    return (
                      <div
                        key={i}
                        className="aspect-square flex flex-col items-center justify-center rounded-lg text-sm cursor-pointer transition-colors relative"
                        style={{
                          background: day === 26 ? '#b39ddb' : '#fdf7fd',
                          color: day === 26 ? '#ffffff' : '#5a4a61',
                          fontWeight: day === 26 ? '600' : '400'
                        }}
                      >
                        <span>{day}</span>
                        {assignmentCount > 0 && (
                          <span className="text-xs mt-1" style={{ 
                            background: day === 26 ? 'rgba(255,255,255,0.3)' : '#b39ddb',
                            color: '#ffffff',
                            padding: '1px 4px',
                            borderRadius: '4px',
                            fontSize: '10px'
                          }}>
                            {assignmentCount}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* My To-Do's */}
            <div className="rounded-3xl p-6 shadow-sm" style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.2)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5" style={{ color: '#f8bbd0' }} />
                <h3 className="text-lg font-semibold" style={{ color: '#5a4a61' }}>My To-Do's</h3>
              </div>

              <div className="space-y-2 mb-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-xl transition-colors group"
                    style={{ background: task.completed ? '#f3e5f5' : 'transparent' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f3e5f5'}
                    onMouseLeave={(e) => e.currentTarget.style.background = task.completed ? '#f3e5f5' : 'transparent'}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTask(task.id)}
                      className="w-5 h-5 rounded cursor-pointer"
                      style={{ 
                        border: '2px solid #b39ddb',
                        accentColor: '#b39ddb'
                      }}
                    />
                    <span
                      className="flex-1 text-sm"
                      style={{
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? '#9575a3' : '#5a4a61'
                      }}
                    >
                      {task.text}
                    </span>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 text-xs transition-opacity"
                      style={{ color: '#e57373' }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a new task..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={handleEnterKey}
                  className="flex-1 px-4 py-2 rounded-xl text-sm focus:outline-none"
                  style={{ 
                    background: '#fdf7fd',
                    border: '1px solid rgba(179, 157, 219, 0.2)',
                    color: '#5a4a61'
                  }}
                />
                <button
                  onClick={handleAddTask}
                  className="w-10 h-10 rounded-xl text-white flex items-center justify-center transition-opacity hover:opacity-90"
                  style={{ background: '#b39ddb' }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Upcoming Assignments */}
            <div className="rounded-3xl p-6 shadow-sm" style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.2)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5" style={{ color: '#b39ddb' }} />
                <h3 className="text-lg font-semibold" style={{ color: '#5a4a61' }}>Upcoming Assignments</h3>
              </div>

              {upcomingAssignments.length > 0 ? (
                <div className="space-y-3">
                  {upcomingAssignments.map((assignment) => {
                    const priorityColors = getPriorityColor(assignment.priority);
                    return (
                      <div
                        key={assignment.id}
                        className="p-3 rounded-xl transition-colors hover:shadow-sm cursor-pointer"
                        style={{ background: '#fdf7fd', border: '1px solid rgba(179, 157, 219, 0.1)' }}
                        onClick={() => navigate('/detailed-progress')}
                      >
                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#b39ddb' }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium mb-1" style={{ color: '#5a4a61' }}>
                              {assignment.title}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs px-2 py-0.5 rounded" style={{ background: '#e1bee7', color: '#5a4a61' }}>
                                {assignment.day}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded" style={{ background: priorityColors.bg, color: priorityColors.text }}>
                                {assignment.priority}
                              </span>
                              <span className="text-xs" style={{ color: '#9575a3' }}>
                                {assignment.progress}% done
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Calendar className="h-16 w-16 mb-3" style={{ color: '#e1bee7' }} />
                  <p className="text-sm mb-1" style={{ color: '#9575a3' }}>No upcoming assignments</p>
                  <p className="text-xs" style={{ color: '#9575a3', opacity: 0.7 }}>Add assignments to track your progress!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;