import React, { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, Clock, Sparkles, Edit2, Save, X, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

// API Configuration
const API = "http://127.0.0.1:8000/api";

function DetailedProgress() {
  const navigate = useNavigate();
  const [weekData, setWeekData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [addingToDay, setAddingToDay] = useState(null);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // 0 = current week, -1 = last week, 1 = next week, etc.

  // Days of the week
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Mock data structure - day-wise
  const mockWeekData = {
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
    Sun: []
  };

  const fetchWeekData = async () => {
    try {
      // First, check localStorage for upcoming assignments from Eisenhower Matrix
      const upcomingAssignments = localStorage.getItem("upcomingAssignments");
      let assignmentsFromCalendar = [];
      
      if (upcomingAssignments) {
        try {
          assignmentsFromCalendar = JSON.parse(upcomingAssignments);
        } catch (e) {
          console.error("Error parsing assignments from calendar:", e);
        }
      }

      // Try to fetch from API
      const token = localStorage.getItem("token");
      let apiData = null;

      if (token) {
        try {
          const response = await fetch(`${API}/assignments/weekly/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            apiData = await response.json();
          }
        } catch (err) {
          console.error("Error fetching from API:", err);
        }
      }

      // Create merged week data from calendar assignments
      let mergedWeekData = { ...mockWeekData };
      
      // Calculate the target week's dates
      const today = new Date();
      const startOfTargetWeek = new Date(today);
      startOfTargetWeek.setDate(today.getDate() - today.getDay() + (currentWeekOffset * 7));
      
      // Group assignments by due date within this week
      assignmentsFromCalendar.forEach(assignment => {
        if (assignment.dueDate) {
          try {
            const assignmentDate = new Date(assignment.dueDate);
            const dayOfWeek = assignmentDate.getDay();
            
            // Check if this assignment falls within the target week
            const diffTime = Math.abs(assignmentDate - startOfTargetWeek);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays <= 6 && assignmentDate >= startOfTargetWeek && assignmentDate < new Date(startOfTargetWeek.getTime() + 7 * 24 * 60 * 60 * 1000)) {
              const day = daysOfWeek[dayOfWeek];
              
              if (!mergedWeekData[day]) {
                mergedWeekData[day] = [];
              }
              
              const existingIndex = mergedWeekData[day].findIndex(a => a.id === assignment.id);
              if (existingIndex === -1) {
                mergedWeekData[day].push({
                  id: assignment.id,
                  title: assignment.title,
                  course: assignment.course || "Assignment",
                  status: assignment.status || "In Progress",
                  priority: assignment.priority || "Medium Priority",
                  progress: assignment.progress || 0,
                  dueDate: assignment.dueDate,
                  notes: assignment.notes || ""
                });
              } else {
                mergedWeekData[day][existingIndex] = {
                  id: assignment.id,
                  title: assignment.title,
                  course: assignment.course || "Assignment",
                  status: assignment.status || "In Progress",
                  priority: assignment.priority || "Medium Priority",
                  progress: assignment.progress || 0,
                  dueDate: assignment.dueDate,
                  notes: assignment.notes || ""
                };
              }
            }
          } catch (e) {
            console.error("Error processing assignment date:", e);
          }
        }
      });

      // Override with API data if available
      if (apiData) {
        mergedWeekData = apiData;
      }

      setWeekData(mergedWeekData);
      setError(null);
    } catch (err) {
      console.error("Error fetching assignments:", err);
      setWeekData(mockWeekData);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeekData();

    // Listen for updates from Eisenhower Matrix or other sources
    const handleStorageChange = () => {
      console.log("Storage changed, updating week data");
      fetchWeekData();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("eisenhowerSaved", handleStorageChange);
    window.addEventListener("weeklyProgressUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("eisenhowerSaved", handleStorageChange);
      window.removeEventListener("weeklyProgressUpdated", handleStorageChange);
    };
  }, [currentWeekOffset]);

  // Calculate day progress
  const calculateDayProgress = (assignments) => {
    if (!assignments || assignments.length === 0) return 0;
    const totalProgress = assignments.reduce((sum, a) => sum + (a.progress || 0), 0);
    return Math.round(totalProgress / assignments.length);
  };

  // Calculate overall weekly progress
  const calculateWeeklyProgress = () => {
    const allProgress = daysOfWeek.map(day => calculateDayProgress(weekData[day] || []));
    const total = allProgress.reduce((sum, p) => sum + p, 0);
    return Math.round(total / 7);
  };

  // Update progress and sync back to localStorage
  const updateWeekData = (newWeekData) => {
    setWeekData(newWeekData);
    
    // Sync back to localStorage
    const upcomingAssignments = localStorage.getItem("upcomingAssignments");
    let allAssignments = upcomingAssignments ? JSON.parse(upcomingAssignments) : [];
    
    // Flatten all assignments from the week data
    const updatedAssignments = [];
    daysOfWeek.forEach(day => {
      if (newWeekData[day]) {
        newWeekData[day].forEach(assignment => {
          updatedAssignments.push({
            id: assignment.id,
            title: assignment.title,
            course: assignment.course,
            status: assignment.status,
            priority: assignment.priority,
            progress: assignment.progress,
            dueDate: assignment.dueDate,
            notes: assignment.notes || ""
          });
        });
      }
    });
    
    // Merge with existing (update existing, add new)
    const finalAssignments = [];
    const seenIds = new Set();
    
    updatedAssignments.forEach(updated => {
      seenIds.add(updated.id);
      finalAssignments.push(updated);
    });
    
    allAssignments.forEach(existing => {
      if (!seenIds.has(existing.id)) {
        finalAssignments.push(existing);
      }
    });
    
    localStorage.setItem("upcomingAssignments", JSON.stringify(finalAssignments));
    
    // Dispatch event so dashboard updates instantly
    window.dispatchEvent(new Event("weeklyProgressUpdated"));
  };

  // Handle assignment update
  const handleUpdateAssignment = (day, assignmentId, updates) => {
    const newWeekData = { ...weekData };
    const assignmentIndex = newWeekData[day].findIndex(a => a.id === assignmentId);
    if (assignmentIndex !== -1) {
      newWeekData[day][assignmentIndex] = {
        ...newWeekData[day][assignmentIndex],
        ...updates
      };
      updateWeekData(newWeekData);
    }
    setEditingAssignment(null);
  };

  // Handle assignment deletion
  const handleDeleteAssignment = (day, assignmentId) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      const newWeekData = { ...weekData };
      newWeekData[day] = newWeekData[day].filter(a => a.id !== assignmentId);
      updateWeekData(newWeekData);
    }
  };

  // Handle adding new assignment
  const handleAddAssignment = (day) => {
    setAddingToDay(day);
  };

  const handleSaveNewAssignment = (day, newAssignment) => {
    const newWeekData = { ...weekData };
    if (!newWeekData[day]) newWeekData[day] = [];
    newWeekData[day].push({
      id: `manual-${Date.now()}`,
      ...newAssignment,
      progress: 0,
      status: "In Progress"
    });
    updateWeekData(newWeekData);
    setAddingToDay(null);
  };

  const getStatusColor = (status) => {
    if (status === "Completed") return { bg: '#e8f5e9', text: '#2e7d32', border: '#4caf50' };
    if (status === "In Progress") return { bg: '#e3f2fd', text: '#1565c0', border: '#2196f3' };
    return { bg: '#f3e5f5', text: '#7b1fa2', border: '#9c27b0' };
  };

  const getPriorityColor = (priority) => {
    if (priority === "High Priority") return { bg: '#ffebee', text: '#c62828' };
    if (priority === "Medium Priority") return { bg: '#fff8e1', text: '#f57c00' };
    return { bg: '#e8f5e9', text: '#2e7d32' };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f5eef8' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" 
               style={{ borderColor: '#e1bee7', borderTopColor: '#b39ddb' }}></div>
          <p style={{ color: '#9575a3' }}>Loading your assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8" style={{ background: '#f5eef8' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl mb-4 transition-colors hover:opacity-80"
            style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.2)', color: '#5a4a61' }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-6 w-6" style={{ color: '#b39ddb' }} />
                <h1 className="text-3xl font-semibold" style={{ color: '#5a4a61' }}>
                  Weekly Progress
                </h1>
              </div>
              <p className="text-sm" style={{ color: '#9575a3' }}>
                Track and manage your assignments across weeks
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
                className="px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                style={{ background: '#e1bee7', color: '#5a4a61' }}
              >
                ← Previous Week
              </button>
              <div className="text-right">
                <div className="text-2xl font-bold" style={{ color: '#b39ddb' }}>
                  Week {currentWeekOffset === 0 ? 'Now' : currentWeekOffset > 0 ? `+${currentWeekOffset}` : currentWeekOffset}
                </div>
                <p className="text-sm" style={{ color: '#9575a3' }}>
                  {(() => {
                    const startDate = new Date();
                    startDate.setDate(startDate.getDate() - startDate.getDay() + (currentWeekOffset * 7));
                    const endDate = new Date(startDate);
                    endDate.setDate(endDate.getDate() + 6);
                    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
                  })()}
                </p>
              </div>
              <button
                onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
                className="px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                style={{ background: '#e1bee7', color: '#5a4a61' }}
              >
                Next Week →
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl" style={{ background: '#fff5f5', border: '1px solid #e57373' }}>
            <p style={{ color: '#e57373' }}>⚠️ {error}</p>
          </div>
        )}

        {/* Days Grid */}
        <div className="grid grid-cols-1 gap-6">
          {daysOfWeek.map((day) => {
            const dayAssignments = weekData[day] || [];
            const dayProgress = calculateDayProgress(dayAssignments);

            return (
              <div
                key={day}
                className="rounded-3xl p-6 shadow-sm"
                style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.2)' }}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-semibold" style={{ color: '#5a4a61' }}>
                      {day}
                    </h2>
                    <div className="flex items-center gap-2">
                      {/* Circular Progress Indicator */}
                      <div className="relative w-12 h-12">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="50%"
                            cy="50%"
                            r="45%"
                            fill="none"
                            stroke="#e1bee7"
                            strokeWidth="4"
                          />
                          <circle
                            cx="50%"
                            cy="50%"
                            r="45%"
                            fill="none"
                            stroke="#b39ddb"
                            strokeWidth="4"
                            strokeDasharray={`${dayProgress * 1.7} 170`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-semibold" style={{ color: '#b39ddb' }}>
                            {dayProgress}%
                          </span>
                        </div>
                      </div>
                      <span className="text-sm" style={{ color: '#9575a3' }}>
                        {dayAssignments.length} {dayAssignments.length === 1 ? 'assignment' : 'assignments'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddAssignment(day)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors hover:opacity-80"
                    style={{ background: '#b39ddb', color: '#ffffff' }}
                  >
                    <Plus className="h-4 w-4" />
                    Add Assignment
                  </button>
                </div>

                {/* Day Progress Bar */}
                <div className="w-full h-2 rounded-full mb-6 overflow-hidden" style={{ background: '#e1bee7' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${dayProgress}%`, background: '#b39ddb' }}
                  />
                </div>

                {/* Assignments List */}
                {dayAssignments.length > 0 ? (
                  <div className="space-y-3">
                    {dayAssignments.map((assignment) => {
                      const statusColors = getStatusColor(assignment.status);
                      const priorityColors = getPriorityColor(assignment.priority);
                      const isEditing = editingAssignment?.id === assignment.id && editingAssignment?.day === day;

                      return (
                        <AssignmentCard
                          key={assignment.id}
                          assignment={assignment}
                          day={day}
                          isEditing={isEditing}
                          statusColors={statusColors}
                          priorityColors={priorityColors}
                          onEdit={() => setEditingAssignment({ ...assignment, day })}
                          onSave={(updates) => handleUpdateAssignment(day, assignment.id, updates)}
                          onCancel={() => setEditingAssignment(null)}
                          onDelete={() => handleDeleteAssignment(day, assignment.id)}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm" style={{ color: '#9575a3' }}>No assignments for this day</p>
                  </div>
                )}

                {/* Add New Assignment Form */}
                {addingToDay === day && (
                  <NewAssignmentForm
                    day={day}
                    onSave={(newAssignment) => handleSaveNewAssignment(day, newAssignment)}
                    onCancel={() => setAddingToDay(null)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Assignment Card Component
function AssignmentCard({ assignment, day, isEditing, statusColors, priorityColors, onEdit, onSave, onCancel, onDelete }) {
  const [editData, setEditData] = useState(assignment);

  if (isEditing) {
    return (
      <div className="p-5 rounded-2xl" style={{ background: '#f3e5f5', border: '2px solid #b39ddb' }}>
        <div className="space-y-3">
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className="w-full px-3 py-2 rounded-lg text-sm"
            style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.3)', color: '#5a4a61' }}
            placeholder="Assignment title"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={editData.course}
              onChange={(e) => setEditData({ ...editData, course: e.target.value })}
              className="px-3 py-2 rounded-lg text-sm"
              style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.3)', color: '#5a4a61' }}
              placeholder="Course code"
            />
            <input
              type="text"
              value={editData.dueDate}
              onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
              className="px-3 py-2 rounded-lg text-sm"
              style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.3)', color: '#5a4a61' }}
              placeholder="Due date"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={editData.status}
              onChange={(e) => setEditData({ ...editData, status: e.target.value })}
              className="px-3 py-2 rounded-lg text-sm"
              style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.3)', color: '#5a4a61' }}
            >
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Not Started">Not Started</option>
            </select>
            <select
              value={editData.priority}
              onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
              className="px-3 py-2 rounded-lg text-sm"
              style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.3)', color: '#5a4a61' }}
            >
              <option value="High Priority">High Priority</option>
              <option value="Medium Priority">Medium Priority</option>
              <option value="Low Priority">Low Priority</option>
            </select>
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: '#9575a3' }}>Progress: {editData.progress}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={editData.progress}
              onChange={(e) => setEditData({ ...editData, progress: parseInt(e.target.value) })}
              className="w-full"
              style={{ accentColor: '#b39ddb' }}
            />
          </div>
          <textarea
            value={editData.notes}
            onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
            className="w-full px-3 py-2 rounded-lg text-sm"
            style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.3)', color: '#5a4a61' }}
            placeholder="Notes..."
            rows="2"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg text-sm transition-colors"
              style={{ background: '#e1bee7', color: '#5a4a61' }}
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(editData)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors"
              style={{ background: '#b39ddb', color: '#ffffff' }}
            >
              <Save className="h-4 w-4" />
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl transition-all hover:shadow-md group" style={{ background: '#fdf7fd', border: '1px solid rgba(179, 157, 219, 0.15)' }}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ 
            background: statusColors.bg,
            border: `2px solid ${statusColors.border}`
          }}
        >
          {assignment.status === "Completed" ? (
            <CheckCircle2 className="h-5 w-5" style={{ color: statusColors.text }} />
          ) : (
            <Clock className="h-5 w-5" style={{ color: statusColors.text }} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1">
              <h3 className="font-semibold mb-2" style={{ color: '#5a4a61' }}>
                {assignment.title}
              </h3>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-xs font-medium px-2 py-1 rounded" style={{ background: '#e1bee7', color: '#5a4a61' }}>
                  {assignment.course}
                </span>
                <span className="text-xs font-medium px-2 py-1 rounded" style={{ background: statusColors.bg, color: statusColors.text }}>
                  {assignment.status}
                </span>
                <span className="text-xs font-medium px-2 py-1 rounded" style={{ background: priorityColors.bg, color: priorityColors.text }}>
                  {assignment.priority}
                </span>
              </div>
              {assignment.notes && (
                <p className="text-xs mt-2" style={{ color: '#9575a3' }}>📝 {assignment.notes}</p>
              )}
            </div>

            {/* Due Date & Actions */}
            <div className="flex items-start gap-2">
              <div className="text-right">
                <p className="text-xs mb-1" style={{ color: '#9575a3' }}>Due Date</p>
                <p className="text-sm font-medium" style={{ color: '#5a4a61' }}>
                  {assignment.dueDate}
                </p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={onEdit}
                  className="p-2 rounded-lg transition-colors hover:opacity-80"
                  style={{ background: '#e1bee7' }}
                >
                  <Edit2 className="h-4 w-4" style={{ color: '#5a4a61' }} />
                </button>
                <button
                  onClick={onDelete}
                  className="p-2 rounded-lg transition-colors hover:opacity-80"
                  style={{ background: '#ffebee' }}
                >
                  <Trash2 className="h-4 w-4" style={{ color: '#e57373' }} />
                </button>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: '#9575a3' }}>Progress</span>
              <span className="text-xs font-semibold" style={{ color: '#b39ddb' }}>
                {assignment.progress}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#e1bee7' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${assignment.progress}%`, background: '#b39ddb' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// New Assignment Form Component
function NewAssignmentForm({ day, onSave, onCancel }) {
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    course: "",
    dueDate: "",
    priority: "Medium Priority",
    notes: ""
  });

  const handleSave = () => {
    if (!newAssignment.title || !newAssignment.course) {
      alert("Please fill in title and course");
      return;
    }
    onSave(newAssignment);
  };

  return (
    <div className="mt-4 p-5 rounded-2xl" style={{ background: '#f3e5f5', border: '2px solid #b39ddb' }}>
      <h4 className="font-semibold mb-3" style={{ color: '#5a4a61' }}>Add New Assignment</h4>
      <div className="space-y-3">
        <input
          type="text"
          value={newAssignment.title}
          onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
          className="w-full px-3 py-2 rounded-lg text-sm"
          style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.3)', color: '#5a4a61' }}
          placeholder="Assignment title *"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            value={newAssignment.course}
            onChange={(e) => setNewAssignment({ ...newAssignment, course: e.target.value })}
            className="px-3 py-2 rounded-lg text-sm"
            style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.3)', color: '#5a4a61' }}
            placeholder="Course code *"
          />
          <input
            type="text"
            value={newAssignment.dueDate}
            onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
            className="px-3 py-2 rounded-lg text-sm"
            style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.3)', color: '#5a4a61' }}
            placeholder="Due date (e.g., Nov 22)"
          />
        </div>
        <select
          value={newAssignment.priority}
          onChange={(e) => setNewAssignment({ ...newAssignment, priority: e.target.value })}
          className="w-full px-3 py-2 rounded-lg text-sm"
          style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.3)', color: '#5a4a61' }}
        >
          <option value="High Priority">High Priority</option>
          <option value="Medium Priority">Medium Priority</option>
          <option value="Low Priority">Low Priority</option>
        </select>
        <textarea
          value={newAssignment.notes}
          onChange={(e) => setNewAssignment({ ...newAssignment, notes: e.target.value })}
          className="w-full px-3 py-2 rounded-lg text-sm"
          style={{ background: '#ffffff', border: '1px solid rgba(179, 157, 219, 0.3)', color: '#5a4a61' }}
          placeholder="Notes (optional)"
          rows="2"
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm transition-colors"
            style={{ background: '#e1bee7', color: '#5a4a61' }}
          >
            <X className="h-4 w-4 inline mr-1" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors"
            style={{ background: '#b39ddb', color: '#ffffff' }}
          >
            <Save className="h-4 w-4" />
            Add Assignment
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailedProgress;