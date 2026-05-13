import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, CheckCircle2, Clock, Sparkles, Edit2, Save, X, Trash2, Plus, Calendar, Brain, ChevronRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../styles/SignInLandingPage/usercontext.jsx";

const API = "http://127.0.0.1:8000/api";

function DetailedProgress() {
  const navigate = useNavigate();
  const location = useLocation();
  // Read ?id= from URL to highlight a specific assignment
  const pinnedId = new URLSearchParams(location.search).get("id");
  const pinnedRef = useRef(null);
  const { user } = useUser();

  // When arriving with ?id=, jump to the week containing that assignment
  const getWeekOffsetForDate = (dateStr) => {
    if (!dateStr) return 0;
    try {
      const d = new Date(dateStr + "T12:00:00");
      const now = new Date();
      const thisWeekMon = new Date(now);
      thisWeekMon.setDate(now.getDate() - (now.getDay() + 6) % 7);
      thisWeekMon.setHours(0, 0, 0, 0);
      const assignmentWeekMon = new Date(d);
      assignmentWeekMon.setDate(d.getDate() - (d.getDay() + 6) % 7);
      assignmentWeekMon.setHours(0, 0, 0, 0);
      const diffMs = assignmentWeekMon - thisWeekMon;
      return Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));
    } catch { return 0; }
  };
  const [weekData, setWeekData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [addingToDay, setAddingToDay] = useState(null);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(() => {
    // If arriving with ?id=, start on the week of that assignment
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) return 0;
    try {
      const raw = localStorage.getItem("upcomingAssignments");
      const all = raw ? JSON.parse(raw) : [];
      const found = all.find(a => String(a.id) === String(id));
      if (!found?.dueDate) return 0;
      const d = new Date(found.dueDate + "T12:00:00");
      const now = new Date();
      const thisWeekMon = new Date(now);
      thisWeekMon.setDate(now.getDate() - (now.getDay() + 6) % 7);
      thisWeekMon.setHours(0, 0, 0, 0);
      const assignWeekMon = new Date(d);
      assignWeekMon.setDate(d.getDate() - (d.getDay() + 6) % 7);
      assignWeekMon.setHours(0, 0, 0, 0);
      return Math.round((assignWeekMon - thisWeekMon) / (7 * 24 * 60 * 60 * 1000));
    } catch { return 0; }
  });

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const mockWeekData = { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] };

  const fetchWeekData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch all tasks from your real database (Using Ushna's ID)
      if (!user || !user.id) return;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/upcoming/${user.id}`);
      const assignmentsFromDB = response.ok ? await response.json() : [];

      let mergedWeekData = { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] };
      const today = new Date();
      
      // Calculate the start and end of the currently selected week
      const startOfTargetWeek = new Date(today);
      startOfTargetWeek.setDate(today.getDate() - (today.getDay() + 6) % 7 + currentWeekOffset * 7);
      startOfTargetWeek.setHours(0, 0, 0, 0);
      const endOfTargetWeek = new Date(startOfTargetWeek.getTime() + 7 * 24 * 60 * 60 * 1000);

      // 2. Loop through DB tasks and sort them into the correct days
      assignmentsFromDB.forEach(assignment => {
        if (assignment.dueDate) {
          try {
            const assignmentDate = new Date(assignment.dueDate + "T12:00:00");
            
            // If the task falls within the week we are looking at...
            if (assignmentDate >= startOfTargetWeek && assignmentDate < endOfTargetWeek) {
              const dayOfWeek = assignmentDate.getDay();
              const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert Sunday to end of week
              const day = daysOfWeek[dayIndex];

              if (!mergedWeekData[day]) mergedWeekData[day] = [];
              
              mergedWeekData[day].push({
                id: assignment.id,
                title: assignment.title,
                course: assignment.category || "Assignment",
                status: assignment.status === "completed" ? "Completed" : "In Progress",
                priority: assignment.priority,
                progress: assignment.progress || 0,
                dueDate: assignment.dueDate,
                notes: assignment.description || ""
              });
            }
          } catch (e) {}
        }
      });

      setWeekData(mergedWeekData);
      setError(null);
    } catch (err) {
      console.error("Failed to load weekly progress from DB:", err);
      setWeekData({ Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeekData();
    const handleExternalChange = () => fetchWeekData();
    window.addEventListener("eisenhowerSaved", handleExternalChange);
    return () => {
      window.removeEventListener("eisenhowerSaved", handleExternalChange);
    };
  }, [currentWeekOffset]);

  // Scroll to pinned assignment after data loads
  useEffect(() => {
    if (!loading && pinnedId && pinnedRef.current) {
      setTimeout(() => {
        pinnedRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [loading, pinnedId]);

  const calculateDayProgress = (assignments) => {
    if (!assignments || assignments.length === 0) return 0;
    return Math.round(assignments.reduce((sum, a) => sum + (a.progress || 0), 0) / assignments.length);
  };

  const updateWeekData = (newWeekData) => {
    setWeekData(newWeekData);
    let allAssignments = [];
    try { const raw = localStorage.getItem("upcomingAssignments"); allAssignments = raw ? JSON.parse(raw) : []; } catch {}

    const updatedIds = new Set();
    const updatedEntries = [];
    daysOfWeek.forEach(day => {
      (newWeekData[day] || []).forEach(a => {
        updatedIds.add(a.id);
        updatedEntries.push({ id: a.id, title: a.title, course: a.course, status: a.status, priority: a.priority, progress: a.progress, dueDate: a.dueDate, notes: a.notes || "" });
      });
    });
    // Merge: update progress/fields for touched assignments, keep everything else as-is
    const finalAssignments = allAssignments.map(a => {
      if (updatedIds.has(a.id)) {
        const updated = updatedEntries.find(u => u.id === a.id);
        return updated ? { ...a, ...updated } : a;
      }
      return a;
    });
    // Also add any brand-new entries not previously in upcomingAssignments
    updatedEntries.forEach(u => {
      if (!allAssignments.find(a => a.id === u.id)) finalAssignments.push(u);
    });
    localStorage.setItem("upcomingAssignments", JSON.stringify(finalAssignments));
    window.dispatchEvent(new Event("eisenhowerSaved"));
  };

  const handleUpdateAssignment = (day, assignmentId, updates) => {
    const newWeekData = { ...weekData };
    const idx = newWeekData[day].findIndex(a => a.id === assignmentId);
    if (idx !== -1) {
      // Auto-complete when progress reaches 100
      const merged = { ...newWeekData[day][idx], ...updates };
      if (merged.progress >= 100) {
        merged.status = "Completed";
        // Remove from upcomingAssignments so it disappears from Dashboard
        try {
          const raw = localStorage.getItem("upcomingAssignments");
          const all = raw ? JSON.parse(raw) : [];
          localStorage.setItem("upcomingAssignments", JSON.stringify(
            all.filter(a => String(a.id) !== String(assignmentId))
          ));
        } catch {}
      }
      newWeekData[day][idx] = merged;
      updateWeekData(newWeekData);
    }
    setEditingAssignment(null);
  };

  const handleDeleteAssignment = (day, assignmentId) => {
    // 1. Remove from weekData state
    const newWeekData = { ...weekData };
    newWeekData[day] = (newWeekData[day] || []).filter(a => a.id !== assignmentId);
    setWeekData(newWeekData);

    // 2. Remove from localStorage upcomingAssignments permanently
    try {
      const raw = localStorage.getItem("upcomingAssignments");
      const all = raw ? JSON.parse(raw) : [];
      const filtered = all.filter(a => String(a.id) !== String(assignmentId));
      localStorage.setItem("upcomingAssignments", JSON.stringify(filtered));
    } catch (e) {}

    // 3. Also remove from eisenhowerTasks if it came from there
    try {
      const raw = localStorage.getItem("eisenhowerTasks");
      const eisenTasks = raw ? JSON.parse(raw) : [];
      const filtered = eisenTasks.filter(t => String(t.id) !== String(assignmentId));
      localStorage.setItem("eisenhowerTasks", JSON.stringify(filtered));
    } catch (e) {}
  };

  const handleSaveNewAssignment = (day, newAssignment) => {
    const newWeekData = { ...weekData };
    // Determine the correct day column from dueDate if provided
    let targetDay = day;
    if (newAssignment.dueDate) {
      try {
        const d = new Date(newAssignment.dueDate + "T12:00:00");
        const jsDay = d.getDay(); // 0=Sun,1=Mon,...,6=Sat
        const dayIndex = jsDay === 0 ? 6 : jsDay - 1; // convert to Mon=0,...,Sun=6
        targetDay = daysOfWeek[dayIndex];
      } catch {}
    }
    if (!newWeekData[targetDay]) newWeekData[targetDay] = [];
    newWeekData[targetDay].push({ id: `manual-${Date.now()}`, ...newAssignment, progress: 0, status: "In Progress" });
    updateWeekData(newWeekData);
    setAddingToDay(null);
  };

  const getStatusColor = (status) => {
    if (status === "Completed")  return { bg: '#e8f5e9', text: '#2e7d32', border: '#4caf50' };
    if (status === "In Progress") return { bg: '#e3f2fd', text: '#1565c0', border: '#2196f3' };
    return { bg: '#f3e5f5', text: '#7b1fa2', border: '#9c27b0' };
  };
  const getPriorityColor = (priority) => {
    if (priority === "High Priority")   return { bg: '#ffebee', text: '#c62828' };
    if (priority === "Medium Priority") return { bg: '#fff8e1', text: '#f57c00' };
    return { bg: '#e8f5e9', text: '#2e7d32' };
  };

  const getWeekLabel = () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (startDate.getDay() + 6) % 7 + currentWeekOffset * 7);
    const endDate = new Date(startDate); endDate.setDate(endDate.getDate() + 6);
    return `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f5eef8' }}>
      <div className="text-center">
        <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#e1bee7', borderTopColor: '#b39ddb' }} />
        <p style={{ color: '#9575a3' }}>Loading your assignments...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: '#f5eef8' }}>
      <div className="p-6 pl-12 space-y-6" style={{ width: '80vw' }}>

        {/* Header */}
        <div>
          <button onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl mb-4 transition-colors hover:opacity-80"
            style={{ background: '#ffffff', border: '1px solid rgba(179,157,219,0.2)', color: '#5a4a61' }}>
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </button>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Sparkles className="h-6 w-6" style={{ color: '#b39ddb' }} />
                <h1 className="text-3xl font-semibold" style={{ color: '#5a4a61' }}>Weekly Progress</h1>
              </div>
              <p className="text-sm" style={{ color: '#9575a3' }}>Track and manage your assignments across weeks</p>
            </div>
            {/* Week navigation */}
            <div className="flex items-center gap-4">
              <button onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
                className="font-medium text-sm hover:opacity-80 transition-opacity"
                style={{ background: '#e1bee7', color: '#5a4a61', padding: '10px 28px', borderRadius: 14, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                ← Previous Week
              </button>
              <div className="text-center" style={{ minWidth: 130 }}>
                <div className="text-base font-bold" style={{ color: '#b39ddb' }}>
                  {currentWeekOffset === 0 ? "This Week" : currentWeekOffset > 0 ? `+${currentWeekOffset} week${currentWeekOffset > 1 ? "s" : ""}` : `${Math.abs(currentWeekOffset)} week${Math.abs(currentWeekOffset) > 1 ? "s" : ""} ago`}
                </div>
                <p className="text-xs" style={{ color: '#9575a3' }}>{getWeekLabel()}</p>
              </div>
              <button onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
                className="font-medium text-sm hover:opacity-80 transition-opacity"
                style={{ background: '#e1bee7', color: '#5a4a61', padding: '10px 28px', borderRadius: 14, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Next Week →
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl" style={{ background: '#fff5f5', border: '1px solid #e57373' }}>
            <p style={{ color: '#e57373' }}>⚠️ {error}</p>
          </div>
        )}

        {/* Days grid */}
        <div className="grid grid-cols-1 gap-6">
          {daysOfWeek.map((day) => {
            const dayAssignments = weekData[day] || [];
            const dayProgress = calculateDayProgress(dayAssignments);

            return (
              <div key={day} className="rounded-3xl p-6 shadow-sm" style={{ background: '#ffffff', border: '1px solid rgba(179,157,219,0.2)' }}>

                {/* Day header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-semibold" style={{ color: '#5a4a61' }}>{day}</h2>
                    <div className="flex items-center gap-2">
                      <div className="relative w-12 h-12">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="50%" cy="50%" r="45%" fill="none" stroke="#e1bee7" strokeWidth="4" />
                          <circle cx="50%" cy="50%" r="45%" fill="none" stroke="#b39ddb" strokeWidth="4"
                            strokeDasharray={`${dayProgress * 1.7} 170`} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-semibold" style={{ color: '#b39ddb' }}>{dayProgress}%</span>
                        </div>
                      </div>
                      <span className="text-sm" style={{ color: '#9575a3' }}>
                        {dayAssignments.length} {dayAssignments.length === 1 ? "assignment" : "assignments"}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setAddingToDay(addingToDay === day ? null : day)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl hover:opacity-80 transition-opacity font-medium"
                    style={{ background: '#b39ddb', color: '#ffffff' }}>
                    <Plus className="h-4 w-4" />
                    Add Assignment
                  </button>
                </div>

                <div className="w-full h-2 rounded-full mb-4 overflow-hidden" style={{ background: '#e1bee7' }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${dayProgress}%`, background: '#b39ddb' }} />
                </div>

                {/* Add new assignment form */}
                {addingToDay === day && (
                  <NewAssignmentForm
                    day={day}
                    onSave={(a) => handleSaveNewAssignment(day, a)}
                    onCancel={() => setAddingToDay(null)}
                  />
                )}

                {/* Assignment list */}
                {dayAssignments.length > 0 ? (
                  <div className="space-y-3 mt-2">
                    {dayAssignments.map((assignment) => {
                      const isEditing = editingAssignment?.id === assignment.id && editingAssignment?.day === day;
                      return (
                        <AssignmentCard
                          key={assignment.id}
                          assignment={assignment}
                          day={day}
                          isEditing={isEditing}
                          isPinned={pinnedId === String(assignment.id)}
                          pinnedRef={pinnedId === String(assignment.id) ? pinnedRef : null}
                          statusColors={getStatusColor(assignment.status)}
                          priorityColors={getPriorityColor(assignment.priority)}
                          onEdit={() => setEditingAssignment({ ...assignment, day })}
                          onSave={(updates) => handleUpdateAssignment(day, assignment.id, updates)}
                          onCancel={() => setEditingAssignment(null)}
                          onDelete={() => handleDeleteAssignment(day, assignment.id)}
                          onDeepWork={() => navigate(`/deep-work?id=${assignment.id}`)}
                        />
                      );
                    })}
                  </div>
                ) : (
                  !addingToDay && (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: '#f3e5f5' }}>
                        <Plus className="h-5 w-5" style={{ color: '#b39ddb' }} />
                      </div>
                      <p className="text-sm font-medium mb-1" style={{ color: '#5a4a61' }}>No assignments for {day}</p>
                      <p className="text-xs" style={{ color: '#9575a3' }}>Click "Add Assignment" or save from Eisenhower Matrix</p>
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── AssignmentCard ─────────────────────────────────────────────────────────
function AssignmentCard({ assignment, day, isEditing, isPinned, pinnedRef, statusColors, priorityColors, onEdit, onSave, onCancel, onDelete, onDeepWork }) {
  const [editData, setEditData] = useState({ ...assignment });

  if (isEditing) {
    return (
      <div className="p-5 rounded-2xl" style={{ background: '#f3e5f5', border: '2px solid #b39ddb' }}>
        <div className="space-y-3">
          <input type="text" value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })}
            className="w-full px-3 py-2 rounded-lg text-sm" placeholder="Assignment title"
            style={{ background: '#ffffff', border: '1px solid rgba(179,157,219,0.3)', color: '#5a4a61' }} />
          <div className="grid grid-cols-2 gap-3">
            <input type="text" value={editData.course} onChange={e => setEditData({ ...editData, course: e.target.value })}
              className="px-3 py-2 rounded-lg text-sm" placeholder="Course code"
              style={{ background: '#ffffff', border: '1px solid rgba(179,157,219,0.3)', color: '#5a4a61' }} />
            {/* ── DATE PICKER ── */}
            <input type="date" value={editData.dueDate} onChange={e => setEditData({ ...editData, dueDate: e.target.value })}
              className="px-3 py-2 rounded-lg text-sm"
              style={{ background: '#ffffff', border: '1px solid rgba(179,157,219,0.3)', color: '#5a4a61' }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select value={editData.status} onChange={e => setEditData({ ...editData, status: e.target.value })}
              className="px-3 py-2 rounded-lg text-sm"
              style={{ background: '#ffffff', border: '1px solid rgba(179,157,219,0.3)', color: '#5a4a61' }}>
              <option>In Progress</option><option>Completed</option><option>Not Started</option>
            </select>
            <select value={editData.priority} onChange={e => setEditData({ ...editData, priority: e.target.value })}
              className="px-3 py-2 rounded-lg text-sm"
              style={{ background: '#ffffff', border: '1px solid rgba(179,157,219,0.3)', color: '#5a4a61' }}>
              <option>High Priority</option><option>Medium Priority</option><option>Low Priority</option>
            </select>
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: '#9575a3' }}>Progress: {editData.progress}%</label>
            <input type="range" min="0" max="100" value={editData.progress}
              onChange={e => setEditData({ ...editData, progress: parseInt(e.target.value) })}
              className="w-full" style={{ accentColor: '#b39ddb' }} />
          </div>
          <textarea value={editData.notes} onChange={e => setEditData({ ...editData, notes: e.target.value })}
            className="w-full px-3 py-2 rounded-lg text-sm" placeholder="Notes..." rows="2"
            style={{ background: '#ffffff', border: '1px solid rgba(179,157,219,0.3)', color: '#5a4a61' }} />
          <div className="flex gap-2 justify-end">
            <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm" style={{ background: '#e1bee7', color: '#5a4a61' }}>Cancel</button>
            <button onClick={() => onSave(editData)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm" style={{ background: '#b39ddb', color: '#ffffff' }}>
              <Save className="h-4 w-4" /> Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={pinnedRef}
      className="p-4 rounded-2xl transition-all hover:shadow-md"
      style={{
        background: isPinned ? '#f3e5f5' : '#fdf7fd',
        border: isPinned ? '2px solid #b39ddb' : '1px solid rgba(179,157,219,0.15)',
        boxShadow: isPinned ? '0 0 0 4px rgba(179,157,219,0.15)' : undefined,
      }}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: statusColors.bg, border: `2px solid ${statusColors.border}` }}>
          {assignment.status === "Completed"
            ? <CheckCircle2 className="h-5 w-5" style={{ color: statusColors.text }} />
            : <Clock className="h-5 w-5" style={{ color: statusColors.text }} />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold" style={{ color: '#5a4a61' }}>{assignment.title}</h3>
                {isPinned && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold animate-pulse"
                    style={{ background: '#b39ddb', color: '#fff' }}>
                    📌 Pinned
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-xs font-medium px-2 py-1 rounded" style={{ background: '#e1bee7', color: '#5a4a61' }}>{assignment.course}</span>
                <span className="text-xs font-medium px-2 py-1 rounded" style={{ background: statusColors.bg, color: statusColors.text }}>{assignment.status}</span>
                <span className="text-xs font-medium px-2 py-1 rounded" style={{ background: priorityColors.bg, color: priorityColors.text }}>{assignment.priority}</span>
              </div>
              {assignment.notes && <p className="text-xs mt-2" style={{ color: '#9575a3' }}>📝 {assignment.notes}</p>}
            </div>

            <div className="flex items-start gap-2 flex-shrink-0">
              <div className="text-right">
                <p className="text-xs mb-1" style={{ color: '#9575a3' }}>Due Date</p>
                <p className="text-sm font-medium" style={{ color: '#5a4a61' }}>
                  {assignment.dueDate
                    ? new Date(assignment.dueDate + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    : "—"}
                </p>
              </div>
              <div className="flex gap-1 ml-1">
                <button onClick={onEdit}
                  className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                  style={{ background: '#e1bee7' }}
                  title="Edit">
                  <Edit2 className="h-4 w-4" style={{ color: '#5a4a61' }} />
                </button>
                <button onClick={onDelete}
                  className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                  style={{ background: '#ffebee' }}
                  title="Delete">
                  <Trash2 className="h-4 w-4" style={{ color: '#e57373' }} />
                </button>
              </div>
            </div>
          </div>

          {/* Deep Work button */}
          {onDeepWork && (
            <button onClick={onDeepWork}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl mb-3 transition-all hover:shadow-md group"
              style={{ background: "linear-gradient(135deg, #f3e5f5, #fce4ec)", border: "1px solid rgba(179,157,219,0.3)" }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #b39ddb, #f8bbd0)" }}>
                  <Brain className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold" style={{ color: "#5a4a61" }}>Deep Work — Subtask AI Help</p>
                  <p className="text-[10px]" style={{ color: "#9575a3" }}>View all subtasks & get step-by-step AI guidance</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform flex-shrink-0" style={{ color: "#b39ddb" }} />
            </button>
          )}

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: '#9575a3' }}>Progress</span>
              <span className="text-xs font-semibold" style={{ color: '#b39ddb' }}>{assignment.progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#e1bee7' }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${assignment.progress}%`, background: '#b39ddb' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── NewAssignmentForm ──────────────────────────────────────────────────────
function NewAssignmentForm({ day, onSave, onCancel }) {
  const [form, setForm] = useState({ title: "", course: "", dueDate: "", priority: "Medium Priority", notes: "" });

  const handleSave = () => {
    if (!form.title.trim() || !form.course.trim()) { alert("Please fill in title and course"); return; }
    onSave(form);
  };

  return (
    <div className="mb-4 p-5 rounded-2xl" style={{ background: '#f3e5f5', border: '2px solid #b39ddb' }}>
      <div className="flex items-center gap-2 mb-3">
        <Plus className="h-4 w-4" style={{ color: '#b39ddb' }} />
        <h4 className="font-semibold" style={{ color: '#5a4a61' }}>Add Assignment — {day}</h4>
      </div>
      <div className="space-y-3">
        <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
          className="w-full px-3 py-2 rounded-lg text-sm" placeholder="Assignment title *"
          style={{ background: '#ffffff', border: '1px solid rgba(179,157,219,0.3)', color: '#5a4a61' }} />

        <div className="grid grid-cols-2 gap-3">
          <input type="text" value={form.course} onChange={e => setForm({ ...form, course: e.target.value })}
            className="px-3 py-2 rounded-lg text-sm" placeholder="Course code *"
            style={{ background: '#ffffff', border: '1px solid rgba(179,157,219,0.3)', color: '#5a4a61' }} />

          {/* ── CALENDAR DATE PICKER ── */}
          <div className="relative">
            <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm pr-8"
              style={{ background: '#ffffff', border: '1px solid rgba(179,157,219,0.3)', color: form.dueDate ? '#5a4a61' : '#9575a3' }} />
            <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: '#b39ddb' }} />
          </div>
        </div>

        <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}
          className="w-full px-3 py-2 rounded-lg text-sm"
          style={{ background: '#ffffff', border: '1px solid rgba(179,157,219,0.3)', color: '#5a4a61' }}>
          <option>High Priority</option>
          <option>Medium Priority</option>
          <option>Low Priority</option>
        </select>

        <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
          className="w-full px-3 py-2 rounded-lg text-sm" placeholder="Notes (optional)" rows="2"
          style={{ background: '#ffffff', border: '1px solid rgba(179,157,219,0.3)', color: '#5a4a61' }} />

        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm hover:opacity-80 transition-opacity"
            style={{ background: '#e1bee7', color: '#5a4a61' }}>
            <X className="h-4 w-4" /> Cancel
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm hover:opacity-80 transition-opacity"
            style={{ background: '#b39ddb', color: '#ffffff' }}>
            <Save className="h-4 w-4" /> Add Assignment
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailedProgress;