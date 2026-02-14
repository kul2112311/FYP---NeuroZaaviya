import { useState } from "react";
import { Plus, ChevronDown, ChevronUp, GripVertical, Calendar as CalendarIcon, Save, X, Trash2, CheckCircle, Sparkles } from "lucide-react";
import { useUser } from "../../usercontext";

export function EisenhowerMatrix({ onSaveAndAddToCalendar }) {
  const { addPoints, updateStreak } = useUser();
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("eisenhowerTasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentTask, setCurrentTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    timeSensitive: false
  });
  const [draggedTask, setDraggedTask] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [addingSubtaskTo, setAddingSubtaskTo] = useState(null);
  const [newSubtaskText, setNewSubtaskText] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const quadrants = [
    {
      id: "do-now",
      title: "Urgent & Important",
      subtitle: "Do Now",
      color: "from-red-50 to-pink-50 border-red-200",
      textColor: "text-red-700",
      example: "Exam tomorrow, health emergency"
    },
    {
      id: "schedule",
      title: "Important, Not Urgent",
      subtitle: "Schedule",
      color: "from-blue-50 to-indigo-50 border-blue-200",
      textColor: "text-blue-700",
      example: "Long-term projects, skill development"
    },
    {
      id: "delegate",
      title: "Urgent, Not Important",
      subtitle: "Delegate",
      color: "from-yellow-50 to-amber-50 border-yellow-200",
      textColor: "text-yellow-700",
      example: "Some emails, minor requests"
    },
    {
      id: "defer",
      title: "Not Urgent, Not Important",
      subtitle: "Defer",
      color: "from-green-50 to-emerald-50 border-green-200",
      textColor: "text-green-700",
      example: "Busy work, time-wasters"
    }
  ];

  const addTaskToQuadrant = (quadrant) => {
    if (!currentTask.title.trim()) {
      alert("Please enter a task title");
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: currentTask.title,
      description: currentTask.description,
      dueDate: currentTask.dueDate,
      timeSensitive: currentTask.timeSensitive,
      quadrant,
      subtasks: [],
      expanded: false
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem("eisenhowerTasks", JSON.stringify(updatedTasks));

    setCurrentTask({
      title: "",
      description: "",
      dueDate: "",
      timeSensitive: false
    });

    addPoints(5, "Created task in Eisenhower Matrix");
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem("eisenhowerTasks", JSON.stringify(updatedTasks));
  };

  const toggleTaskExpanded = (taskId) => {
    const updatedTasks = tasks.map(t =>
      t.id === taskId ? { ...t, expanded: !t.expanded } : t
    );
    setTasks(updatedTasks);
    localStorage.setItem("eisenhowerTasks", JSON.stringify(updatedTasks));
  };

  const moveTask = (taskId, newQuadrant) => {
    const updatedTasks = tasks.map(t =>
      t.id === taskId ? { ...t, quadrant: newQuadrant } : t
    );
    setTasks(updatedTasks);
    localStorage.setItem("eisenhowerTasks", JSON.stringify(updatedTasks));
  };

  const addSubtask = (taskId) => {
    if (!newSubtaskText.trim()) return;

    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          subtasks: [
            ...t.subtasks,
            { id: Date.now().toString(), text: newSubtaskText, completed: false }
          ]
        };
      }
      return t;
    });

    setTasks(updatedTasks);
    localStorage.setItem("eisenhowerTasks", JSON.stringify(updatedTasks));
    setNewSubtaskText("");
    addPoints(2, "Added subtask");
  };

  const toggleSubtask = (taskId, subtaskId) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          subtasks: t.subtasks.map(st =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          )
        };
      }
      return t;
    });

    setTasks(updatedTasks);
    localStorage.setItem("eisenhowerTasks", JSON.stringify(updatedTasks));

    const task = updatedTasks.find(t => t.id === taskId);
    if (task && task.subtasks.every(st => st.completed) && task.subtasks.length > 0) {
      addPoints(10, "Completed all subtasks");
      updateStreak();
    }
  };

  const handleDragStart = (taskId) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (quadrant) => {
    if (draggedTask) {
      moveTask(draggedTask, quadrant);
      setDraggedTask(null);
    }
  };

  const handleSaveAndAddToCalendar = () => {
    if (onSaveAndAddToCalendar) {
      onSaveAndAddToCalendar(tasks);
    }
    addPoints(15, "Saved Eisenhower Matrix to calendar");
    updateStreak();
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleDiscard = () => {
    if (window.confirm("Are you sure you want to discard all tasks?")) {
      setTasks([]);
      localStorage.removeItem("eisenhowerTasks");
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructions Toggle */}
      <div className="rounded-2xl p-4 shadow-sm" style={{ background: '#f3e5f5', border: '1px solid rgba(179, 157, 219, 0.2)' }}>
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="w-full flex items-center justify-between text-left"
        >
          <h4 className="font-semibold" style={{ color: '#b39ddb' }}>How this works?</h4>
          {showInstructions ? <ChevronUp className="h-5 w-5" style={{ color: '#b39ddb' }} /> : <ChevronDown className="h-5 w-5" style={{ color: '#b39ddb' }} />}
        </button>

        {showInstructions && (
          <div className="mt-4 space-y-3 text-sm" style={{ color: '#9575a3' }}>
            <p>
              The Eisenhower Matrix helps you prioritize tasks by urgency and importance:
            </p>
            <ul className="space-y-2 pl-4">
              <li>• <span style={{ color: '#5a4a61' }}>Do Now:</span> Tasks that are both urgent and important</li>
              <li>• <span style={{ color: '#5a4a61' }}>Schedule:</span> Important tasks that can be planned for later</li>
              <li>• <span style={{ color: '#5a4a61' }}>Delegate:</span> Urgent but less important tasks</li>
              <li>• <span style={{ color: '#5a4a61' }}>Defer:</span> Low-priority tasks that can wait</li>
            </ul>
            <p className="text-xs italic">
              Simple example: "Do coding homework today, plan rest time tomorrow"
            </p>
          </div>
        )}
      </div>

      {/* Task Input Area */}
      <div className="rounded-3xl p-6 shadow-sm" style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.2)' }}>
        <h3 className="text-xl font-semibold mb-4" style={{ color: '#b39ddb' }}>Create a Task</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2" style={{ color: '#9575a3' }}>Task Title *</label>
            <input
              type="text"
              value={currentTask.title}
              onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
              className="w-full px-4 py-2 rounded-xl focus:outline-none focus:ring-2"
              style={{ 
                background: '#fdf7fd',
                border: '1px solid rgba(179, 157, 219, 0.2)',
                color: '#5a4a61'
              }}
              onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(179, 157, 219, 0.2)'}
              onBlur={(e) => e.target.style.boxShadow = 'none'}
              placeholder="What needs to be done?"
            />
          </div>

          <div>
            <label className="block text-sm mb-2" style={{ color: '#9575a3' }}>Description (optional)</label>
            <textarea
              value={currentTask.description}
              onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
              className="w-full px-4 py-2 rounded-xl resize-none h-20 focus:outline-none focus:ring-2"
              style={{ 
                background: '#fdf7fd',
                border: '1px solid rgba(179, 157, 219, 0.2)',
                color: '#5a4a61'
              }}
              onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(179, 157, 219, 0.2)'}
              onBlur={(e) => e.target.style.boxShadow = 'none'}
              placeholder="Add more details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2" style={{ color: '#9575a3' }}>Due Date (optional)</label>
              <input
                type="date"
                value={currentTask.dueDate}
                onChange={(e) => setCurrentTask({ ...currentTask, dueDate: e.target.value })}
                className="w-full px-4 py-2 rounded-xl focus:outline-none focus:ring-2"
                style={{ 
                  background: '#fdf7fd',
                  border: '1px solid rgba(179, 157, 219, 0.2)',
                  color: '#5a4a61'
                }}
                onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(179, 157, 219, 0.2)'}
                onBlur={(e) => e.target.style.boxShadow = 'none'}
              />
            </div>

            <div>
              <label className="block text-sm mb-2" style={{ color: '#9575a3' }}>Time Sensitivity (optional)</label>
              <select
                value={currentTask.timeSensitive ? "time-sensitive" : "flexible"}
                onChange={(e) => setCurrentTask({ ...currentTask, timeSensitive: e.target.value === "time-sensitive" })}
                className="w-full px-4 py-2 rounded-xl focus:outline-none focus:ring-2"
                style={{ 
                  background: '#fdf7fd',
                  border: '1px solid rgba(179, 157, 219, 0.2)',
                  color: '#5a4a61'
                }}
                onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(179, 157, 219, 0.2)'}
                onBlur={(e) => e.target.style.boxShadow = 'none'}
              >
                <option value="flexible">Flexible</option>
                <option value="time-sensitive">Time-sensitive</option>
              </select>
            </div>
          </div>

          <p className="text-xs italic" style={{ color: '#9575a3' }}>
            Fill in task details, then add it to the appropriate quadrant below
          </p>
        </div>
      </div>

      {/* Eisenhower Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quadrants.map((quadrant) => (
          <div
            key={quadrant.id}
            className={`bg-gradient-to-br ${quadrant.color} rounded-3xl p-6 border-2 min-h-[400px] max-h-[600px] flex flex-col transition-all ${
              draggedTask ? "ring-2 ring-primary/30" : ""
            }`}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(quadrant.id)}
          >
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className={quadrant.textColor}>{quadrant.title}</h3>
                <span className="text-sm px-3 py-1 rounded-full bg-white/50">
                  {quadrant.subtitle}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{quadrant.example}</p>
            </div>

            <button
              onClick={() => addTaskToQuadrant(quadrant.id)}
              className="w-full mb-4 px-4 py-3 rounded-xl bg-white hover:bg-white/80 border border-border transition-all flex items-center justify-center gap-2 group"
            >
              <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm">Add Task Here</span>
            </button>

            <div className="flex-1 space-y-3 overflow-y-auto pr-2">
              {tasks
                .filter((task) => task.quadrant === quadrant.id)
                .map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task.id)}
                    className="bg-white rounded-2xl p-4 border border-border shadow-sm hover:shadow-md transition-all cursor-move group"
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="h-5 w-5 text-muted-foreground mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-sm mb-1">{task.title}</p>
                            {task.description && (
                              <p className="text-xs text-muted-foreground">{task.description}</p>
                            )}
                            {task.dueDate && (
                              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                <CalendarIcon className="h-3 w-3" />
                                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-1">
                            <button
                              onClick={() => toggleTaskExpanded(task.id)}
                              className="p-1 rounded hover:bg-muted/30"
                            >
                              {task.expanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-1 rounded hover:bg-red-50 text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${quadrant.textColor} bg-white/50 mb-2`}>
                          {quadrant.subtitle}
                        </span>

                        {task.expanded && (
                          <div className="mt-3 pt-3 border-t border-border space-y-3">
                            <div>
                              <h5 className="text-xs text-muted-foreground mb-2">Subtasks</h5>
                              <div className="space-y-2">
                                {task.subtasks.map((subtask) => (
                                  <label key={subtask.id} className="flex items-start gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
                                    <input
                                      type="checkbox"
                                      checked={subtask.completed}
                                      onChange={() => toggleSubtask(task.id, subtask.id)}
                                      className="w-4 h-4 mt-0.5 rounded border-border text-primary focus:ring-primary flex-shrink-0"
                                    />
                                    <div className="flex-1">
                                      <span className={subtask.completed ? "line-through text-muted-foreground" : ""}>
                                        {subtask.text}
                                      </span>
                                      {subtask.aiDetail && !subtask.completed && (
                                        <div className="mt-1 text-xs text-purple-600 flex items-start gap-1.5 bg-purple-50/50 p-1.5 rounded border border-purple-100">
                                          <Sparkles className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                          <span className="opacity-90">{subtask.aiDetail}</span>
                                        </div>
                                      )}
                                    </div>
                                  </label>
                                ))}
                              </div>

                              {addingSubtaskTo === task.id ? (
                                <div className="mt-2 flex gap-2">
                                  <input
                                    type="text"
                                    value={newSubtaskText}
                                    onChange={(e) => setNewSubtaskText(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && addSubtask(task.id)}
                                    className="flex-1 px-2 py-1 text-sm rounded border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Subtask text..."
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => addSubtask(task.id)}
                                    className="px-2 py-1 rounded bg-primary text-white text-xs hover:bg-primary/90"
                                  >
                                    Add
                                  </button>
                                  <button
                                    onClick={() => {
                                      setAddingSubtaskTo(null);
                                      setNewSubtaskText("");
                                    }}
                                    className="px-2 py-1 rounded bg-muted text-xs"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setAddingSubtaskTo(task.id)}
                                  className="mt-2 text-xs text-primary hover:underline flex items-center gap-1"
                                >
                                  <Plus className="h-3 w-3" />
                                  Break Further
                                </button>
                              )}
                            </div>

                            <div>
                              <label className="block text-xs text-muted-foreground mb-1">Move to:</label>
                              <select
                                value={task.quadrant}
                                onChange={(e) => moveTask(task.id, e.target.value)}
                                className="w-full px-2 py-1 text-sm rounded border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                              >
                                {quadrants.map((q) => (
                                  <option key={q.id} value={q.id}>
                                    {q.title}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Save Controls */}
      <div className="rounded-3xl p-6 shadow-sm flex gap-3" style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.2)' }}>
        <button
          onClick={() => {
            localStorage.setItem("eisenhowerTasks", JSON.stringify(tasks));
            alert("Saved as draft!");
          }}
          className="flex-1 rounded-full px-4 py-2 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          style={{ 
            background: '#fdf7fd',
            border: '1px solid rgba(179, 157, 219, 0.2)',
            color: '#5a4a61'
          }}
        >
          <Save className="h-4 w-4" />
          Save as Draft
        </button>

        <button
          onClick={handleSaveAndAddToCalendar}
          className="flex-1 text-white rounded-full hover:opacity-90 transition-opacity px-4 py-2 flex items-center justify-center gap-2"
          style={{ background: '#b39ddb' }}
        >
          <CalendarIcon className="h-4 w-4" />
          Save & Add to Calendar
        </button>

        <button
          onClick={handleDiscard}
          className="rounded-full px-4 py-2 transition-opacity hover:opacity-90 flex items-center gap-2"
          style={{ 
            background: '#ffebee',
            color: '#e57373'
          }}
        >
          <X className="h-4 w-4" />
          Discard
        </button>
      </div>

      {showSuccessToast && (
        <div className="fixed bottom-8 right-8 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom">
          <CheckCircle className="h-5 w-5" />
          <span className="text-sm">Tasks saved to calendar!</span>
        </div>
      )}
    </div>
  );
}