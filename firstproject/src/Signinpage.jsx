import { useState } from "react";
import {
  Brain, Mail, Lock, Eye, EyeOff, ArrowRight,
  ChevronDown, GraduationCap, Heart, Shield, Users,
  BookOpen, CheckCircle2, Sparkles
} from "lucide-react";
import { useAuth } from "./Authcontext";

const DEMO_ACCOUNTS = [
  { role: "Student",            email: "ub07100@st.habib.edu.pk",      password: "Student@123"    },
  { role: "Focus Peer",         email: "sarah.ahmed@st.habib.edu.pk",  password: "FocusPeer@123" },
  { role: "OAP Staff",          email: "fatima.khan@habib.edu.pk",     password: "OAP@123"        },
  { role: "Ehsas Counselor",    email: "sara.ali@habib.edu.pk",        password: "Ehsas@123"      },
  { role: "Wellness Counselor", email: "dr.zainab@habib.edu.pk",       password: "Wellness@123"   },
  { role: "Faculty",            email: "dr.ahmed@habib.edu.pk",        password: "Faculty@123"    },
];

const ROLE_INFO = [
  {
    label: "Student",
    icon: GraduationCap,
    color: "#7c5cbf",
    bg: "#ede7f6",
    features: ["AI Task Breakdown", "Focus Peer", "Super Calendar", "Weekly Progress"],
  },
  {
    label: "Focus Peer",
    icon: Heart,
    color: "#c2185b",
    bg: "#fce4ec",
    features: ["My Dashboard", "Community Forum", "Resources", "Events"],
  },
  {
    label: "OAP / Wellness",
    icon: Shield,
    color: "#00838f",
    bg: "#e0f7fa",
    features: ["Student Alerts", "Scheduling", "Focus Peer Monitor", "Reports"],
  },
  {
    label: "Faculty",
    icon: BookOpen,
    color: "#e65100",
    bg: "#fff3e0",
    features: ["My Courses", "Student List", "Files", "Events"],
  },
];

export function SignInPage() {
  const { signIn } = useAuth();
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState("");
  const [loading, setLoading]           = useState(false);
  const [showDemo, setShowDemo]         = useState(false);
  const [focusedField, setFocusedField] = useState(null);

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

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      display: "flex",
      flexDirection: "column",
      background: "linear-gradient(135deg, #f3e8ff 0%, #ede7f6 40%, #e8eaf6 100%)",
      fontFamily: "'Segoe UI', sans-serif",
      overflow: "hidden",
    }}>

      {/* ── Top bar ── */}
      <div style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(179,157,219,0.25)",
        padding: "14px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 13,
            background: "linear-gradient(135deg, #b39ddb, #9575cd)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px rgba(149,117,205,0.35)",
          }}>
            <Brain style={{ width: 22, height: 22, color: "#fff" }} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, color: "#4a3560", letterSpacing: "-0.3px" }}>NeuroZaviya</div>
            <div style={{ fontSize: 11, color: "#9575a3", fontWeight: 500 }}>Habib University</div>
          </div>
        </div>

        {/* Demo dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowDemo(!showDemo)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "9px 18px",
              background: showDemo ? "#ede7f6" : "rgba(243,229,245,0.7)",
              border: "1.5px solid rgba(179,157,219,0.35)",
              borderRadius: 50, cursor: "pointer",
              color: "#5a4a61", fontSize: 13, fontWeight: 600,
              transition: "all 0.2s",
            }}>
            <Sparkles style={{ width: 14, height: 14, color: "#b39ddb" }} />
            Demo Accounts
            <ChevronDown style={{
              width: 14, height: 14, color: "#9575a3",
              transform: showDemo ? "rotate(180deg)" : "none",
              transition: "transform 0.2s",
            }} />
          </button>

          {showDemo && (
            <div style={{
              position: "absolute", top: "calc(100% + 10px)", right: 0,
              width: 290, background: "#ffffff",
              borderRadius: 18, boxShadow: "0 12px 40px rgba(149,117,205,0.2)",
              border: "1px solid rgba(179,157,219,0.25)", zIndex: 100, overflow: "hidden",
            }}>
              <div style={{
                padding: "10px 16px",
                background: "linear-gradient(90deg, #f3e5f5, #ede7f6)",
                borderBottom: "1px solid rgba(179,157,219,0.2)",
                fontSize: 11, fontWeight: 700, color: "#9575a3", letterSpacing: "0.05em",
              }}>
                ⚡ CLICK TO AUTO-FILL
              </div>
              {DEMO_ACCOUNTS.map((acc, i) => (
                <button key={i} onClick={() => fillDemo(acc)}
                  style={{
                    width: "100%", textAlign: "left",
                    padding: "11px 16px", background: "transparent", border: "none",
                    borderBottom: i < DEMO_ACCOUNTS.length - 1 ? "1px solid rgba(179,157,219,0.1)" : "none",
                    cursor: "pointer", transition: "background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fdf7fd"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "#5a4a61" }}>{acc.role}</div>
                  <div style={{ fontSize: 11, color: "#9575a3", marginTop: 1 }}>{acc.email}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        minHeight: "calc(100vh - 70px)",
      }}>

        {/* ── LEFT PANEL ── */}
        <div style={{
          padding: "56px 64px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 32,
        }}>
          {/* Hero text */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(179,157,219,0.18)", borderRadius: 50,
              padding: "5px 14px", marginBottom: 16,
            }}>
              <Sparkles style={{ width: 13, height: 13, color: "#b39ddb" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#7c5cbf", letterSpacing: "0.04em" }}>
                Neurodivergent-Friendly Platform
              </span>
            </div>
            <h1 style={{
              fontSize: 46, fontWeight: 800, color: "#3d2b5a",
              lineHeight: 1.1, letterSpacing: "-1px", margin: 0,
            }}>
              Welcome to<br />
              <span style={{
                background: "linear-gradient(135deg, #b39ddb, #9575cd, #7c5cbf)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                NeuroZaviya
              </span>
            </h1>
            <p style={{ color: "#7a6a8a", marginTop: 14, fontSize: 15, lineHeight: 1.6, maxWidth: 460 }}>
              A supportive space built for neurodivergent students, Focus Peers, counselors, and faculty at Habib University.
            </p>
          </div>

          {/* Role cards grid */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#b39ddb", letterSpacing: "0.1em", marginBottom: 14 }}>
              WHAT YOU GET BY ROLE
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {ROLE_INFO.map(({ label, icon: Icon, color, bg, features }) => (
                <div key={label} style={{
                  background: "rgba(255,255,255,0.75)",
                  backdropFilter: "blur(8px)",
                  borderRadius: 18, padding: "16px 18px",
                  border: "1px solid rgba(255,255,255,0.9)",
                  boxShadow: "0 2px 12px rgba(149,117,205,0.08)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(149,117,205,0.15)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(149,117,205,0.08)"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 10,
                      background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <Icon style={{ width: 17, height: 17, color }} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 13, color: "#3d2b5a" }}>{label}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 6px" }}>
                    {features.map(f => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <CheckCircle2 style={{ width: 12, height: 12, color: "#b39ddb", flexShrink: 0 }} />
                        <span style={{ fontSize: 11, color: "#7a6a8a", fontWeight: 500 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL — sign in form ── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "56px 64px",
          background: "rgba(255,255,255,0.45)",
          backdropFilter: "blur(20px)",
          borderLeft: "1px solid rgba(255,255,255,0.6)",
        }}>
          <div style={{ width: "100%", maxWidth: 440 }}>

            {/* Form header */}
            <div style={{ marginBottom: 36 }}>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: "#3d2b5a", margin: 0, letterSpacing: "-0.5px" }}>
                Sign In
              </h2>
              <p style={{ fontSize: 14, color: "#9575a3", marginTop: 6, fontWeight: 500 }}>
                Continue your journey with NeuroZaviya
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Email */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4a3560", marginBottom: 8 }}>
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <Mail style={{
                    position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
                    width: 17, height: 17,
                    color: focusedField === "email" ? "#b39ddb" : "#b0a0bc",
                    transition: "color 0.2s",
                  }} />
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@habib.edu.pk" required
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      width: "100%", paddingLeft: 46, paddingRight: 16,
                      paddingTop: 14, paddingBottom: 14,
                      borderRadius: 16,
                      border: focusedField === "email" ? "2px solid #b39ddb" : "2px solid rgba(179,157,219,0.25)",
                      background: focusedField === "email" ? "#fdf7ff" : "rgba(255,255,255,0.8)",
                      color: "#3d2b5a", fontSize: 14, outline: "none",
                      boxSizing: "border-box", transition: "all 0.2s",
                      boxShadow: focusedField === "email" ? "0 0 0 4px rgba(179,157,219,0.12)" : "none",
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#4a3560", marginBottom: 8 }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <Lock style={{
                    position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
                    width: 17, height: 17,
                    color: focusedField === "password" ? "#b39ddb" : "#b0a0bc",
                    transition: "color 0.2s",
                  }} />
                  <input
                    type={showPassword ? "text" : "password"} value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password" required
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      width: "100%", paddingLeft: 46, paddingRight: 50,
                      paddingTop: 14, paddingBottom: 14,
                      borderRadius: 16,
                      border: focusedField === "password" ? "2px solid #b39ddb" : "2px solid rgba(179,157,219,0.25)",
                      background: focusedField === "password" ? "#fdf7ff" : "rgba(255,255,255,0.8)",
                      color: "#3d2b5a", fontSize: 14, outline: "none",
                      boxSizing: "border-box", transition: "all 0.2s",
                      boxShadow: focusedField === "password" ? "0 0 0 4px rgba(179,157,219,0.12)" : "none",
                    }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer", color: "#b0a0bc",
                      padding: 0, display: "flex",
                    }}>
                    {showPassword ? <EyeOff style={{ width: 17, height: 17 }} /> : <Eye style={{ width: 17, height: 17 }} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  padding: "12px 16px", borderRadius: 14,
                  background: "rgba(255,235,238,0.9)", color: "#c62828",
                  fontSize: 13, border: "1.5px solid rgba(229,115,115,0.3)",
                  fontWeight: 500,
                }}>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading}
                style={{
                  width: "100%", padding: "15px",
                  borderRadius: 16,
                  background: loading ? "#c9b8e8" : "linear-gradient(135deg, #b39ddb, #9575cd)",
                  color: "#ffffff", fontWeight: 700, fontSize: 15,
                  border: "none", cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: loading ? "none" : "0 6px 20px rgba(149,117,205,0.4)",
                  transition: "all 0.2s", letterSpacing: "0.01em",
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
              >
                {loading ? "Signing in…" : (<><span>Sign In</span><ArrowRight style={{ width: 17, height: 17 }} /></>)}
              </button>
            </form>

            {/* Hint */}
            <div style={{
              marginTop: 20, padding: "12px 16px", borderRadius: 14,
              background: "rgba(243,229,245,0.6)",
              border: "1px solid rgba(179,157,219,0.25)", textAlign: "center",
            }}>
              <p style={{ fontSize: 12, color: "#9575a3", margin: 0, fontWeight: 500 }}>
                💡 Use <strong style={{ color: "#7c5cbf" }}>Demo Accounts</strong> in the top bar to auto-fill any role
              </p>
            </div>

            {/* Footer */}
            <div style={{
              marginTop: 28, paddingTop: 20,
              borderTop: "1px solid rgba(179,157,219,0.2)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex" }}>
                {[GraduationCap, Heart, Shield, Users].map((Icon, i) => (
                  <div key={i} style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "linear-gradient(135deg, #e1bee7, #d1c4e9)",
                    border: "2.5px solid rgba(255,255,255,0.9)",
                    marginLeft: i > 0 ? -10 : 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(149,117,205,0.2)",
                  }}>
                    <Icon style={{ width: 14, height: 14, color: "#9575cd" }} />
                  </div>
                ))}
                <span style={{ marginLeft: 12, fontSize: 12, color: "#9575a3", fontWeight: 500, alignSelf: "center" }}>
                  6 roles supported
                </span>
              </div>
              <p style={{ fontSize: 11, color: "#b0a0bc", margin: 0 }}>© 2026 Habib University</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;