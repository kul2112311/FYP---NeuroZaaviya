import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft, CheckCircle2, Sparkles, Send, Brain,
  ChevronRight, Clock, Target, Flame, Zap, ListTodo,
  Star, BookOpen, Calendar
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

// ── Helpers ────────────────────────────────────────────────────────────────
const getPriorityIcon = (p) => {
  if (p === "High Priority") return Flame;
  if (p === "Medium Priority") return Target;
  if (p === "Low Priority") return ListTodo;
  return Zap;
};
const getPriorityColor = (p) => {
  if (p === "High Priority") return "#ef4444";
  if (p === "Medium Priority") return "#3b82f6";
  return "#22c55e";
};

// ── AI Step Chat ───────────────────────────────────────────────────────────
function StepChat({ step, stepIndex, totalSteps, parentTitle, allSteps }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Reset + init greeting when step changes
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        text: `Hi there! 🧡 I'm your learning guide for Step ${stepIndex + 1}: "${step.title}". I won't solve it for you, but I'll guide you every step of the way. What are you thinking about for this step?`,
      },
    ]);
    setInput("");
  }, [stepIndex, step.title]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user", text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const stepsContext = allSteps
        .map((s, i) => `  Step ${i + 1}: ${s.title}${s.duration && s.duration !== "—" ? ` (${s.duration})` : ""}`)
        .join("\n");

      const systemPrompt = `You are a warm, supportive AI learning guide helping a neurodivergent student work through their assignment step by step.

Parent Assignment: "${parentTitle}"
All Steps in this assignment:
${stepsContext}

Currently helping with Step ${stepIndex + 1} of ${totalSteps}: "${step.title}"
${step.notes ? `Step notes: ${step.notes}` : ""}

Your rules:
- NEVER give direct answers or write the assignment content for them
- Ask Socratic guiding questions to help them think
- Give hints, frameworks, and point to resource types (not specific links)
- Be warm, encouraging, use emojis naturally
- Keep responses to 2-4 sentences max
- You can reference how this step connects to other steps in the assignment
- Help them see the big picture of the whole assignment while focusing on this step`;

      // 🚀 Now calling your local backend instead of the blocked external API
      const response = await fetch("http://127.0.0.1:5000/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: systemPrompt,
          messages: newMessages
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch response");
      }

      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
      
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Oops, my circuits got crossed! Could you try asking that again? 🌟" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", paddingRight: "4px" }} className="space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                style={{ background: "linear-gradient(135deg, #b39ddb, #f8bbd0)" }}>
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            )}
            <div className="max-w-[78%] px-4 py-3 text-sm leading-relaxed"
              style={msg.role === "user"
                ? { background: "linear-gradient(135deg, #b39ddb, #9575a3)", color: "#fff", borderRadius: "18px 18px 4px 18px" }
                : { background: "#f9f6fd", color: "#5a4a61", border: "1px solid rgba(179,157,219,0.2)", borderRadius: "4px 18px 18px 18px" }}>
              {msg.text}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 text-sm"
                style={{ background: "#e1bee7" }}>👤</div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #b39ddb, #f8bbd0)" }}>
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl" style={{ background: "#f9f6fd", border: "1px solid rgba(179,157,219,0.2)" }}>
              <div className="flex gap-1 items-center h-5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full animate-bounce"
                    style={{ background: "#b39ddb", animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 pt-3 mt-3 flex-shrink-0"
        style={{ borderTop: "1px solid rgba(179,157,219,0.15)" }}>
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask for guidance with this step..."
          className="flex-1 px-4 py-2.5 rounded-full text-sm focus:outline-none"
          style={{ background: "#fdf7fd", border: "1px solid rgba(179,157,219,0.25)", color: "#5a4a61" }} />
        <button onClick={sendMessage} disabled={!input.trim() || loading}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-40 flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #b39ddb, #9575a3)" }}>
          <Send className="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function DeepWorkSession() {
  const navigate = useNavigate();
  const location = useLocation();
  const clickedId = new URLSearchParams(location.search).get("id");

  const [parentTask, setParentTask] = useState(null);
  const [allSubtasks, setAllSubtasks] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  useEffect(() => {
    if (!clickedId) return;

    const fetchSessionData = async () => {
      try {
        // Fetch real data from your backend
        const response = await fetch(`http://127.0.0.1:5000/api/session/${clickedId}`);
        if (!response.ok) throw new Error("Failed to fetch session");
        const data = await response.json();

        setParentTask(data.parentTask);
        setAllSubtasks(data.subtasks);

        const done = new Set();
        data.subtasks.forEach((s, i) => {
          if (s.progress >= 100 || s.isCompleted) done.add(i);
        });
        setCompletedSteps(done);

        // Figure out which step to jump to automatically
        const cleanClickedId = clickedId.replace('sub-', '');
        const clickedIdx = data.subtasks.findIndex((s) => String(s.id) === String(cleanClickedId));
        
        const startAt = clickedIdx !== -1 ? clickedIdx : 0;
        const firstIncomplete = data.subtasks.findIndex((_, i) => !done.has(i));
        setActiveStep(done.has(startAt) && firstIncomplete !== -1 ? firstIncomplete : startAt);
      } catch (e) {
        console.error("DeepWork load error:", e);
      }
    };

    fetchSessionData();
  }, [clickedId]);

  const markStepDone = async (index) => {
    const newDone = new Set(completedSteps);
    newDone.add(index);
    setCompletedSteps(newDone);

    const stepId = allSubtasks[index]?.id;
    
    // Update UI instantly
    setAllSubtasks(prev => prev.map((s, i) => i === index ? { ...s, progress: 100, isCompleted: true } : s));

    try {
      // Send completion status to the backend
      await fetch(`http://127.0.0.1:5000/api/subtasks/${stepId}/complete`, { method: 'PUT' });
      
      // Ping the rest of the app to refresh (like the Dashboard)
      window.dispatchEvent(new Event("eisenhowerSaved"));
    } catch (err) {
      console.error("Failed to save completion:", err);
    }

    // Auto-advance to the next incomplete step
    const next = allSubtasks.findIndex((_, i) => i > index && !newDone.has(i));
    if (next !== -1) setActiveStep(next);
  };

  if (!parentTask) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f5eef8" }}>
        <div className="text-center space-y-4">
          <div className="w-14 h-14 border-4 rounded-full animate-spin mx-auto"
            style={{ borderColor: "#e1bee7", borderTopColor: "#b39ddb" }} />
          <p style={{ color: "#9575a3" }}>Loading your session...</p>
        </div>
      </div>
    );
  }

  const currentStep = allSubtasks[activeStep];
  const overallProgress = allSubtasks.length > 0
    ? Math.round((completedSteps.size / allSubtasks.length) * 100) : 0;
  const PriorityIcon = getPriorityIcon(parentTask.priority);
  const priorityColor = getPriorityColor(parentTask.priority);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#f5eef8" }}>

      {/* ── TOP HEADER ── */}
      <div className="flex items-center justify-between px-6 py-4 flex-shrink-0"
        style={{ background: "rgba(255,255,255,0.9)", borderBottom: "1px solid rgba(179,157,219,0.2)", backdropFilter: "blur(10px)" }}>

        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity flex-shrink-0"
          style={{ color: "#9575a3" }}>
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="flex-1 text-center px-6">
          <div className="flex items-center justify-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #b39ddb, #f8bbd0)" }}>
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-base truncate" style={{ color: "#5a4a61" }}>
              {parentTask.title}
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 mt-1 text-xs" style={{ color: "#9575a3" }}>
            <span className="flex items-center gap-1">
              <PriorityIcon className="h-3 w-3" style={{ color: priorityColor }} />
              {parentTask.priority}
            </span>
            {parentTask.dueDate && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Due {new Date(parentTask.dueDate + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </>
            )}
            <span>·</span>
            <span>Step {activeStep + 1} of {allSubtasks.length}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0"
          style={{ background: "#f3e5f5", color: "#b39ddb" }}>
          <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "#e1bee7" }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${overallProgress}%`, background: "linear-gradient(90deg, #b39ddb, #f8bbd0)" }} />
          </div>
          {overallProgress}%
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>

        {/* LEFT SIDEBAR */}
        <div className="flex-shrink-0 flex flex-col"
          style={{ width: "260px", background: "rgba(255,255,255,0.78)", borderRight: "1px solid rgba(179,157,219,0.18)" }}>

          <div className="px-4 py-3 flex-shrink-0"
            style={{ borderBottom: "1px solid rgba(179,157,219,0.12)" }}>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#b39ddb" }}>
              YOUR ROADMAP
            </p>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }} className="p-3 space-y-1.5">
            {allSubtasks.map((step, i) => {
              const isDone = completedSteps.has(i);
              const isActive = activeStep === i;
              return (
                <button key={i} onClick={() => setActiveStep(i)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all"
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, rgba(179,157,219,0.18), rgba(248,187,208,0.12))"
                      : isDone ? "rgba(200,230,201,0.3)" : "transparent",
                    border: isActive ? "1px solid rgba(179,157,219,0.4)" : "1px solid transparent",
                  }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all"
                    style={{
                      background: isDone ? "#b39ddb" : isActive ? "linear-gradient(135deg, #b39ddb, #f8bbd0)" : "#e1bee7",
                      color: isDone || isActive ? "#ffffff" : "#9575a3",
                    }}>
                    {isDone ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium leading-tight"
                      style={{ color: isDone ? "#9575a3" : "#5a4a61", textDecoration: isDone ? "line-through" : "none" }}>
                      {step.title}
                    </p>
                    {step.dueDate && (
                      <p className="text-[10px] mt-0.5" style={{ color: "#b39ddb" }}>
                        Due {new Date(step.dueDate + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    )}
                    {step.duration && step.duration !== "—" && (
                      <p className="text-[10px]" style={{ color: "#9575a3" }}>{step.duration}</p>
                    )}
                  </div>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#b39ddb" }} />}
                </button>
              );
            })}
          </div>

          {completedSteps.size === allSubtasks.length && allSubtasks.length > 0 && (
            <div className="p-4 flex-shrink-0" style={{ borderTop: "1px solid rgba(179,157,219,0.12)" }}>
              <div className="rounded-2xl p-4 text-center"
                style={{ background: "linear-gradient(135deg, #b39ddb, #f8bbd0)" }}>
                <Star className="h-5 w-5 text-white mx-auto mb-1" />
                <p className="text-white text-xs font-bold">All Done! 🎉</p>
                <button onClick={() => navigate("/")}
                  className="mt-1 text-white text-[10px] underline opacity-80 hover:opacity-100">
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MAIN CONTENT — scrollable, properly centred */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {currentStep && (
            <div style={{ maxWidth: "780px", margin: "0 auto", padding: "32px 32px 48px" }}
              className="space-y-5">

              {/* Step badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: "linear-gradient(135deg, rgba(179,157,219,0.2), rgba(248,187,208,0.2))", color: "#b39ddb", border: "1px solid rgba(179,157,219,0.3)" }}>
                  Step {activeStep + 1} of {allSubtasks.length}
                </span>
                {completedSteps.has(activeStep) && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1"
                    style={{ background: "#e8f5e9", color: "#2e7d32" }}>
                    <CheckCircle2 className="h-3 w-3" /> Completed
                  </span>
                )}
              </div>

              {/* What you need to accomplish */}
              <div className="rounded-3xl p-6"
                style={{ background: "#ffffff", border: "1px solid rgba(179,157,219,0.2)", boxShadow: "0 2px 16px rgba(179,157,219,0.07)" }}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #e3f2fd, #e8eaf6)" }}>
                    <BookOpen className="h-5 w-5" style={{ color: "#7986cb" }} />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg mb-2" style={{ color: "#5a4a61" }}>
                      What you need to accomplish
                    </h2>
                    <p className="text-sm leading-relaxed" style={{ color: "#9575a3" }}>
                      {currentStep.notes || currentStep.description ||
                        `Focus on "${currentStep.title}" as part of your ${parentTask.title}. Take it one action at a time — quality over speed. Use the AI guide below if you get stuck.`}
                    </p>
                    {currentStep.duration && currentStep.duration !== "—" && (
                      <div className="flex items-center gap-2 mt-3">
                        <Clock className="h-3.5 w-3.5" style={{ color: "#b39ddb" }} />
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: "#f3e5f5", color: "#9575a3" }}>
                          Estimated: {currentStep.duration}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* How the AI Guide helps */}
              <div className="rounded-3xl p-5"
                style={{ background: "#ffffff", border: "1px solid rgba(248,187,208,0.35)", boxShadow: "0 2px 16px rgba(248,187,208,0.07)" }}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #fce4ec, #f3e5f5)" }}>
                    <span className="text-lg">💡</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1" style={{ color: "#5a4a61" }}>
                      How the AI Guide helps
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#9575a3" }}>
                      I'm here to support your learning journey! I won't give you direct answers or complete your work. Instead,
                      I'll guide you with thoughtful questions, helpful hints, and point you toward useful resources. Let's work
                      through this together! 🌟
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Chat — fixed height, internal scroll */}
              <div className="rounded-3xl p-6"
                style={{ background: "#ffffff", border: "1px solid rgba(179,157,219,0.2)", boxShadow: "0 2px 16px rgba(179,157,219,0.07)", height: "420px", display: "flex", flexDirection: "column" }}>
                <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #b39ddb, #f8bbd0)" }}>
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#5a4a61" }}>AI Learning Guide</p>
                    <p className="text-[11px]" style={{ color: "#9575a3" }}>Ask me questions to guide you through this step</p>
                  </div>
                </div>
                <StepChat
                  key={activeStep}
                  step={currentStep}
                  stepIndex={activeStep}
                  totalSteps={allSubtasks.length}
                  parentTitle={parentTask.title}
                  allSteps={allSubtasks}
                />
              </div>

              {/* Mark done / done state */}
              {!completedSteps.has(activeStep) ? (
                <button onClick={() => markStepDone(activeStep)}
                  className="w-full h-14 rounded-full text-white font-semibold flex items-center justify-center gap-3 transition-all hover:shadow-xl hover:scale-[1.01]"
                  style={{ background: "linear-gradient(135deg, #b39ddb, #9575a3)" }}>
                  <CheckCircle2 className="h-5 w-5" />
                  Mark Step as Complete
                </button>
              ) : (
                <div className="w-full h-14 rounded-full flex items-center justify-center gap-3"
                  style={{ background: "linear-gradient(135deg, #c8e6c9, #a5d6a7)", border: "2px solid #81c784" }}>
                  <CheckCircle2 className="h-5 w-5" style={{ color: "#2e7d32" }} />
                  <span className="font-semibold" style={{ color: "#2e7d32" }}>Step Completed ✨</span>
                </div>
              )}

              <div className="h-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}