import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft, ChevronRight, Calendar, Clock, TrendingUp,
  Sparkles, X, Edit2, UserCheck, Heart, HeartHandshake, Shield, 
  BookOpen, ClipboardList, FileQuestion, Users, ListTodo
} from "lucide-react";
import { useUser } from "../../styles/SignInLandingPage/usercontext.jsx";

// ── Palette( standard )) ────────────────────────────────────
const C = {
  purple800: "#5a4a61",
  purple600: "#9575a3",
  purple500: "#b39ddb",
  purple400: "#c0b4cc",
  purple200: "#e8e0f0",
  purple100: "rgba(179,157,219,0.15)",
  purple50:  "rgba(179,157,219,0.08)",
  pink:      "#f8bbd0",
  pageBg:    "#f5eef8",
  white:     "#FFFFFF",
};

// ── Category definitions (Used for styling and legend) ─────────────────────────
const FILTER_CATEGORIES = [
  {
    group: "Appointments",
    items: [
      { id: "oap",         label: "OAP Appointments",          icon: Shield,        color: "#6b9e9a", bg: "rgba(107,158,154,0.12)", border: "rgba(107,158,154,0.3)",  types: ["oap", "oap-appointment"]        },
      { id: "wellness",    label: "Wellness Appointments",      icon: Heart,         color: "#d4789a", bg: "rgba(212,120,154,0.12)", border: "rgba(212,120,154,0.3)",  types: ["wellness", "wellness-appointment"] },
      { id: "ehsas",       label: "Ehsas Appointments",         icon: HeartHandshake,color: "#9b7fbd", bg: "rgba(155,127,189,0.12)", border: "rgba(155,127,189,0.3)",  types: ["ehsas", "ehsas-appointment"]    },
      { id: "focuspeer_apt", label: "Focus Peer Appointments",  icon: Users,         color: "#b39ddb", bg: "rgba(179,157,219,0.12)", border: "rgba(24, 22, 29, 0.3)",  types: ["focuspeer-appointment", "focus-peer-appointment"] },
      { id: "checkin",     label: "Focus Peer Check-ins",       icon: UserCheck,     color: "#7ca5b8", bg: "rgba(124,165,184,0.12)", border: "rgba(124,165,184,0.3)",  types: ["checkin", "check-in", "focuspeer-checkin"] },
    ],
  },
  {
    group: "Academic",
    items: [
      { id: "assignment",  label: "Assignments",                icon: BookOpen,      color: "#f59e0b", bg: "rgba(245,158,11,0.1)",   border: "rgba(245,158,11,0.3)",   types: ["assignment"]                   },
      { id: "subtask",     label: "Subtasks",                   icon: ListTodo,      color: "#22c55e", bg: "rgba(34,197,94,0.1)",    border: "rgba(34,197,94,0.3)",    types: ["subtask", "sub-task"]          },
      { id: "quiz",        label: "Quizzes & Exams",            icon: FileQuestion,  color: "#ef4444", bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.25)",   types: ["quiz", "exam", "test"]         },
      { id: "other",       label: "Other Tasks",                icon: ClipboardList, color: "#9575a3", bg: "rgba(149,117,163,0.1)",  border: "rgba(149,117,163,0.3)",  types: ["task", "other", null, undefined] },
    ],
  },
];

// Flatten all items for easy lookup
const ALL_FILTER_ITEMS = FILTER_CATEGORIES.flatMap(g => g.items);

// Get the filter item that matches an assignment's type
const getFilterForAssignment = (a) => {
  const t = (a.type || "").toLowerCase().replace(/_/g, "-");
  // Check apt- prefix (legacy)
  const isApt = a.id?.toString().startsWith("apt-");

  for (const item of ALL_FILTER_ITEMS) {
    if (item.types.some(type => {
      if (type === null || type === undefined) return !a.type;
      return t === type || t.includes(type);
    })) return item;
  }
  // Fallback: if it's an apt- id, call it oap; otherwise other
  return isApt ? ALL_FILTER_ITEMS.find(i => i.id === "oap") : ALL_FILTER_ITEMS.find(i => i.id === "other");
};

const PRIORITY_COLORS = {
  "High Priority":   { bg: "#ffebee", text: "#c62828", dot: "#ef4444" },
  "Medium Priority": { bg: "#fff8e1", text: "#f57c00", dot: "#ffa726" },
  "Low Priority":    { bg: "#e8f5e9", text: "#2e7d32", dot: "#66bb6a" },
};

const DAY_LABELS_MON = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const HOURS = Array.from({ length: 15 }, (_, i) => 7 + i);

const formatTime = (time24) => {
  if (!time24 || !time24.includes(":")) return time24;
  const [h, m] = time24.split(":");
  let hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${m} ${ampm}`;
};

function SuperCalendarPage() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [viewMode, setViewMode]               = useState("week");
  const [currentDate, setCurrentDate]         = useState(new Date());
  const [assignments, setAssignments]         = useState([]);
  const [hoveredDate, setHoveredDate]         = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const scrollRef  = useRef(null);

  const load = async () => {
    if (!user || !user.id) return;
    try {
      const response = await fetch(`https://fyp-neuro-zaaviya-server-01.vercel.app/api/calendar/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      }
    } catch (error) {
      console.error("Failed to load calendar data:", error);
    }
  };

  useEffect(() => {
    load();
    window.addEventListener("eisenhowerSaved", load);
    const t = setInterval(load, 2000);
    return () => { window.removeEventListener("eisenhowerSaved", load); clearInterval(t); };
  }, [user]);

  useEffect(() => {
    if (scrollRef.current && viewMode === "week") {
      scrollRef.current.scrollTop = 60;
    }
  }, [viewMode]);

  // ── Calendar helpers ──────────────────────────────────────────────────────
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

  const weekDays  = getWeekDays(currentDate);
  const monthDays = getMonthDays(currentDate);
  const todayStr  = new Date().toISOString().split("T")[0];
  const dateStr   = (d) => d ? d.toISOString().split("T")[0] : "";

  const assignmentsOnDate   = (d) => { if (!d) return []; const ds = dateStr(d); return assignments.filter(a => a.dueDate === ds); };
  const assignmentsAtSlot   = (d, hour) => { const ds = dateStr(d); return assignments.filter(a => { if (a.dueDate !== ds || !a.time) return false; return parseInt(a.time.split(":")[0]) === hour; }); };
  const progressOnDate      = (d) => { const list = assignmentsOnDate(d).filter(a => a.progress !== undefined && !a.id?.toString().startsWith("apt-")); if (!list.length) return 0; return Math.round(list.reduce((s, a) => s + (a.progress || 0), 0) / list.length); };
  const weekProgress        = () => weekDays.map(d => ({ day: DAY_LABELS_MON[(d.getDay() + 6) % 7], value: progressOnDate(d) }));
  const monthName           = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const priorityColor       = (p) => PRIORITY_COLORS[p] || PRIORITY_COLORS["Low Priority"];

  // Assign a display color to an item based on its category
  const itemStyle = (a) => {
    const fi = getFilterForAssignment(a);
    if (fi) return { bg: fi.bg, text: fi.color, dot: fi.color, border: fi.border };
    return { bg: "#f3e5f5", text: "#9575a3", dot: "#b39ddb", border: "rgba(179,157,219,0.3)" };
  };

  return (
    <div className="min-h-screen" style={{ background: C.pageBg }}>
      <div className="p-6 pl-12 space-y-5" style={{ width: "80vw" }}>

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm" style={{ background: C.purple500 }}>
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold" style={{ color: C.purple800 }}>Calendar</h1>
              <p className="text-sm" style={{ color: C.purple600 }}>All your assignments, scheduled tasks and progress in one view</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* ── View toggle ── */}
            <div className="flex gap-1 p-1 rounded-2xl" style={{ background: "#e1bee7" }}>
              {["week","month"].map(v => (
                <button key={v} onClick={() => setViewMode(v)}
                  className="px-5 py-2 rounded-xl text-sm font-medium transition-all capitalize"
                  style={{ background: viewMode === v ? C.purple500 : "transparent", color: viewMode === v ? "#fff" : C.purple600, boxShadow: viewMode === v ? "0 2px 8px rgba(179,157,219,0.4)" : "none" }}>
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Week Progress Summary Bar ── */}
        {viewMode === "week" && (
          <div className="rounded-3xl p-5 shadow-sm" style={{ background: "#fff", border: "1px solid rgba(179,157,219,0.2)" }}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4" style={{ color: C.purple500 }} />
              <span className="font-semibold text-sm" style={{ color: C.purple800 }}>Weekly Progress</span>
              <button onClick={() => navigate("/detailed-progress")}
                className="ml-auto text-xs px-3 py-1 rounded-full hover:opacity-80"
                style={{ background: "#f3e5f5", color: C.purple500 }}>
                View Details →
              </button>
            </div>
            <div className="grid grid-cols-7 gap-3">
              {weekProgress().map(({ day, value }) => (
                <div key={day} className="text-center">
                  <div className="text-xs mb-2 font-medium" style={{ color: C.purple600 }}>{day}</div>
                  <div className="relative w-10 h-10 mx-auto">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="50%" cy="50%" r="45%" fill="none" stroke="#e1bee7" strokeWidth="6"/>
                      <circle cx="50%" cy="50%" r="45%" fill="none" stroke={C.purple500} strokeWidth="6"
                        strokeDasharray={`${value * 1.26} 126`} strokeLinecap="round"/>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[9px] font-bold" style={{ color: C.purple500 }}>{value}%</span>
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
            <button onClick={() => navigate_(-1)} className="w-9 h-9 rounded-xl flex items-center justify-center hover:opacity-80 transition-opacity" style={{ background: "#f3e5f5" }}>
              <ChevronLeft className="h-4 w-4" style={{ color: C.purple500 }} />
            </button>
            <div className="text-center">
              <div className="font-semibold text-lg" style={{ color: C.purple800 }}>{monthName}</div>
              {viewMode === "week" && (
                <div className="text-xs" style={{ color: C.purple600 }}>
                  {weekDays[0].toLocaleDateString("en-US",{month:"short",day:"numeric"})} – {weekDays[6].toLocaleDateString("en-US",{month:"short",day:"numeric"})}
                </div>
              )}
            </div>
            <button onClick={() => navigate_(1)} className="w-9 h-9 rounded-xl flex items-center justify-center hover:opacity-80 transition-opacity" style={{ background: "#f3e5f5" }}>
              <ChevronRight className="h-4 w-4" style={{ color: C.purple500 }} />
            </button>
          </div>

          {/* ── WEEK VIEW ── */}
          {viewMode === "week" && (
            <div>
              <div className="grid sticky top-0 z-10" style={{ gridTemplateColumns: "72px repeat(7, 1fr)", background: "#fdf7fd", borderBottom: "1px solid rgba(179,157,219,0.15)" }}>
                <div />
                {weekDays.map((d, i) => {
                  const ds = dateStr(d);
                  const isToday = ds === todayStr;
                  const count   = assignmentsOnDate(d).length;
                  return (
                    <div key={i} className="text-center py-3 px-1">
                      <div className="text-xs font-medium mb-1" style={{ color: C.purple600 }}>{DAY_LABELS_MON[i]}</div>
                      <div className="w-9 h-9 mx-auto rounded-full flex flex-col items-center justify-center"
                        style={{ background: isToday ? C.purple500 : "transparent" }}>
                        <span className="text-sm font-semibold" style={{ color: isToday ? "#fff" : C.purple800 }}>{d.getDate()}</span>
                      </div>
                      {count > 0 && (
                        <div className="mt-1 mx-auto w-5 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                          style={{ background: isToday ? "rgba(179,157,219,0.3)" : "#e1bee7", color: isToday ? "#fff" : C.purple500 }}>
                          {count}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div ref={scrollRef} style={{ maxHeight: "calc(100vh - 400px)", overflowY: "auto" }}>
                {HOURS.map(hour => (
                  <div key={hour} className="grid" style={{ gridTemplateColumns: "72px repeat(7, 1fr)", minHeight: 64, borderBottom: "1px solid rgba(179,157,219,0.07)" }}>
                    <div className="flex items-start justify-end pr-3 pt-2">
                      <span className="text-[10px]" style={{ color: "#c0a8d0" }}>
                        {hour > 12 ? `${hour-12} PM` : hour === 12 ? "12 PM" : `${hour} AM`}
                      </span>
                    </div>
                    {weekDays.map((day, di) => {
                      const slots  = assignmentsAtSlot(day, hour);
                      const allDay = hour === 8 ? assignmentsOnDate(day).filter(a => !a.time) : [];
                      const all    = [...slots, ...allDay];
                      return (
                        <div key={di} className="border-l relative py-1 px-1"
                          style={{ borderColor: "rgba(179,157,219,0.1)", minHeight: 64 }}>
                          {all.map(a => {
                            const style = itemStyle(a);
                            const fi    = getFilterForAssignment(a);
                            const Icon  = fi?.icon;
                            return (
                              <button key={a.id} onClick={() => setSelectedAssignment(a)}
                                className="w-full text-left rounded-lg px-2 py-1 mb-1 hover:opacity-90 transition-opacity"
                                style={{ background: style.bg, border: `1px solid ${style.border}` }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                  {Icon && <Icon size={9} color={style.text} style={{ flexShrink: 0 }} />}
                                  <div className="text-[10px] font-semibold truncate" style={{ color: style.text }}>{a.title}</div>
                                </div>
                                {a.time && <div className="text-[9px]" style={{ color: style.text, opacity: 0.7 }}>{formatTime(a.time)}{a.duration ? ` · ${a.duration}` : ""}</div>}
                                {!a.time && <div className="text-[9px]" style={{ color: style.text, opacity: 0.6 }}>All day</div>}
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
              <div className="grid grid-cols-7 mb-2">
                {DAY_LABELS_MON.map(d => (
                  <div key={d} className="text-center text-xs font-medium py-2" style={{ color: C.purple600 }}>{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {monthDays.map((day, idx) => {
                  if (!day) return <div key={idx} />;
                  const ds      = dateStr(day);
                  const isToday = ds === todayStr;
                  const list    = assignmentsOnDate(day);
                  const prog    = progressOnDate(day);
                  return (
                    <div key={idx}
                      className="rounded-2xl p-2 min-h-[80px] cursor-pointer hover:shadow-md transition-all relative group"
                      style={{ background: isToday ? "#f3e5f5" : "#fdf7fd", border: isToday ? `2px solid ${C.purple500}` : "1px solid rgba(179,157,219,0.15)" }}
                      onMouseEnter={() => list.length && setHoveredDate(ds)}
                      onMouseLeave={() => setHoveredDate(null)}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold" style={{ color: isToday ? C.purple500 : C.purple800 }}>{day.getDate()}</span>
                        {list.length > 0 && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: "#e1bee7", color: C.purple500 }}>{list.length}</span>
                        )}
                      </div>
                      {prog > 0 && (
                        <div className="w-full h-1 rounded-full overflow-hidden mb-1.5" style={{ background: "#e1bee7" }}>
                          <div className="h-full rounded-full" style={{ width: `${prog}%`, background: C.purple500 }} />
                        </div>
                      )}
                      {/* Coloured category dots */}
                      {list.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 2, marginBottom: 3 }}>
                          {[...new Map(list.map(a => { const fi = getFilterForAssignment(a); return [fi?.id, fi]; })).values()].filter(Boolean).slice(0, 4).map(fi => (
                            <div key={fi.id} style={{ width: 7, height: 7, borderRadius: "50%", background: fi.color }} title={fi.label} />
                          ))}
                        </div>
                      )}
                      <div className="space-y-0.5">
                        {list.slice(0, 2).map(a => {
                          const style = itemStyle(a);
                          const fi    = getFilterForAssignment(a);
                          const Icon  = fi?.icon;
                          return (
                            <button key={a.id} onClick={() => setSelectedAssignment(a)}
                              className="w-full text-left rounded px-1.5 py-0.5 truncate text-[9px] font-medium flex items-center gap-1"
                              style={{ background: style.bg, color: style.text }}>
                              {Icon && <Icon size={8} color={style.text} style={{ flexShrink: 0 }} />}
                              {a.title}
                            </button>
                          );
                        })}
                        {list.length > 2 && (
                          <div className="text-[9px] text-center" style={{ color: C.purple600 }}>+{list.length - 2} more</div>
                        )}
                      </div>

                      {/* Hover popup */}
                      {hoveredDate === ds && list.length > 0 && (
                        <div className="absolute z-50 left-0 top-full mt-2 rounded-2xl shadow-xl p-3 w-60"
                          style={{ background: "#fff", border: "1px solid rgba(179,157,219,0.3)" }}>
                          <div className="text-xs font-semibold mb-2" style={{ color: C.purple800 }}>
                            {day.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}
                          </div>
                          <div className="space-y-1.5 max-h-40 overflow-y-auto">
                            {list.map(a => {
                              const style = itemStyle(a);
                              const fi    = getFilterForAssignment(a);
                              const Icon  = fi?.icon;
                              return (
                                <button key={a.id} onClick={() => setSelectedAssignment(a)}
                                  className="w-full text-left p-2 rounded-xl hover:opacity-80 transition-opacity flex items-center gap-2"
                                  style={{ background: style.bg }}>
                                  {Icon && <Icon size={12} color={style.text} style={{ flexShrink: 0 }} />}
                                  <div>
                                    <div className="text-xs font-medium" style={{ color: style.text }}>{a.title}</div>
                                    <div className="text-[10px] mt-0.5" style={{ color: style.text, opacity: 0.7 }}>
                                      {fi?.label}{a.progress !== undefined ? ` · ${a.progress ?? 0}% done` : ""}
                                    </div>
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

        {/* ── Upcoming Tasks & Meetings ── */}
        <div className="rounded-3xl p-5 shadow-sm" style={{ background: "#fff", border: "1px solid rgba(179,157,219,0.2)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4" style={{ color: C.purple500 }} />
            <span className="font-semibold text-sm" style={{ color: C.purple800 }}>Upcoming Tasks & Meetings</span>
            <span className="ml-1 text-xs px-2 py-0.5 rounded-full" style={{ background: "#f3e5f5", color: C.purple500 }}>
              {assignments.filter(a => (a.progress ?? 0) < 100 && a.status !== "Completed").length}
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {assignments
              .filter(a => (a.progress ?? 0) < 100 && a.status !== "Completed")
              .sort((a,b) => new Date(a.dueDate||"9999") - new Date(b.dueDate||"9999"))
              .slice(0, 8)
              .map(a => {
                const style = itemStyle(a);
                const fi    = getFilterForAssignment(a);
                const Icon  = fi?.icon;
                const due   = a.dueDate ? new Date(a.dueDate + "T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"}) : null;
                return (
                  <button key={a.id}
                    onClick={() => { if (!a.id?.toString().startsWith("apt-")) { navigate(`/detailed-progress?id=${a.id}`); } else { setSelectedAssignment(a); } }}
                    className="flex-shrink-0 rounded-2xl p-3 text-left hover:shadow-md transition-all w-44"
                    style={{ background: style.bg, border: `1px solid ${style.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
                      {Icon && <div style={{ width: 20, height: 20, borderRadius: 6, background: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyItems: "center", flexShrink: 0 }}>
                        <Icon size={11} color={style.text} />
                      </div>}
                      <span style={{ fontSize: 9, fontWeight: 700, color: style.text, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.7 }}>{fi?.label}</span>
                    </div>
                    <div className="text-xs font-semibold mb-1 line-clamp-2" style={{ color: style.text }}>{a.title}</div>
                    {due && <div className="text-[10px] mb-2" style={{ color: style.text, opacity: 0.7 }}>Due {due}</div>}
                    {!a.id?.toString().startsWith("apt-") && (
                      <>
                        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.08)" }}>
                          <div className="h-full rounded-full" style={{ width: `${a.progress ?? 0}%`, background: style.dot }} />
                        </div>
                        <div className="text-[9px] mt-1" style={{ color: style.text, opacity: 0.6 }}>{a.progress ?? 0}% done</div>
                      </>
                    )}
                  </button>
                );
              })}
            {assignments.filter(a => (a.progress ?? 0) < 100 && a.status !== "Completed").length === 0 && (
              <div className="text-sm py-4 w-full text-center" style={{ color: C.purple600 }}>
                🎉 All caught up! No upcoming assignments.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Detail Modal ── */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(90,74,97,0.4)" }}
          onClick={() => setSelectedAssignment(null)}>
          <div className="rounded-3xl p-6 shadow-2xl w-96 max-w-full mx-4" style={{ background: "#fff" }} onClick={e => e.stopPropagation()}>
            {(() => {
              const style = itemStyle(selectedAssignment);
              const fi    = getFilterForAssignment(selectedAssignment);
              const Icon  = fi?.icon;
              return (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1 pr-4">
                      {Icon && (
                        <div style={{ width: 38, height: 38, borderRadius: 12, background: style.bg, border: `1.5px solid ${style.border}`, display: "flex", alignItems: "center", justifyItems: "center", flexShrink: 0 }}>
                          <Icon size={18} color={style.text} />
                        </div>
                      )}
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: style.text, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>{fi?.label}</div>
                        <h3 className="font-semibold text-lg leading-tight" style={{ color: C.purple800 }}>{selectedAssignment.title}</h3>
                        {selectedAssignment.course && <p className="text-xs mt-1" style={{ color: C.purple600 }}>{selectedAssignment.course}</p>}
                      </div>
                    </div>
                    <button onClick={() => setSelectedAssignment(null)} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#f3e5f5" }}>
                      <X className="h-4 w-4" style={{ color: C.purple600 }} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {selectedAssignment.priority && (() => {
                      const pc = priorityColor(selectedAssignment.priority);
                      return <div><span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: pc.bg, color: pc.text }}>{selectedAssignment.priority}</span></div>;
                    })()}
                    <div className="flex items-center gap-4 text-sm" style={{ color: C.purple600 }}>
                      {selectedAssignment.dueDate && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" style={{ color: C.purple500 }} />
                          <span>{new Date(selectedAssignment.dueDate + "T12:00:00").toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}</span>
                        </div>
                      )}
                      {selectedAssignment.time && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" style={{ color: C.purple500 }} />
                          <span>{formatTime(selectedAssignment.time)}</span>
                        </div>
                      )}
                    </div>
                    {!selectedAssignment.id?.toString().startsWith("apt-") && (
                      <div>
                        <div className="flex justify-between text-xs mb-1.5" style={{ color: C.purple600 }}>
                          <span>Progress</span>
                          <span className="font-semibold" style={{ color: C.purple500 }}>{selectedAssignment.progress ?? 0}%</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: "#e1bee7" }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${selectedAssignment.progress ?? 0}%`, background: `linear-gradient(90deg, ${style.dot}, ${style.text})` }} />
                        </div>
                      </div>
                    )}
                    {selectedAssignment.duration && <div className="text-xs" style={{ color: C.purple600 }}>⏱ Estimated: {selectedAssignment.duration}</div>}
                    {selectedAssignment.notes && <div className="text-xs p-3 rounded-xl" style={{ background: "#fdf7fd", color: C.purple600 }}>{selectedAssignment.notes}</div>}
                  </div>

                  <div className="flex gap-2 mt-5">
                    {!selectedAssignment.id?.toString().startsWith("apt-") && (
                      <button onClick={() => { navigate(`/detailed-progress?id=${selectedAssignment.id}`); setSelectedAssignment(null); }}
                        className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        style={{ background: C.purple500 }}>
                        <Edit2 className="h-4 w-4" /> Update Progress
                      </button>
                    )}
                    <button onClick={() => setSelectedAssignment(null)}
                      className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-80 transition-opacity"
                      style={{ background: "#f3e5f5", color: C.purple600 }}>
                      Close
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperCalendarPage;