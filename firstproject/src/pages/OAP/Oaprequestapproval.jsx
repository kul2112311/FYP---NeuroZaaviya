import { useState, useEffect } from "react";
import {
  UserPlus, CheckCircle, XCircle, Clock, Mail, Send,
  X, RefreshCw, Filter, Search, Shield, GraduationCap,
  HeartHandshake, Stethoscope, ChevronDown,
} from "lucide-react";

// ── Palette matching FocusPeerManagement ──────────────────────────────────────
const C = {
  purple800: "#5a4a61",
  purple600: "#9575a3",
  purple500: "#b39ddb",
  purple400: "#c0b4cc",
  purple300: "#d8cfe0",
  purple200: "#e8e0f0",
  purple100: "rgba(179,157,219,0.15)",
  purple50:  "rgba(179,157,219,0.08)",
  pink:      "#f8bbd0",
  pinkText:  "#c0608a",
  teal:      "#6b9e9a",
  tealBg:    "rgba(107,158,154,0.1)",
  ehsas:     "#9b7fbd",
  ehsasBg:   "rgba(155,127,189,0.1)",
  green:     "#22c55e",
  greenBg:   "rgba(34,197,94,0.1)",
  red:       "#ef4444",
  redBg:     "rgba(239,68,68,0.06)",
  amber:     "#f59e0b",
  amberBg:   "rgba(245,158,11,0.1)",
  white:     "#FFFFFF",
  pageBg:    "#f5eef8",
  btnGrad:   "linear-gradient(90deg, #b39ddb 0%, #f8bbd0 100%)",
};

const ROLE_META = {
  student:  { label: "Student",            icon: GraduationCap, color: C.purple600,  bg: C.purple100    },
  oap:      { label: "OAP Staff",           icon: Shield,        color: C.teal,       bg: C.tealBg       },
  ehsas:    { label: "Ehsas Counselor",     icon: HeartHandshake,color: C.ehsas,      bg: C.ehsasBg      },
  wellness: { label: "Wellness Counselor",  icon: Stethoscope,   color: C.teal,       bg: C.tealBg       },
  focuspeer:{ label: "Focus Peer",          icon: UserPlus,      color: C.pinkText,   bg: "rgba(248,187,208,0.15)" },
};

// ── Email templates ────────────────────────────────────────────────────────────
function approvalEmailBody(name, role) {
  const roleLabel = ROLE_META[role]?.label || role;
  return `Dear ${name},

We are pleased to inform you that your account request for the NeuroZaviya platform has been approved.

Your Role: ${roleLabel}

You can now sign in at the NeuroZaviya platform using the email and password you provided during registration.

If you have any questions or need assistance, please contact us at oap@habib.edu.pk.

Warm regards,
Office of Academic Performance (OAP)
Habib University`;
}

function rejectionEmailBody(name, role) {
  const roleLabel = ROLE_META[role]?.label || role;
  return `Dear ${name},

Thank you for submitting a request to access the NeuroZaviya platform as ${roleLabel}.

After careful review, we regret to inform you that your request has not been approved at this time.

If you believe this is in error or would like to discuss further, please reach out to us at oap@habib.edu.pk.

Kind regards,
Office of Academic Performance (OAP)
Habib University`;
}

export function OAPRequestApproval() {
  const [requests, setRequests]     = useState([]);
  const [filter, setFilter]         = useState("pending"); // pending | approved | rejected | all
  const [searchQuery, setSearchQuery] = useState("");
  const [emailModal, setEmailModal] = useState(null); // { type, request }
  const [focusedSearch, setFocusedSearch] = useState(false);

  // ── Load from localStorage ─────────────────────────────────────────────────
  const loadRequests = () => {
    const all = JSON.parse(localStorage.getItem("accessRequests") || "[]");
    // Show only signup requests (not focuspeer applications, which Ehsas manages)
    setRequests(all.filter(r => r.source === "signup" || !r.source));
  };

  useEffect(() => { loadRequests(); }, []);

  // ── Approve / Reject ───────────────────────────────────────────────────────
  const commitApprove = (req) => {
    const all = JSON.parse(localStorage.getItem("accessRequests") || "[]");
    const updated = all.map(r => r.id === req.id
      ? { ...r, status: "approved", reviewedAt: new Date().toISOString() }
      : r
    );
    localStorage.setItem("accessRequests", JSON.stringify(updated));

    // Also create the user account so they can sign in
    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const alreadyExists = users.find(u => u.email === req.email);
    if (!alreadyExists) {
      users.push({ id: Date.now().toString(), name: req.name, email: req.email, password: req.password, role: req.role, createdAt: new Date().toISOString() });
      localStorage.setItem("registeredUsers", JSON.stringify(users));
    }

    loadRequests();
    setEmailModal(null);
  };

  const commitReject = (req) => {
    const all = JSON.parse(localStorage.getItem("accessRequests") || "[]");
    const updated = all.map(r => r.id === req.id
      ? { ...r, status: "rejected", reviewedAt: new Date().toISOString() }
      : r
    );
    localStorage.setItem("accessRequests", JSON.stringify(updated));
    loadRequests();
    setEmailModal(null);
  };

  // ── Derived data ───────────────────────────────────────────────────────────
  const counts = {
    pending:  requests.filter(r => r.status === "pending").length,
    approved: requests.filter(r => r.status === "approved").length,
    rejected: requests.filter(r => r.status === "rejected").length,
  };

  const filtered = requests
    .filter(r => filter === "all" ? true : r.status === filter)
    .filter(r => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return r.name?.toLowerCase().includes(q) || r.email?.toLowerCase().includes(q) || (ROLE_META[r.role]?.label || r.role).toLowerCase().includes(q);
    })
    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

  const statusBadge = (status) => {
    const map = {
      pending:  { bg: C.amberBg, color: C.amber, label: "Pending"  },
      approved: { bg: C.greenBg, color: C.green,  label: "Approved" },
      rejected: { bg: C.redBg,   color: C.red,    label: "Rejected" },
    };
    const s = map[status] || map.pending;
    return (
      <span style={{ fontSize: "clamp(0.62rem, 0.72vw, 0.76rem)", padding: "3px 10px", borderRadius: 999, background: s.bg, color: s.color, fontWeight: 700 }}>
        {s.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen" style={{ background: C.pageBg, padding: "2vw 2.5vw" }}>

      {/* ── Header ── */}
      <div className="rounded-3xl mb-5 flex items-center gap-5" style={{
        background: "linear-gradient(135deg, rgba(179,157,219,0.12) 0%, rgba(248,187,208,0.12) 100%)",
        border: "1px solid rgba(179,157,219,0.2)", padding: "2vw 2.5vw",
      }}>
        <UserPlus style={{ color: C.purple500, width: "2.5vw", height: "2.5vw", minWidth: 32, minHeight: 32 }} />
        <div style={{ flex: 1 }}>
          <h1 style={{ color: C.purple800, fontSize: "clamp(1.4rem, 2.2vw, 2.2rem)", fontWeight: 700, marginBottom: 4 }}>
            Request Approval
          </h1>
          <p style={{ color: C.purple600, fontSize: "clamp(0.8rem, 1vw, 1rem)", margin: 0 }}>
            Review and approve signup requests for all roles (Students, OAP Staff, Ehsas, Wellness Counselors)
          </p>
        </div>
        <button onClick={loadRequests} style={{ padding: "8px 18px", borderRadius: 999, background: C.purple100, border: `1px solid ${C.purple300}`, color: C.purple600, cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 7, transition: "all 0.18s" }}
          onMouseEnter={e => { e.currentTarget.style.background = C.purple200; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = C.purple100; e.currentTarget.style.transform = "none"; }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* ── Stats row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5vw", marginBottom: "1.5vw" }}>
        {[
          { label: "Pending Requests", count: counts.pending,  icon: Clock,       color: C.amber,  bg: C.amberBg,  id: "pending"  },
          { label: "Approved",         count: counts.approved, icon: CheckCircle, color: C.green,  bg: C.greenBg,  id: "approved" },
          { label: "Rejected",         count: counts.rejected, icon: XCircle,     color: C.red,    bg: C.redBg,    id: "rejected" },
        ].map(({ label, count, icon: Icon, color, bg, id }) => (
          <button key={id} onClick={() => setFilter(id)} style={{
            background: C.white, borderRadius: "1.25rem", padding: "1.5vw",
            border: `2px solid ${filter === id ? color + "55" : "rgba(179,157,219,0.2)"}`,
            boxShadow: filter === id ? `0 4px 18px ${color}22` : "none",
            cursor: "pointer", transition: "all 0.2s", textAlign: "left",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 6px 20px ${color}20`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = filter === id ? `0 4px 18px ${color}22` : "none"; }}>
            <div>
              <p style={{ color: C.purple600, fontSize: "clamp(0.75rem, 0.9vw, 0.9rem)", margin: "0 0 6px", fontWeight: 500 }}>{label}</p>
              <p style={{ color, fontSize: "clamp(1.8rem, 2.5vw, 2.6rem)", fontWeight: 800, margin: 0, lineHeight: 1 }}>{count}</p>
            </div>
            <div style={{ width: "3vw", height: "3vw", minWidth: 42, minHeight: 42, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={22} color={color} />
            </div>
          </button>
        ))}
      </div>

      {/* ── Filter bar ── */}
      <div style={{ background: C.white, borderRadius: "1.25rem", border: "1px solid rgba(179,157,219,0.2)", padding: "1vw 1.5vw", marginBottom: "1.5vw", display: "flex", alignItems: "center", gap: "1vw", flexWrap: "wrap" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: focusedSearch ? C.purple500 : C.purple400, transition: "color 0.18s" }} />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or role…"
            onFocus={() => setFocusedSearch(true)} onBlur={() => setFocusedSearch(false)}
            style={{ width: "100%", paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9, borderRadius: 10, border: `2px solid ${focusedSearch ? C.purple500 : C.purple200}`, outline: "none", fontSize: "0.85rem", color: C.purple800, fontFamily: "inherit", transition: "border-color 0.18s", boxSizing: "border-box" }} />
        </div>

        {/* Filter pills */}
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { id: "pending",  label: "Pending",  color: C.amber },
            { id: "approved", label: "Approved", color: C.green },
            { id: "rejected", label: "Rejected", color: C.red   },
            { id: "all",      label: "All",       color: C.purple500 },
          ].map(({ id, label, color }) => (
            <button key={id} onClick={() => setFilter(id)} style={{
              padding: "7px 16px", borderRadius: 999, border: "none", cursor: "pointer",
              background: filter === id ? color : C.purple50,
              color: filter === id ? C.white : C.purple600,
              fontSize: "0.8rem", fontWeight: 700, transition: "all 0.18s",
              boxShadow: filter === id ? `0 3px 10px ${color}40` : "none",
            }}
              onMouseEnter={e => { if (filter !== id) { e.currentTarget.style.background = C.purple100; } }}
              onMouseLeave={e => { if (filter !== id) { e.currentTarget.style.background = C.purple50; } }}>
              {label} {id !== "all" && `(${counts[id] ?? 0})`}
            </button>
          ))}
        </div>
      </div>

      {/* ── Requests list ── */}
      <div style={{ background: C.white, borderRadius: "1.5rem", border: "1px solid rgba(179,157,219,0.2)", overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5vw 0", color: C.purple600 }}>
            <UserPlus style={{ width: "4vw", height: "4vw", minWidth: 52, margin: "0 auto 14px", opacity: 0.2 }} />
            <p style={{ fontWeight: 600, fontSize: "1rem", marginBottom: 4 }}>
              {filter === "pending" ? "No Pending Requests" : `No ${filter.charAt(0).toUpperCase() + filter.slice(1)} Requests`}
            </p>
            <p style={{ fontSize: "0.85rem", color: C.purple400, margin: 0 }}>
              {filter === "pending" ? "All signup requests have been reviewed." : "Nothing to show here."}
            </p>
          </div>
        ) : (
          <div>
            {/* Table header */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1.5fr 1.2fr 1.4fr 1fr", gap: "1vw", padding: "1vw 1.5vw", background: C.purple50, borderBottom: "1px solid rgba(179,157,219,0.15)" }}>
              {["Applicant", "Email", "Role", "Requested", "Status", "Actions"].map(h => (
                <span key={h} style={{ fontSize: "0.72rem", fontWeight: 800, color: C.purple400, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</span>
              ))}
            </div>

            {/* Rows */}
            {filtered.map((req, i) => {
              const meta = ROLE_META[req.role] || ROLE_META.student;
              const RoleIcon = meta.icon;
              return (
                <div key={req.id} style={{
                  display: "grid", gridTemplateColumns: "2fr 2fr 1.5fr 1.2fr 1.4fr 1fr", gap: "1vw",
                  padding: "1.1vw 1.5vw", alignItems: "center",
                  borderBottom: i < filtered.length - 1 ? "1px solid rgba(179,157,219,0.1)" : "none",
                  background: i % 2 === 0 ? C.white : "rgba(179,157,219,0.03)",
                  transition: "background 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = C.purple50}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? C.white : "rgba(179,157,219,0.03)"}>

                  {/* Name */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg, ${C.purple500}33, ${C.pink}55)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: C.purple800 }}>
                        {req.name?.charAt(0)?.toUpperCase() || "?"}
                      </span>
                    </div>
                    <span style={{ fontWeight: 600, color: C.purple800, fontSize: "clamp(0.8rem, 0.9vw, 0.92rem)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{req.name || "—"}</span>
                  </div>

                  {/* Email */}
                  <span style={{ color: C.purple600, fontSize: "clamp(0.75rem, 0.82vw, 0.86rem)", wordBreak: "break-all", overflowWrap: "anywhere" }}>{req.email}</span>

                  {/* Role */}
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 8, background: meta.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <RoleIcon size={13} color={meta.color} />
                    </div>
                    <span style={{ fontSize: "clamp(0.72rem, 0.8vw, 0.84rem)", color: meta.color, fontWeight: 600 }}>{meta.label}</span>
                  </div>

                  {/* Date */}
                  <span style={{ color: C.purple400, fontSize: "clamp(0.7rem, 0.78vw, 0.82rem)" }}>
                    {new Date(req.appliedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>

                  {/* Status */}
                  {statusBadge(req.status)}

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 6 }}>
                    {req.status === "pending" ? (
                      <>
                        <button onClick={() => setEmailModal({ type: "approve", request: req })} style={{
                          padding: "5px 12px", borderRadius: 8, background: C.greenBg, border: `1px solid ${C.green}44`,
                          color: C.green, fontWeight: 700, fontSize: "0.75rem", cursor: "pointer", transition: "all 0.18s",
                        }}
                          onMouseEnter={e => { e.currentTarget.style.background = C.green; e.currentTarget.style.color = C.white; e.currentTarget.style.transform = "translateY(-1px)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = C.greenBg; e.currentTarget.style.color = C.green; e.currentTarget.style.transform = "none"; }}>
                          Approve
                        </button>
                        <button onClick={() => setEmailModal({ type: "reject", request: req })} style={{
                          padding: "5px 12px", borderRadius: 8, background: C.redBg, border: `1px solid ${C.red}33`,
                          color: C.red, fontWeight: 700, fontSize: "0.75rem", cursor: "pointer", transition: "all 0.18s",
                        }}
                          onMouseEnter={e => { e.currentTarget.style.background = C.red; e.currentTarget.style.color = C.white; e.currentTarget.style.transform = "translateY(-1px)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = C.redBg; e.currentTarget.style.color = C.red; e.currentTarget.style.transform = "none"; }}>
                          Reject
                        </button>
                      </>
                    ) : (
                      <span style={{ fontSize: "0.75rem", color: C.purple400, fontStyle: "italic" }}>
                        {req.reviewedAt ? new Date(req.reviewedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) : "Reviewed"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Email Preview Modal ── */}
      {emailModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 24 }}>
          <div style={{ background: C.white, borderRadius: 24, boxShadow: "0 24px 60px rgba(0,0,0,0.15)", width: "100%", maxWidth: 540, overflow: "hidden" }}>

            {/* Modal header */}
            <div style={{ padding: "20px 28px 16px", borderBottom: "1px solid rgba(179,157,219,0.15)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: emailModal.type === "approve" ? C.greenBg : C.redBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Mail size={18} color={emailModal.type === "approve" ? C.green : C.red} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: C.purple800, margin: 0, fontSize: "0.95rem" }}>
                    {emailModal.type === "approve" ? "Approval Email Preview" : "Rejection Email Preview"}
                  </p>
                  <p style={{ color: C.purple600, margin: 0, fontSize: "0.78rem" }}>Review before sending to {emailModal.request.email}</p>
                </div>
              </div>
              <button onClick={() => setEmailModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: C.purple400, padding: 4 }}
                onMouseEnter={e => e.currentTarget.style.color = C.purple800}
                onMouseLeave={e => e.currentTarget.style.color = C.purple400}>
                <X size={20} />
              </button>
            </div>

            {/* To / From */}
            <div style={{ padding: "16px 28px 0" }}>
              <div style={{ background: C.purple50, borderRadius: 12, padding: "11px 15px", fontSize: "0.82rem", display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ color: C.purple400, minWidth: 36 }}>To:</span>
                  <span style={{ color: C.purple800, fontWeight: 600 }}>{emailModal.request.email}</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ color: C.purple400, minWidth: 36 }}>From:</span>
                  <span style={{ color: C.purple800, fontWeight: 600 }}>oap@habib.edu.pk</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ color: C.purple400, minWidth: 36 }}>Sub:</span>
                  <span style={{ color: C.purple800, fontWeight: 600 }}>
                    {emailModal.type === "approve" ? "NeuroZaviya Account Approved" : "NeuroZaviya Account Request — Update"}
                  </span>
                </div>
              </div>
            </div>

            {/* Email body */}
            <div style={{ padding: "14px 28px 20px" }}>
              <div style={{ border: "1px solid rgba(179,157,219,0.2)", borderRadius: 12, padding: "16px 20px", fontSize: "0.85rem", color: C.purple800, lineHeight: 1.75, background: "#fdfbff", whiteSpace: "pre-line" }}>
                {emailModal.type === "approve"
                  ? approvalEmailBody(emailModal.request.name || emailModal.request.email, emailModal.request.role)
                  : rejectionEmailBody(emailModal.request.name || emailModal.request.email, emailModal.request.role)
                }
              </div>
            </div>

            {/* Actions */}
            <div style={{ padding: "0 28px 24px", display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setEmailModal(null)} style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid rgba(179,157,219,0.3)", background: C.white, color: C.purple600, cursor: "pointer", fontWeight: 500, fontSize: "0.85rem", transition: "all 0.18s" }}
                onMouseEnter={e => { e.currentTarget.style.background = C.purple50; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.white; }}>
                Cancel
              </button>
              <button onClick={() => emailModal.type === "approve" ? commitApprove(emailModal.request) : commitReject(emailModal.request)}
                style={{ padding: "10px 22px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", color: C.white, display: "flex", alignItems: "center", gap: 7, transition: "all 0.18s",
                  background: emailModal.type === "approve" ? C.green : C.red,
                  boxShadow: emailModal.type === "approve" ? "0 4px 14px rgba(34,197,94,0.3)" : "0 4px 14px rgba(239,68,68,0.25)",
                }}
                onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.filter = "brightness(1)"; e.currentTarget.style.transform = "none"; }}>
                <Send size={15} />
                Send Email &amp; {emailModal.type === "approve" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OAPRequestApproval;