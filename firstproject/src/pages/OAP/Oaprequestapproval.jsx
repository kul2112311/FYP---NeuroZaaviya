import { useState, useEffect } from "react";
import {
  UserPlus, CheckCircle, XCircle, Clock, Mail, Send,
  X, RefreshCw, Search, Shield, GraduationCap,
  HeartHandshake, Stethoscope,
} from "lucide-react";

// ── Palette ───────────────────────────────────────────────────────────────────
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
};

const ROLE_META = {
  student:   { label: "Student",           icon: GraduationCap,  color: "#9575a3", bg: "rgba(179,157,219,0.15)" },
  oap:       { label: "OAP Staff",          icon: Shield,         color: "#6b9e9a", bg: "rgba(107,158,154,0.1)"  },
  ehsas:     { label: "Ehsas Counselor",    icon: HeartHandshake, color: "#9b7fbd", bg: "rgba(155,127,189,0.1)"  },
  wellness:  { label: "Wellness Counselor", icon: Stethoscope,    color: "#6b9e9a", bg: "rgba(107,158,154,0.1)"  },
  focuspeer: { label: "Focus Peer",         icon: UserPlus,       color: "#c0608a", bg: "rgba(248,187,208,0.15)" },
};

function approvalEmailBody(name, role) {
  const roleLabel = ROLE_META[role]?.label || role;
  return `Dear ${name},\n\nWe are pleased to inform you that your account request for the NeuroZaviya platform has been approved.\n\nYour Role: ${roleLabel}\n\nYou can now sign in at the NeuroZaviya platform using the email and password you provided during registration.\n\nIf you have any questions or need assistance, please contact us at oap@habib.edu.pk.\n\nWarm regards,\nOffice of Academic Performance (OAP)\nHabib University`;
}

function rejectionEmailBody(name, role) {
  const roleLabel = ROLE_META[role]?.label || role;
  return `Dear ${name},\n\nThank you for submitting a request to access the NeuroZaviya platform as ${roleLabel}.\n\nAfter careful review, we regret to inform you that your request has not been approved at this time.\n\nIf you believe this is in error or would like to discuss further, please reach out to us at oap@habib.edu.pk.\n\nKind regards,\nOffice of Academic Performance (OAP)\nHabib University`;
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ActionBtn({ label, color, bg, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: "6px 16px", borderRadius: 9,
        background: hov ? color : bg,
        border: `1px solid ${color}55`,
        color: hov ? "#fff" : color,
        fontWeight: 700, fontSize: 13, cursor: "pointer",
        transition: "all 0.18s",
        transform: hov ? "translateY(-1px)" : "none",
        boxShadow: hov ? `0 4px 10px ${color}44` : "none",
        whiteSpace: "nowrap",
      }}>
      {label}
    </button>
  );
}

function FilterPill({ id, label, color, active, count, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: "10px 24px", borderRadius: 999, border: "none", cursor: "pointer",
        background: active ? color : hov ? C.purple200 : C.purple100,
        color: active ? "#fff" : C.purple600,
        fontSize: 13, fontWeight: 700, transition: "all 0.18s",
        boxShadow: active ? `0 4px 12px ${color}44` : "none",
        transform: hov && !active ? "translateY(-1px)" : "none",
        whiteSpace: "nowrap",
      }}>
      {label}{id !== "all" && ` (${count ?? 0})`}
    </button>
  );
}

function StatCard({ label, count, icon: Icon, color, bg, active, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: C.white, borderRadius: 20, padding: "32px 36px",
        border: `2px solid ${active ? color + "66" : "rgba(179,157,219,0.2)"}`,
        boxShadow: active ? `0 6px 24px ${color}22` : hov ? `0 8px 24px ${color}18` : "0 2px 8px rgba(0,0,0,0.04)",
        cursor: "pointer", transition: "all 0.2s", textAlign: "left",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        transform: hov && !active ? "translateY(-2px)" : "none",
        width: "100%", boxSizing: "border-box",
      }}>
      <div>
        <p style={{ color: C.purple600, fontSize: 15, margin: "0 0 12px", fontWeight: 500 }}>{label}</p>
        <p style={{ color, fontSize: 52, fontWeight: 900, margin: 0, lineHeight: 1, letterSpacing: "-1.5px" }}>{count}</p>
      </div>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={28} color={color} />
      </div>
    </button>
  );
}

function RequestRow({ req, i, meta, RoleIcon, statusBadge, onApprove, onReject, isLast }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 2.5fr 1.6fr 1.2fr 1.2fr 1.5fr",
        gap: 16, padding: "20px 32px", alignItems: "center",
        borderBottom: !isLast ? "1px solid rgba(179,157,219,0.1)" : "none",
        background: hov ? "rgba(179,157,219,0.07)" : i % 2 === 0 ? C.white : "rgba(179,157,219,0.03)",
        transition: "background 0.15s",
      }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, rgba(179,157,219,0.3), rgba(248,187,208,0.4))", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: C.purple800 }}>{req.name?.charAt(0)?.toUpperCase() || "?"}</span>
        </div>
        <span style={{ fontWeight: 600, color: C.purple800, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{req.name || "—"}</span>
      </div>
      <span style={{ color: C.purple600, fontSize: 13.5, wordBreak: "break-all" }}>{req.email}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, background: meta.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <RoleIcon size={15} color={meta.color} />
        </div>
        <span style={{ fontSize: 13, color: meta.color, fontWeight: 600 }}>{meta.label}</span>
      </div>
      <span style={{ color: C.purple400, fontSize: 13 }}>
        {new Date(req.appliedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
      </span>
      {statusBadge(req.status)}
      <div style={{ display: "flex", gap: 8 }}>
        {req.status === "pending" ? (
          <>
            <ActionBtn label="Approve" color={C.green} bg={C.greenBg} onClick={onApprove} />
            <ActionBtn label="Reject"  color={C.red}   bg={C.redBg}   onClick={onReject}  />
          </>
        ) : (
          <span style={{ fontSize: 12, color: C.purple400, fontStyle: "italic" }}>
            {req.reviewedAt ? new Date(req.reviewedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) : "Reviewed"}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function OAPRequestApproval() {
  const [requests, setRequests]           = useState([]);
  const [filter, setFilter]               = useState("pending");
  const [searchQuery, setSearchQuery]     = useState("");
  const [emailModal, setEmailModal]       = useState(null);
  const [focusedSearch, setFocusedSearch] = useState(false);
  const [refreshHov, setRefreshHov]       = useState(false);

  const loadRequests = () => {
    const all = JSON.parse(localStorage.getItem("accessRequests") || "[]");
    setRequests(all.filter(r => r.source === "signup" || !r.source));
  };
  useEffect(() => { loadRequests(); }, []);

  const commitApprove = (req) => {
    const all = JSON.parse(localStorage.getItem("accessRequests") || "[]");
    const updated = all.map(r => r.id === req.id ? { ...r, status: "approved", reviewedAt: new Date().toISOString() } : r);
    localStorage.setItem("accessRequests", JSON.stringify(updated));
    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    if (!users.find(u => u.email === req.email)) {
      users.push({ id: Date.now().toString(), name: req.name, email: req.email, password: req.password, role: req.role, createdAt: new Date().toISOString() });
      localStorage.setItem("registeredUsers", JSON.stringify(users));
    }
    loadRequests(); setEmailModal(null);
  };

  const commitReject = (req) => {
    const all = JSON.parse(localStorage.getItem("accessRequests") || "[]");
    const updated = all.map(r => r.id === req.id ? { ...r, status: "rejected", reviewedAt: new Date().toISOString() } : r);
    localStorage.setItem("accessRequests", JSON.stringify(updated));
    loadRequests(); setEmailModal(null);
  };

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
      <span style={{ fontSize: 12.5, padding: "5px 14px", borderRadius: 999, background: s.bg, color: s.color, fontWeight: 700, whiteSpace: "nowrap", display: "inline-block" }}>
        {s.label}
      </span>
    );
  };

  return (
    /*
     * ── LAYOUT FIX ──────────────────────────────────────────────────────────
     * App.jsx wraps <main> with `flex-1 flex justify-center` which collapses
     * the child width. We escape that by using:
     *   position: absolute, inset: 0, left: <sidebar-width>
     * The sidebar is 240px wide (standard NavBar width in this project).
     * This makes the component fill exactly the space to the right of the sidebar.
     */
    <div style={{
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 240,    /* matches NavBar width — adjust if your sidebar is different */
      right: 0,
      overflowY: "auto",
      background: C.pageBg,
      padding: "36px 44px",
      boxSizing: "border-box",
      fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
    }}>

      {/* ── Header ── */}
      <div style={{
        background: "linear-gradient(135deg, rgba(179,157,219,0.14) 0%, rgba(248,187,208,0.14) 100%)",
        border: "1px solid rgba(179,157,219,0.22)",
        borderRadius: 24, padding: "28px 36px",
        display: "flex", alignItems: "center", gap: 20,
        marginBottom: 28,
      }}>
        <div style={{ width: 58, height: 58, borderRadius: 17, flexShrink: 0, background: "rgba(179,157,219,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <UserPlus style={{ color: C.purple500, width: 28, height: 28 }} />
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ color: C.purple800, fontSize: 26, fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.4px" }}>
            Request Approval
          </h1>
          <p style={{ color: C.purple600, fontSize: 14, margin: 0, lineHeight: 1.5 }}>
            Review and approve signup requests for all roles (Students, OAP Staff, Ehsas, Wellness Counselors)
          </p>
        </div>
        <button onClick={loadRequests}
          onMouseEnter={() => setRefreshHov(true)} onMouseLeave={() => setRefreshHov(false)}
          style={{
            padding: "11px 22px", borderRadius: 999, flexShrink: 0,
            background: refreshHov ? "rgba(179,157,219,0.28)" : "rgba(179,157,219,0.15)",
            border: "1px solid rgba(179,157,219,0.32)",
            color: C.purple600, cursor: "pointer", fontWeight: 700, fontSize: 13.5,
            display: "flex", alignItems: "center", gap: 8,
            transition: "all 0.18s",
            transform: refreshHov ? "translateY(-1px)" : "none",
          }}>
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* ── Stats — 3 equal columns ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 24 }}>
        <StatCard label="Pending Requests" count={counts.pending}  icon={Clock}       color={C.amber} bg={C.amberBg} active={filter === "pending"}  onClick={() => setFilter("pending")}  />
        <StatCard label="Approved"         count={counts.approved} icon={CheckCircle} color={C.green} bg={C.greenBg} active={filter === "approved"} onClick={() => setFilter("approved")} />
        <StatCard label="Rejected"         count={counts.rejected} icon={XCircle}     color={C.red}   bg={C.redBg}   active={filter === "rejected"} onClick={() => setFilter("rejected")} />
      </div>

      {/* ── Filter bar ── */}
      <div style={{
        background: C.white, borderRadius: 18,
        border: "1px solid rgba(179,157,219,0.2)",
        padding: "18px 28px", marginBottom: 20,
        display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
        boxShadow: "0 2px 10px rgba(90,74,97,0.04)",
      }}>
        <div style={{ position: "relative", flex: "1 1 260px" }}>
          <Search style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, pointerEvents: "none", color: focusedSearch ? C.purple500 : C.purple400, transition: "color 0.18s" }} />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or role…"
            onFocus={() => setFocusedSearch(true)} onBlur={() => setFocusedSearch(false)}
            style={{ width: "100%", paddingLeft: 44, paddingRight: 16, paddingTop: 12, paddingBottom: 12, borderRadius: 12, border: `2px solid ${focusedSearch ? C.purple500 : C.purple200}`, outline: "none", fontSize: 14, color: C.purple800, fontFamily: "inherit", transition: "all 0.18s", boxSizing: "border-box", boxShadow: focusedSearch ? "0 0 0 3px rgba(179,157,219,0.15)" : "none" }} />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { id: "pending",  label: "Pending",  color: C.amber    },
            { id: "approved", label: "Approved", color: C.green    },
            { id: "rejected", label: "Rejected", color: C.red      },
            { id: "all",      label: "All",      color: C.purple500 },
          ].map(({ id, label, color }) => (
            <FilterPill key={id} id={id} label={label} color={color} active={filter === id} count={counts[id]} onClick={() => setFilter(id)} />
          ))}
        </div>
      </div>

      {/* ── Requests table ── */}
      <div style={{ background: C.white, borderRadius: 20, border: "1px solid rgba(179,157,219,0.2)", overflow: "hidden", boxShadow: "0 2px 12px rgba(90,74,97,0.06)" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "90px 0", color: C.purple600 }}>
            <UserPlus style={{ width: 60, height: 60, margin: "0 auto 20px", opacity: 0.15, display: "block" }} />
            <p style={{ fontWeight: 700, fontSize: 17, marginBottom: 8, color: C.purple800 }}>
              {filter === "pending" ? "No Pending Requests" : `No ${filter.charAt(0).toUpperCase() + filter.slice(1)} Requests`}
            </p>
            <p style={{ fontSize: 14, color: C.purple400, margin: 0 }}>
              {filter === "pending" ? "All signup requests have been reviewed." : "Nothing to show here."}
            </p>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 2.5fr 1.6fr 1.2fr 1.2fr 1.5fr", gap: 16, padding: "16px 32px", background: "rgba(179,157,219,0.08)", borderBottom: "1px solid rgba(179,157,219,0.15)" }}>
              {["Applicant", "Email", "Role", "Requested", "Status", "Actions"].map(h => (
                <span key={h} style={{ fontSize: 11, fontWeight: 800, color: C.purple400, textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</span>
              ))}
            </div>
            {filtered.map((req, i) => {
              const meta = ROLE_META[req.role] || ROLE_META.student;
              return (
                <RequestRow key={req.id} req={req} i={i} meta={meta} RoleIcon={meta.icon}
                  statusBadge={statusBadge} isLast={i === filtered.length - 1}
                  onApprove={() => setEmailModal({ type: "approve", request: req })}
                  onReject={()  => setEmailModal({ type: "reject",  request: req })}
                />
              );
            })}
          </>
        )}
      </div>

      {emailModal && (
        <EmailModal
          emailModal={emailModal}
          onClose={() => setEmailModal(null)}
          onConfirm={() => emailModal.type === "approve" ? commitApprove(emailModal.request) : commitReject(emailModal.request)}
        />
      )}
    </div>
  );
}

// ── Email modal ────────────────────────────────────────────────────────────────
function EmailModal({ emailModal, onClose, onConfirm }) {
  const [cancelHov, setCancelHov]   = useState(false);
  const [confirmHov, setConfirmHov] = useState(false);
  const [closeHov, setCloseHov]     = useState(false);
  const isApprove    = emailModal.type === "approve";
  const actionColor  = isApprove ? C.green : C.red;
  const actionShadow = isApprove ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.25)";

  // ── Editable email body ──────────────────────────────────────────────────────
  const defaultBody = isApprove
    ? approvalEmailBody(emailModal.request.name || emailModal.request.email, emailModal.request.role)
    : rejectionEmailBody(emailModal.request.name || emailModal.request.email, emailModal.request.role);
  const [emailBody, setEmailBody] = useState(defaultBody);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 24 }}>
      <div style={{ background: C.white, borderRadius: 24, boxShadow: "0 24px 60px rgba(0,0,0,0.15)", width: "100%", maxWidth: 560, overflow: "hidden" }}>
        <div style={{ padding: "22px 30px 18px", borderBottom: "1px solid rgba(179,157,219,0.15)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: isApprove ? C.greenBg : C.redBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Mail size={20} color={actionColor} />
            </div>
            <div>
              <p style={{ fontWeight: 700, color: C.purple800, margin: 0, fontSize: 15 }}>
                {isApprove ? "Approval Email Preview" : "Rejection Email Preview"}
              </p>
              <p style={{ color: C.purple600, margin: 0, fontSize: 12.5 }}>Review before sending to {emailModal.request.email}</p>
            </div>
          </div>
          <button onClick={onClose}
            onMouseEnter={() => setCloseHov(true)} onMouseLeave={() => setCloseHov(false)}
            style={{ background: closeHov ? "rgba(179,157,219,0.15)" : "none", border: "none", cursor: "pointer", color: closeHov ? C.purple800 : C.purple400, padding: 6, borderRadius: 8, transition: "all 0.18s", display: "flex" }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: "18px 30px 0" }}>
          <div style={{ background: C.purple50, borderRadius: 12, padding: "12px 16px", fontSize: 13, display: "flex", flexDirection: "column", gap: 5 }}>
            {[["To", emailModal.request.email], ["From", "oap@habib.edu.pk"], ["Sub", isApprove ? "NeuroZaviya Account Approved" : "NeuroZaviya Account Request — Update"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 10 }}>
                <span style={{ color: C.purple400, minWidth: 38, fontWeight: 600 }}>{k}:</span>
                <span style={{ color: C.purple800, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "16px 30px 20px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.purple400, letterSpacing: "0.07em", textTransform: "uppercase", margin: "0 0 8px" }}>
            Email Body <span style={{ fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>— editable before sending</span>
          </p>
          <textarea
            value={emailBody}
            onChange={e => setEmailBody(e.target.value)}
            rows={12}
            style={{
              width: "100%", boxSizing: "border-box",
              border: "1.5px solid rgba(179,157,219,0.3)",
              borderRadius: 12, padding: "16px 18px",
              fontSize: 13.5, color: C.purple800, lineHeight: 1.8,
              background: "#fdfbff", fontFamily: "inherit",
              resize: "vertical", outline: "none",
              transition: "border-color 0.18s",
            }}
            onFocus={e => e.target.style.borderColor = C.purple500}
            onBlur={e  => e.target.style.borderColor = "rgba(179,157,219,0.3)"}
          />
        </div>
        <div style={{ padding: "0 30px 26px", display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose}
            onMouseEnter={() => setCancelHov(true)} onMouseLeave={() => setCancelHov(false)}
            style={{ padding: "11px 22px", borderRadius: 11, border: "1px solid rgba(179,157,219,0.3)", background: cancelHov ? "rgba(179,157,219,0.12)" : C.white, color: C.purple600, cursor: "pointer", fontWeight: 600, fontSize: 14, transition: "all 0.18s" }}>
            Cancel
          </button>
          <button onClick={onConfirm}
            onMouseEnter={() => setConfirmHov(true)} onMouseLeave={() => setConfirmHov(false)}
            style={{ padding: "11px 24px", borderRadius: 11, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14, color: "#fff", background: actionColor, display: "flex", alignItems: "center", gap: 8, boxShadow: confirmHov ? `0 8px 20px ${actionShadow}` : `0 4px 14px ${actionShadow}`, transform: confirmHov ? "translateY(-1px)" : "none", filter: confirmHov ? "brightness(1.08)" : "brightness(1)", transition: "all 0.18s" }}>
            <Send size={15} />
            Send Email &amp; {isApprove ? "Approve" : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OAPRequestApproval;