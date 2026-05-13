import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star, Award, TrendingUp, Calendar, ChevronLeft, ChevronRight,
  Sparkles, Brain, Grid3x3, Clock, Link2, CheckCircle2, Circle,
  AlertCircle, BookOpen, Zap, Edit2, X, Check
} from "lucide-react";
import { useUser } from "../../styles/SignInLandingPage/usercontext.jsx";


// ─── Canvas Integration Card ─────────────────────────────────────────────────
function CanvasIntegrationCard({ onConnected }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState(() => localStorage.getItem("canvasConnected") || "idle");
  const [isSyncing, setIsSyncing] = useState(false); // ✨ NEW: Loading state for the Sync button

  const handleConnect = () => {
    navigate("/canvas-integration");
  };

  const handleDisconnect = () => {
    setStatus("idle");
    localStorage.removeItem("canvasConnected");
    localStorage.removeItem("canvasToken"); // Clean up the token too!
  };

  // ✨ NEW: The actual sync logic for the "Sync Now" button!
  const handleSync = async () => {
    const token = localStorage.getItem("canvasToken");
    if (!token) {
      handleDisconnect(); // If they lost the token, log them out
      return;
    }
    
    setIsSyncing(true);
    try {
      const response = await fetch("https://fyp-neuro-zaaviya-server-01.vercel.app/api/canvas/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });

      if (response.ok) {
        const data = await response.json();
        // Teleport the user to the assignments page with the fresh Canvas data!
        navigate("/canvas-assignments", { state: { assignments: data.assignments } });
      } else {
        console.error("Failed to sync with Canvas");
      }
    } catch (err) {
      console.error("Network error during sync:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="rounded-3xl p-8 shadow-sm" style={{ background: "#ffffff", border: "1px solid rgba(179,157,219,0.2)" }}>
      <div className="flex items-center gap-4 mb-5">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
          style={{ background: status === "connected" ? "#e8f5e9" : "#e8f4fd" }}>
          {status === "connected"
            ? <CheckCircle2 className="h-6 w-6" style={{ color: "#43a047" }} />
            : <Link2 className="h-6 w-6" style={{ color: "#42a5f5" }} />}
        </div>
        <div>
          <h3 className="text-xl font-semibold" style={{ color: "#5a4a61" }}>Canvas Integration</h3>
          <p className="text-sm" style={{ color: "#9575a3" }}>Import assignments automatically</p>
        </div>
        {status === "connected" && (
          <span className="ml-auto text-xs px-3 py-1 rounded-full font-semibold"
            style={{ background: "#e8f5e9", color: "#43a047" }}>
            ● Connected
          </span>
        )}
      </div>

      {status !== "connected" ? (
        <>
          <p className="text-sm mb-5" style={{ color: "#9575a3" }}>
            Connect your Habib University Canvas account to automatically pull assignments and generate AI task breakdowns.
          </p>
          <button
            onClick={handleConnect}
            disabled={status === "connecting"}
            className="w-full flex items-center justify-between px-6 py-4 rounded-2xl font-semibold text-white transition-all hover:opacity-90 active:scale-95 cursor-pointer"
            style={{
              background: status === "connecting"
                ? "linear-gradient(135deg, #81c784, #4caf50)"
                : "linear-gradient(135deg, #26a69a, #00897b)",
              cursor: status === "connecting" ? "wait" : "pointer",
              boxShadow: "0 4px 15px rgba(0,137,123,0.3)"
            }}>
            <span>{status === "connecting" ? "Connecting to Canvas…" : "Connect Canvas Account"}</span>
            {status === "connecting"
              ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <ChevronRight className="h-5 w-5" />}
          </button>
        </>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: "#f1f8e9" }}>
            <BookOpen className="h-5 w-5 flex-shrink-0" style={{ color: "#43a047" }} />
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: "#2e7d32" }}>Assignments synced successfully</p>
              <p className="text-xs mt-0.5" style={{ color: "#66bb6a" }}>Last sync: just now · Auto-syncs every 30 min</p>
            </div>
          </div>
          <div className="flex gap-2">
            {/* ✨ FIXED: Added handleSync and cursor-pointer */}
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity ${isSyncing ? "cursor-wait opacity-70" : "cursor-pointer"}`}
              style={{ background: "#e8f5e9", color: "#2e7d32" }}>
              {isSyncing ? "Syncing..." : "Sync Now"}
            </button>
            {/* ✨ FIXED: Added cursor-pointer */}
            <button
              onClick={handleDisconnect}
              disabled={isSyncing}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
              style={{ background: "#ffebee", color: "#c62828" }}>
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


// ─── Upcoming Subtasks Card ───────────────────────────────────────────────────
function UpcomingSubtasksCard({ calendarEvents = [], onUpdate }) {
  const navigate = useNavigate();
  const [isCompleting, setIsCompleting] = useState(false);

  // ✨ BACKEND MAGIC: Filter calendar events for subtasks, sort by closest date & time!
  const subtasks = calendarEvents
    .filter(e => typeof e.id === 'string' && e.id.startsWith('sub-'))
    .sort((a, b) => {
      const dateA = new Date(`${a.dueDate || "9999-12-31"}T${a.time || "23:59"}`);
      const dateB = new Date(`${b.dueDate || "9999-12-31"}T${b.time || "23:59"}`);
      return dateA - dateB;
    })
    .slice(0, 6);

  const completedCount = subtasks.filter(t => t.status === 'Completed').length;

  // ✨ BACKEND MAGIC: Send completion status directly to Postgres!
  const handleComplete = async (taskId, isDone) => {
    if (isCompleting || isDone) return; // Backend only supports marking complete for now
    setIsCompleting(true);
    
    // Strip the 'sub-' prefix to get the real database ID
    const realId = taskId.replace('sub-', '');
    
    try {
      const res = await fetch(`https://fyp-neuro-zaaviya-server-01.vercel.app/api/subtasks/${realId}/complete`, { method: 'PUT' });
      if (res.ok) {
        onUpdate(); // Trigger dashboard refresh to update progress bars!
      }
    } catch (error) {
      console.error("Error completing subtask:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  const getPriorityStyle = (priority) => {
    const p = (priority || "").toLowerCase();
    if (p.includes("high"))   return { dot: "#ef4444", badge: "#ffebee", badgeText: "#c62828", label: "High" };
    if (p.includes("medium")) return { dot: "#ffa726", badge: "#fff8e1", badgeText: "#f57c00", label: "Med" };
    return { dot: "#66bb6a", badge: "#e8f5e9", badgeText: "#2e7d32", label: "Low" };
  };

  const formatDate = (ds) => {
    if (!ds) return null;
    try {
      const d = new Date(ds + "T12:00:00");
      const today = new Date();
      const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
      if (ds === today.toISOString().split("T")[0]) return "Today";
      if (ds === tomorrow.toISOString().split("T")[0]) return "Tomorrow";
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch { return ds; }
  };

  return (
    <div className="rounded-3xl p-7 shadow-sm" style={{ background: "#ffffff", border: "1px solid rgba(179,157,219,0.2)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#fce4ec" }}>
            <Zap className="h-5 w-5" style={{ color: "#f48fb1" }} />
          </div>
          <div>
            <h3 className="text-xl font-semibold" style={{ color: "#5a4a61" }}>Upcoming Subtasks</h3>
            {subtasks.length > 0 && (
              <p className="text-xs" style={{ color: "#9575a3" }}>{completedCount}/{subtasks.length} completed</p>
            )}
          </div>
        </div>
        {subtasks.length > 0 && (
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
            style={{ background: "#fce4ec", color: "#f48fb1" }}>
            {subtasks.length - completedCount} left
          </span>
        )}
      </div>

      {/* Progress bar */}
      {subtasks.length > 0 && (
        <div className="w-full h-2 rounded-full overflow-hidden mb-5" style={{ background: "#f3e5f5" }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${subtasks.length > 0 ? (completedCount / subtasks.length) * 100 : 0}%`, background: "#f48fb1" }} />
        </div>
      )}

      {/* Subtask list */}
      {subtasks.length > 0 ? (
        <div className="space-y-2">
          {subtasks.map(task => {
            const ps = getPriorityStyle(task.priority);
            const done = task.status === 'Completed';
            const dateLabel = formatDate(task.dueDate);
            return (
              <div key={task.id}
                className="flex items-start gap-3 p-3.5 rounded-2xl transition-all group"
                style={{ background: done ? "#fdf7fd" : "#fefefe", border: "1px solid rgba(179,157,219,0.12)", opacity: done ? 0.6 : 1 }}>
                <button 
                  onClick={() => handleComplete(task.id, done)} 
                  disabled={isCompleting || done}
                  className={`mt-0.5 flex-shrink-0 transition-transform ${!done && !isCompleting ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
                >
                  {done
                    ? <CheckCircle2 className="h-5 w-5" style={{ color: "#b39ddb" }} />
                    : <Circle className="h-5 w-5" style={{ color: "#d1c4e9" }} />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug truncate"
                    style={{ color: "#5a4a61", textDecoration: done ? "line-through" : "none" }}>
                    {task.title}
                  </p>
                  {task.notes && (
                    <p className="text-xs mt-0.5 truncate" style={{ color: "#9575a3" }}>{task.notes}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {dateLabel && (
                      <span className="flex items-center gap-1 text-xs"
                        style={{ color: dateLabel === "Today" ? "#c62828" : "#9575a3" }}>
                        <Calendar className="h-3 w-3" /> {dateLabel}
                      </span>
                    )}
                    {task.time && (
                      <span className="flex items-center gap-1 text-xs" style={{ color: "#9575a3" }}>
                        <Clock className="h-3 w-3" /> {task.time}
                      </span>
                    )}
                    {task.duration && (
                      <span className="text-xs" style={{ color: "#9575a3" }}>{task.duration}</span>
                    )}
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium ml-auto"
                      style={{ background: ps.badge, color: ps.badgeText }}>
                      {ps.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "#fce4ec" }}>
            <Zap className="h-8 w-8" style={{ color: "#f8bbd0" }} />
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: "#9575a3" }}>No subtasks yet</p>
          <p className="text-xs" style={{ color: "#9575a3", opacity: 0.7 }}>
            Subtasks from AI Task Breakdown and Eisenhower Matrix will appear here
          </p>
        </div>
      )}
    </div>
  );
}


// ─── Main Dashboard ───────────────────────────────────────────────────────────
function Dashboard() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [view, setView] = useState("week");
  const [myAdvisors, setMyAdvisors] = useState({ oap: "Assigning...", wellness: "Assigning..." });
  const [tasks, setTasks] = useState(() => {
    try {
      const s = localStorage.getItem("dashboardTodos");
      return s ? JSON.parse(s) : [
        { id: 1, text: "Review chapter 5", completed: false },
        { id: 2, text: "Finish project draft", completed: false },
        { id: 3, text: "Practice mindfulness", completed: true },
      ];
    } catch { return []; }
  });
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const [upcomingAssignments, setUpcomingAssignments] = useState([]);
  const [mainTasks, setMainTasks] = useState([]);

  const loadDashboardData = async () => {
    if (!user || !user.id) return;
    try {
      const userId = user.id;
      const calRes = await fetch(`https://fyp-neuro-zaaviya-server-01.vercel.app/api/calendar/${userId}`);
      if (calRes.ok) setUpcomingAssignments(await calRes.json());
      const taskRes = await fetch(`https://fyp-neuro-zaaviya-server-01.vercel.app/api/tasks/upcoming/${userId}`);
      if (taskRes.ok) setMainTasks(await taskRes.json());
      const advRes = await fetch(`https://fyp-neuro-zaaviya-server-01.vercel.app/api/student-advisors/${userId}`);
      if (advRes.ok) setMyAdvisors(await advRes.json());
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
  };

  useEffect(() => {
    loadDashboardData();
    window.addEventListener("focus", loadDashboardData);
    window.addEventListener("eisenhowerSaved", loadDashboardData);
    const interval = setInterval(loadDashboardData, 2000);
    return () => {
      window.removeEventListener("focus", loadDashboardData);
      window.removeEventListener("eisenhowerSaved", loadDashboardData);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("dashboardTodos", JSON.stringify(tasks));
  }, [tasks]);

  const computeProgress = (assignments) => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - (now.getDay() + 6) % 7);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    const days = { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] };
    const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    assignments.forEach(a => {
      try {
        const dateStr = a.dueDate || (a.createdAt ? a.createdAt.split("T")[0] : null);
        if (!dateStr) return;
        const d = new Date(dateStr + "T12:00:00");
        if (d < weekStart || d >= weekEnd) return;
        const name = dayNames[d.getDay()];
        if (days[name] !== undefined) days[name].push(a.progress || 0);
      } catch {}
    });
    const result = {};
    Object.entries(days).forEach(([day, vals]) => {
      result[day] = vals.length > 0 ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length) : 0;
    });
    return result;
  };

  const progress = computeProgress(mainTasks);
  const nonZeroDays = Object.values(progress).filter(v => v > 0);
  const weeklyProgress = nonZeroDays.length > 0
    ? Math.round(nonZeroDays.reduce((a, b) => a + b, 0) / nonZeroDays.length) : 0;

  const assignmentsOnDate = (dateStr) =>
    upcomingAssignments.filter(a => a.dueDate === dateStr);

  const sortedUpcoming = [...mainTasks]
    .sort((a, b) => {
      const order = { "High Priority": 0, "Medium Priority": 1, "Low Priority": 2 };
      if (order[a.priority] !== order[b.priority]) return (order[a.priority] ?? 2) - (order[b.priority] ?? 2);
      return new Date(a.dueDate || "9999") - new Date(b.dueDate || "9999");
    })
    .slice(0, 5);

  const getPriorityColor = (priority) => {
    if (priority === "High Priority")   return { bg: "#ffebee", text: "#c62828" };
    if (priority === "Medium Priority") return { bg: "#fff8e1", text: "#f57c00" };
    return { bg: "#e8f5e9", text: "#2e7d32" };
  };

  const getLocalDateStr = (d) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getMonthDays = () => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    const days = [];
    const startOffset = (first.getDay() + 6) % 7;
    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let i = 1; i <= last.getDate(); i++) days.push(new Date(y, m, i));
    return days;
  };

  const getWeekDays = () => {
    const start = new Date(currentDate);
    start.setDate(currentDate.getDate() - (currentDate.getDay() + 6) % 7);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start); d.setDate(start.getDate() + i); return d;
    });
  };

  const weekDays = getWeekDays();
  const monthDays = getMonthDays();
  const todayStr = getLocalDateStr(new Date());

  const navigateCalendar = (dir) => {
    const d = new Date(currentDate);
    if (view === "week") d.setDate(d.getDate() + dir * 7);
    else d.setMonth(d.getMonth() + dir);
    setCurrentDate(d);
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask("");
    }
  };
  
  const handleToggleTask = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  
  const handleDeleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));
  
  const handleEditTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      setEditingId(id);
      setEditText(task.text);
    }
  };
  
  const handleSaveEdit = (id) => {
    if (editText.trim()) {
      setTasks(tasks.map(t => t.id === id ? { ...t, text: editText } : t));
    }
    setEditingId(null);
    setEditText("");
  };
  
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };
  
  const handleEnterKey = (e) => e.key === "Enter" && handleAddTask();
  
  const handleEditEnterKey = (e, id) => {
    if (e.key === "Enter") handleSaveEdit(id);
    if (e.key === "Escape") handleCancelEdit();
  };

  return (
    <>
      <div className="min-h-screen p-8" style={{ background: "#f5eef8" }}>
        <div style={{ maxWidth: "1600px", margin: "0 auto" }} className="space-y-6">

          {/* Welcome Header */}
          <div className="rounded-3xl p-8 shadow-sm" style={{ background: "#ffffff", border: "1px solid rgba(179,157,219,0.2)" }}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-semibold mb-2" style={{ color: "#5a4a61" }}>
                  Welcome back, {user?.name?.split(' ')[0] || 'Student'}! ✨
                </h1>
                <p className="italic mb-4" style={{ color: "#b39ddb" }}>You're doing better than you think. Keep going! 🌸</p>
                <div className="flex gap-6 text-sm" style={{ color: "#9575a3" }}>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: "#5a4a61" }} />
                    <span>OAP Advisor: <strong style={{ color: "#5a4a61" }}>{myAdvisors.oap}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: "#4ade80" }} />
                    <span>Wellness Counselor: <strong style={{ color: "#5a4a61" }}>{myAdvisors.wellness}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main 2-col Grid */}
          <div className="grid grid-cols-5 gap-6">

            {/* LEFT col — 3/5 width */}
            <div className="col-span-3 space-y-6">

              {/* Weekly Progress */}
              <div className="rounded-3xl p-8 shadow-sm" style={{ background: "#ffffff", border: "1px solid rgba(179,157,219,0.2)" }}>
                <button onClick={() => navigate("/detailed-progress")}
                  className="w-full flex items-center gap-4 mb-7 rounded-2xl p-5 hover:opacity-90 transition-opacity"
                  style={{ background: "#f3e5f5", border: "none" }}>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0" style={{ background: "#ffffff" }}>
                    <TrendingUp className="h-7 w-7" style={{ color: "#b39ddb" }} />
                  </div>
                  <div className="text-left flex-1">
                    <h2 className="text-2xl font-semibold" style={{ color: "#5a4a61" }}>Weekly Progress</h2>
                    <p className="text-sm mt-0.5" style={{ color: "#9575a3" }}>Click to view and edit daily assignments</p>
                  </div>
                  <ChevronRight className="h-6 w-6" style={{ color: "#b39ddb" }} />
                </button>

                <div className="mb-7">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base" style={{ color: "#9575a3" }}>Overall Completion</span>
                    <span className="text-3xl font-semibold" style={{ color: "#b39ddb" }}>{weeklyProgress}%</span>
                  </div>
                  <div className="w-full h-4 rounded-full overflow-hidden" style={{ background: "#e1bee7" }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${weeklyProgress}%`, background: "#b39ddb" }} />
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-4">
                  {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(day => {
                    const value = progress[day] || 0;
                    return (
                      <div key={day} className="text-center">
                        <div className="text-sm mb-2 font-medium" style={{ color: "#9575a3" }}>{day}</div>
                        <div className="relative w-full aspect-square">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="50%" cy="50%" r="45%" fill="none" stroke="#e1bee7" strokeWidth="8" />
                            <circle cx="50%" cy="50%" r="45%" fill="none" stroke="#b39ddb" strokeWidth="8"
                              strokeDasharray={`${value * 2.83} 283`} strokeLinecap="round" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-semibold" style={{ color: "#b39ddb" }}>{value}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* AI Task Breakdown */}
              <div className="rounded-3xl p-8 shadow-sm" style={{ background: "#ffffff", border: "1px solid rgba(179,157,219,0.2)" }}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#e1bee7" }}>
                    <Brain className="h-6 w-6" style={{ color: "#b39ddb" }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold" style={{ color: "#5a4a61" }}>AI Task Breakdown</h3>
                    <p className="text-sm" style={{ color: "#9575a3" }}>Smart planning assistant</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => navigate("/ai-task-breakdown")}
                    className="flex items-center gap-4 p-5 rounded-2xl hover:opacity-90 transition-opacity"
                    style={{ background: "#f3e5f5", border: "1px solid rgba(179,157,219,0.2)" }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#ffffff" }}>
                      <Sparkles className="h-6 w-6" style={{ color: "#b39ddb" }} />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-base" style={{ color: "#5a4a61" }}>AI Smart Breakdown</div>
                      <div className="text-sm mt-0.5" style={{ color: "#9575a3" }}>Let AI analyze and organize your tasks</div>
                    </div>
                  </button>
                  <button onClick={() => navigate("/eisenhower-matrix")}
                    className="flex items-center gap-4 p-5 rounded-2xl hover:opacity-90 transition-opacity"
                    style={{ background: "#fce4ec", border: "1px solid rgba(248,187,208,0.3)" }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#ffffff" }}>
                      <Grid3x3 className="h-6 w-6" style={{ color: "#f8bbd0" }} />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-base" style={{ color: "#5a4a61" }}>Eisenhower Matrix</div>
                      <div className="text-sm mt-0.5" style={{ color: "#9575a3" }}>Manual priority-based organization</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* ── NEW: Canvas Integration ── */}
              <CanvasIntegrationCard onConnected={loadDashboardData} />

              {/* ── NEW: Upcoming Subtasks ── */}
              <UpcomingSubtasksCard 
                calendarEvents={upcomingAssignments} 
                onUpdate={loadDashboardData} 
              />

            </div>

            {/* RIGHT col — 2/5 width */}
            <div className="col-span-2 space-y-6">

              {/* Calendar */}
              <div className="rounded-3xl p-7 shadow-sm" style={{ background: "#ffffff", border: "1px solid rgba(179,157,219,0.2)" }}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-semibold" style={{ color: "#5a4a61" }}>
                    {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button onClick={() => navigateCalendar(-1)} className="p-2 rounded-lg hover:opacity-80 transition-opacity cursor-pointer" style={{ background: "#f3e5f5" }}>
                      <ChevronLeft className="h-4 w-4" style={{ color: "#9575a3" }} />
                    </button>
                    <button onClick={() => navigateCalendar(1)} className="p-2 rounded-lg hover:opacity-80 transition-opacity cursor-pointer" style={{ background: "#f3e5f5" }}>
                      <ChevronRight className="h-4 w-4" style={{ color: "#9575a3" }} />
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 mb-5">
                  {["week","month"].map(v => (
                    <button key={v} onClick={() => setView(v)}
                      className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors capitalize"
                      style={{ background: view === v ? "#e1bee7" : "#fdf7fd", color: view === v ? "#b39ddb" : "#9575a3" }}>
                      {v}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2 text-center mb-3">
                  {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
                    <div key={d} className="text-xs font-medium" style={{ color: "#9575a3" }}>{d}</div>
                  ))}
                </div>

                {view === "week" ? (
                  <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((date, idx) => {
                      const ds = getLocalDateStr(date);
                      const list = assignmentsOnDate(ds);
                      const isToday = ds === todayStr;
                      return (
                        <div key={idx}
                          className="aspect-square flex flex-col items-center justify-center rounded-xl text-sm cursor-pointer hover:opacity-90 transition-opacity"
                          style={{ background: isToday ? "#b39ddb" : "#fdf7fd", color: isToday ? "#ffffff" : "#5a4a61", fontWeight: isToday ? "600" : "400" }}
                          onClick={() => list.length > 0 && setSelectedDate({ dateStr: ds, date, assignments: list })}>
                          <span>{date.getDate()}</span>
                          {list.length > 0 && (
                            <span className="text-[10px] mt-0.5 px-1.5 rounded font-semibold"
                              style={{ background: isToday ? "rgba(255,255,255,0.3)" : "#b39ddb", color: "#fff" }}>
                              {list.length}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-7 gap-2">
                    {monthDays.map((d, i) => {
                      if (!d) return <div key={`empty-${i}`} className="aspect-square" />;
                      const ds = getLocalDateStr(d);
                      const list = assignmentsOnDate(ds);
                      const isToday = ds === todayStr;
                      return (
                        <div key={i}
                          className="aspect-square flex flex-col items-center justify-center rounded-xl text-sm cursor-pointer hover:opacity-90 transition-opacity"
                          style={{ background: isToday ? "#b39ddb" : "#fdf7fd", color: isToday ? "#ffffff" : "#5a4a61", fontWeight: isToday ? "600" : "400" }}
                          onClick={() => list.length > 0 && setSelectedDate({ dateStr: ds, date: d, assignments: list })}>
                          <span>{d.getDate()}</span>
                          {list.length > 0 && (
                            <span className="text-[10px] mt-0.5 px-1.5 rounded font-semibold"
                              style={{ background: isToday ? "rgba(255,255,255,0.3)" : "#b39ddb", color: "#fff" }}>
                              {list.length}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* My To-Do's */}
              <div className="rounded-3xl p-6 shadow-sm" style={{ background: "#ffffff", border: "1px solid rgba(179,157,219,0.2)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5" style={{ color: "#f8bbd0" }} />
                  <h3 className="text-lg font-semibold" style={{ color: "#5a4a61" }}>My To-Do's</h3>
                </div>
                <div className="space-y-2 mb-4">
                  {tasks.map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl transition-colors group"
                      style={{ background: task.completed ? "#f3e5f5" : "transparent" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f3e5f5"}
                      onMouseLeave={e => e.currentTarget.style.background = task.completed ? "#f3e5f5" : "transparent"}>
                      <input type="checkbox" checked={task.completed} onChange={() => handleToggleTask(task.id)}
                        className="w-5 h-5 rounded cursor-pointer flex-shrink-0" style={{ accentColor: "#b39ddb" }} />
                      
                      {editingId === task.id ? (
                        <input
                          type="text"
                          value={editText}
                          onChange={e => setEditText(e.target.value)}
                          onKeyDown={e => handleEditEnterKey(e, task.id)}
                          className="flex-1 px-3 py-1 rounded-lg text-sm focus:outline-none"
                          style={{ background: "#fdf7fd", border: "1px solid rgba(179,157,219,0.3)", color: "#5a4a61" }}
                          autoFocus
                        />
                      ) : (
                        <span className="flex-1 text-sm"
                          style={{ textDecoration: task.completed ? "line-through" : "none", color: task.completed ? "#9575a3" : "#5a4a61" }}>
                          {task.text}
                        </span>
                      )}
                      
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {editingId === task.id ? (
                          <>
                            <button onClick={() => handleSaveEdit(task.id)}
                              className="p-1 rounded hover:bg-green-100 transition-colors" title="Save">
                              <Check className="h-4 w-4" style={{ color: "#2e7d32" }} />
                            </button>
                            <button onClick={handleCancelEdit}
                              className="p-1 rounded hover:bg-gray-100 transition-colors" title="Cancel">
                              <X className="h-4 w-4" style={{ color: "#9575a3" }} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleEditTask(task.id)}
                              className="p-1 rounded hover:bg-blue-100 transition-colors" title="Edit">
                              <Edit2 className="h-4 w-4" style={{ color: "#42a5f5" }} />
                            </button>
                            <button onClick={() => handleDeleteTask(task.id)}
                              className="p-1 rounded hover:bg-red-100 transition-colors" title="Delete">
                              <X className="h-4 w-4" style={{ color: "#e57373" }} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" placeholder="Add a new task..." value={newTask}
                    onChange={e => setNewTask(e.target.value)} onKeyDown={handleEnterKey}
                    className="flex-1 px-4 py-2 rounded-xl text-sm focus:outline-none"
                    style={{ background: "#fdf7fd", border: "1px solid rgba(179,157,219,0.2)", color: "#5a4a61" }} />
                  <button onClick={handleAddTask}
                    className="w-10 h-10 rounded-xl text-white flex items-center justify-center hover:opacity-90"
                    style={{ background: "#b39ddb" }}>+</button>
                </div>
              </div>

              {/* Upcoming Assignments */}
              <div className="rounded-3xl p-7 shadow-sm" style={{ background: "#ffffff", border: "1px solid rgba(179,157,219,0.2)" }}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5" style={{ color: "#b39ddb" }} />
                    <h3 className="text-xl font-semibold" style={{ color: "#5a4a61" }}>Upcoming Assignments</h3>
                  </div>
                  {sortedUpcoming.length > 0 && (
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "#f3e5f5", color: "#b39ddb" }}>
                      {sortedUpcoming.length}
                    </span>
                  )}
                </div>

                {sortedUpcoming.length > 0 ? (
                  <div className="space-y-3">
                    {sortedUpcoming.map(assignment => {
                      const pc = getPriorityColor(assignment.priority);
                      const due = assignment.dueDate
                        ? new Date(assignment.dueDate + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })
                        : null;
                      return (
                        <div key={assignment.id}
                          className="p-4 rounded-xl hover:shadow-sm cursor-pointer transition-all"
                          style={{ background: "#fdf7fd", border: "1px solid rgba(179,157,219,0.1)" }}
                          onClick={() => navigate(`/detailed-progress?id=${assignment.id}`)}>
                          <div className="flex items-start gap-3">
                            <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "#b39ddb" }} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium mb-2 truncate" style={{ color: "#5a4a61" }}>{assignment.title}</p>
                              <div className="w-full h-1.5 rounded-full overflow-hidden mb-2" style={{ background: "#e1bee7" }}>
                                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${assignment.progress ?? 0}%`, background: "#b39ddb" }} />
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                {due && (
                                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: "#e1bee7", color: "#5a4a61" }}>
                                    Due {due}
                                  </span>
                                )}
                                <span className="text-xs px-2 py-0.5 rounded" style={{ background: pc.bg, color: pc.text }}>
                                  {assignment.priority}
                                </span>
                                <span className="text-xs" style={{ color: "#9575a3" }}>{assignment.progress ?? 0}% done</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Calendar className="h-16 w-16 mb-4" style={{ color: "#e1bee7" }} />
                    <p className="text-sm mb-1" style={{ color: "#9575a3" }}>No upcoming assignments</p>
                    <p className="text-xs" style={{ color: "#9575a3", opacity: 0.7 }}>
                      Use AI Task Breakdown or Eisenhower Matrix to add tasks!
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Date popup modal */}
      {selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(90,74,97,0.35)" }}
          onClick={() => setSelectedDate(null)}>
          <div className="rounded-3xl shadow-2xl w-80 max-w-full mx-4 overflow-hidden"
            style={{ background: "#fff" }}
            onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 flex items-center justify-between"
              style={{ background: "#f3e5f5", borderBottom: "1px solid rgba(179,157,219,0.2)" }}>
              <div>
                <div className="font-semibold" style={{ color: "#5a4a61" }}>
                  {selectedDate.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "#9575a3" }}>
                  {selectedDate.assignments.length} assignment{selectedDate.assignments.length !== 1 ? "s" : ""}
                </div>
              </div>
              <button onClick={() => setSelectedDate(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:opacity-80"
                style={{ background: "#fff" }}>
                <span style={{ color: "#9575a3", fontSize: 16 }}>✕</span>
              </button>
            </div>
            <div className="p-4 space-y-2 max-h-72 overflow-y-auto">
              {selectedDate.assignments.map(a => {
                const pc = a.priority === "High Priority"
                  ? { bg: "#ffebee", text: "#c62828", bar: "#ef4444" }
                  : a.priority === "Medium Priority"
                  ? { bg: "#fff8e1", text: "#f57c00", bar: "#ffa726" }
                  : { bg: "#e8f5e9", text: "#2e7d32", bar: "#66bb6a" };
                return (
                  <button key={a.id}
                    onClick={() => { setSelectedDate(null); navigate(`/detailed-progress?id=${a.id}`); }}
                    className="w-full text-left rounded-2xl p-3 hover:shadow-md transition-all"
                    style={{ background: pc.bg, border: `1px solid ${pc.bar}22` }}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-sm font-semibold leading-snug" style={{ color: pc.text }}>{a.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 font-medium"
                        style={{ background: "rgba(255,255,255,0.7)", color: pc.text }}>
                        {a.priority?.replace(" Priority","")}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full overflow-hidden mb-1" style={{ background: "rgba(0,0,0,0.08)" }}>
                      <div className="h-full rounded-full" style={{ width: `${a.progress ?? 0}%`, background: pc.bar }} />
                    </div>
                    <div className="text-[10px]" style={{ color: pc.text, opacity: 0.7 }}>
                      {a.progress ?? 0}% done · tap to update progress
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="px-4 pb-4 flex gap-2">
              <button onClick={() => { setSelectedDate(null); navigate("/calendar"); }}
                className="flex-1 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                style={{ background: "#e1bee7", color: "#5a4a61" }}>
                Full Calendar View
              </button>
              <button onClick={() => { setSelectedDate(null); navigate("/detailed-progress"); }}
                className="flex-1 py-2 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity"
                style={{ background: "#b39ddb" }}>
                Weekly Progress
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;