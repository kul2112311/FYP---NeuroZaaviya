import React, { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, Clock, Sparkles, Edit2, Save, X, Trash2, Plus } from "lucide-react";

// API Configuration
const API = "http://127.0.0.1:8000/api";

function DetailedProgress({ onBack, onUpdateProgress }) {
  const [weekData, setWeekData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [addingToDay, setAddingToDay] = useState(null);

  // Days of the week
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Mock data structure - day-wise
  const mockWeekData = {
    Mon: [
      {
        id: 1,
        title: "Calculus 1 HW - Derivatives",
        course: "MATH 101",
        status: "Completed",
        priority: "High Priority",
        progress: 100,
        dueDate: "Nov 22",
        notes: ""
      },
      {
        id: 2,
        title: "Read Chapter 5 - Biology",
        course: "BIO 150",
        status: "In Progress",
        priority: "Medium Priority",
        progress: 60,
        dueDate: "Nov 22",
        notes: ""
      }
    ],
    Tue: [
      {
        id: 3,
        title: "PAMSA Essay - Cultural Analysis",
        course: "PAMSA 200",
        status: "In Progress",
        priority: "High Priority",
        progress: 75,
        dueDate: "Nov 24",
        notes: "Need to add conclusion"
      }
    ],
    Wed: [
      {
        id: 4,
        title: "Lab Report - Photosynthesis",
        course: "BIO 150",
        status: "Completed",
        priority: "Medium Priority",
        progress: 100,
        dueDate: "Nov 23",
        notes: ""
      }
    ],
    Thu: [],
    Fri: [
      {
        id: 5,
        title: "OOP Project - Library System",
        course: "CS 201",
        status: "In Progress",
        priority: "High Priority",
        progress: 65,
        dueDate: "Nov 29",
        notes: "Working on database integration"
      }
    ],
    Sat: [],
    Sun: [
      {
        id: 6,
        title: "History Presentation - Ottoman Empire",
        course: "HIST 102",
        status: "In Progress",
        priority: "Medium Priority",
        progress: 40,
        dueDate: "Dec 1",
        notes: ""
      }
    ]
  };

  const fetchWeekData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setWeekData(mockWeekData);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API}/assignments/weekly/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setWeekData(data || mockWeekData);
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
  }, []);

  // Calculate day progress
  const calculateDayProgress = (assignments) => {
    if (!assignments || assignments.length === 0) return 0;
    const totalProgress = assignments.reduce((sum, a) => sum + a.progress, 0);
    return Math.round(totalProgress / assignments.length);
  };

  // Calculate overall weekly progress
  const calculateWeeklyProgress = () => {
    const allProgress = daysOfWeek.map(day => calculateDayProgress(weekData[day] || []));
    const total = allProgress.reduce((sum, p) => sum + p, 0);
    return Math.round(total / 7);
  };

  // Update progress and notify parent
  const updateWeekData = (newWeekData) => {
    setWeekData(newWeekData);
    if (onUpdateProgress) {
      const dayProgress = {};
      daysOfWeek.forEach(day => {
        dayProgress[day] = calculateDayProgress(newWeekData[day] || []);
      });
      onUpdateProgress(dayProgress, newWeekData);
    }
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
      id: Date.now(),
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
            onClick={onBack}
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
                  Weekly Assignment Tracker
                </h1>
              </div>
              <p className="text-sm" style={{ color: '#9575a3' }}>
                Track your daily assignments and progress throughout the week
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold mb-1" style={{ color: '#b39ddb' }}>
                {calculateWeeklyProgress()}%
              </div>
              <p className="text-sm" style={{ color: '#9575a3' }}>Overall Weekly Progress</p>
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