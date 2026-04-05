import { useState } from "react";
import {
  Brain, Mail, Lock, Eye, EyeOff, ArrowRight,
  ChevronDown, GraduationCap, Heart, Shield, Users,
  BookOpen, CheckCircle2, Sparkles, Zap,
  MessageSquare, Calendar, Target, BookMarked, User,
  HeartHandshake,
} from "lucide-react";
import { useAuth } from "./Authcontext";

// ── Palette: matches FocusPeerManagement soft muted tones ─────────────────────
const C = {
  purple900: "#3d2f47",
  purple800: "#5a4a61",
  purple700: "#6e5878",
  purple600: "#9575a3",
  purple500: "#b39ddb",
  purple400: "#c0b4cc",
  purple300: "#d8cfe0",
  purple200: "#e8e0f0",
  purple100: "rgba(179,157,219,0.15)",
  purple50:  "rgba(179,157,219,0.08)",
  btnFrom:   "#b39ddb",
  btnTo:     "#f8bbd0",
  logoBg:    "linear-gradient(135deg, #b39ddb 0%, #c9a9e0 100%)",
  pink500:   "#d4789a",
  pink400:   "#f8bbd0",
  pink600:   "#c0608a",
  pink100:   "rgba(248,187,208,0.18)",
  teal:      "#6b9e9a",
  tealBg:    "rgba(107,158,154,0.12)",
  tealBorder:"rgba(107,158,154,0.3)",
  ehsas:     "#9b7fbd",
  ehsasBg:   "rgba(155,127,189,0.12)",
  ehsasBorder:"rgba(155,127,189,0.3)",
  gray900:   "#3d2f47",
  gray700:   "#5a4a61",
  gray500:   "#9575a3",
  white:     "#FFFFFF",
  pageBg:    "#f5eef8",
};

const DEMO_ACCOUNTS = [
  { role: "Student",            email: "ub07100@st.habib.edu.pk",      password: "Student@123"    },
  { role: "Focus Peer",         email: "sarah.ahmed@st.habib.edu.pk",  password: "FocusPeer@123" },
  { role: "OAP Staff",          email: "fatima.khan@habib.edu.pk",     password: "OAP@123"        },
  { role: "Ehsas Counselor",    email: "sara.ali@habib.edu.pk",        password: "Ehsas@123"      },
  { role: "Wellness Counselor", email: "dr.zainab@habib.edu.pk",       password: "Wellness@123"   },
];

const ROLE_INFO = [
  {
    label: "Student",
    icon: GraduationCap,
    color: C.purple600,
    bg: `linear-gradient(135deg, ${C.purple100}, ${C.purple50})`,
    border: C.purple300,
    features: ["AI Task Breakdown", "Focus Peer", "Super Calendar", "Weekly Progress"],
  },
  {
    label: "Focus Peer",
    icon: Heart,
    color: C.pink600,
    bg: `linear-gradient(135deg, ${C.pink100}, rgba(248,187,208,0.06))`,
    border: "rgba(248,187,208,0.5)",
    features: ["My Dashboard", "Community Chats", "Resources", "Events"],
  },
  {
    label: "OAP / Wellness",
    icon: Shield,
    color: C.teal,
    bg: C.tealBg,
    border: C.tealBorder,
    features: ["Student Alerts", "Scheduling", "Peer Monitor", "Reports"],
  },
  {
    label: "Ehsas",
    icon: HeartHandshake,
    color: C.ehsas,
    bg: C.ehsasBg,
    border: C.ehsasBorder,
    features: ["Focus Peer Mgmt", "Events & Forum", "Counseling Files", "Student Support"],
  },
];

const PLATFORM_HIGHLIGHTS = [
  { icon: Brain,         label: "AI Task Breakdown",  desc: "Smart step-by-step guidance"  },
  { icon: Users,         label: "Focus Peer Support", desc: "Real 1-on-1 companionship"    },
  { icon: MessageSquare, label: "Community Chats",    desc: "Teams-style messaging"        },
  { icon: Calendar,      label: "Smart Scheduling",   desc: "Visual drag-and-drop planner" },
  { icon: Target,        label: "OAP Accommodations", desc: "Academic support & advocacy"  },
  { icon: BookMarked,    label: "Resource Library",   desc: "Curated neurodivergent tools" },
];

// Roles available in Sign Up (FP uses separate flow)
const SIGNUP_ROLES = [
  { value: "student",  label: "Student",           desc: "Habib University student"        },
  { value: "oap",      label: "OAP Staff",          desc: "Office of Academic Performance"  },
  { value: "ehsas",    label: "Ehsas Counselor",    desc: "Ehsas counseling services"       },
  { value: "wellness", label: "Wellness Counselor", desc: "Student wellness & mental health" },
];

export function SignInPage({ onNavigateToRegister }) {
  const { signIn, registerUser } = useAuth();

  // ── Tab ────────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("signin");

  // ── Sign-in ────────────────────────────────────────────────────────────────
  const [email, setEmail]                 = useState("");
  const [password, setPassword]           = useState("");
  const [showPassword, setShowPassword]   = useState(false);
  const [signInError, setSignInError]     = useState("");
  const [signInLoading, setSignInLoading] = useState(false);

  // ── Sign-up ────────────────────────────────────────────────────────────────
  const [suName, setSuName]       = useState("");
  const [suEmail, setSuEmail]     = useState("");
  const [suRole, setSuRole]       = useState("student");
  const [suPassword, setSuPassword]   = useState("");
  const [suConfirm, setSuConfirm]     = useState("");
  const [showSuPass, setShowSuPass]   = useState(false);
  const [suError, setSuError]         = useState("");
  const [suLoading, setSuLoading]     = useState(false);
  const [suSuccess, setSuSuccess]     = useState(false);

  // ── Shared UI ──────────────────────────────────────────────────────────────
  const [showDemo, setShowDemo]         = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [hoveredRole, setHoveredRole]   = useState(null);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSignIn = async (e) => {
    e.preventDefault();
    setSignInError("");
    setSignInLoading(true);
    const result = await signIn(email, password);
    if (!result.success) setSignInError(result.error);
    setSignInLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setSuError("");
    if (!suName.trim())           { setSuError("Please enter your full name"); return; }
    if (!suEmail.includes("@"))   { setSuError("Please enter a valid email address"); return; }
    if (suPassword.length < 8)    { setSuError("Password must be at least 8 characters"); return; }
    if (suPassword !== suConfirm) { setSuError("Passwords do not match"); return; }

    setSuLoading(true);
    const result = await registerUser({ name: suName, email: suEmail, role: suRole, password: suPassword });
    setSuLoading(false);
    if (!result.success) { setSuError(result.error); return; }
    setSuSuccess(true);
    setSuName(""); setSuEmail(""); setSuRole("student"); setSuPassword(""); setSuConfirm("");
  };

  const fillDemo = (acc) => {
    setEmail(acc.email); setPassword(acc.password);
    setShowDemo(false); setSignInError(""); setActiveTab("signin");
  };

  const switchTab = (tab) => {
    setActiveTab(tab); setSuSuccess(false);
    setSuError(""); setSignInError("");
  };

  // ── Input style helper ─────────────────────────────────────────────────────
  const inp = (field, pl = 44, pr = 16) => ({
    width: "100%", paddingTop: 12, paddingBottom: 12,
    paddingLeft: pl, paddingRight: pr, borderRadius: 12,
    border: `2px solid ${focusedField === field ? C.purple500 : C.purple200}`,
    background: focusedField === field ? C.white : "#fdfbff",
    color: C.gray900, fontSize: 14, outline: "none",
    boxSizing: "border-box", transition: "all 0.18s", fontFamily: "inherit",
    boxShadow: focusedField === field ? `0 0 0 3px ${C.purple100}` : "none",
  });

  const iconPos = {
    position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
    width: 16, height: 16, transition: "color 0.18s", pointerEvents: "none",
  };

  const labelStyle = { display: "block", fontSize: 12.5, fontWeight: 700, color: C.purple800, marginBottom: 6 };

  // ── Submit button helper ───────────────────────────────────────────────────
  const submitBtn = (loading, label) => ({
    width: "100%", padding: "13px", borderRadius: 12, border: "none",
    background: loading ? C.purple400 : `linear-gradient(90deg, ${C.btnFrom} 0%, ${C.btnTo} 100%)`,
    color: C.white, fontWeight: 800, fontSize: 15,
    cursor: loading ? "not-allowed" : "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    boxShadow: loading ? "none" : "0 6px 20px rgba(179,157,219,0.4)",
    transition: "all 0.2s", marginTop: 4,
  });

  return (
    <div style={{
      minHeight: "100vh", width: "100vw", display: "flex", flexDirection: "column",
      background: `linear-gradient(145deg, ${C.pageBg} 0%, #ede4f5 50%, #f5e8f2 100%)`,
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif",
      overflow: "hidden", position: "relative",
    }}>

      {/* Ambient blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-12%", left: "-8%", width: 550, height: 550, background: `radial-gradient(circle, ${C.purple200}44 0%, transparent 70%)`, borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-8%", right: "-4%", width: 450, height: 450, background: `radial-gradient(circle, ${C.pink100}88 0%, transparent 70%)`, borderRadius: "50%" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${C.purple300}30 1.5px, transparent 1.5px)`, backgroundSize: "28px 28px" }} />
      </div>

      {/* ── Top bar ── */}
      <div style={{
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${C.purple200}`, padding: "13px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 12px rgba(179,157,219,0.1)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: C.logoBg, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(179,157,219,0.4)" }}>
            <Brain style={{ width: 22, height: 22, color: C.white }} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, color: C.purple800, letterSpacing: "-0.4px" }}>NeuroZaviya</div>
            <div style={{ fontSize: 10.5, color: C.purple400, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Habib University · 2026</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Become a Focus Peer */}
          <button onClick={onNavigateToRegister} style={{
            display: "flex", alignItems: "center", gap: 7, padding: "9px 20px",
            background: `linear-gradient(135deg, ${C.pink400}, ${C.pink500})`,
            border: "none", borderRadius: 50, cursor: "pointer",
            color: C.purple800, fontSize: 13, fontWeight: 700,
            boxShadow: "0 4px 14px rgba(248,187,208,0.5)", transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.filter = "brightness(1.05)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.filter = "brightness(1)"; }}>
            <Heart style={{ width: 14, height: 14 }} /> Become a Focus Peer
          </button>

          {/* Demo dropdown */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowDemo(!showDemo)} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "9px 18px",
              background: showDemo ? C.purple50 : "rgba(255,255,255,0.9)",
              border: `1.5px solid ${showDemo ? C.purple300 : C.purple200}`,
              borderRadius: 50, cursor: "pointer", color: C.purple700,
              fontSize: 13, fontWeight: 700, transition: "all 0.2s",
            }}>
              <Sparkles style={{ width: 14, height: 14, color: C.purple400 }} />
              Demo Accounts
              <ChevronDown style={{ width: 14, height: 14, color: C.purple400, transform: showDemo ? "rotate(180deg)" : "none", transition: "transform 0.22s" }} />
            </button>
            {showDemo && (
              <div style={{
                position: "absolute", top: "calc(100% + 10px)", right: 0, width: 300,
                background: C.white, borderRadius: 18,
                boxShadow: "0 16px 48px rgba(179,157,219,0.2), 0 4px 12px rgba(0,0,0,0.06)",
                border: `1px solid ${C.purple200}`, zIndex: 100, overflow: "hidden",
              }}>
                <div style={{ padding: "10px 18px", background: `linear-gradient(90deg, ${C.purple50}, ${C.pageBg})`, borderBottom: `1px solid ${C.purple100}`, display: "flex", alignItems: "center", gap: 7 }}>
                  <Zap style={{ width: 12, height: 12, color: C.purple500 }} />
                  <span style={{ fontSize: 11, fontWeight: 800, color: C.purple600, letterSpacing: "0.07em", textTransform: "uppercase" }}>Click to Auto-Fill</span>
                </div>
                {DEMO_ACCOUNTS.map((acc, i) => (
                  <button key={i} onClick={() => fillDemo(acc)} style={{
                    width: "100%", textAlign: "left", padding: "12px 18px",
                    background: "transparent", border: "none",
                    borderBottom: i < DEMO_ACCOUNTS.length - 1 ? `1px solid ${C.purple100}` : "none",
                    cursor: "pointer", transition: "background 0.15s",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = C.purple50}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: C.purple800 }}>{acc.role}</div>
                      <div style={{ fontSize: 11, color: C.purple400, marginTop: 2 }}>{acc.email}</div>
                    </div>
                    <ArrowRight style={{ width: 13, height: 13, color: C.purple300 }} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1.15fr 0.85fr", minHeight: "calc(100vh - 71px)", position: "relative", zIndex: 1 }}>

        {/* ── LEFT PANEL ── */}
        <div style={{ padding: "44px 52px 44px 60px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 26 }}>

          {/* Hero */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.purple100, borderRadius: 50, padding: "6px 16px", marginBottom: 16, border: `1px solid ${C.purple200}` }}>
              <Sparkles style={{ width: 13, height: 13, color: C.purple500 }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: C.purple600, letterSpacing: "0.05em" }}>Neurodivergent-Friendly · Habib University</span>
            </div>
            <h1 style={{ fontSize: 44, fontWeight: 900, color: C.purple900, lineHeight: 1.08, letterSpacing: "-1.5px", margin: 0 }}>
              Welcome to{" "}
              <span style={{ background: `linear-gradient(135deg, ${C.purple500} 0%, ${C.purple700} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                NeuroZaviya
              </span>
            </h1>
            <p style={{ color: C.gray700, marginTop: 13, fontSize: 15, lineHeight: 1.7, maxWidth: 500 }}>
              A supportive space built for neurodivergent students, Focus Peers, counselors, and staff — designed with care, not compromise.
            </p>
          </div>

          {/* Platform highlights */}
          <div>
            <SectionLabel label="Platform Features" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {PLATFORM_HIGHLIGHTS.map(({ icon: Icon, label, desc }) => (
                <div key={label} style={{
                  display: "flex", alignItems: "flex-start", gap: 11,
                  background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)",
                  borderRadius: 13, padding: "11px 13px", border: `1px solid ${C.purple100}`,
                  boxShadow: "0 1px 6px rgba(179,157,219,0.08)", transition: "all 0.18s", cursor: "default",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 18px rgba(179,157,219,0.14)"; e.currentTarget.style.borderColor = C.purple200; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 6px rgba(179,157,219,0.08)"; e.currentTarget.style.borderColor = C.purple100; }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0, background: C.purple50, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.purple100}` }}>
                    <Icon style={{ width: 15, height: 15, color: C.purple600 }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 12.5, color: C.purple800, lineHeight: 1.2 }}>{label}</div>
                    <div style={{ fontSize: 11, color: C.gray500, marginTop: 2 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Role cards — 2×2 grid now includes Ehsas */}
          <div>
            <SectionLabel label="What You Get By Role" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {ROLE_INFO.map(({ label, icon: Icon, color, bg, border, features }, idx) => (
                <div key={label}
                  onMouseEnter={() => setHoveredRole(idx)}
                  onMouseLeave={() => setHoveredRole(null)}
                  style={{
                    background: hoveredRole === idx ? C.white : "rgba(255,255,255,0.80)",
                    backdropFilter: "blur(8px)", borderRadius: 15, padding: "13px 14px",
                    border: `1.5px solid ${hoveredRole === idx ? border : C.purple100}`,
                    boxShadow: hoveredRole === idx ? `0 8px 24px ${color}22` : "0 1px 8px rgba(179,157,219,0.07)",
                    transition: "all 0.22s", cursor: "default",
                  }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: bg, border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon style={{ width: 15, height: 15, color }} />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: 12.5, color: C.purple900 }}>{label}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {features.map(f => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <CheckCircle2 style={{ width: 11, height: 11, color, flexShrink: 0 }} />
                        <span style={{ fontSize: 10.5, color: C.gray700, fontWeight: 500 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL — tabbed card ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "36px 44px", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.55)", backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)", borderLeft: `1px solid ${C.purple100}` }} />

          <div style={{ width: "100%", maxWidth: 410, position: "relative", zIndex: 1 }}>
            <div style={{ background: C.white, borderRadius: 24, boxShadow: "0 16px 56px rgba(179,157,219,0.14), 0 2px 12px rgba(0,0,0,0.04)", border: `1.5px solid ${C.purple100}` }}>

              {/* ── Tab switcher ── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, padding: "16px 16px 0" }}>
                {[{ id: "signin", label: "Sign In" }, { id: "signup", label: "Sign Up" }].map(({ id, label }) => (
                  <button key={id} onClick={() => switchTab(id)} style={{
                    padding: "11px", borderRadius: 11, border: "none", cursor: "pointer",
                    fontWeight: 700, fontSize: 14, transition: "all 0.2s",
                    background: activeTab === id ? `linear-gradient(90deg, ${C.btnFrom} 0%, ${C.btnTo} 100%)` : "rgba(179,157,219,0.08)",
                    color: activeTab === id ? C.white : C.purple600,
                    boxShadow: activeTab === id ? "0 4px 14px rgba(179,157,219,0.35)" : "none",
                  }}>
                    {label}
                  </button>
                ))}
              </div>

              <div style={{ padding: "22px 28px 26px" }}>

                {/* ════ SIGN IN ════ */}
                {activeTab === "signin" && (
                  <>
                    <div style={{ marginBottom: 22, textAlign: "center" }}>
                      <div style={{ width: 50, height: 50, borderRadius: 15, background: C.logoBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", boxShadow: "0 6px 20px rgba(179,157,219,0.35)" }}>
                        <Brain style={{ width: 24, height: 24, color: C.white }} />
                      </div>
                      <h2 style={{ fontSize: 23, fontWeight: 900, color: C.purple800, margin: "0 0 4px", letterSpacing: "-0.5px" }}>Sign In</h2>
                      <p style={{ fontSize: 13, color: C.purple400, margin: 0, fontWeight: 500 }}>Continue your journey with NeuroZaviya</p>
                    </div>

                    <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                      <div>
                        <label style={labelStyle}>Email Address</label>
                        <div style={{ position: "relative" }}>
                          <Mail style={{ ...iconPos, color: focusedField === "si_email" ? C.purple500 : C.purple300 }} />
                          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@habib.edu.pk" required
                            onFocus={() => setFocusedField("si_email")} onBlur={() => setFocusedField(null)} style={inp("si_email")} />
                        </div>
                      </div>
                      <div>
                        <label style={labelStyle}>Password</label>
                        <div style={{ position: "relative" }}>
                          <Lock style={{ ...iconPos, color: focusedField === "si_pass" ? C.purple500 : C.purple300 }} />
                          <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                            placeholder="Enter your password" required
                            onFocus={() => setFocusedField("si_pass")} onBlur={() => setFocusedField(null)}
                            style={inp("si_pass", 44, 44)} />
                          <EyeBtn show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                        </div>
                      </div>

                      {signInError && <ErrorBox msg={signInError} />}

                      <button type="submit" disabled={signInLoading} style={submitBtn(signInLoading)}
                        onMouseEnter={e => { if (!signInLoading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.filter = "brightness(1.06)"; } }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.filter = "brightness(1)"; }}>
                        {signInLoading ? "Signing in…" : (<><span>Sign In</span><ArrowRight style={{ width: 17, height: 17 }} /></>)}
                      </button>
                    </form>

                    <div style={{ marginTop: 14, padding: "9px 12px", borderRadius: 10, background: C.purple50, border: `1px solid ${C.purple100}`, textAlign: "center" }}>
                      <p style={{ fontSize: 12, color: C.purple600, margin: 0, fontWeight: 600 }}>
                        💡 Use <strong>Demo Accounts</strong> in the top bar to auto-fill
                      </p>
                    </div>
                  </>
                )}

                {/* ════ SIGN UP ════ */}
                {activeTab === "signup" && (
                  suSuccess ? (
                    <div style={{ textAlign: "center", padding: "16px 0" }}>
                      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(34,197,94,0.1)", border: "2px solid rgba(34,197,94,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                        <CheckCircle2 style={{ width: 32, height: 32, color: "#22c55e" }} />
                      </div>
                      <h3 style={{ fontSize: 20, fontWeight: 800, color: C.purple800, margin: "0 0 8px" }}>Request Submitted!</h3>
                      <p style={{ fontSize: 13.5, color: C.gray500, lineHeight: 1.65, margin: "0 0 20px" }}>
                        Your account request has been sent to the <strong style={{ color: C.purple600 }}>OAP team</strong> for review. You'll receive an email once it's approved or rejected.
                      </p>
                      <button onClick={() => { setSuSuccess(false); setActiveTab("signin"); }} style={{
                        padding: "11px 28px", borderRadius: 12, border: "none", cursor: "pointer",
                        background: `linear-gradient(90deg, ${C.btnFrom} 0%, ${C.btnTo} 100%)`,
                        color: C.white, fontWeight: 700, fontSize: 14,
                        boxShadow: "0 4px 14px rgba(179,157,219,0.35)",
                      }}>Back to Sign In</button>
                    </div>
                  ) : (
                    <>
                      <div style={{ marginBottom: 18 }}>
                        <h2 style={{ fontSize: 21, fontWeight: 900, color: C.purple800, margin: "0 0 4px", letterSpacing: "-0.4px" }}>Create Account</h2>
                        <p style={{ fontSize: 13, color: C.purple400, margin: 0, fontWeight: 500 }}>Request access to the platform</p>
                      </div>

                      <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                        {/* Email */}
                        <div>
                          <label style={labelStyle}>Email Address *</label>
                          <div style={{ position: "relative" }}>
                            <Mail style={{ ...iconPos, color: focusedField === "su_email" ? C.purple500 : C.purple300 }} />
                            <input type="email" value={suEmail} onChange={e => setSuEmail(e.target.value)} placeholder="your.email@habib.edu.pk" required
                              onFocus={() => setFocusedField("su_email")} onBlur={() => setFocusedField(null)} style={inp("su_email")} />
                          </div>
                        </div>

                        {/* Full name */}
                        <div>
                          <label style={labelStyle}>Full Name *</label>
                          <div style={{ position: "relative" }}>
                            <User style={{ ...iconPos, color: focusedField === "su_name" ? C.purple500 : C.purple300 }} />
                            <input type="text" value={suName} onChange={e => setSuName(e.target.value)} placeholder="Enter your full name" required
                              onFocus={() => setFocusedField("su_name")} onBlur={() => setFocusedField(null)} style={inp("su_name")} />
                          </div>
                        </div>

                        {/* Account type */}
                        <div>
                          <label style={labelStyle}>Account Type *</label>
                          <div style={{ position: "relative" }}>
                            <select value={suRole} onChange={e => setSuRole(e.target.value)}
                              onFocus={() => setFocusedField("su_role")} onBlur={() => setFocusedField(null)}
                              style={{ ...inp("su_role", 16, 36), appearance: "none", WebkitAppearance: "none", cursor: "pointer" }}>
                              {SIGNUP_ROLES.map(r => (
                                <option key={r.value} value={r.value}>{r.label} — {r.desc}</option>
                              ))}
                            </select>
                            <ChevronDown style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: C.purple400, pointerEvents: "none" }} />
                          </div>
                          <p style={{ fontSize: 11.5, color: C.purple400, marginTop: 4, marginBottom: 0 }}>
                            For Focus Peer registration, use the <strong style={{ color: C.pink600 }}>"Become a Focus Peer"</strong> button.
                          </p>
                        </div>

                        {/* Password */}
                        <div>
                          <label style={labelStyle}>Password *</label>
                          <div style={{ position: "relative" }}>
                            <Lock style={{ ...iconPos, color: focusedField === "su_pass" ? C.purple500 : C.purple300 }} />
                            <input type={showSuPass ? "text" : "password"} value={suPassword} onChange={e => setSuPassword(e.target.value)}
                              placeholder="Enter your password" required
                              onFocus={() => setFocusedField("su_pass")} onBlur={() => setFocusedField(null)}
                              style={inp("su_pass", 44, 44)} />
                            <EyeBtn show={showSuPass} onToggle={() => setShowSuPass(!showSuPass)} />
                          </div>
                        </div>

                        {/* Confirm */}
                        <div>
                          <label style={labelStyle}>Confirm Password *</label>
                          <div style={{ position: "relative" }}>
                            <Lock style={{ ...iconPos, color: focusedField === "su_confirm" ? C.purple500 : C.purple300 }} />
                            <input type={showSuPass ? "text" : "password"} value={suConfirm} onChange={e => setSuConfirm(e.target.value)}
                              placeholder="Confirm your password" required
                              onFocus={() => setFocusedField("su_confirm")} onBlur={() => setFocusedField(null)}
                              style={inp("su_confirm")} />
                          </div>
                        </div>

                        {/* Note */}
                        <div style={{ padding: "9px 12px", borderRadius: 10, background: C.purple50, border: `1px solid ${C.purple100}` }}>
                          <p style={{ fontSize: 12, color: C.purple600, margin: 0, lineHeight: 1.6 }}>
                            <strong>Note:</strong> Your signup request will be reviewed by OAP staff. You'll be able to sign in once your account is approved.
                          </p>
                        </div>

                        {suError && <ErrorBox msg={suError} />}

                        <button type="submit" disabled={suLoading} style={submitBtn(suLoading)}
                          onMouseEnter={e => { if (!suLoading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.filter = "brightness(1.06)"; } }}
                          onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.filter = "brightness(1)"; }}>
                          {suLoading ? "Submitting…" : (<><span>Submit Request</span><ArrowRight style={{ width: 17, height: 17 }} /></>)}
                        </button>
                      </form>
                    </>
                  )
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                {[GraduationCap, Heart, Shield, HeartHandshake, BookOpen].map((Icon, i) => (
                  <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${C.purple100}, ${C.purple200})`, border: `2.5px solid ${C.white}`, marginLeft: i > 0 ? -8 : 0, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(179,157,219,0.2)" }}>
                    <Icon style={{ width: 12, height: 12, color: C.purple600 }} />
                  </div>
                ))}
                <span style={{ marginLeft: 10, fontSize: 11.5, color: C.purple400, fontWeight: 600 }}>5 roles supported</span>
              </div>
              <p style={{ fontSize: 11, color: C.purple300, margin: 0, fontWeight: 500 }}>© 2026 Habib</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Small reusable sub-components ─────────────────────────────────────────────
function SectionLabel({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
      <div style={{ width: 22, height: 3, borderRadius: 2, background: `linear-gradient(90deg, #b39ddb, #d8cfe0)` }} />
      <span style={{ fontSize: 11, fontWeight: 800, color: "#c0b4cc", letterSpacing: "0.12em", textTransform: "uppercase" }}>{label}</span>
    </div>
  );
}

function EyeBtn({ show, onToggle }) {
  const [hov, setHov] = useState(false);
  return (
    <button type="button" onClick={onToggle}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: hov ? "#b39ddb" : "#d8cfe0", padding: 4, display: "flex", borderRadius: 8, transition: "color 0.18s" }}>
      {show ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
    </button>
  );
}

function ErrorBox({ msg }) {
  return (
    <div style={{ padding: "10px 13px", borderRadius: 10, background: "#FFF1F2", color: "#B91C1C", fontSize: 13, border: "1.5px solid #FECACA", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
      <span>⚠️</span> {msg}
    </div>
  );
}

// labelStyle used inline above — defined here for clarity
const labelStyle = { display: "block", fontSize: 12.5, fontWeight: 700, color: "#5a4a61", marginBottom: 6 };

// submitBtn helper used inline above
function submitBtn(loading) {
  return {
    width: "100%", padding: "13px", borderRadius: 12, border: "none",
    background: loading ? "#c0b4cc" : "linear-gradient(90deg, #b39ddb 0%, #f8bbd0 100%)",
    color: "#fff", fontWeight: 800, fontSize: 15,
    cursor: loading ? "not-allowed" : "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    boxShadow: loading ? "none" : "0 6px 20px rgba(179,157,219,0.4)",
    transition: "all 0.2s", marginTop: 4,
  };
}

export default SignInPage;