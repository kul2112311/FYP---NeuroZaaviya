import { useState } from "react";
import {
  Brain, Mail, Lock, Eye, EyeOff, ArrowRight,
  ChevronDown, GraduationCap, Heart, Shield, Users,
  BookOpen, CheckCircle2, Sparkles, Zap,
  MessageSquare, Calendar, Target, BookMarked,
} from "lucide-react";
import { useAuth } from "./Authcontext";

// ── Palette: matches FocusPeerManagement soft muted tones ─────────────────────
const C = {
  // Core text & heading colours (muted plum, not deep violet)
  purple900: "#3d2f47",   // headings only
  purple800: "#5a4a61",   // subheadings / primary text  ← FPM's #5a4a61
  purple700: "#6e5878",   // text-level accents
  purple600: "#9575a3",   // muted labels / secondary text ← FPM's #9575a3
  purple500: "#b39ddb",   // active icons / accents ← FPM's #b39ddb
  purple400: "#c0b4cc",   // borders / placeholders ← FPM's #c0b4cc
  purple300: "#d8cfe0",   // light borders
  purple200: "#e8e0f0",   // card borders
  purple100: "rgba(179,157,219,0.15)",  // card bg tint
  purple50:  "rgba(179,157,219,0.08)",  // hint bg

  // button gradient — matches FPM's Send Invitation button
  btnFrom:   "#b39ddb",
  btnTo:     "#f8bbd0",

  // logo bg — soft purple→pink gradient matching FPM
  logoBg:    "linear-gradient(135deg, #b39ddb 0%, #c9a9e0 100%)",

  // pink — FPM's soft pink accent
  pink500:   "#d4789a",
  pink400:   "#f8bbd0",   // ← FPM's #f8bbd0
  pink600:   "#c0608a",
  pink100:   "rgba(248,187,208,0.18)",

  // neutrals
  gray900:   "#3d2f47",
  gray700:   "#5a4a61",
  gray500:   "#9575a3",
  white:     "#FFFFFF",
  pageBg:    "#f5eef8",   // ← FPM's page background
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
    color: "#6b9e9a",
    bg: "linear-gradient(135deg, rgba(107,158,154,0.15), rgba(107,158,154,0.06))",
    border: "rgba(107,158,154,0.35)",
    features: ["Student Alerts", "Scheduling", "Peer Monitor", "Reports"],
  },
];

const PLATFORM_HIGHLIGHTS = [
  { icon: Brain,         label: "AI Task Breakdown",  desc: "Smart step-by-step guidance"   },
  { icon: Users,         label: "Focus Peer Support", desc: "Real 1-on-1 companionship"     },
  { icon: MessageSquare, label: "Community Chats",    desc: "Teams-style messaging"         },
  { icon: Calendar,      label: "Smart Scheduling",   desc: "Visual drag-and-drop planner"  },
  { icon: Target,        label: "OAP Accommodations", desc: "Academic support & advocacy"   },
  { icon: BookMarked,    label: "Resource Library",   desc: "Curated neurodivergent tools"  },
];

export function SignInPage({ onNavigateToRegister }) {
  const { signIn } = useAuth();
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState("");
  const [loading, setLoading]           = useState(false);
  const [showDemo, setShowDemo]         = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [hoveredRole, setHoveredRole]   = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn(email, password);
    if (!result.success) setError(result.error);
    setLoading(false);
  };

  const fillDemo = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setShowDemo(false);
    setError("");
  };

  const inputStyle = (field) => ({
    width: "100%",
    paddingTop: 13, paddingBottom: 13,
    paddingLeft: 44, paddingRight: 16,
    borderRadius: 12,
    border: `2px solid ${focusedField === field ? C.purple400 : C.purple200}`,
    background: focusedField === field ? C.white : "#FDFBFF",
    color: C.gray900,
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    transition: "all 0.18s",
    fontFamily: "inherit",
    boxShadow: focusedField === field ? `0 0 0 3px ${C.purple100}` : "none",
  });

  return (
    <div style={{
      minHeight: "100vh", width: "100vw",
      display: "flex", flexDirection: "column",
      background: `linear-gradient(145deg, ${C.pageBg} 0%, #ede4f5 50%, #f5e8f2 100%)`,
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif",
      overflow: "hidden", position: "relative",
    }}>

      {/* Ambient blobs + dot grid */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: "-12%", left: "-8%", width: 550, height: 550,
          background: `radial-gradient(circle, ${C.purple200}44 0%, transparent 70%)`, borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute", bottom: "-8%", right: "-4%", width: 450, height: 450,
          background: `radial-gradient(circle, ${C.pink100}88 0%, transparent 70%)`, borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `radial-gradient(${C.purple300}30 1.5px, transparent 1.5px)`,
          backgroundSize: "28px 28px",
        }} />
      </div>

      {/* ── Top bar ── */}
      <div style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${C.purple200}`,
        padding: "13px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 50,
        boxShadow: "0 1px 12px rgba(109,40,217,0.06)",
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: C.logoBg,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 4px 14px ${C.purple500}40`,
          }}>
            <Brain style={{ width: 22, height: 22, color: C.white }} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, color: C.purple800, letterSpacing: "-0.4px" }}>
              NeuroZaviya
            </div>
            <div style={{ fontSize: 10.5, color: C.purple400, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Habib University · 2026
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

          {/* Become a Focus Peer — vibrant pink pill */}
          <button
            onClick={onNavigateToRegister}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "9px 20px",
              background: `linear-gradient(135deg, ${C.pink400}, ${C.pink500})`,
              border: "none", borderRadius: 50, cursor: "pointer",
              color: C.purple800, fontSize: 13, fontWeight: 700,
              boxShadow: `0 4px 14px rgba(248,187,208,0.5)`,
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 8px 20px rgba(248,187,208,0.65)`; e.currentTarget.style.filter = "brightness(1.05)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 4px 14px rgba(248,187,208,0.5)`; e.currentTarget.style.filter = "brightness(1)"; }}
          >
            <Heart style={{ width: 14, height: 14 }} />
            Become a Focus Peer
          </button>

          {/* Demo dropdown */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowDemo(!showDemo)} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "9px 18px",
              background: showDemo ? C.purple50 : "rgba(255,255,255,0.9)",
              border: `1.5px solid ${showDemo ? C.purple300 : C.purple200}`,
              borderRadius: 50, cursor: "pointer",
              color: C.purple700, fontSize: 13, fontWeight: 700,
              transition: "all 0.2s", boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}>
              <Sparkles style={{ width: 14, height: 14, color: C.purple400 }} />
              Demo Accounts
              <ChevronDown style={{
                width: 14, height: 14, color: C.purple400,
                transform: showDemo ? "rotate(180deg)" : "none", transition: "transform 0.22s",
              }} />
            </button>

            {showDemo && (
              <div style={{
                position: "absolute", top: "calc(100% + 10px)", right: 0,
                width: 300, background: C.white, borderRadius: 18,
                boxShadow: `0 16px 48px ${C.purple700}18, 0 4px 12px rgba(0,0,0,0.07)`,
                border: `1px solid ${C.purple200}`, zIndex: 100, overflow: "hidden",
              }}>
                <div style={{
                  padding: "10px 18px",
                  background: `linear-gradient(90deg, ${C.purple50}, ${C.pageBg})`,
                  borderBottom: `1px solid ${C.purple100}`,
                  display: "flex", alignItems: "center", gap: 7,
                }}>
                  <Zap style={{ width: 12, height: 12, color: C.purple500 }} />
                  <span style={{ fontSize: 11, fontWeight: 800, color: C.purple600, letterSpacing: "0.07em", textTransform: "uppercase" }}>
                    Click to Auto-Fill
                  </span>
                </div>
                {DEMO_ACCOUNTS.map((acc, i) => (
                  <button key={i} onClick={() => fillDemo(acc)} style={{
                    width: "100%", textAlign: "left",
                    padding: "12px 18px", background: "transparent", border: "none",
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
      <div style={{
        flex: 1, display: "grid", gridTemplateColumns: "1.2fr 0.8fr",
        minHeight: "calc(100vh - 71px)", position: "relative", zIndex: 1,
      }}>

        {/* ── LEFT PANEL ── */}
        <div style={{
          padding: "52px 60px 52px 68px",
          display: "flex", flexDirection: "column", justifyContent: "center", gap: 34,
        }}>

          {/* Hero */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: C.purple100, borderRadius: 50, padding: "6px 16px", marginBottom: 20,
              border: `1px solid ${C.purple200}`,
            }}>
              <Sparkles style={{ width: 13, height: 13, color: C.purple500 }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: C.purple600, letterSpacing: "0.05em" }}>
                Neurodivergent-Friendly · Habib University
              </span>
            </div>
            <h1 style={{ fontSize: 50, fontWeight: 900, color: C.purple900, lineHeight: 1.06, letterSpacing: "-1.5px", margin: 0 }}>
              Welcome to{" "}
              <span style={{
                background: `linear-gradient(135deg, ${C.purple500} 0%, ${C.purple700} 100%)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                NeuroZaviya
              </span>
            </h1>
            <p style={{ color: C.gray700, marginTop: 16, fontSize: 15.5, lineHeight: 1.7, maxWidth: 500 }}>
              A supportive space built for neurodivergent students, Focus Peers, counselors, and staff — designed with care, not compromise.
            </p>
          </div>

          {/* Platform highlights */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 22, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${C.purple500}, ${C.purple300})` }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: C.purple400, letterSpacing: "0.12em", textTransform: "uppercase" }}>Platform Features</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
              {PLATFORM_HIGHLIGHTS.map(({ icon: Icon, label, desc }) => (
                <div key={label} style={{
                  display: "flex", alignItems: "flex-start", gap: 11,
                  background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)",
                  borderRadius: 13, padding: "12px 14px",
                  border: `1px solid ${C.purple100}`,
                  boxShadow: "0 1px 6px rgba(109,40,217,0.06)", transition: "all 0.18s", cursor: "default",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 18px rgba(109,40,217,0.10)`; e.currentTarget.style.borderColor = C.purple200; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 6px rgba(109,40,217,0.06)"; e.currentTarget.style.borderColor = C.purple100; }}>
                  <div style={{
                    width: 33, height: 33, borderRadius: 10, flexShrink: 0,
                    background: C.purple50,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: `1px solid ${C.purple100}`,
                  }}>
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

          {/* Role cards */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 22, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${C.purple500}, ${C.purple300})` }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: C.purple400, letterSpacing: "0.12em", textTransform: "uppercase" }}>What You Get By Role</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 9 }}>
              {ROLE_INFO.map(({ label, icon: Icon, color, bg, border, features }, idx) => (
                <div key={label}
                  onMouseEnter={() => setHoveredRole(idx)}
                  onMouseLeave={() => setHoveredRole(null)}
                  style={{
                    background: hoveredRole === idx ? C.white : "rgba(255,255,255,0.80)",
                    backdropFilter: "blur(8px)", borderRadius: 15, padding: "14px 15px",
                    border: `1.5px solid ${hoveredRole === idx ? border : C.purple100}`,
                    boxShadow: hoveredRole === idx ? `0 8px 24px ${color}18` : "0 1px 8px rgba(109,40,217,0.05)",
                    transition: "all 0.22s", cursor: "default",
                  }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 11 }}>
                    <div style={{
                      width: 33, height: 33, borderRadius: 10,
                      background: bg, border: `1px solid ${border}`,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <Icon style={{ width: 16, height: 16, color }} />
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

        {/* ── RIGHT PANEL — sign-in form ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "52px 48px", position: "relative",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(255,255,255,0.60)",
            backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)",
            borderLeft: `1px solid ${C.purple100}`,
          }} />

          <div style={{ width: "100%", maxWidth: 400, position: "relative", zIndex: 1 }}>

            {/* Form card */}
            <div style={{
              background: C.white, borderRadius: 24, padding: "38px 36px",
              boxShadow: "0 16px 56px rgba(109,40,217,0.10), 0 2px 12px rgba(0,0,0,0.04)",
              border: `1.5px solid ${C.purple100}`,
            }}>
              {/* Header */}
              <div style={{ marginBottom: 30, textAlign: "center" }}>
                <div style={{
                  width: 54, height: 54, borderRadius: 16,
                  background: C.logoBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 14px",
                  boxShadow: `0 6px 20px ${C.purple500}38`,
                }}>
                  <Brain style={{ width: 26, height: 26, color: C.white }} />
                </div>
                <h2 style={{ fontSize: 26, fontWeight: 900, color: C.purple800, margin: "0 0 5px", letterSpacing: "-0.5px" }}>
                  Sign In
                </h2>
                <p style={{ fontSize: 13.5, color: C.purple400, margin: 0, fontWeight: 500 }}>
                  Continue your journey with NeuroZaviya
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 17 }}>
                {/* Email */}
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: C.purple800, marginBottom: 7 }}>
                    Email Address
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail style={{
                      position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                      width: 16, height: 16,
                      color: focusedField === "email" ? C.purple500 : C.purple300, transition: "color 0.18s",
                    }} />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@habib.edu.pk" required
                      onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)}
                      style={inputStyle("email")} />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: C.purple800, marginBottom: 7 }}>
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock style={{
                      position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                      width: 16, height: 16,
                      color: focusedField === "password" ? C.purple500 : C.purple300, transition: "color 0.18s",
                    }} />
                    <input type={showPassword ? "text" : "password"} value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password" required
                      onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField(null)}
                      style={{ ...inputStyle("password"), paddingRight: 44 }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                      position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer",
                      color: C.purple300, padding: 4, display: "flex", borderRadius: 8, transition: "color 0.18s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.color = C.purple500}
                      onMouseLeave={e => e.currentTarget.style.color = C.purple300}>
                      {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div style={{
                    padding: "11px 14px", borderRadius: 11,
                    background: "#FFF1F2", color: "#B91C1C",
                    fontSize: 13, border: "1.5px solid #FECACA",
                    fontWeight: 600, display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <span>⚠️</span> {error}
                  </div>
                )}

                {/* Submit — softer violet button */}
                <button type="submit" disabled={loading} style={{
                  width: "100%", padding: "14px", borderRadius: 12,
                  background: loading
                    ? C.purple400
                    : `linear-gradient(90deg, ${C.btnFrom} 0%, ${C.btnTo} 100%)`,
                  color: C.white, fontWeight: 800, fontSize: 15,
                  border: "none", cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: loading ? "none" : `0 6px 20px ${C.purple500}40`,
                  transition: "all 0.2s", letterSpacing: "0.02em", marginTop: 2,
                }}
                  onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 10px 28px ${C.purple500}50`; } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = loading ? "none" : `0 6px 20px ${C.purple500}40`; }}>
                  {loading ? "Signing in…" : (<><span>Sign In</span><ArrowRight style={{ width: 17, height: 17 }} /></>)}
                </button>
              </form>

              {/* Demo hint */}
              <div style={{
                marginTop: 18, padding: "10px 14px", borderRadius: 11,
                background: C.purple50, border: `1px solid ${C.purple100}`, textAlign: "center",
              }}>
                <p style={{ fontSize: 12, color: C.purple600, margin: 0, fontWeight: 600 }}>
                  💡 Use <span style={{ color: C.purple700, fontWeight: 800 }}>Demo Accounts</span> in the top bar to auto-fill
                </p>
              </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: 22, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                {[GraduationCap, Heart, Shield, Users, BookOpen].map((Icon, i) => (
                  <div key={i} style={{
                    width: 29, height: 29, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${C.purple100}, ${C.purple200})`,
                    border: `2.5px solid ${C.white}`, marginLeft: i > 0 ? -8 : 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 2px 8px ${C.purple500}18`,
                  }}>
                    <Icon style={{ width: 13, height: 13, color: C.purple600 }} />
                  </div>
                ))}
                <span style={{ marginLeft: 10, fontSize: 11.5, color: C.purple400, fontWeight: 600, alignSelf: "center" }}>
                  5 roles supported
                </span>
              </div>
              <p style={{ fontSize: 11, color: C.purple300, margin: 0, fontWeight: 500 }}>© 2026 Habib</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;