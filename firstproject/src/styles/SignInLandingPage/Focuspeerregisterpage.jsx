import { useState } from "react";
import {
  Brain, Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight,
  Sparkles, Users, Award, TrendingUp, CheckCircle, Heart, User,
} from "lucide-react";
import { useAuth } from "./AuthContext";

// ── Palette: matches FocusPeerManagement soft muted tones ─────────────────────
const C = {
  purple900: "#3d2f47",
  purple800: "#5a4a61",   // ← FPM primary text
  purple700: "#6e5878",
  purple600: "#9575a3",   // ← FPM secondary text / labels
  purple500: "#b39ddb",   // ← FPM accent purple
  purple400: "#c0b4cc",
  purple300: "#d8cfe0",
  purple200: "rgba(179,157,219,0.25)",
  purple100: "rgba(179,157,219,0.15)",
  purple50:  "rgba(179,157,219,0.08)",
  logoBg:    "linear-gradient(135deg, #b39ddb 0%, #c9a9e0 100%)",
  // Buttons: FPM's Send Invitation gradient
  btn:       "linear-gradient(90deg, #b39ddb 0%, #f8bbd0 100%)",
  btnHover:  "linear-gradient(90deg, #c5b0e8 0%, #f9c8da 100%)",
  btnShadow: "rgba(179,157,219,0.35)",
  btnShadowHover: "rgba(179,157,219,0.55)",
  backHoverBg: "rgba(179,157,219,0.1)",
  pink500:   "#c0608a",
  pink400:   "#f8bbd0",   // ← FPM soft pink
  pink100:   "rgba(248,187,208,0.2)",
  teal600:   "#6b9e9a",   // softened teal
  teal100:   "rgba(107,158,154,0.15)",
  amber600:  "#b8924a",   // muted amber
  amber100:  "rgba(184,146,74,0.15)",
  gray900:   "#3d2f47",
  gray700:   "#5a4a61",
  gray500:   "#9575a3",
  white:     "#FFFFFF",
  pageBg:    "#f5eef8",   // ← FPM page background
  red50:     "#FFF1F2",
  red700:    "#B91C1C",
  redBorder: "#FECACA",
};

const BENEFITS = [
  { icon: Users,       color: C.purple600, bg: C.purple100, title: "Make a Difference",  description: "Support fellow students in their academic journey and help them overcome challenges"          },
  { icon: Award,       color: C.pink500,   bg: C.pink100,   title: "Build Your Resume",  description: "Gain valuable mentoring and leadership experience for your professional development"          },
  { icon: TrendingUp,  color: C.teal600,   bg: C.teal100,   title: "Develop Skills",     description: "Enhance your communication, empathy, and problem-solving abilities"                          },
  { icon: CheckCircle, color: C.amber600,  bg: C.amber100,  title: "Flexible Schedule",  description: "Choose your availability and manage sessions that fit your calendar"                         },
];

const RESPONSIBILITIES = [
  "Conduct one-on-one support sessions with students",
  "Provide academic guidance and accountability",
  "Track student progress and set achievable goals",
  "Maintain confidentiality and professional boundaries",
  "Attend monthly training and feedback sessions",
  "Use the platform to schedule and document sessions",
];

export function FocusPeerRegisterPage({ onBack }) {
  const { registerFocusPeer } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", cgpa: "", reason: "", password: "", confirmPassword: "" });
  const [error, setError]               = useState("");
  const [loading, setLoading]           = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [btnHovered, setBtnHovered]     = useState(false);
  const [backHovered, setBackHovered]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const cgpaNum = parseFloat(formData.cgpa);
    if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 4.0) { setError("Please enter a valid CGPA between 0.0 and 4.0"); return; }
    if (!formData.reason.trim() || formData.reason.trim().length < 50) { setError("Please provide a detailed reason (at least 50 characters)"); return; }
    if (formData.password !== formData.confirmPassword) { setError("Passwords do not match"); return; }
    setLoading(true);
    const result = await registerFocusPeer({ name: formData.name, email: formData.email, cgpa: formData.cgpa, reason: formData.reason, password: formData.password });
    if (!result.success) { setError(result.error || "Registration failed"); setLoading(false); }
    else { alert("✅ Application submitted! Your request will be reviewed by Ehsas staff. You'll be notified once approved."); onBack(); }
  };

  const handleChange = (field, value) => { setFormData(prev => ({ ...prev, [field]: value })); setError(""); };

  const inp = (field, noIcon = false) => ({
    width: "100%", paddingTop: 13, paddingBottom: 13,
    paddingLeft: noIcon ? 16 : 44, paddingRight: noIcon ? 16 : 44,
    borderRadius: 12,
    border: `2px solid ${focusedField === field ? C.purple400 : C.purple200}`,
    background: focusedField === field ? C.white : "#FDFBFF",
    color: C.gray900, fontSize: 14, outline: "none",
    boxSizing: "border-box", transition: "all 0.18s", fontFamily: "inherit",
    boxShadow: focusedField === field ? `0 0 0 3px ${C.purple100}` : "none",
  });

  const iconCol = (field) => focusedField === field ? C.purple500 : C.purple300;

  return (
    <div style={{
      minHeight: "100vh", width: "100vw",
      display: "flex", flexDirection: "column",
      background: `linear-gradient(145deg, ${C.pageBg} 0%, #ede4f5 50%, #f5e8f2 100%)`,
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      {/* Ambient blobs + dot grid */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-10%", left: "-6%", width: 520, height: 520, background: `radial-gradient(circle, ${C.purple200}44 0%, transparent 70%)`, borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-8%", right: "-4%", width: 420, height: 420, background: `radial-gradient(circle, ${C.pink100}88 0%, transparent 70%)`, borderRadius: "50%" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${C.purple300}28 1.5px, transparent 1.5px)`, backgroundSize: "28px 28px" }} />
      </div>

      {/* ── Top bar ── */}
      <div style={{
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${C.purple200}`, padding: "13px 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 50,
        boxShadow: "0 1px 12px rgba(109,40,217,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: C.logoBg, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 14px ${C.purple500}40` }}>
            <Brain style={{ width: 22, height: 22, color: C.white }} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, color: C.purple800, letterSpacing: "-0.4px" }}>NeuroZaviya</div>
            <div style={{ fontSize: 10.5, color: C.purple400, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Habib University · 2026</div>
          </div>
        </div>

        {/* Back button with hover */}
        <button onClick={onBack}
          onMouseEnter={() => setBackHovered(true)}
          onMouseLeave={() => setBackHovered(false)}
          style={{
            display: "flex", alignItems: "center", gap: 8, padding: "9px 20px",
            background: backHovered ? C.purple100 : "rgba(255,255,255,0.9)",
            border: `1.5px solid ${backHovered ? C.purple300 : C.purple200}`,
            borderRadius: 50, cursor: "pointer",
            color: backHovered ? C.purple700 : C.purple600,
            fontSize: 13, fontWeight: 700,
            transition: "all 0.2s",
            boxShadow: backHovered ? `0 4px 14px ${C.purple500}20` : "0 2px 8px rgba(0,0,0,0.05)",
            transform: backHovered ? "translateY(-1px)" : "none",
          }}>
          <ArrowLeft style={{ width: 14, height: 14 }} />
          Back to Sign In
        </button>
      </div>

      {/* ── Full-page body: LEFT info | CENTER form | RIGHT responsibilities ── */}
      <div style={{
        flex: 1, position: "relative", zIndex: 1,
        display: "grid",
        gridTemplateColumns: "1fr 1.6fr 1fr",   // wider centre, equal side panels
        gap: 0,
        minHeight: "calc(100vh - 71px)",
      }}>

        {/* ══ LEFT PANEL ══ */}
        <div style={{
          padding: "48px 36px 48px 52px",
          display: "flex", flexDirection: "column", justifyContent: "center", gap: 32,
          borderRight: `1px solid ${C.purple100}`,
          background: "rgba(255,255,255,0.30)",
        }}>
          {/* Identity block */}
          <div>
            <div style={{ width: 62, height: 62, borderRadius: 20, background: C.logoBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, boxShadow: `0 6px 20px ${C.purple500}38` }}>
              <Heart style={{ width: 30, height: 30, color: C.white }} />
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: C.purple900, margin: "0 0 4px", letterSpacing: "-0.6px" }}>Focus Peer</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
              <Sparkles style={{ width: 13, height: 13, color: C.purple500 }} />
              <span style={{ fontSize: 13, color: C.purple500, fontWeight: 600 }}>Registration</span>
            </div>
            <p style={{ fontSize: 14.5, color: C.gray700, lineHeight: 1.7, margin: 0, maxWidth: 320 }}>
              Focus Peers provide one-on-one academic support and guidance to neurodivergent students at Habib University.
            </p>
          </div>

          {/* Why Join */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: C.purple400, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>Why Join?</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {BENEFITS.map(({ icon: Icon, color, bg, title, description }) => (
                <BenefitCard key={title} Icon={Icon} color={color} bg={bg} title={title} description={description} />
              ))}
            </div>
          </div>
        </div>

        {/* ══ CENTRE PANEL — Form ══ */}
        <div style={{
          padding: "48px 52px",
          display: "flex", flexDirection: "column", justifyContent: "center",
          overflowY: "auto",
        }}>
          <div style={{
            background: C.white, borderRadius: 28, padding: "44px 48px",
            boxShadow: "0 20px 60px rgba(109,40,217,0.10), 0 4px 16px rgba(0,0,0,0.04)",
            border: `1.5px solid ${C.purple100}`,
            width: "100%", boxSizing: "border-box",
          }}>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: C.purple900, margin: "0 0 6px", letterSpacing: "-0.5px" }}>Create Your Account</h2>
              <p style={{ fontSize: 14.5, color: C.gray500, margin: 0 }}>Fill in your details to get started as a Focus Peer</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Two-column row: Name + Email */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <div style={{ position: "relative" }}>
                    <User style={{ ...iconStyle, color: iconCol("name") }} />
                    <input type="text" value={formData.name} onChange={e => handleChange("name", e.target.value)}
                      placeholder="Your full name" required
                      onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField(null)}
                      style={inp("name")} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <div style={{ position: "relative" }}>
                    <Mail style={{ ...iconStyle, color: iconCol("email") }} />
                    <input type="email" value={formData.email} onChange={e => handleChange("email", e.target.value)}
                      placeholder="your.email@example.com" required
                      onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)}
                      style={inp("email")} />
                  </div>
                </div>
              </div>

              {/* CGPA — single narrow field */}
              <div style={{ maxWidth: 220 }}>
                <label style={labelStyle}>CGPA *</label>
                <input type="number" step="0.01" min="0" max="4.0"
                  value={formData.cgpa} onChange={e => handleChange("cgpa", e.target.value)}
                  placeholder="e.g., 3.50" required
                  onFocus={() => setFocusedField("cgpa")} onBlur={() => setFocusedField(null)}
                  style={{ ...inp("cgpa", true) }} />
                <p style={{ fontSize: 11, color: C.purple400, margin: "5px 0 0", fontWeight: 500 }}>Enter your current CGPA (0.0 – 4.0)</p>
              </div>

              {/* Reason — full width, taller */}
              <div>
                <label style={labelStyle}>Why should you be a Focus Peer? *</label>
                <textarea value={formData.reason} onChange={e => handleChange("reason", e.target.value)}
                  placeholder="Share your strengths and explain why you'd make a great Focus Peer (minimum 50 characters)"
                  required rows={5}
                  onFocus={() => setFocusedField("reason")} onBlur={() => setFocusedField(null)}
                  style={{ ...inp("reason", true), resize: "none", lineHeight: 1.65 }} />
                <p style={{ fontSize: 11, margin: "5px 0 0", fontWeight: 600, color: formData.reason.length >= 50 ? C.teal600 : C.purple400 }}>
                  {formData.reason.length}/50 characters minimum{formData.reason.length >= 50 && " ✓"}
                </p>
              </div>

              {/* Password row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                <div>
                  <label style={labelStyle}>Password *</label>
                  <div style={{ position: "relative" }}>
                    <Lock style={{ ...iconStyle, color: iconCol("password") }} />
                    <input type={showPassword ? "text" : "password"} value={formData.password}
                      onChange={e => handleChange("password", e.target.value)}
                      placeholder="Enter your password" required
                      onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField(null)}
                      style={inp("password")} />
                    <EyeToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Confirm Password *</label>
                  <div style={{ position: "relative" }}>
                    <Lock style={{ ...iconStyle, color: iconCol("confirmPassword") }} />
                    <input type={showPassword ? "text" : "password"} value={formData.confirmPassword}
                      onChange={e => handleChange("confirmPassword", e.target.value)}
                      placeholder="Confirm your password" required
                      onFocus={() => setFocusedField("confirmPassword")} onBlur={() => setFocusedField(null)}
                      style={inp("confirmPassword")} />
                    <EyeToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{ padding: "12px 16px", borderRadius: 12, background: C.red50, color: C.red700, fontSize: 13, border: `1.5px solid ${C.redBorder}`, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                  <span>⚠️</span> {error}
                </div>
              )}

              {/* Submit button with hover */}
              <button type="submit" disabled={loading}
                onMouseEnter={() => setBtnHovered(true)}
                onMouseLeave={() => setBtnHovered(false)}
                style={{
                  width: "100%", padding: "15px", borderRadius: 14,
                  background: loading ? C.purple300 : (btnHovered ? C.btnHover : C.btn),
                  color: C.white, fontWeight: 800, fontSize: 15,
                  border: "none", cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: loading ? "none" : (btnHovered ? `0 12px 32px ${C.btnShadowHover}` : `0 6px 20px ${C.btnShadow}`),
                  transition: "all 0.22s ease",
                  transform: (!loading && btnHovered) ? "translateY(-2px)" : "none",
                  letterSpacing: "0.02em", marginTop: 4,
                }}>
                {loading ? "Registering…" : (<><span>Register as Focus Peer</span><ArrowRight style={{ width: 18, height: 18 }} /></>)}
              </button>
            </form>
          </div>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div style={{
          padding: "48px 52px 48px 36px",
          display: "flex", flexDirection: "column", justifyContent: "center", gap: 20,
          borderLeft: `1px solid ${C.purple100}`,
          background: "rgba(255,255,255,0.30)",
        }}>
          {/* Responsibilities */}
          <div style={{
            background: C.white, borderRadius: 22, padding: "26px 26px",
            border: `1.5px solid ${C.purple100}`,
            boxShadow: "0 2px 12px rgba(109,40,217,0.06)",
            flex: 1,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <div style={{ width: 4, height: 20, borderRadius: 2, background: `linear-gradient(180deg, ${C.purple500}, ${C.purple300})` }} />
              <span style={{ fontSize: 13, fontWeight: 800, color: C.purple800 }}>Your Responsibilities</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {RESPONSIBILITIES.map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                    background: C.purple50, border: `1.5px solid ${C.purple200}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <CheckCircle style={{ width: 12, height: 12, color: C.purple600 }} />
                  </div>
                  <span style={{ fontSize: 13, color: C.gray700, lineHeight: 1.6, fontWeight: 500 }}>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Need Help */}
          <div style={{
            background: C.white, borderRadius: 20, padding: "20px 22px",
            border: `1.5px solid ${C.pink100}`,
            boxShadow: "0 2px 10px rgba(236,72,153,0.07)",
            display: "flex", alignItems: "flex-start", gap: 14,
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: C.pink100, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Heart style={{ width: 19, height: 19, color: C.pink500 }} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: C.purple800, marginBottom: 5 }}>Need Help?</div>
              <p style={{ fontSize: 12.5, color: C.gray500, margin: 0, lineHeight: 1.6 }}>
                Contact us at<br />
                <span style={{ color: C.purple600, fontWeight: 700 }}>focuspeer@habib.edu.pk</span>
              </p>
            </div>
          </div>

          <p style={{ fontSize: 11, color: C.purple300, textAlign: "center", margin: 0, fontWeight: 500 }}>© 2026 Habib University</p>
        </div>
      </div>
    </div>
  );
}

// ── Small reusable sub-components ─────────────────────────────────────────────
const labelStyle = {
  display: "block", fontSize: 12.5, fontWeight: 700,
  color: "#5a4a61", marginBottom: 7,
};

const iconStyle = {
  position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
  width: 16, height: 16, transition: "color 0.18s", pointerEvents: "none",
};

function EyeToggle({ show, onToggle }) {
  const [hov, setHov] = useState(false);
  return (
    <button type="button" onClick={onToggle}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
        background: "none", border: "none", cursor: "pointer",
        color: hov ? "#8B5CF6" : "#C4B5FD",
        padding: 4, display: "flex", borderRadius: 8, transition: "color 0.18s",
      }}>
      {show ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
    </button>
  );
}

function BenefitCard({ Icon, color, bg, title, description }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "flex-start", gap: 13,
        background: hov ? C.white : "rgba(255,255,255,0.82)",
        backdropFilter: "blur(8px)", borderRadius: 15, padding: "13px 15px",
        border: `1.5px solid ${hov ? color + "44" : "#EDE9FE"}`,
        boxShadow: hov ? `0 8px 20px ${color}18` : "0 1px 6px rgba(109,40,217,0.05)",
        transition: "all 0.2s ease", cursor: "default",
        transform: hov ? "translateY(-2px)" : "none",
      }}>
      <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon style={{ width: 18, height: 18, color }} />
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 13.5, color: "#5a4a61", marginBottom: 3 }}>{title}</div>
        <div style={{ fontSize: 12, color: "#9575a3", lineHeight: 1.55 }}>{description}</div>
      </div>
    </div>
  );
}

export default FocusPeerRegisterPage;