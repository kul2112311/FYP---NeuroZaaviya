// import { useState } from "react";
// import { ArrowLeft, Sparkles, Calendar as CalendarIcon, AlertTriangle, Save, CheckCircle, RotateCcw, Flame, Target, Zap, ListTodo, Check, ChevronLeft, ChevronRight, GripVertical, Edit2, X, Clock } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useUser } from "../../usercontext";

// export function AITaskResultsPage({ taskData, onBack, onEditPrompt }) {
//   const navigate = useNavigate();
//   const { addPoints, updateStreak } = useUser();
//   const [selectedQuadrant, setSelectedQuadrant] = useState("schedule");
//   const [dueDate, setDueDate] = useState("");
//   const [showSuccessToast, setShowSuccessToast] = useState(false);
//   const [showErrorModal, setShowErrorModal] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [currentWeek, setCurrentWeek] = useState(0);
//   const [draggedSubtask, setDraggedSubtask] = useState(null);
//   const [scheduledSubtasks, setScheduledSubtasks] = useState({});
//   // Edit modal state
//   const [editingKey, setEditingKey] = useState(null); // subtask.id being edited
//   const [editForm, setEditForm] = useState({});

//   const aiSubtasks = [
//     { id: "st1", title: "Research and gather information", duration: "45min", estimated_minutes: 45 },
//     { id: "st2", title: "Create an outline", duration: "30min", estimated_minutes: 30 },
//     { id: "st3", title: "Draft initial version", duration: "120min", estimated_minutes: 120 },
//     { id: "st4", title: "Review and refine", duration: "60min", estimated_minutes: 60 },
//     { id: "st5", title: "Final polish and submission", duration: "30min", estimated_minutes: 30 }
//   ];

//   const quadrants = [
//     { id: "do-now",   title: "Do Now",    subtitle: "Urgent & Important",       icon: Flame,    iconColor: "#ef4444" },
//     { id: "schedule", title: "Schedule",  subtitle: "Important, Not Urgent",    icon: Target,   iconColor: "#3b82f6" },
//     { id: "delegate", title: "Delegate",  subtitle: "Urgent, Not Important",    icon: Zap,      iconColor: "#eab308" },
//     { id: "defer",    title: "Defer",     subtitle: "Not Urgent, Not Important", icon: ListTodo, iconColor: "#22c55e" }
//   ];

//   // Mon-start week
//   const getWeekDates = () => {
//     const today = new Date();
//     const startOfWeek = new Date(today);
//     startOfWeek.setDate(today.getDate() - (today.getDay() + 6) % 7 + currentWeek * 7);
//     return Array.from({ length: 7 }, (_, i) => {
//       const d = new Date(startOfWeek); d.setDate(startOfWeek.getDate() + i); return d;
//     });
//   };

//   const weekDates = getWeekDates();
//   const monthYear = weekDates[0].toLocaleDateString("en-US", { month: "long", year: "numeric" });
//   const dayLabels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

//   const handleDragStart = (e, subtask) => {
//     setDraggedSubtask(subtask);
//     e.dataTransfer.effectAllowed = "move";
//   };

//   const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };

//   const handleDrop = (e, day, hour) => {
//     e.preventDefault();
//     if (!draggedSubtask) return;
//     const dateKey = day.toISOString().split("T")[0];
//     const timeKey = `${String(hour).padStart(2,"0")}:00`;
//     setScheduledSubtasks(prev => ({
//       ...prev,
//       [draggedSubtask.id]: {
//         date: dateKey,
//         time: timeKey,
//         day: day.toLocaleDateString("en-US", { weekday: "short" }),
//         displayDate: day.getDate(),
//         title: draggedSubtask.title,
//         duration: draggedSubtask.duration,
//         estimated_minutes: draggedSubtask.estimated_minutes,
//       }
//     }));
//     setDraggedSubtask(null);
//   };

//   // Open edit modal for a scheduled subtask
//   const openEdit = (subtaskId) => {
//     const s = scheduledSubtasks[subtaskId];
//     if (!s) return;
//     setEditForm({
//       date: s.date,
//       time: s.time,
//       duration: s.duration,
//       title: s.title,
//     });
//     setEditingKey(subtaskId);
//   };

//   const saveEdit = () => {
//     setScheduledSubtasks(prev => ({
//       ...prev,
//       [editingKey]: {
//         ...prev[editingKey],
//         date: editForm.date,
//         time: editForm.time,
//         duration: editForm.duration,
//         title: editForm.title,
//         day: editForm.date ? new Date(editForm.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" }) : prev[editingKey].day,
//         displayDate: editForm.date ? new Date(editForm.date + "T12:00:00").getDate() : prev[editingKey].displayDate,
//       }
//     }));
//     setEditingKey(null);
//   };

//   const removeScheduled = (subtaskId) => {
//     setScheduledSubtasks(prev => { const n = { ...prev }; delete n[subtaskId]; return n; });
//   };

//   const getPriority = (quadrantId) => {
//     if (quadrantId === "do-now")   return "High Priority";
//     if (quadrantId === "schedule") return "Medium Priority";
//     if (quadrantId === "delegate") return "Medium Priority";
//     return "Low Priority";
//   };

//   const handleConfirmAndAdd = () => {
//     if (!selectedQuadrant || !dueDate) {
//       setErrorMessage("Please select a priority quadrant and due date");
//       setShowErrorModal(true);
//       return;
//     }

//     try {
//       const taskId = `ai-task-${Date.now()}`;
//       const priority = getPriority(selectedQuadrant);

//       // Build one upcomingAssignment per subtask
//       const newEntries = aiSubtasks.map((subtask, index) => {
//         const sched = scheduledSubtasks[subtask.id];
//         return {
//           id: `${taskId}-${index}`,
//           title: sched?.title || subtask.title,
//           course: taskData?.taskPrompt ? taskData.taskPrompt.slice(0, 40) : "AI Breakdown",
//           status: "In Progress",
//           priority,
//           progress: 0,
//           dueDate: sched?.date || dueDate,
//           time: sched?.time || "",
//           duration: sched?.duration || subtask.duration,
//           notes: `Estimated: ${sched?.duration || subtask.duration}`,
//           createdAt: new Date().toISOString(),
//           source: "ai-breakdown",
//         };
//       });

//       // Merge with existing
//       const existing = localStorage.getItem("upcomingAssignments");
//       const all = existing ? JSON.parse(existing) : [];
//       localStorage.setItem("upcomingAssignments", JSON.stringify([...all, ...newEntries]));

//       if (typeof addPoints === "function") addPoints(20, "Completed AI task breakdown");
//       if (typeof updateStreak === "function") updateStreak();

//       window.dispatchEvent(new Event("eisenhowerSaved"));

//       setShowSuccessToast(true);
//       setTimeout(() => { setShowSuccessToast(false); navigate("/"); }, 2000);
//     } catch (error) {
//       setErrorMessage("There was an error saving your task. Please try again.");
//       setShowErrorModal(true);
//     }
//   };

//   return (
//     <div className="min-h-screen p-6" style={{ background: "#f5eef8" }}>
//       <div className="max-w-[1800px] mx-auto space-y-4">

//         {/* Header */}
//         <div className="flex items-center gap-4">
//           <button onClick={onBack || (() => navigate("/"))}
//             className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80"
//             style={{ background: "#ffffff", border: "1px solid rgba(179,157,219,0.2)" }}>
//             <ArrowLeft className="h-4 w-4" style={{ color: "#9575a3" }} />
//           </button>
//           <div className="flex-1 flex items-center gap-3">
//             <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#b39ddb" }}>
//               <Sparkles className="h-5 w-5 text-white" />
//             </div>
//             <div>
//               <h1 className="text-xl font-semibold" style={{ color: "#5a4a61" }}>Task Breakdown & Scheduling</h1>
//               <p style={{ color: "#9575a3", fontSize: "13px" }}>Drag subtasks to the calendar, then click the edit icon to adjust time/day</p>
//             </div>
//           </div>
//         </div>

//         {/* Main 3-col layout */}
//         <div className="grid grid-cols-12 gap-4">

//           {/* LEFT: Subtask list */}
//           <div className="col-span-3">
//             <div className="rounded-3xl p-5 shadow-sm h-full" style={{ background: "#ffffff", border: "1px solid rgba(179,157,219,0.2)" }}>
//               <h3 className="font-semibold mb-4 text-sm" style={{ color: "#5a4a61" }}>Subtasks to Schedule</h3>
//               <div className="space-y-2">
//                 {aiSubtasks.map(subtask => {
//                   const sched = scheduledSubtasks[subtask.id];
//                   const isScheduled = !!sched;
//                   return (
//                     <div key={subtask.id}
//                       draggable={!isScheduled}
//                       onDragStart={e => !isScheduled && handleDragStart(e, subtask)}
//                       className={`p-3 rounded-2xl transition-all ${!isScheduled ? "cursor-move hover:shadow-md" : ""}`}
//                       style={{ background: "#fce4ec", border: "1px solid rgba(248,187,208,0.3)", opacity: isScheduled ? 0.7 : 1 }}>
//                       <div className="flex items-start gap-2">
//                         {isScheduled
//                           ? <Check className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "#22c55e" }} />
//                           : <GripVertical className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "#f8bbd0" }} />}
//                         <div className="flex-1 min-w-0">
//                           <div className="font-medium text-xs mb-1" style={{ color: "#5a4a61" }}>{subtask.title}</div>
//                           <div className="text-[10px] font-medium" style={{ color: "#f8bbd0" }}>{subtask.duration}</div>
//                           {isScheduled && (
//                             <div className="flex flex-col gap-1 mt-1">
//                               <span className="text-[10px] px-1.5 py-0.5 rounded w-fit" style={{ background: "#c8e6c9", color: "#2e7d32" }}>
//                                 ✓ {sched.day} {sched.time}
//                               </span>
//                               <div className="flex items-center gap-1">
//                                 <button onClick={() => openEdit(subtask.id)}
//                                   className="text-[10px] px-1.5 py-0.5 rounded hover:opacity-80 flex items-center gap-0.5"
//                                   style={{ background: "#e3f2fd", color: "#1565c0" }}>
//                                   <Edit2 className="h-2.5 w-2.5" /> Edit
//                                 </button>
//                                 <button onClick={() => removeScheduled(subtask.id)}
//                                   className="text-[10px] px-1.5 py-0.5 rounded hover:opacity-80 flex items-center gap-0.5"
//                                   style={{ background: "#fff3e0", color: "#e65100" }}>
//                                   <RotateCcw className="h-2.5 w-2.5" /> Unschedule
//                                 </button>
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//               <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(179,157,219,0.2)" }}>
//                 <p className="text-xs" style={{ color: "#9575a3" }}>
//                   📌 Drag to calendar to schedule. Click Edit to change time or day.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* CENTER: Calendar */}
//           <div className="col-span-6">
//             <div className="rounded-3xl p-5 shadow-sm h-full" style={{ background: "#ffffff", border: "1px solid rgba(179,157,219,0.2)" }}>
//               <div className="flex items-center justify-between mb-4">
//                 <button onClick={() => setCurrentWeek(currentWeek - 1)} className="p-2 rounded-xl hover:opacity-80" style={{ background: "#f3e5f5" }}>
//                   <ChevronLeft className="h-4 w-4" style={{ color: "#b39ddb" }} />
//                 </button>
//                 <div className="text-center">
//                   <div className="font-semibold text-base" style={{ color: "#5a4a61" }}>{monthYear}</div>
//                   <div className="text-xs" style={{ color: "#9575a3" }}>
//                     {weekDates[0].toLocaleDateString("en-US",{month:"short",day:"numeric"})} – {weekDates[6].toLocaleDateString("en-US",{month:"short",day:"numeric"})}
//                   </div>
//                 </div>
//                 <button onClick={() => setCurrentWeek(currentWeek + 1)} className="p-2 rounded-xl hover:opacity-80" style={{ background: "#f3e5f5" }}>
//                   <ChevronRight className="h-4 w-4" style={{ color: "#b39ddb" }} />
//                 </button>
//               </div>

//               <div className="overflow-auto" style={{ maxHeight: "calc(100vh - 280px)" }}>
//                 {/* Day headers */}
//                 <div className="flex gap-1 mb-2 text-xs sticky top-0" style={{ background: "#ffffff", zIndex: 10 }}>
//                   <div className="w-16 flex-shrink-0" />
//                   {weekDates.map((date, i) => (
//                     <div key={i} className="flex-1 text-center min-w-[80px]">
//                       <div className="font-medium" style={{ color: "#9575a3" }}>{dayLabels[i]}</div>
//                       <div className="text-base font-semibold" style={{ color: "#5a4a61" }}>{date.getDate()}</div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Time slots */}
//                 <div className="space-y-1">
//                   {Array.from({ length: 14 }, (_, i) => 8 + i).map(hour => (
//                     <div key={hour} className="flex gap-1">
//                       <div className="w-16 flex-shrink-0 text-[10px] pt-1" style={{ color: "#9575a3" }}>
//                         {hour > 12 ? `${hour-12}:00 PM` : hour === 12 ? "12:00 PM" : `${hour}:00 AM`}
//                       </div>
//                       {weekDates.map((day, dayIdx) => {
//                         const dateKey = day.toISOString().split("T")[0];
//                         const scheduledHere = Object.entries(scheduledSubtasks).find(
//                           ([, s]) => s.date === dateKey && parseInt(s.time.split(":")[0]) === hour
//                         );
//                         return (
//                           <div key={dayIdx}
//                             className="flex-1 h-12 rounded-lg transition-all min-w-[80px] relative"
//                             style={{ border: "1px solid rgba(179,157,219,0.1)", background: scheduledHere ? "#e8eaf6" : "transparent" }}
//                             onDragOver={handleDragOver}
//                             onDrop={e => handleDrop(e, day, hour)}>
//                             {scheduledHere && (() => {
//                               const [subtaskId, info] = scheduledHere;
//                               return (
//                                 <div className="absolute inset-0 p-1 flex flex-col justify-between">
//                                   <div className="text-[9px] font-medium truncate" style={{ color: "#283593" }}>{info.title}</div>
//                                   <div className="flex items-center justify-between">
//                                     <span className="text-[8px]" style={{ color: "#3949ab" }}>{info.duration}</span>
//                                     <div className="flex items-center gap-0.5">
//                                       <button onClick={() => openEdit(subtaskId)}
//                                         className="w-4 h-4 rounded flex items-center justify-center hover:opacity-80"
//                                         title="Edit"
//                                         style={{ background: "#c5cae9" }}>
//                                         <Edit2 className="h-2.5 w-2.5" style={{ color: "#283593" }} />
//                                       </button>
//                                       <button onClick={() => removeScheduled(subtaskId)}
//                                         className="w-4 h-4 rounded flex items-center justify-center hover:opacity-80"
//                                         title="Unschedule — drag back to reschedule"
//                                         style={{ background: "#ffe0b2" }}>
//                                         <RotateCcw className="h-2.5 w-2.5" style={{ color: "#e65100" }} />
//                                       </button>
//                                     </div>
//                                   </div>
//                                 </div>
//                               );
//                             })()}
//                           </div>
//                         );
//                       })}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT: Controls */}
//           <div className="col-span-3 space-y-3">
//             <div className="rounded-3xl p-5 shadow-sm" style={{ background: "#ffffff", border: "1px solid rgba(179,157,219,0.2)" }}>
//               <h3 className="flex items-center gap-2 font-semibold mb-3 text-sm" style={{ color: "#5a4a61" }}>
//                 <CalendarIcon className="h-4 w-4" style={{ color: "#b39ddb" }} />
//                 Main Due Date
//               </h3>
//               <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
//                 className="w-full p-2 rounded-xl focus:outline-none text-sm"
//                 style={{ background: "#fdf7fd", border: "1px solid rgba(179,157,219,0.2)", color: "#5a4a61" }}
//                 min={new Date().toISOString().split("T")[0]} />
//               <p className="text-xs mt-2" style={{ color: "#9575a3" }}>Used for unscheduled subtasks</p>
//             </div>

//             <div className="rounded-3xl p-5 shadow-sm" style={{ background: "#ffffff", border: "1px solid rgba(179,157,219,0.2)" }}>
//               <h3 className="flex items-center gap-2 font-semibold mb-3 text-sm" style={{ color: "#5a4a61" }}>
//                 <AlertTriangle className="h-4 w-4" style={{ color: "#b39ddb" }} />
//                 Priority
//               </h3>
//               <div className="space-y-2">
//                 {quadrants.map(q => {
//                   const Icon = q.icon;
//                   return (
//                     <button key={q.id} onClick={() => setSelectedQuadrant(q.id)}
//                       className="w-full p-2.5 rounded-xl text-left transition-all flex items-center gap-2"
//                       style={{ background: selectedQuadrant === q.id ? "#f3e5f5" : "#fdf7fd", border: selectedQuadrant === q.id ? "2px solid #b39ddb" : "1px solid rgba(179,157,219,0.2)" }}>
//                       <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#ffffff" }}>
//                         <Icon className="h-3.5 w-3.5" style={{ color: q.iconColor }} />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <div className="font-medium text-xs" style={{ color: "#5a4a61" }}>{q.title}</div>
//                         <div className="text-[10px] truncate" style={{ color: "#9575a3" }}>{q.subtitle}</div>
//                       </div>
//                       {selectedQuadrant === q.id && <Check className="h-4 w-4 flex-shrink-0" style={{ color: "#b39ddb" }} />}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             <button onClick={handleConfirmAndAdd} disabled={!selectedQuadrant || !dueDate}
//               className="w-full h-12 rounded-2xl text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg flex items-center justify-center gap-2"
//               style={{ background: (!selectedQuadrant || !dueDate) ? "#e1bee7" : "#b39ddb" }}>
//               <Save className="h-4 w-4" />
//               Save to Calendar
//             </button>

//             <div className="text-xs p-3 rounded-lg" style={{ background: "#fffbeb", color: "#92400e" }}>
//               ✓ {Object.keys(scheduledSubtasks).length}/{aiSubtasks.length} scheduled<br />
//               ✓ All appear in Calendar, Upcoming Assignments &amp; Weekly Progress
//             </div>

//             {onEditPrompt && (
//               <button onClick={onEditPrompt} className="w-full py-2 text-xs flex items-center justify-center gap-2 hover:opacity-80" style={{ color: "#9575a3" }}>
//                 <RotateCcw className="h-3.5 w-3.5" /> Edit Prompt
//               </button>
//             )}
//           </div>
//         </div>

//         {/* ── Edit Modal ── */}
//         {editingKey && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
//             <div className="rounded-3xl p-6 shadow-2xl w-80" style={{ background: "#ffffff" }}>
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="font-semibold" style={{ color: "#5a4a61" }}>Edit Scheduled Task</h3>
//                 <button onClick={() => setEditingKey(null)} className="w-7 h-7 rounded-full flex items-center justify-center hover:opacity-80" style={{ background: "#f3e5f5" }}>
//                   <X className="h-4 w-4" style={{ color: "#9575a3" }} />
//                 </button>
//               </div>
//               <div className="space-y-3">
//                 <div>
//                   <label className="text-xs font-medium block mb-1" style={{ color: "#9575a3" }}>Task title</label>
//                   <input value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })}
//                     className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none"
//                     style={{ background: "#fdf7fd", border: "1px solid rgba(179,157,219,0.3)", color: "#5a4a61" }} />
//                 </div>
//                 <div>
//                   <label className="text-xs font-medium block mb-1" style={{ color: "#9575a3" }}>Date</label>
//                   <input type="date" value={editForm.date} onChange={e => setEditForm({ ...editForm, date: e.target.value })}
//                     className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none"
//                     style={{ background: "#fdf7fd", border: "1px solid rgba(179,157,219,0.3)", color: "#5a4a61" }} />
//                 </div>
//                 <div>
//                   <label className="text-xs font-medium block mb-1" style={{ color: "#9575a3" }}>Time</label>
//                   <input type="time" value={editForm.time} onChange={e => setEditForm({ ...editForm, time: e.target.value })}
//                     className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none"
//                     style={{ background: "#fdf7fd", border: "1px solid rgba(179,157,219,0.3)", color: "#5a4a61" }} />
//                 </div>
//                 <div>
//                   <label className="text-xs font-medium block mb-1" style={{ color: "#9575a3" }}>Duration</label>
//                   <input value={editForm.duration} onChange={e => setEditForm({ ...editForm, duration: e.target.value })}
//                     placeholder="e.g. 45min"
//                     className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none"
//                     style={{ background: "#fdf7fd", border: "1px solid rgba(179,157,219,0.3)", color: "#5a4a61" }} />
//                 </div>
//                 <div className="flex gap-2 pt-1">
//                   <button onClick={() => setEditingKey(null)}
//                     className="flex-1 py-2 rounded-xl text-sm font-medium"
//                     style={{ background: "#f3e5f5", color: "#9575a3" }}>
//                     Cancel
//                   </button>
//                   <button onClick={saveEdit}
//                     className="flex-1 py-2 rounded-xl text-sm font-medium text-white"
//                     style={{ background: "#b39ddb" }}>
//                     Save Changes
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Error Modal */}
//         {showErrorModal && (
//           <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.5)" }}>
//             <div className="bg-white px-8 py-6 rounded-3xl shadow-2xl flex flex-col items-center gap-4" style={{ maxWidth: "400px" }}>
//               <AlertTriangle className="h-12 w-12" style={{ color: "#ef4444" }} />
//               <div className="text-center">
//                 <div className="text-lg font-semibold mb-1" style={{ color: "#5a4a61" }}>Missing Info</div>
//                 <div className="text-sm" style={{ color: "#9575a3" }}>{errorMessage}</div>
//               </div>
//               <button onClick={() => setShowErrorModal(false)} className="px-6 py-2 rounded-full text-white font-medium" style={{ background: "#b39ddb" }}>OK</button>
//             </div>
//           </div>
//         )}

//         {/* Success Toast */}
//         {showSuccessToast && (
//           <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.5)" }}>
//             <div className="text-white px-8 py-6 rounded-3xl shadow-2xl flex flex-col items-center gap-4" style={{ background: "#22c55e", maxWidth: "400px" }}>
//               <CheckCircle className="h-12 w-12" />
//               <div className="text-center">
//                 <div className="text-lg font-semibold mb-1">Saved! ✨</div>
//                 <div className="text-sm opacity-90">{aiSubtasks.length} tasks saved to your calendar</div>
//                 <div className="text-xs opacity-75 mt-2">Check Calendar · Upcoming Assignments · Weekly Progress</div>
//               </div>
//               <div className="text-xs opacity-75">Redirecting...</div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { ArrowLeft, Sparkles, Calendar as CalendarIcon, AlertTriangle, Save, CheckCircle, RotateCcw, Flame, Target, Zap, ListTodo, Check, ChevronLeft, ChevronRight, GripVertical, Edit2, X, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../styles/SignInLandingPage/usercontext";

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
  // Edit modal state
  const [editingKey, setEditingKey] = useState(null); 
  const [editForm, setEditForm] = useState({});

  const [aiSubtasks, setAiSubtasks] = useState(() => {
    if (taskData && taskData.aiResult && taskData.aiResult.tasks) {
      return taskData.aiResult.tasks.map((task, index) => ({
        id: `st-${index}`,
        title: task.title,
        duration: `${task.duration_minutes}min`,
        estimated_minutes: task.duration_minutes,
        ai_detail: task.ai_detail 
      }));
    }
    return []; 
  });

  const quadrants = [
    { id: "do_now",   title: "Do Now",    subtitle: "Urgent & Important",       icon: Flame,    iconColor: "#ef4444" },
    { id: "schedule", title: "Schedule",  subtitle: "Important, Not Urgent",    icon: Target,   iconColor: "#3b82f6" },
    { id: "delegate", title: "Delegate",  subtitle: "Urgent, Not Important",    icon: Zap,      iconColor: "#eab308" },
    { id: "defer",    title: "Defer",     subtitle: "Not Urgent, Not Important", icon: ListTodo, iconColor: "#22c55e" }
  ];

  const getWeekDates = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (today.getDay() + 6) % 7 + currentWeek * 7);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek); d.setDate(startOfWeek.getDate() + i); return d;
    });
  };

  const weekDates = getWeekDates();
  const monthYear = weekDates[0].toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const dayLabels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  const handleDragStart = (e, subtask) => { setDraggedSubtask(subtask); e.dataTransfer.effectAllowed = "move"; };
  const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };

  const handleDrop = (e, day, hour) => {
    e.preventDefault();
    if (!draggedSubtask) return;
    const dateKey = day.toISOString().split("T")[0];
    const timeKey = `${String(hour).padStart(2,"0")}:00`;
    setScheduledSubtasks(prev => ({
      ...prev,
      [draggedSubtask.id]: {
        date: dateKey, time: timeKey,
        day: day.toLocaleDateString("en-US", { weekday: "short" }),
        displayDate: day.getDate(),
        title: draggedSubtask.title,
        duration: draggedSubtask.duration,
        estimated_minutes: draggedSubtask.estimated_minutes,
      }
    }));
    setDraggedSubtask(null);
  };

  const openEdit = (subtaskId) => {
    const s = scheduledSubtasks[subtaskId];
    if (!s) return;
    setEditForm({ date: s.date, time: s.time, duration: s.duration, title: s.title });
    setEditingKey(subtaskId);
  };

  const saveEdit = () => {
    setScheduledSubtasks(prev => ({
      ...prev,
      [editingKey]: {
        ...prev[editingKey],
        date: editForm.date, time: editForm.time, duration: editForm.duration, title: editForm.title,
        day: editForm.date ? new Date(editForm.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" }) : prev[editingKey].day,
        displayDate: editForm.date ? new Date(editForm.date + "T12:00:00").getDate() : prev[editingKey].displayDate,
      }
    }));
    setEditingKey(null);
  };

  const removeScheduled = (subtaskId) => {
    setScheduledSubtasks(prev => { const n = { ...prev }; delete n[subtaskId]; return n; });
  };

  const getPriority = (quadrantId) => {
    if (quadrantId === "do-now") return "High Priority";
    if (quadrantId === "schedule" || quadrantId === "delegate") return "Medium Priority";
    return "Low Priority";
  };

  const handleConfirmAndAdd = async () => {
    console.log("🟢 1. Save button clicked");
    if (!selectedQuadrant || !dueDate) {
      setErrorMessage("Please select a priority quadrant and due date");
      setShowErrorModal(true);
      return;
    }
    try {
      console.log("🟢 2. Building Payload...");
      const payload = {
        studentId: "a1111111-1111-1111-1111-111111111111", // Forced Ushna's ID directly to prevent context errors
        title: taskData?.taskPrompt ? taskData.taskPrompt.substring(0, 50) + "..." : "AI Task Breakdown",
        description: taskData?.taskPrompt || "Generated via AI Agent",
        dueDate: dueDate,
        quadrant: selectedQuadrant,
        subtasks: aiSubtasks.map(subtask => {
          const sched = scheduledSubtasks[subtask.id];
          return {
            title: sched?.title || subtask.title,
            description: subtask.ai_detail || "Follow AI instructions",
            estimated_time_minutes: sched?.estimated_minutes || subtask.estimated_minutes,
            scheduled_date: sched?.date || null,
            scheduled_start_time: sched?.time || null
          };
        })
      };

      console.log("🟢 3. Payload built successfully:", payload);
      console.log("🟢 4. Sending fetch request to backend...");

      const response = await fetch("http://127.0.0.1:5000/api/tasks/ai-breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      console.log("🟢 5. Received response. Status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("🔴 Backend Error:", errorText);
        throw new Error(`Backend Status ${response.status}: ${errorText}`);
      }

      console.log("🟢 6. Save successful!");
      
      if (typeof addPoints === "function") addPoints(20, "Completed AI task breakdown");
      if (typeof updateStreak === "function") updateStreak();

      setShowSuccessToast(true);
      setTimeout(() => { 
        setShowSuccessToast(false); 
        navigate("/"); 
      }, 2000);

    } catch (error) {
      console.error("🔴 7. CATCH BLOCK TRIGGERED:", error);
      // 🔥 THIS WILL NOW SHOW THE EXACT ERROR ON YOUR SCREEN
      setErrorMessage(`DEBUG INFO: ${error.message}`);
      setShowErrorModal(true);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ background: "#f5eef8" }}>
      <div className="max-w-[1800px] mx-auto space-y-4">

        <div className="flex items-center gap-4">
          <button onClick={onBack || (() => navigate("/"))} className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80" style={{ background: "#ffffff", border: "1px solid rgba(179,157,219,0.2)" }}>
            <ArrowLeft className="h-4 w-4" style={{ color: "#9575a3" }} />
          </button>
          <div className="flex-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#b39ddb" }}>
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold" style={{ color: "#5a4a61" }}>Task Breakdown & Scheduling</h1>
              <p style={{ color: "#9575a3", fontSize: "13px" }}>Drag subtasks to the calendar, then click the edit icon to adjust time/day</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">

          {/* LEFT: Subtask list */}
          <div className="col-span-3">
            <div className="rounded-3xl p-5 shadow-sm h-full" style={{ background: "#ffffff", border: "1px solid rgba(179,157,219,0.2)" }}>
              <h3 className="font-semibold mb-4 text-sm" style={{ color: "#5a4a61" }}>Subtasks to Schedule</h3>
              <div className="space-y-2">
                {aiSubtasks.map(subtask => {
                  const sched = scheduledSubtasks[subtask.id];
                  const isScheduled = !!sched;
                  return (
                    <div key={subtask.id}
                      draggable={!isScheduled}
                      onDragStart={e => !isScheduled && handleDragStart(e, subtask)}
                      className={`p-3 rounded-2xl transition-all ${!isScheduled ? "cursor-move hover:shadow-md" : ""}`}
                      style={{ background: "#fce4ec", border: "1px solid rgba(248,187,208,0.3)", opacity: isScheduled ? 0.7 : 1 }}>
                      <div className="flex items-start gap-2">
                        {isScheduled
                          ? <Check className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "#22c55e" }} />
                          : <GripVertical className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "#f8bbd0" }} />}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-xs mb-1" style={{ color: "#5a4a61" }}>{subtask.title}</div>
                          <div className="text-[10px] font-medium" style={{ color: "#f8bbd0" }}>{subtask.duration}</div>
                          {isScheduled && (
                            <div className="flex flex-col gap-1 mt-1">
                              <span className="text-[10px] px-1.5 py-0.5 rounded w-fit" style={{ background: "#c8e6c9", color: "#2e7d32" }}>✓ {sched.day} {sched.time}</span>
                              <div className="flex items-center gap-1">
                                <button onClick={() => openEdit(subtask.id)} className="text-[10px] px-1.5 py-0.5 rounded hover:opacity-80 flex items-center gap-0.5" style={{ background: "#e3f2fd", color: "#1565c0" }}>
                                  <Edit2 className="h-2.5 w-2.5" /> Edit
                                </button>
                                <button onClick={() => removeScheduled(subtask.id)} className="text-[10px] px-1.5 py-0.5 rounded hover:opacity-80 flex items-center gap-0.5" style={{ background: "#fff3e0", color: "#e65100" }}>
                                  <RotateCcw className="h-2.5 w-2.5" /> Unschedule
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(179,157,219,0.2)" }}>
                <p className="text-xs" style={{ color: "#9575a3" }}>📌 Drag to calendar to schedule. Click Edit to change time or day.</p>
              </div>
            </div>
          </div>

          {/* CENTER: Calendar */}
          <div className="col-span-6">
            <div className="rounded-3xl p-5 shadow-sm h-full" style={{ background: "#ffffff", border: "1px solid rgba(179,157,219,0.2)" }}>
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setCurrentWeek(currentWeek - 1)} className="p-2 rounded-xl hover:opacity-80" style={{ background: "#f3e5f5" }}>
                  <ChevronLeft className="h-4 w-4" style={{ color: "#b39ddb" }} />
                </button>
                <div className="text-center">
                  <div className="font-semibold text-base" style={{ color: "#5a4a61" }}>{monthYear}</div>
                  <div className="text-xs" style={{ color: "#9575a3" }}>
                    {weekDates[0].toLocaleDateString("en-US",{month:"short",day:"numeric"})} – {weekDates[6].toLocaleDateString("en-US",{month:"short",day:"numeric"})}
                  </div>
                </div>
                <button onClick={() => setCurrentWeek(currentWeek + 1)} className="p-2 rounded-xl hover:opacity-80" style={{ background: "#f3e5f5" }}>
                  <ChevronRight className="h-4 w-4" style={{ color: "#b39ddb" }} />
                </button>
              </div>

              <div className="overflow-auto" style={{ maxHeight: "calc(100vh - 280px)" }}>
                <div className="flex gap-1 mb-2 text-xs sticky top-0" style={{ background: "#ffffff", zIndex: 10 }}>
                  <div className="w-16 flex-shrink-0" />
                  {weekDates.map((date, i) => (
                    <div key={i} className="flex-1 text-center min-w-[80px]">
                      <div className="font-medium" style={{ color: "#9575a3" }}>{dayLabels[i]}</div>
                      <div className="text-base font-semibold" style={{ color: "#5a4a61" }}>{date.getDate()}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  {Array.from({ length: 14 }, (_, i) => 8 + i).map(hour => (
                    <div key={hour} className="flex gap-1">
                      <div className="w-16 flex-shrink-0 text-[10px] pt-1" style={{ color: "#9575a3" }}>
                        {hour > 12 ? `${hour-12}:00 PM` : hour === 12 ? "12:00 PM" : `${hour}:00 AM`}
                      </div>
                      {weekDates.map((day, dayIdx) => {
                        const dateKey = day.toISOString().split("T")[0];
                        const scheduledHere = Object.entries(scheduledSubtasks).find(
                          ([, s]) => s.date === dateKey && parseInt(s.time.split(":")[0]) === hour
                        );
                        return (
                          <div key={dayIdx}
                            className="flex-1 h-12 rounded-lg transition-all min-w-[80px] relative"
                            style={{ border: "1px solid rgba(179,157,219,0.1)", background: scheduledHere ? "#e8eaf6" : "transparent" }}
                            onDragOver={handleDragOver}
                            onDrop={e => handleDrop(e, day, hour)}>
                            {scheduledHere && (() => {
                              const [subtaskId, info] = scheduledHere;
                              return (
                                <div className="absolute inset-0 p-1 flex flex-col justify-between">
                                  <div className="text-[9px] font-medium truncate" style={{ color: "#283593" }}>{info.title}</div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-[8px]" style={{ color: "#3949ab" }}>{info.duration}</span>
                                    <div className="flex items-center gap-0.5">
                                      <button onClick={() => openEdit(subtaskId)} className="w-4 h-4 rounded flex items-center justify-center hover:opacity-80" style={{ background: "#c5cae9" }}>
                                        <Edit2 className="h-2.5 w-2.5" style={{ color: "#283593" }} />
                                      </button>
                                      <button onClick={() => removeScheduled(subtaskId)}
                                        className="w-4 h-4 rounded flex items-center justify-center hover:opacity-80"
                                        title="Unschedule"
                                        style={{ background: "#ffe0b2" }}>
                                        <RotateCcw className="h-2.5 w-2.5" style={{ color: "#e65100" }} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Controls */}
          <div className="col-span-3 space-y-3">
            <div className="rounded-3xl p-5 shadow-sm" style={{ background: "#ffffff", border: "1px solid rgba(179,157,219,0.2)" }}>
              <h3 className="flex items-center gap-2 font-semibold mb-3 text-sm" style={{ color: "#5a4a61" }}>
                <CalendarIcon className="h-4 w-4" style={{ color: "#b39ddb" }} /> Main Due Date
              </h3>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                className="w-full p-2 rounded-xl focus:outline-none text-sm"
                style={{ background: "#fdf7fd", border: "1px solid rgba(179,157,219,0.2)", color: "#5a4a61" }}
                min={new Date().toISOString().split("T")[0]} />
              <p className="text-xs mt-2" style={{ color: "#9575a3" }}>Used for unscheduled subtasks</p>
            </div>

            <div className="rounded-3xl p-5 shadow-sm" style={{ background: "#ffffff", border: "1px solid rgba(179,157,219,0.2)" }}>
              <h3 className="flex items-center gap-2 font-semibold mb-3 text-sm" style={{ color: "#5a4a61" }}>
                <AlertTriangle className="h-4 w-4" style={{ color: "#b39ddb" }} /> Priority
              </h3>
              <div className="space-y-2">
                {quadrants.map(q => {
                  const Icon = q.icon;
                  return (
                    <button key={q.id} onClick={() => setSelectedQuadrant(q.id)}
                      className="w-full p-2.5 rounded-xl text-left transition-all flex items-center gap-2"
                      style={{ background: selectedQuadrant === q.id ? "#f3e5f5" : "#fdf7fd", border: selectedQuadrant === q.id ? "2px solid #b39ddb" : "1px solid rgba(179,157,219,0.2)" }}>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#ffffff" }}>
                        <Icon className="h-3.5 w-3.5" style={{ color: q.iconColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-xs" style={{ color: "#5a4a61" }}>{q.title}</div>
                        <div className="text-[10px] truncate" style={{ color: "#9575a3" }}>{q.subtitle}</div>
                      </div>
                      {selectedQuadrant === q.id && <Check className="h-4 w-4 flex-shrink-0" style={{ color: "#b39ddb" }} />}
                    </button>
                  );
                })}
              </div>
            </div>

            <button onClick={handleConfirmAndAdd} disabled={!selectedQuadrant || !dueDate}
              className="w-full h-12 rounded-2xl text-white font-medium transition-all hover:shadow-lg flex items-center justify-center gap-2"
              style={{ background: (!selectedQuadrant || !dueDate) ? "#e1bee7" : "#b39ddb" }}>
              <Save className="h-4 w-4" /> Save to Calendar
            </button>

            {/* <div className="text-xs p-3 rounded-lg" style={{ background: "#fffbeb", color: "#92400e" }}>
              ✓ {Object.keys(scheduledSubtasks).length}/{aiSubtasks.length} scheduled<br />
              ✓ All appear in Calendar & Weekly Progress
            </div>

            {onEditPrompt && (
              <button onClick={onEditPrompt} className="w-full py-2 text-xs flex items-center justify-center gap-2 hover:opacity-80" style={{ color: "#9575a3" }}>
                <RotateCcw className="h-3.5 w-3.5" /> Edit Prompt
              </button>
            )} */}
          </div>
        </div>

        {/* Edit Modal */}
        {editingKey && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
            <div className="rounded-3xl p-6 shadow-2xl w-80" style={{ background: "#ffffff" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold" style={{ color: "#5a4a61" }}>Edit Scheduled Task</h3>
                <button onClick={() => setEditingKey(null)} className="w-7 h-7 rounded-full flex items-center justify-center hover:opacity-80" style={{ background: "#f3e5f5" }}>
                  <X className="h-4 w-4" style={{ color: "#9575a3" }} />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: "#9575a3" }}>Task title</label>
                  <input value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none"
                    style={{ background: "#fdf7fd", border: "1px solid rgba(179,157,219,0.3)", color: "#5a4a61" }} />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: "#9575a3" }}>Date</label>
                  <input type="date" value={editForm.date} onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none"
                    style={{ background: "#fdf7fd", border: "1px solid rgba(179,157,219,0.3)", color: "#5a4a61" }} />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: "#9575a3" }}>Time</label>
                  <input type="time" value={editForm.time} onChange={e => setEditForm({ ...editForm, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none"
                    style={{ background: "#fdf7fd", border: "1px solid rgba(179,157,219,0.3)", color: "#5a4a61" }} />
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => setEditingKey(null)} className="flex-1 py-2 rounded-xl text-sm font-medium" style={{ background: "#f3e5f5", color: "#9575a3" }}>Cancel</button>
                  <button onClick={saveEdit} className="flex-1 py-2 rounded-xl text-sm font-medium text-white" style={{ background: "#b39ddb" }}>Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Modal */}
        {showErrorModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="bg-white px-8 py-6 rounded-3xl shadow-2xl flex flex-col items-center gap-4" style={{ maxWidth: "500px" }}>
              <AlertTriangle className="h-12 w-12" style={{ color: "#ef4444" }} />
              <div className="text-center w-full">
                <div className="text-lg font-semibold mb-1" style={{ color: "#5a4a61" }}>Save Failed</div>
                <div className="text-sm p-3 rounded-lg text-left overflow-auto" style={{ background: "#fee2e2", color: "#991b1b", maxHeight: "150px" }}>
                  {errorMessage}
                </div>
              </div>
              <button onClick={() => setShowErrorModal(false)} className="px-6 py-2 rounded-full text-white font-medium" style={{ background: "#b39ddb" }}>OK</button>
            </div>
          </div>
        )}

        {/* Success Toast */}
        {showSuccessToast && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="text-white px-8 py-6 rounded-3xl shadow-2xl flex flex-col items-center gap-4" style={{ background: "#22c55e", maxWidth: "400px" }}>
              <CheckCircle className="h-12 w-12" />
              <div className="text-center">
                <div className="text-lg font-semibold mb-1">Saved! ✨</div>
                <div className="text-sm opacity-90">{aiSubtasks.length} tasks saved to your calendar</div>
                <div className="text-xs opacity-75 mt-2">Redirecting...</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}