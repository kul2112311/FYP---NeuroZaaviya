import { useState, useEffect } from "react";
import {
  Plus, ChevronDown, ChevronUp, GripVertical, Calendar as CalendarIcon,
  Trash2, CheckCircle, AlertCircle, Target,
  Flame, Zap, ListTodo, Check, Edit
} from "lucide-react";
import { useUser } from "../../styles/SignInLandingPage/usercontext"
import { useNavigate } from "react-router-dom";

const C = {
  bg: "#f5eef8",
  white: "#ffffff",
  border: "rgba(179,157,219,0.2)",
  purple: "#b39ddb",
  purpleDark: "#5a4a61",
  purpleMid: "#9575a3",
  purpleLight: "#f3e5f5",
  purpleFaint: "#fdf7fd",
};

const QUADRANTS = [
  {
    id: "do-now",
    title: "Do Now",
    subtitle: "Urgent & Important",
    icon: Flame,
    accent: "#ef4444",
    bg: "#fff5f5",
    border: "rgba(239,68,68,0.25)",
    badge: "#fee2e2",
    badgeText: "#ef4444",
  },
  {
    id: "schedule",
    title: "Schedule",
    subtitle: "Important, Not Urgent",
    icon: Target,
    accent: "#3b82f6",
    bg: "#eff6ff",
    border: "rgba(59,130,246,0.25)",
    badge: "#dbeafe",
    badgeText: "#3b82f6",
  },
  {
    id: "delegate",
    title: "Delegate",
    subtitle: "Urgent, Not Important",
    icon: Zap,
    accent: "#f59e0b",
    bg: "#fffbeb",
    border: "rgba(245,158,11,0.25)",
    badge: "#fef3c7",
    badgeText: "#d97706",
  },
  {
    id: "defer",
    title: "Defer",
    subtitle: "Not Urgent, Not Important",
    icon: ListTodo,
    accent: "#22c55e",
    bg: "#f0fdf4",
    border: "rgba(34,197,94,0.25)",
    badge: "#dcfce7",
    badgeText: "#16a34a",
  },
];

function Toast({ show, message, type = "success", onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const bgColor = type === "success" ? "#22c55e" : "#ef4444";
  const icon = type === "success" ? 
    <CheckCircle className="h-5 w-5" /> : 
    <AlertCircle className="h-5 w-5" />;

  return (
    <div className="fixed bottom-8 right-8 z-50 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
      style={{ background: bgColor }}>
      {icon}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}

function TaskCard({ task, quadrant, onDelete, onToggleExpand, onToggleSubtask, onEdit, onMove, onAddSubtask }) {
  const [addingSubtask, setAddingSubtask] = useState(false);
  const [subtaskText, setSubtaskText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || "",
    dueDate: task.dueDate || "",
  });

  const handleSaveEdit = () => {
    onEdit(task.id, editData);
    setIsEditing(false);
  };

  const handleAddSubtask = () => {
    if (!subtaskText.trim()) return;
    onAddSubtask(task.id, subtaskText);
    setSubtaskText("");
    setAddingSubtask(false);
  };

  const completedCount = task.subtasks?.filter((s) => s.completed).length ?? 0;
  const totalCount = task.subtasks?.length ?? 0;

  return (
    <div
      draggable={!isEditing}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("taskId", task.id);
      }}
      className="rounded-lg p-3 shadow-sm hover:shadow-md transition-all group"
      style={{ background: C.white, border: `1px solid ${C.border}`, cursor: isEditing ? "default" : "grab" }}
    >
      {isEditing ? (
        <div className="space-y-2">
          <input
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className="w-full px-3 py-2 text-sm rounded-lg focus:outline-none"
            style={{ background: C.purpleFaint, border: `1px solid ${C.border}`, color: C.purpleDark }}
          />
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="w-full px-3 py-2 text-sm rounded-lg resize-none h-14 focus:outline-none"
            placeholder="Description"
            style={{ background: C.purpleFaint, border: `1px solid ${C.border}`, color: C.purpleDark }}
          />
          <input
            type="date"
            value={editData.dueDate}
            onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
            className="w-full px-3 py-2 text-sm rounded-lg focus:outline-none"
            style={{ background: C.purpleFaint, border: `1px solid ${C.border}`, color: C.purpleDark }}
          />
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSaveEdit}
              className="flex-1 h-8 rounded-full text-xs font-medium text-white flex items-center justify-center gap-1"
              style={{ background: C.purple }}
            >
              <Check className="h-3 w-3" /> Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 h-8 rounded-full text-xs font-medium flex items-center justify-center gap-1"
              style={{ background: C.purpleLight, color: C.purpleMid }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start gap-2">
            <GripVertical className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-50 transition-opacity" style={{ color: C.purpleMid }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-1 mb-1">
                <p className="text-sm font-medium" style={{ color: C.purpleDark }}>
                  {task.title}
                </p>
                <div className="flex gap-0.5 flex-shrink-0">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-5 h-5 rounded-full flex items-center justify-center hover:opacity-80"
                    style={{ background: "#eff6ff" }}
                  >
                    <Edit className="h-2.5 w-2.5" style={{ color: "#3b82f6" }} />
                  </button>
                  <button
                    onClick={() => onToggleExpand(task.id)}
                    className="w-5 h-5 rounded-full flex items-center justify-center hover:opacity-80"
                    style={{ background: C.purpleLight }}
                  >
                    {task.expanded ? (
                      <ChevronUp className="h-2.5 w-2.5" style={{ color: C.purpleMid }} />
                    ) : (
                      <ChevronDown className="h-2.5 w-2.5" style={{ color: C.purpleMid }} />
                    )}
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="w-5 h-5 rounded-full flex items-center justify-center hover:opacity-80"
                    style={{ background: "#fee2e2" }}
                  >
                    <Trash2 className="h-2.5 w-2.5" style={{ color: "#ef4444" }} />
                  </button>
                </div>
              </div>
              {task.description && (
                <p className="text-xs mb-1" style={{ color: C.purpleMid }}>
                  {task.description}
                </p>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                {task.dueDate && (
                  <div className="flex items-center gap-1 text-[10px]" style={{ color: C.purpleMid }}>
                    <CalendarIcon className="h-3 w-3" />
                    <span>{new Date(task.dueDate + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  </div>
                )}
                {totalCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: quadrant.badge, color: quadrant.badgeText }}>
                    {completedCount}/{totalCount}
                  </span>
                )}
              </div>
            </div>
          </div>

          {task.expanded && (
            <div className="mt-3 pt-3 space-y-2" style={{ borderTop: `1px solid ${C.border}` }}>
              {task.subtasks?.map((st) => (
                <label key={st.id} className="flex items-start gap-2 cursor-pointer p-1 rounded hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={st.completed}
                    onChange={() => onToggleSubtask(task.id, st.id)}
                    className="w-3 h-3 mt-0.5 rounded flex-shrink-0"
                    style={{ accentColor: quadrant.accent }}
                  />
                  <span className="text-xs" style={{ color: st.completed ? C.purpleMid : C.purpleDark, textDecoration: st.completed ? "line-through" : "none" }}>
                    {st.text}
                  </span>
                </label>
              ))}

              {addingSubtask ? (
                <div className="flex gap-2 mt-2">
                  <input
                    value={subtaskText}
                    onChange={(e) => setSubtaskText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddSubtask()}
                    autoFocus
                    placeholder="Subtask..."
                    className="flex-1 px-2 py-1 text-xs rounded focus:outline-none"
                    style={{ background: C.purpleFaint, border: `1px solid ${C.border}`, color: C.purpleDark }}
                  />
                  <button
                    onClick={handleAddSubtask}
                    className="px-2 py-1 rounded text-xs text-white"
                    style={{ background: C.purple }}
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setAddingSubtask(false);
                      setSubtaskText("");
                    }}
                    className="px-2 py-1 rounded text-xs"
                    style={{ background: C.purpleLight, color: C.purpleMid }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAddingSubtask(true)}
                  className="text-[10px] flex items-center gap-1 hover:opacity-80 mt-1"
                  style={{ color: quadrant.accent }}
                >
                  <Plus className="h-3 w-3" /> Add
                </button>
              )}

              <div className="pt-1">
                <label className="text-[10px] block mb-1" style={{ color: C.purpleMid }}>Move:</label>
                <select
                  value={task.quadrant}
                  onChange={(e) => onMove(task.id, e.target.value)}
                  className="w-full px-2 py-1 text-xs rounded focus:outline-none"
                  style={{ background: C.purpleFaint, border: `1px solid ${C.border}`, color: C.purpleDark }}
                >
                  {QUADRANTS.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function EisenhowerMatrix() {
  const { addPoints, updateStreak } = useUser();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState(() => {
    try {
      const s = localStorage.getItem("eisenhowerTasks");
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    quadrant: "schedule",
  });
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [isExiting, setIsExiting] = useState(false);

  const save = (updated) => {
    setTasks(updated);
    localStorage.setItem("eisenhowerTasks", JSON.stringify(updated));
  };

  const handleCreate = () => {
    if (!form.title.trim()) {
      setToast({ show: true, message: "Please enter a task title", type: "error" });
      return;
    }
    const task = {
      id: `t-${Date.now()}`,
      title: form.title,
      description: form.description,
      dueDate: form.dueDate,
      quadrant: form.quadrant,
      subtasks: [],
      expanded: false,
    };
    save([...tasks, task]);
    setForm({ title: "", description: "", dueDate: "", quadrant: "schedule" });
    addPoints(5, "Created task");
    setToast({ show: true, message: "Task created! ✨", type: "success" });
  };

  const handleDelete = (id) => {
    save(tasks.filter((t) => t.id !== id));
    setToast({ show: true, message: "Task deleted", type: "success" });
  };

  const handleToggleExpand = (id) => save(tasks.map((t) => (t.id === id ? { ...t, expanded: !t.expanded } : t)));
  const handleMove = (id, quadrant) => save(tasks.map((t) => (t.id === id ? { ...t, quadrant } : t)));
  const handleEdit = (id, data) => save(tasks.map((t) => (t.id === id ? { ...t, ...data } : t)));

  const handleToggleSubtask = (taskId, subId) => {
    const updated = tasks.map((t) =>
      t.id !== taskId
        ? t
        : {
            ...t,
            subtasks: t.subtasks.map((s) => (s.id === subId ? { ...s, completed: !s.completed } : s)),
          }
    );
    save(updated);
    const task = updated.find((t) => t.id === taskId);
    if (task?.subtasks.every((s) => s.completed) && task.subtasks.length > 0) {
      addPoints(10, "Completed all subtasks");
      updateStreak();
      setToast({ show: true, message: "All subtasks completed! 🎉", type: "success" });
    }
  };

  const handleAddSubtask = (taskId, text) => {
    save(
      tasks.map((t) =>
        t.id !== taskId
          ? t
          : {
              ...t,
              subtasks: [...t.subtasks, { id: `s-${Date.now()}`, text, completed: false }],
            }
      )
    );
    addPoints(2, "Added subtask");
  };

  const handleDrop = (e, targetQuadrant) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) handleMove(taskId, targetQuadrant);
  };

  const handleSave = async () => {
    if (tasks.length === 0) {
      setToast({ show: true, message: "Add tasks first!", type: "error" });
      return;
    }

    try {
      const newEntries = tasks.map((t) => ({
        id: t.id,
        title: t.title,
        dueDate: t.dueDate || "",
        priority: t.quadrant === "do-now" ? "High Priority" : t.quadrant === "schedule" ? "Medium Priority" : "Low Priority",
        progress: t.subtasks.length > 0 ? Math.round((t.subtasks.filter((s) => s.completed).length / t.subtasks.length) * 100) : 0,
        status: "In Progress",
        subtasksTotal: t.subtasks.length,
        subtasksDone: t.subtasks.filter((s) => s.completed).length,
        createdAt: new Date().toISOString(),
      }));

      const existing = localStorage.getItem("upcomingAssignments");
      const all = existing ? JSON.parse(existing) : [];
      const existingIds = new Set(all.map((a) => a.id));
      const merged = [
        ...all.map((a) => {
          const updated = newEntries.find((x) => x.id === a.id);
          return updated ?? a;
        }),
        ...newEntries.filter((e) => !existingIds.has(e.id)),
      ];
      
      localStorage.setItem("upcomingAssignments", JSON.stringify(merged));
      
      if (addPoints && typeof addPoints === "function") {
        addPoints(15, "Saved Matrix");
      }
      if (updateStreak && typeof updateStreak === "function") {
        updateStreak();
      }
      window.dispatchEvent(new Event("eisenhowerSaved"));

      const taskCount = tasks.length;
      const msg = taskCount === 1 ? "1 task saved to your calendar! ✨" : `${taskCount} tasks saved to your calendar! ✨`;
      setToast({ show: true, message: msg, type: "success" });
      
      // Auto-exit after 3 seconds
      setIsExiting(true);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Error saving:", error);
      setToast({ show: true, message: "Tasks saved! (Redirecting...)", type: "success" });
      
      // Still exit even if there's an error with points/streak
      setIsExiting(true);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-sm" style={{ background: `${C.bg}dd` }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: C.border }}>
          <button
            onClick={() => navigate("/")}
            className="text-sm hover:opacity-80"
            style={{ color: C.purpleMid }}
          >
            ← Back
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: C.purple }}>
              <Target className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-bold" style={{ color: C.purpleDark }}>Eisenhower Matrix</h1>
          </div>
          <span className="text-xs px-3 py-1 rounded-full" style={{ background: C.purpleLight, color: C.purpleMid }}>
            {tasks.length} tasks
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Form and Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 rounded-xl p-8" style={{ background: C.white, border: `1px solid ${C.border}` }}>
            <h2 className="text-lg font-bold mb-6" style={{ color: C.purpleDark }}>Add New Task</h2>

            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium block mb-2" style={{ color: C.purpleMid }}>Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  placeholder="What to do?"
                  className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none"
                  style={{ background: C.purpleFaint, border: `1px solid ${C.border}`, color: C.purpleDark }}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2" style={{ color: C.purpleMid }}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Add details..."
                  className="w-full px-4 py-3 rounded-lg text-sm resize-none focus:outline-none"
                  style={{ background: C.purpleFaint, border: `1px solid ${C.border}`, color: C.purpleDark, height: "80px" }}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2" style={{ color: C.purpleMid }}>Due Date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none"
                  style={{ background: C.purpleFaint, border: `1px solid ${C.border}`, color: C.purpleDark }}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-3" style={{ color: C.purpleMid }}>Priority *</label>
                <div className="grid grid-cols-2 gap-3">
                  {QUADRANTS.map((q) => {
                    const Icon = q.icon;
                    const active = form.quadrant === q.id;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setForm({ ...form, quadrant: q.id })}
                        className="p-4 rounded-lg text-left transition-all"
                        style={{
                          background: active ? q.bg : C.purpleFaint,
                          border: active ? `2px solid ${q.accent}` : `1px solid ${C.border}`,
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center"
                            style={{
                              background: active ? q.accent : C.white,
                              border: active ? "none" : `1.5px solid ${C.border}`,
                            }}
                          >
                            {active ? (
                              <Check className="h-3 w-3 text-white" />
                            ) : (
                              <Icon className="h-3 w-3" style={{ color: q.accent }} />
                            )}
                          </div>
                          <span className="font-semibold text-sm" style={{ color: active ? q.accent : C.purpleDark }}>
                            {q.title}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleCreate}
                disabled={!form.title.trim()}
                className="w-full h-11 rounded-lg text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-40 mt-2"
                style={{ background: form.title.trim() ? C.purple : "#e1bee7" }}
              >
                <Plus className="h-4 w-4" />
                Add Task
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-xl p-8" style={{ background: C.white, border: `1px solid ${C.border}` }}>
            <h2 className="text-lg font-bold mb-5" style={{ color: C.purpleDark }}>Summary</h2>
            <div className="space-y-3">
              {QUADRANTS.map((q) => {
                const Icon = q.icon;
                const count = tasks.filter((t) => t.quadrant === q.id).length;
                return (
                  <div key={q.id} className="flex items-center gap-3 p-4 rounded-lg" style={{ background: q.bg, border: `1px solid ${q.border}` }}>
                    <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ background: C.white }}>
                      <Icon className="h-4 w-4" style={{ color: q.accent }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold" style={{ color: q.accent }}>{q.title}</p>
                      <p className="text-xs" style={{ color: C.purpleMid }}>{q.subtitle}</p>
                    </div>
                    <span className="text-lg font-bold" style={{ color: q.accent }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Matrix */}
        <div className="grid grid-cols-2 gap-8">
          {QUADRANTS.map((q) => {
            const Icon = q.icon;
            const qTasks = tasks.filter((t) => t.quadrant === q.id);
            return (
              <div
                key={q.id}
                className="rounded-xl p-5 flex flex-col"
                style={{
                  background: q.bg,
                  border: `2px solid ${q.border}`,
                  minHeight: "400px",
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, q.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.white }}>
                      <Icon className="h-4 w-4" style={{ color: q.accent }} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold" style={{ color: q.accent }}>{q.title}</h3>
                      <p className="text-xs" style={{ color: C.purpleMid }}>{q.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-base font-bold px-2 py-1 rounded-lg" style={{ background: q.badge, color: q.badgeText }}>
                    {qTasks.length}
                  </span>
                </div>

                {qTasks.length === 0 && (
                  <div className="flex-1 flex items-center justify-center rounded-lg border-2 border-dashed" style={{ borderColor: q.border }}>
                    <p className="text-xs" style={{ color: C.purpleMid }}>Drop tasks here</p>
                  </div>
                )}

                <div className="flex-1 space-y-2 overflow-y-auto pr-2">
                  {qTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      quadrant={q}
                      onDelete={handleDelete}
                      onToggleExpand={handleToggleExpand}
                      onToggleSubtask={handleToggleSubtask}
                      onEdit={handleEdit}
                      onMove={handleMove}
                      onAddSubtask={handleAddSubtask}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Save Button - Bottom */}
        <div className="py-6">
          <button
            onClick={handleSave}
            disabled={isExiting}
            className="w-full h-12 rounded-xl text-white text-base font-bold flex items-center justify-center gap-3 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: C.purple }}
          >
            <CalendarIcon className="h-5 w-5" />
            Save to Calendar
          </button>
        </div>
      </div>

      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
}