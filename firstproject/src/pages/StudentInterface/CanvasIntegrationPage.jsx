import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, GraduationCap, ShieldCheck, Mail, Lock, Eye, EyeOff,
  CheckCircle2, Link2, BookOpen, Sparkles, RefreshCw, LogOut, Zap
} from "lucide-react";

// ── palette (from Dashboard) ──────────────────────────────────────────────────
// bg:       #f5eef8
// card:     #ffffff  border rgba(179,157,219,0.2)
// primary:  #b39ddb
// deep:     #5a4a61
// mid:      #9575a3
// light:    #e1bee7 / #f3e5f5 / #fdf7fd
// accent:   #f8bbd0 (pink)  #4ade80 (green)

export default function CanvasIntegrationPage() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass]  = useState(false);
  const [status, setStatus]      = useState(
    () => localStorage.getItem("canvasConnected") || "idle"
  ); // "idle" | "connecting" | "connected" | "error"
  const [errorMsg, setErrorMsg]  = useState("");

  const handleConnect = async () => {
    if (!password) { // We are using the 'password' state variable to store the Token to save time
      setErrorMsg("Please enter your Canvas Access Token.");
      setStatus("error");
      return;
    }
    
    setStatus("connecting");
    setErrorMsg("");

    try {
      const response = await fetch("http://127.0.0.1:5000/api/canvas/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: password }) // Send the token
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("canvasConnected", "connected");
        localStorage.setItem("canvasToken", password)
        setStatus("connected");
        
        // ✨ MAGIC: Pass the fetched assignments directly to the new page!
        navigate("/canvas-assignments", { state: { assignments: data.assignments } });
      } else {
        throw new Error("Invalid Token or Network Error");
      }
    } catch (err) {
      setErrorMsg("Failed to connect. Please check your token and try again.");
      setStatus("error");
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem("canvasConnected");
    setEmail("");
    setPassword("");
    setStatus("idle");
  };

  const steps = [
    { n: 1, title: "Connect Your Account",    desc: "Securely link your Canvas credentials to NeuroZaviya" },
    { n: 2, title: "Import Assignments",       desc: "Automatically pull your Canvas assignments into NeuroZaviya" },
    { n: 3, title: "Generate AI Breakdowns",   desc: "Each assignment is automatically broken down into manageable subtasks" },
  ];

  return (
    <div className="min-h-screen p-8" style={{ background: "#f5eef8" }}>
      <div className="space-y-6">

        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
          style={{ color: "#9575a3" }}>
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>

        {/* ── Hero Header ─────────────────────────────────────────────────── */}
        <div className="rounded-3xl p-8 flex items-center gap-6"
          style={{ background: "linear-gradient(135deg, #ede7f6 0%, #f3e5f5 60%, #fce4ec 100%)", border: "1px solid rgba(179,157,219,0.25)" }}>
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #b39ddb, #9575a3)" }}>
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-semibold mb-1" style={{ color: "#5a4a61" }}>Canvas Integration</h1>
            <p style={{ color: "#9575a3" }}>Connect your Habib University Canvas account to sync assignments automatically</p>
          </div>
          {status === "connected" && (
            <span className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
              style={{ background: "#e8f5e9", color: "#2e7d32" }}>
              <CheckCircle2 className="h-4 w-4" /> Connected
            </span>
          )}
        </div>

        {/* ── Main 2-col grid ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-6">

          {/* LEFT — form / connected state  (2 cols) */}
          <div className="col-span-2 space-y-5">

            {/* Secure Connection notice */}
            <div className="rounded-2xl p-5 flex gap-4"
              style={{ background: "#ede7f6", border: "1px solid rgba(179,157,219,0.3)" }}>
              <ShieldCheck className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: "#b39ddb" }} />
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: "#5a4a61" }}>Secure Connection</p>
                <p className="text-sm" style={{ color: "#7e57a0" }}>
                  Your Canvas credentials are used to securely fetch your assignments.
                  We use industry-standard encryption to protect your information.
                </p>
                <p className="text-xs mt-2 italic" style={{ color: "#b39ddb" }}>
                  Note: This is a mock implementation. In production, credentials would be encrypted and stored securely on the backend.
                </p>
              </div>
            </div>

            {status !== "connected" ? (
              /* ── Login form ── */
              <div className="rounded-3xl p-8 shadow-sm space-y-6"
                style={{ background: "#ffffff", border: "1px solid rgba(179,157,219,0.2)" }}>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: "#5a4a61" }}>
                    Habib University Email
                  </label>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                    style={{ background: "#fdf7fd", border: "1px solid rgba(179,157,219,0.3)" }}>
                    <Mail className="h-4 w-4 flex-shrink-0" style={{ color: "#b39ddb" }} />
                    <input
                      type="email"
                      placeholder="your.name@stu.habib.edu.pk"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setStatus("idle"); }}
                      className="flex-1 text-sm bg-transparent focus:outline-none"
                      style={{ color: "#5a4a61" }}
                    />
                  </div>
                  <p className="text-xs" style={{ color: "#9575a3" }}>Use your official Habib University email address</p>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: "#5a4a61" }}>
                    Canvas Access Token 
                  </label>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                    style={{ background: "#fdf7fd", border: "1px solid rgba(179,157,219,0.3)" }}>
                    <Lock className="h-4 w-4 flex-shrink-0" style={{ color: "#b39ddb" }} />
                    <input
                      type={showPass ? "text" : "Paste your Canvas API Token here..."}
                      placeholder="Enter your Canvas token"
                      value={password}
                      onChange={e => { setPassword(e.target.value); setStatus("idle"); }}
                      className="flex-1 text-sm bg-transparent focus:outline-none"
                      style={{ color: "#5a4a61" }}
                    />
                    <button onClick={() => setShowPass(p => !p)} className="hover:opacity-70 transition-opacity">
                      {showPass
                        ? <EyeOff className="h-4 w-4" style={{ color: "#b39ddb" }} />
                        : <Eye    className="h-4 w-4" style={{ color: "#b39ddb" }} />}
                    </button>
                  </div>
                  <p className="text-xs" style={{ color: "#9575a3" }}>Same password you use to log into Canvas</p>
                </div>

                {/* Error */}
                {status === "error" && (
                  <div className="px-4 py-3 rounded-2xl text-sm"
                    style={{ background: "#ffebee", color: "#c62828", border: "1px solid #ffcdd2" }}>
                    {errorMsg}
                  </div>
                )}

                {/* Submit */}
                <button
                  onClick={handleConnect}
                  disabled={status === "connecting"}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-white font-semibold text-base transition-all hover:opacity-90 active:scale-95"
                  style={{
                    background: status === "connecting"
                      ? "linear-gradient(135deg, #ce93d8, #b39ddb)"
                      : "linear-gradient(135deg, #b39ddb, #9575a3)",
                    boxShadow: "0 4px 20px rgba(179,157,219,0.4)",
                    cursor: status === "connecting" ? "wait" : "pointer"
                  }}>
                  {status === "connecting" ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Connecting to Canvas…
                    </>
                  ) : (
                    <>
                      <Link2 className="h-5 w-5" />
                      Connect Canvas Account
                    </>
                  )}
                </button>
              </div>

            ) : (
              /* ── Connected state ── */
              <div className="rounded-3xl p-8 shadow-sm space-y-5"
                style={{ background: "#ffffff", border: "1px solid rgba(179,157,219,0.2)" }}>

                {/* Success banner */}
                <div className="flex items-center gap-4 p-5 rounded-2xl"
                  style={{ background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)", border: "1px solid #c8e6c9" }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "#ffffff", boxShadow: "0 2px 8px rgba(76,175,80,0.2)" }}>
                    <CheckCircle2 className="h-6 w-6" style={{ color: "#43a047" }} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: "#2e7d32" }}>Canvas account connected!</p>
                    <p className="text-sm mt-0.5" style={{ color: "#66bb6a" }}>
                      {email || "your account"} · Last synced just now
                    </p>
                  </div>
                </div>

                {/* Sync stats row */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Assignments pulled", value: "12", color: "#b39ddb", bg: "#f3e5f5" },
                    { label: "Subtasks generated", value: "48", color: "#f48fb1", bg: "#fce4ec" },
                    { label: "Auto-syncs today",   value: "3",  color: "#4db6ac", bg: "#e0f2f1" },
                  ].map(s => (
                    <div key={s.label} className="rounded-2xl p-4 text-center"
                      style={{ background: s.bg }}>
                      <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                      <p className="text-xs mt-1" style={{ color: "#9575a3" }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate("/")}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold hover:opacity-90 transition-opacity"
                    style={{ background: "linear-gradient(135deg, #b39ddb, #9575a3)", color: "#fff", boxShadow: "0 4px 15px rgba(179,157,219,0.35)" }}>
                    <Sparkles className="h-4 w-4" /> View on Dashboard
                  </button>
                  <button
                    onClick={() => {}}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-medium hover:opacity-90 transition-opacity"
                    style={{ background: "#e1bee7", color: "#5a4a61" }}>
                    <RefreshCw className="h-4 w-4" /> Sync Now
                  </button>
                  <button
                    onClick={handleDisconnect}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-medium hover:opacity-90 transition-opacity"
                    style={{ background: "#ffebee", color: "#c62828" }}>
                    <LogOut className="h-4 w-4" /> Disconnect
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — How It Works  (1 col) */}
          <div className="col-span-1 space-y-5">

            {/* How it works */}
            <div className="rounded-3xl p-7 shadow-sm"
              style={{ background: "#ffffff", border: "1px solid rgba(179,157,219,0.2)" }}>
              <h3 className="text-lg font-semibold mb-5" style={{ color: "#5a4a61" }}>How It Works</h3>
              <div className="space-y-4">
                {steps.map(s => (
                  <div key={s.n} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 text-white"
                      style={{ background: "linear-gradient(135deg, #b39ddb, #9575a3)" }}>
                      {s.n}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#5a4a61" }}>{s.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#9575a3" }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What gets imported */}
            <div className="rounded-3xl p-7 shadow-sm"
              style={{ background: "#ffffff", border: "1px solid rgba(179,157,219,0.2)" }}>
              <h3 className="text-lg font-semibold mb-5" style={{ color: "#5a4a61" }}>What Gets Imported</h3>
              <div className="space-y-3">
                {[
                  { icon: BookOpen, label: "Assignments & quizzes", color: "#b39ddb", bg: "#f3e5f5" },
                  { icon: Zap,      label: "Due dates & deadlines",  color: "#f48fb1", bg: "#fce4ec" },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3 p-3 rounded-2xl"
                    style={{ background: item.bg }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "#fff" }}>
                      <item.icon className="h-4 w-4" style={{ color: item.color }} />
                    </div>
                    <span className="text-sm font-medium" style={{ color: "#5a4a61" }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy note */}
            <div className="rounded-2xl p-5"
              style={{ background: "#fdf7fd", border: "1px solid rgba(179,157,219,0.15)" }}>
              <p className="text-xs leading-relaxed" style={{ color: "#9575a3" }}>
                🔒 <strong style={{ color: "#5a4a61" }}>Privacy first.</strong> Your credentials are only used to authenticate with Canvas and are never stored in plain text. You can disconnect at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}