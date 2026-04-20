import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Award, TrendingUp, Calendar, ChevronLeft, ChevronRight, Sparkles, Brain, Grid3x3, Clock } from "lucide-react";
// ADD THIS LINE:
import { useUser } from "../../styles/SignInLandingPage/usercontext.jsx";


function Dashboard() {
  const navigate = useNavigate();
  const { user } = useUser(); // <--- 1. Grab the logged-in user!

  const [view, setView] = useState("week");
  const [tasks, setTasks] = useState(() => {
    try { const s = localStorage.getItem("dashboardTodos"); return s ? JSON.parse(s) : [
      { id: 1, text: "Review chapter 5", completed: false },
      { id: 2, text: "Finish project draft", completed: false },
      { id: 3, text: "Practice mindfulness", completed: true },
    ]; } catch { return []; }
  });
  const [newTask, setNewTask] = useState("");
  const [currentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null); 

  const [upcomingAssignments, setUpcomingAssignments] = useState([]);
  const [mainTasks, setMainTasks] = useState([]);

  const loadDashboardData = async () => {
    // 2. Safety check: Don't fetch if no user is logged in
    if (!user || !user.id) return; 

    try {
      // 3. Swap out the hardcoded ID for the real one!
      const userId = user.id; 
      
      const calRes = await fetch(`http://127.0.0.1:5000/api/calendar/${userId}`);
      if (calRes.ok) setUpcomingAssignments(await calRes.json());

      const taskRes = await fetch(`http://127.0.0.1:5000/api/tasks/upcoming/${userId}`);
      if (taskRes.ok) setMainTasks(await taskRes.json());
      
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

  // Save todos separately (never mixed with assignments)
  useEffect(() => {
    localStorage.setItem("dashboardTodos", JSON.stringify(tasks));
  }, [tasks]);

  // ── Week progress: Mon–Sun, current week only ─────────────────────────────
  const computeProgress = (assignments) => {
    const now = new Date();
    // Mon-start: (getDay()+6)%7 gives Mon=0 … Sun=6
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - (now.getDay() + 6) % 7);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);

    const days = { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] };
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

// ── Weekly Progress (Rings): Now uses mainTasks for accurate math! ───────
  const progress = computeProgress(mainTasks);
  const nonZeroDays = Object.values(progress).filter(v => v > 0);
  const weeklyProgress = nonZeroDays.length > 0
    ? Math.round(nonZeroDays.reduce((a, b) => a + b, 0) / nonZeroDays.length) : 0;

  // ── Calendar: assignments for a date (Still uses the full list for dots) ─
  const assignmentsOnDate = (dateStr) =>
    upcomingAssignments.filter(a => a.dueDate === dateStr);

// ── Upcoming: Main Tasks Only, sorted by priority then dueDate ───────
  const sortedUpcoming = [...mainTasks]
    .sort((a, b) => {
      const order = { "High Priority": 0, "Medium Priority": 1, "Low Priority": 2 };
      if (order[a.priority] !== order[b.priority]) return (order[a.priority] ?? 2) - (order[b.priority] ?? 2);
      return new Date(a.dueDate || "9999") - new Date(b.dueDate || "9999");
    })
    .slice(0, 5);

  const badges = [
    { name: "Early Bird",    bgColor: "#f8bbd0", icon: Star },
    { name: "Study Streak",  bgColor: "#b39ddb", icon: Award },
    { name: "Progress Hero", bgColor: "#4ade80", icon: TrendingUp },
    { name: "Motivation",    bgColor: "#e57373", icon: Sparkles },
  ];

  const getPriorityColor = (priority) => {
    if (priority === "High Priority")   return { bg: "#ffebee", text: "#c62828" };
    if (priority === "Medium Priority") return { bg: "#fff8e1", text: "#f57c00" };
    return { bg: "#e8f5e9", text: "#2e7d32" };
  };

  const getDaysInMonth = () =>
    new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  const getWeekDays = () => {
    // Mon-start week
    const start = new Date(currentDate);
    start.setDate(currentDate.getDate() - (currentDate.getDay() + 6) % 7);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start); d.setDate(start.getDate() + i); return d;
    });
  };

  const weekDays = getWeekDays();
  const todayStr = currentDate.toISOString().split("T")[0];

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask("");
    }
  };
  const handleToggleTask = (id) => setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const handleDeleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));
  const handleEnterKey   = (e) => e.key === "Enter" && handleAddTask();

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
                    <span>OAP Advisor: <strong style={{ color: "#5a4a61" }}>Dr. Fatima Khan</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: "#4ade80" }} />
                    <span>Wellness Counsellor: <strong style={{ color: "#5a4a61" }}>Sara Ali</strong></span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                {badges.map((badge, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 p-4 rounded-2xl shadow-md hover:scale-105 transition-transform cursor-pointer" style={{ background: badge.bgColor }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.9)" }}>
                      <badge.icon className="h-6 w-6" style={{ color: "#b39ddb" }} />
                    </div>
                    <span className="text-xs font-medium text-center text-white">{badge.name}</span>
                  </div>
                ))}
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
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${weeklyProgress}%`, background: "#b39ddb" }} />
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
            </div>

            {/* RIGHT col — 2/5 width */}
            <div className="col-span-2 space-y-6">

              {/* Calendar */}
              <div className="rounded-3xl p-7 shadow-sm" style={{ background: "#ffffff", border: "1px solid rgba(179,157,219,0.2)" }}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-semibold" style={{ color: "#5a4a61" }}>
                    {view === "week" ? "Week" : "Month"} View
                  </h3>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg" style={{ background: "#f3e5f5" }}>
                      <ChevronLeft className="h-4 w-4" style={{ color: "#9575a3" }} />
                    </button>
                    <button className="p-2 rounded-lg" style={{ background: "#f3e5f5" }}>
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
                      const ds = date.toISOString().split("T")[0];
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
                    {Array.from({ length: getDaysInMonth() }, (_, i) => {
                      const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
                      const ds = d.toISOString().split("T")[0];
                      const list = assignmentsOnDate(ds);
                      const isToday = ds === todayStr;
                      return (
                        <div key={i}
                          className="aspect-square flex flex-col items-center justify-center rounded-xl text-sm cursor-pointer hover:opacity-90 transition-opacity"
                          style={{ background: isToday ? "#b39ddb" : "#fdf7fd", color: isToday ? "#ffffff" : "#5a4a61", fontWeight: isToday ? "600" : "400" }}
                          onClick={() => list.length > 0 && setSelectedDate({ dateStr: ds, date: d, assignments: list })}>
                          <span>{i + 1}</span>
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

              {/* My To-Do's (Fixed Version) */}
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
                        className="w-5 h-5 rounded cursor-pointer" style={{ accentColor: "#b39ddb" }} />
                      <span className="flex-1 text-sm"
                        style={{ textDecoration: task.completed ? "line-through" : "none", color: task.completed ? "#9575a3" : "#5a4a61" }}>
                        {task.text}
                      </span>
                      <button onClick={() => handleDeleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 text-xs transition-opacity" style={{ color: "#e57373" }}>
                        Delete
                      </button>
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
                              {/* Live progress bar */}
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
                    <p className="text-xs" style={{ color: "#9575a3", opacity: 0.7 }}>Use AI Task Breakdown or Eisenhower Matrix to add tasks!</p>
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