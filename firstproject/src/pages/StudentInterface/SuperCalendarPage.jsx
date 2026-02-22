import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft, ChevronRight, Calendar, Clock, TrendingUp,
  Sparkles, X, Edit2, CheckCircle2, AlertCircle, Flame, Target, Zap, ListTodo
} from "lucide-react";

const PRIORITY_COLORS = {
  "High Priority":   { bg: "#ffebee", text: "#c62828", dot: "#ef4444" },
  "Medium Priority": { bg: "#fff8e1", text: "#f57c00", dot: "#ffa726" },
  "Low Priority":    { bg: "#e8f5e9", text: "#2e7d32", dot: "#66bb6a" },
};

const QUADRANT_ICONS = {
  "do-now":   { icon: Flame,    color: "#ef4444" },
  "schedule": { icon: Target,   color: "#3b82f6" },
  "delegate": { icon: Zap,      color: "#eab308" },
  "defer":    { icon: ListTodo, color: "#22c55e" },
};

const DAY_LABELS_MON = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const HOURS = Array.from({ length: 15 }, (_, i) => 7 + i); // 7am–9pm

function SuperCalendarPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [assignments, setAssignments] = useState([]);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const scrollRef = useRef(null);

  // Load from localStorage — same key as Dashboard, DetailedProgress, AI breakdown
  const load = () => {
    try {
      const raw = localStorage.getItem("upcomingAssignments");
      setAssignments(raw ? JSON.parse(raw) : []);
    } catch { setAssignments([]); }
  };

  useEffect(() => {
    load();
    window.addEventListener("eisenhowerSaved", load);
    const t = setInterval(load, 800);
    return () => { window.removeEventListener("eisenhowerSaved", load); clearInterval(t); };
  }, []);

  // Scroll to 8am on mount
  useEffect(() => {
    if (scrollRef.current && viewMode === "week") {
      scrollRef.current.scrollTop = 60; // 1 hour slot height = 60px, scroll to 8am
    }
  }, [viewMode]);

  // ── Week helpers (Mon-start) ──────────────────────────────────────────────
  const getWeekDays = (anchor) => {
    const d = new Date(anchor);
    d.setDate(d.getDate() - (d.getDay() + 6) % 7);
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(d); day.setDate(d.getDate() + i); return day;
    });
  };

  const getMonthDays = (anchor) => {
    const y = anchor.getFullYear(), m = anchor.getMonth();
    const first = new Date(y, m, 1);
    const last  = new Date(y, m + 1, 0);
    const days  = [];
    // Mon-start: offset
    const startOffset = (first.getDay() + 6) % 7;
    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let i = 1; i <= last.getDate(); i++) days.push(new Date(y, m, i));
    return days;
  };

  const navigate_ = (dir) => {
    const d = new Date(currentDate);
    if (viewMode === "week") d.setDate(d.getDate() + dir * 7);
    else d.setMonth(d.getMonth() + dir);
    setCurrentDate(d);
  };

  const weekDays   = getWeekDays(currentDate);
  const monthDays  = getMonthDays(currentDate);
  const todayStr   = new Date().toISOString().split("T")[0];

  const dateStr = (d) => d ? d.toISOString().split("T")[0] : "";

  // Assignments for a specific date
  const assignmentsOnDate = (d) => {
    if (!d) return [];
    const ds = dateStr(d);
    return assignments.filter(a => a.dueDate === ds);
  };

  // Progress for a date (avg of assignments' progress)
  const progressOnDate = (d) => {
    const list = assignmentsOnDate(d);
    if (!list.length) return 0;
    return Math.round(list.reduce((s, a) => s + (a.progress || 0), 0) / list.length);
  };

  // Assignments for a specific date+hour (time slot)
  const assignmentsAtSlot = (d, hour) => {
    const ds = dateStr(d);
    return assignments.filter(a => {
      if (a.dueDate !== ds) return false;
      if (!a.time) return false;
      return parseInt(a.time.split(":")[0]) === hour;
    });
  };

  // Week-level progress summary
  const weekProgress = () => {
    return weekDays.map(d => ({ day: DAY_LABELS_MON[(d.getDay() + 6) % 7], value: progressOnDate(d) }));
  };

  // Month header
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const priorityColor = (p) => PRIORITY_COLORS[p] || PRIORITY_COLORS["Low Priority"];

  return (
    <div className="min-h-screen" style={{ background: "#f5eef8" }}>
      <div className="p-6 pl-12 space-y-5" style={{ width: "80vw" }}>

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
              style={{ background: "#b39ddb" }}>
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold" style={{ color: "#5a4a61" }}>Calendar</h1>
              <p className="text-sm" style={{ color: "#9575a3" }}>All your assignments, scheduled tasks and progress in one view</p>
            </div>
          </div>

          {/* View toggle */}
          <div className="flex gap-1 p-1 rounded-2xl" style={{ background: "#e1bee7" }}>
            {["week","month"].map(v => (
              <button key={v} onClick={() => setViewMode(v)}
                className="px-5 py-2 rounded-xl text-sm font-medium transition-all capitalize"
                style={{
                  background: viewMode === v ? "#b39ddb" : "transparent",
                  color: viewMode === v ? "#fff" : "#9575a3",
                  boxShadow: viewMode === v ? "0 2px 8px rgba(179,157,219,0.4)" : "none"
                }}>
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* ── Week Progress Summary Bar (only in week view) ── */}
        {viewMode === "week" && (
          <div className="rounded-3xl p-5 shadow-sm" style={{ background: "#fff", border: "1px solid rgba(179,157,219,0.2)" }}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4" style={{ color: "#b39ddb" }} />
              <span className="font-semibold text-sm" style={{ color: "#5a4a61" }}>Weekly Progress</span>
              <button onClick={() => navigate("/detailed-progress")}
                className="ml-auto text-xs px-3 py-1 rounded-full hover:opacity-80"
                style={{ background: "#f3e5f5", color: "#b39ddb" }}>
                View Details →
              </button>
            </div>
            <div className="grid grid-cols-7 gap-3">
              {weekProgress().map(({ day, value }) => (
                <div key={day} className="text-center">
                  <div className="text-xs mb-2 font-medium" style={{ color: "#9575a3" }}>{day}</div>
                  <div className="relative w-10 h-10 mx-auto">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="50%" cy="50%" r="45%" fill="none" stroke="#e1bee7" strokeWidth="6"/>
                      <circle cx="50%" cy="50%" r="45%" fill="none" stroke="#b39ddb" strokeWidth="6"
                        strokeDasharray={`${value * 1.26} 126`} strokeLinecap="round"/>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[9px] font-bold" style={{ color: "#b39ddb" }}>{value}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Main Calendar Card ── */}
        <div className="rounded-3xl shadow-sm overflow-hidden" style={{ background: "#fff", border: "1px solid rgba(179,157,219,0.2)" }}>

          {/* Nav bar */}
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(179,157,219,0.15)" }}>
            <button onClick={() => navigate_(-1)}
              className="w-9 h-9 rounded-xl flex items-center justify-center hover:opacity-80 transition-opacity"
              style={{ background: "#f3e5f5" }}>
              <ChevronLeft className="h-4 w-4" style={{ color: "#b39ddb" }} />
            </button>
            <div className="text-center">
              <div className="font-semibold text-lg" style={{ color: "#5a4a61" }}>{monthName}</div>
              {viewMode === "week" && (
                <div className="text-xs" style={{ color: "#9575a3" }}>
                  {weekDays[0].toLocaleDateString("en-US",{month:"short",day:"numeric"})} – {weekDays[6].toLocaleDateString("en-US",{month:"short",day:"numeric"})}
                </div>
              )}
            </div>
            <button onClick={() => navigate_(1)}
              className="w-9 h-9 rounded-xl flex items-center justify-center hover:opacity-80 transition-opacity"
              style={{ background: "#f3e5f5" }}>
              <ChevronRight className="h-4 w-4" style={{ color: "#b39ddb" }} />
            </button>
          </div>

          {/* ── WEEK VIEW ── */}
          {viewMode === "week" && (
            <div>
              {/* Day headers */}
              <div className="grid sticky top-0 z-10" style={{ gridTemplateColumns: "72px repeat(7, 1fr)", background: "#fdf7fd", borderBottom: "1px solid rgba(179,157,219,0.15)" }}>
                <div />
                {weekDays.map((d, i) => {
                  const ds = dateStr(d);
                  const isToday = ds === todayStr;
                  const count = assignmentsOnDate(d).length;
                  return (
                    <div key={i} className="text-center py-3 px-1">
                      <div className="text-xs font-medium mb-1" style={{ color: "#9575a3" }}>{DAY_LABELS_MON[i]}</div>
                      <div className="w-9 h-9 mx-auto rounded-full flex flex-col items-center justify-center"
                        style={{ background: isToday ? "#b39ddb" : "transparent" }}>
                        <span className="text-sm font-semibold" style={{ color: isToday ? "#fff" : "#5a4a61" }}>{d.getDate()}</span>
                      </div>
                      {count > 0 && (
                        <div className="mt-1 mx-auto w-5 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                          style={{ background: isToday ? "rgba(179,157,219,0.3)" : "#e1bee7", color: isToday ? "#fff" : "#b39ddb" }}>
                          {count}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Time grid */}
              <div ref={scrollRef} style={{ maxHeight: "calc(100vh - 400px)", overflowY: "auto" }}>
                {HOURS.map(hour => (
                  <div key={hour} className="grid" style={{ gridTemplateColumns: "72px repeat(7, 1fr)", minHeight: 64, borderBottom: "1px solid rgba(179,157,219,0.07)" }}>
                    <div className="flex items-start justify-end pr-3 pt-2">
                      <span className="text-[10px]" style={{ color: "#c0a8d0" }}>
                        {hour > 12 ? `${hour-12} PM` : hour === 12 ? "12 PM" : `${hour} AM`}
                      </span>
                    </div>
                    {weekDays.map((day, di) => {
                      const slots = assignmentsAtSlot(day, hour);
                      // Also show all-day (no time) assignments on their dueDate in the first slot row
                      const allDay = hour === 8 ? assignmentsOnDate(day).filter(a => !a.time) : [];
                      const all = [...slots, ...allDay];
                      return (
                        <div key={di} className="border-l relative py-1 px-1"
                          style={{ borderColor: "rgba(179,157,219,0.1)", minHeight: 64 }}>
                          {all.map(a => {
                            const pc = priorityColor(a.priority);
                            return (
                              <button key={a.id}
                                onClick={() => setSelectedAssignment(a)}
                                className="w-full text-left rounded-lg px-2 py-1 mb-1 hover:opacity-90 transition-opacity"
                                style={{ background: pc.bg, border: `1px solid ${pc.dot}22` }}>
                                <div className="text-[10px] font-semibold truncate" style={{ color: pc.text }}>{a.title}</div>
                                {a.time && <div className="text-[9px]" style={{ color: pc.text, opacity: 0.7 }}>{a.time}{a.duration ? ` · ${a.duration}` : ""}</div>}
                                {!a.time && <div className="text-[9px]" style={{ color: pc.text, opacity: 0.6 }}>All day</div>}
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── MONTH VIEW ── */}
          {viewMode === "month" && (
            <div className="p-4">
              {/* Day name headers */}
              <div className="grid grid-cols-7 mb-2">
                {DAY_LABELS_MON.map(d => (
                  <div key={d} className="text-center text-xs font-medium py-2" style={{ color: "#9575a3" }}>{d}</div>
                ))}
              </div>
              {/* Day cells */}
              <div className="grid grid-cols-7 gap-1">
                {monthDays.map((day, idx) => {
                  if (!day) return <div key={idx} />;
                  const ds = dateStr(day);
                  const isToday = ds === todayStr;
                  const list = assignmentsOnDate(day);
                  const prog = progressOnDate(day);
                  return (
                    <div key={idx}
                      className="rounded-2xl p-2 min-h-[80px] cursor-pointer hover:shadow-md transition-all relative group"
                      style={{
                        background: isToday ? "#f3e5f5" : "#fdf7fd",
                        border: isToday ? "2px solid #b39ddb" : "1px solid rgba(179,157,219,0.15)"
                      }}
                      onMouseEnter={() => list.length && setHoveredDate(ds)}
                      onMouseLeave={() => setHoveredDate(null)}>
                      {/* Date number */}
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold" style={{ color: isToday ? "#b39ddb" : "#5a4a61" }}>
                          {day.getDate()}
                        </span>
                        {list.length > 0 && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                            style={{ background: "#e1bee7", color: "#b39ddb" }}>
                            {list.length}
                          </span>
                        )}
                      </div>
                      {/* Progress mini bar */}
                      {prog > 0 && (
                        <div className="w-full h-1 rounded-full overflow-hidden mb-1.5" style={{ background: "#e1bee7" }}>
                          <div className="h-full rounded-full" style={{ width: `${prog}%`, background: "#b39ddb" }} />
                        </div>
                      )}
                      {/* Task pills — show up to 2 */}
                      <div className="space-y-0.5">
                        {list.slice(0, 2).map(a => {
                          const pc = priorityColor(a.priority);
                          return (
                            <button key={a.id}
                              onClick={() => setSelectedAssignment(a)}
                              className="w-full text-left rounded px-1.5 py-0.5 truncate text-[9px] font-medium"
                              style={{ background: pc.bg, color: pc.text }}>
                              {a.title}
                            </button>
                          );
                        })}
                        {list.length > 2 && (
                          <div className="text-[9px] text-center" style={{ color: "#9575a3" }}>+{list.length - 2} more</div>
                        )}
                      </div>

                      {/* Hover popup */}
                      {hoveredDate === ds && list.length > 0 && (
                        <div className="absolute z-50 left-0 top-full mt-2 rounded-2xl shadow-xl p-3 w-60"
                          style={{ background: "#fff", border: "1px solid rgba(179,157,219,0.3)" }}>
                          <div className="text-xs font-semibold mb-2" style={{ color: "#5a4a61" }}>
                            {day.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}
                          </div>
                          <div className="space-y-1.5 max-h-40 overflow-y-auto">
                            {list.map(a => {
                              const pc = priorityColor(a.priority);
                              return (
                                <button key={a.id} onClick={() => setSelectedAssignment(a)}
                                  className="w-full text-left p-2 rounded-xl hover:opacity-80 transition-opacity"
                                  style={{ background: pc.bg }}>
                                  <div className="text-xs font-medium" style={{ color: pc.text }}>{a.title}</div>
                                  <div className="text-[10px] mt-0.5" style={{ color: pc.text, opacity: 0.7 }}>
                                    {a.progress ?? 0}% done · {a.priority}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Upcoming Assignments strip (bottom) ── */}
        <div className="rounded-3xl p-5 shadow-sm" style={{ background: "#fff", border: "1px solid rgba(179,157,219,0.2)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4" style={{ color: "#b39ddb" }} />
            <span className="font-semibold text-sm" style={{ color: "#5a4a61" }}>Upcoming Assignments</span>
            <span className="ml-1 text-xs px-2 py-0.5 rounded-full" style={{ background: "#f3e5f5", color: "#b39ddb" }}>
              {assignments.filter(a => (a.progress ?? 0) < 100 && a.status !== "Completed").length}
            </span>
            <button onClick={() => navigate("/detailed-progress")}
              className="ml-auto text-xs px-3 py-1 rounded-full hover:opacity-80"
              style={{ background: "#f3e5f5", color: "#b39ddb" }}>
              Manage in Weekly Progress →
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {assignments
              .filter(a => (a.progress ?? 0) < 100 && a.status !== "Completed")
              .sort((a,b) => new Date(a.dueDate||"9999") - new Date(b.dueDate||"9999"))
              .slice(0, 8)
              .map(a => {
                const pc = priorityColor(a.priority);
                const due = a.dueDate ? new Date(a.dueDate + "T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"}) : null;
                return (
                  <button key={a.id}
                    onClick={() => navigate(`/detailed-progress?id=${a.id}`)}
                    className="flex-shrink-0 rounded-2xl p-3 text-left hover:shadow-md transition-all w-44"
                    style={{ background: pc.bg, border: `1px solid ${pc.dot}33` }}>
                    <div className="text-xs font-semibold mb-1 line-clamp-2" style={{ color: pc.text }}>{a.title}</div>
                    {due && <div className="text-[10px] mb-2" style={{ color: pc.text, opacity: 0.7 }}>Due {due}</div>}
                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.08)" }}>
                      <div className="h-full rounded-full" style={{ width: `${a.progress ?? 0}%`, background: pc.dot }} />
                    </div>
                    <div className="text-[9px] mt-1" style={{ color: pc.text, opacity: 0.6 }}>{a.progress ?? 0}% done</div>
                  </button>
                );
              })}
            {assignments.filter(a => (a.progress ?? 0) < 100 && a.status !== "Completed").length === 0 && (
              <div className="text-sm py-4 w-full text-center" style={{ color: "#9575a3" }}>
                🎉 All caught up! No upcoming assignments.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Assignment Detail Modal ── */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(90,74,97,0.4)" }}
          onClick={() => setSelectedAssignment(null)}>
          <div className="rounded-3xl p-6 shadow-2xl w-96 max-w-full mx-4"
            style={{ background: "#fff" }}
            onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 pr-4">
                <h3 className="font-semibold text-lg leading-tight" style={{ color: "#5a4a61" }}>
                  {selectedAssignment.title}
                </h3>
                {selectedAssignment.course && (
                  <p className="text-xs mt-1" style={{ color: "#9575a3" }}>{selectedAssignment.course}</p>
                )}
              </div>
              <button onClick={() => setSelectedAssignment(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "#f3e5f5" }}>
                <X className="h-4 w-4" style={{ color: "#9575a3" }} />
              </button>
            </div>

            {/* Details */}
            <div className="space-y-3">
              {/* Priority */}
              {selectedAssignment.priority && (() => {
                const pc = priorityColor(selectedAssignment.priority);
                return (
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: pc.bg, color: pc.text }}>
                      {selectedAssignment.priority}
                    </span>
                  </div>
                );
              })()}

              {/* Due date + time */}
              <div className="flex items-center gap-4 text-sm" style={{ color: "#9575a3" }}>
                {selectedAssignment.dueDate && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" style={{ color: "#b39ddb" }} />
                    <span>{new Date(selectedAssignment.dueDate + "T12:00:00").toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}</span>
                  </div>
                )}
                {selectedAssignment.time && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" style={{ color: "#b39ddb" }} />
                    <span>{selectedAssignment.time}</span>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs mb-1.5" style={{ color: "#9575a3" }}>
                  <span>Progress</span>
                  <span className="font-semibold" style={{ color: "#b39ddb" }}>{selectedAssignment.progress ?? 0}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: "#e1bee7" }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${selectedAssignment.progress ?? 0}%`, background: "linear-gradient(90deg, #ce93d8, #b39ddb)" }} />
                </div>
              </div>

              {/* Duration */}
              {selectedAssignment.duration && (
                <div className="text-xs" style={{ color: "#9575a3" }}>
                  ⏱ Estimated: {selectedAssignment.duration}
                </div>
              )}

              {/* Notes */}
              {selectedAssignment.notes && (
                <div className="text-xs p-3 rounded-xl" style={{ background: "#fdf7fd", color: "#9575a3" }}>
                  {selectedAssignment.notes}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => { navigate(`/detailed-progress?id=${selectedAssignment.id}`); setSelectedAssignment(null); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                style={{ background: "#b39ddb" }}>
                <Edit2 className="h-4 w-4" /> Update Progress
              </button>
              <button onClick={() => setSelectedAssignment(null)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-80 transition-opacity"
                style={{ background: "#f3e5f5", color: "#9575a3" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperCalendarPage;