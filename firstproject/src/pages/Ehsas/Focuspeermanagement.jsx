import { useState } from "react";
import { UserPlus, Mail, Users, Trash2, CheckCircle, X, Send } from "lucide-react";

export function FocusPeerManagement() {
  const [focusPeers, setFocusPeers] = useState(() => {
    const saved = localStorage.getItem("focusPeers");
    return saved ? JSON.parse(saved) : [];
  });

  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem("accessRequests");
    const allRequests = saved ? JSON.parse(saved) : [];
    return allRequests.filter((req) => req.role === "focuspeer");
  });

  const [newPeerEmail, setNewPeerEmail] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ── Email preview modal state ─────────────────────────────────────────────
  const [emailModal, setEmailModal] = useState(null); // { type: 'approve'|'reject', app }
  // ─────────────────────────────────────────────────────────────────────────

  const ndStudents = [
    { id: "1", name: "Sarah Ahmed",  email: "sarah.ahmed@university.edu"  },
    { id: "2", name: "Ali Hassan",   email: "ali.hassan@university.edu"   },
    { id: "3", name: "Fatima Khan",  email: "fatima.khan@university.edu"  },
    { id: "4", name: "Omar Ibrahim", email: "omar.ibrahim@university.edu" },
    { id: "5", name: "Zainab Malik", email: "zainab.malik@university.edu" },
    { id: "6", name: "Hassan Ali",   email: "hassan.ali@university.edu"   },
  ];

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  const handleAddFocusPeer = () => {
    if (!newPeerEmail.trim())        { setErrorMessage("Please enter an email address");                    setShowErrorModal(true); return; }
    if (!newPeerEmail.includes("@")) { setErrorMessage("Please enter a valid email address");               setShowErrorModal(true); return; }
    if (selectedStudents.length === 0){ setErrorMessage("Please select at least one student to assign");   setShowErrorModal(true); return; }

    const newPeer = { id: Date.now().toString(), email: newPeerEmail, assignedStudents: selectedStudents, status: "pending" };
    const updatedPeers = [...focusPeers, newPeer];
    setFocusPeers(updatedPeers);
    localStorage.setItem("focusPeers", JSON.stringify(updatedPeers));
    setNewPeerEmail("");
    setSelectedStudents([]);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleDeletePeer = (peerId) => {
    if (window.confirm("Are you sure you want to remove this Focus Peer invitation?")) {
      const updatedPeers = focusPeers.filter((peer) => peer.id !== peerId);
      setFocusPeers(updatedPeers);
      localStorage.setItem("focusPeers", JSON.stringify(updatedPeers));
    }
  };

  // ── Show email preview, then on "Send Email" actually commit the action ───
  const handleApproveClick  = (app) => setEmailModal({ type: "approve", app });
  const handleRejectClick   = (app) => setEmailModal({ type: "reject",  app });

  const commitApprove = (application) => {
    const updatedRequests = requests.map((req) =>
      req.id === application.id ? { ...req, status: "approved" } : req
    );
    setRequests(updatedRequests);

    const allRequests = localStorage.getItem("accessRequests");
    if (allRequests) {
      const updated = JSON.parse(allRequests).map((req) =>
        req.id === application.id ? { ...req, status: "approved" } : req
      );
      localStorage.setItem("accessRequests", JSON.stringify(updated));
    }

    const existingIdx = focusPeers.findIndex((p) => p.email === application.email);
    let updatedPeers = [...focusPeers];
    if (existingIdx >= 0) {
      updatedPeers[existingIdx] = { ...updatedPeers[existingIdx], status: "registered", registeredAt: new Date().toISOString() };
    } else {
      updatedPeers.push({ id: Date.now().toString(), email: application.email, assignedStudents: [], status: "registered", registeredAt: new Date().toISOString() });
    }
    setFocusPeers(updatedPeers);
    localStorage.setItem("focusPeers", JSON.stringify(updatedPeers));
    setEmailModal(null);
  };

  const commitReject = (appId) => {
    const updatedRequests = requests.map((req) =>
      req.id === appId ? { ...req, status: "rejected" } : req
    );
    setRequests(updatedRequests);

    const allRequests = localStorage.getItem("accessRequests");
    if (allRequests) {
      const updated = JSON.parse(allRequests).map((req) =>
        req.id === appId ? { ...req, status: "rejected" } : req
      );
      localStorage.setItem("accessRequests", JSON.stringify(updated));
    }
    setEmailModal(null);
  };
  // ─────────────────────────────────────────────────────────────────────────

  const pendingApplications = requests.filter((req) => req.status === "pending");

  return (
    <div className="min-h-screen" style={{ background: "#f5eef8", padding: "2vw 2.5vw" }}>

      {/* Header */}
      <div className="rounded-3xl mb-5 flex items-center gap-5"
        style={{ background: "linear-gradient(135deg, rgba(179,157,219,0.12) 0%, rgba(248,187,208,0.12) 100%)", border: "1px solid rgba(179,157,219,0.2)", padding: "2vw 2.5vw" }}>
        <UserPlus style={{ color: "#b39ddb", width: "2.5vw", height: "2.5vw", minWidth: 32, minHeight: 32 }} />
        <div>
          <h1 style={{ color: "#5a4a61", fontSize: "clamp(1.4rem, 2.2vw, 2.2rem)", fontWeight: 700, marginBottom: 4 }}>
            Focus Peer Management
          </h1>
          <p style={{ color: "#9575a3", fontSize: "clamp(0.8rem, 1vw, 1rem)" }}>
            Invite students to become Focus Peers and assign neurodivergent students to them
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2vw", alignItems: "start" }}>

        {/* LEFT: Invite Form */}
        <div className="rounded-3xl" style={{ background: "#fff", border: "1px solid rgba(179,157,219,0.2)", padding: "2vw" }}>
          <h2 className="flex items-center gap-2 font-semibold mb-5" style={{ color: "#5a4a61", fontSize: "clamp(1rem, 1.2vw, 1.25rem)" }}>
            <Mail style={{ color: "#b39ddb", width: "1.3vw", height: "1.3vw", minWidth: 20, minHeight: 20 }} />
            Invite New Focus Peer
          </h2>

          <div className="mb-5">
            <label style={{ display: "block", color: "#9575a3", fontSize: "clamp(0.75rem, 0.9vw, 0.9rem)", marginBottom: 6 }}>
              Focus Peer Email Address *
            </label>
            <input
              type="email" value={newPeerEmail}
              onChange={(e) => setNewPeerEmail(e.target.value)}
              style={{ width: "100%", boxSizing: "border-box", padding: "0.75vw 1vw", borderRadius: "0.75rem", border: "2px solid rgba(179,157,219,0.2)", color: "#5a4a61", fontSize: "clamp(0.8rem, 0.95vw, 1rem)", outline: "none" }}
              placeholder="student@university.edu"
              onFocus={(e) => (e.target.style.borderColor = "#b39ddb")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(179,157,219,0.2)")}
            />
            <p style={{ color: "#9575a3", fontSize: "clamp(0.7rem, 0.8vw, 0.85rem)", marginTop: 6 }}>
              The student will receive an invitation email to register as a Focus Peer
            </p>
          </div>

          <div className="mb-5">
            <label style={{ display: "block", color: "#9575a3", fontSize: "clamp(0.75rem, 0.9vw, 0.9rem)", marginBottom: 4 }}>
              Assign ND Students *
            </label>
            <p style={{ color: "#9575a3", fontSize: "clamp(0.7rem, 0.8vw, 0.85rem)", marginBottom: 10 }}>
              Select neurodivergent students to assign to this Focus Peer
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75vw" }}>
              {ndStudents.map((student) => {
                const selected = selectedStudents.includes(student.id);
                return (
                  <button key={student.id} onClick={() => toggleStudentSelection(student.id)}
                    style={{ padding: "0.75vw 1vw", borderRadius: "0.75rem", border: `2px solid ${selected ? "#b39ddb" : "rgba(179,157,219,0.2)"}`, background: selected ? "linear-gradient(135deg, rgba(179,157,219,0.1) 0%, rgba(248,187,208,0.1) 100%)" : "rgba(179,157,219,0.04)", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6vw" }}>
                      <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${selected ? "#b39ddb" : "#d1d1d1"}`, background: selected ? "#b39ddb" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {selected && <CheckCircle size={11} color="#fff" />}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ color: "#5a4a61", fontWeight: 500, fontSize: "clamp(0.75rem, 0.85vw, 0.9rem)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{student.name}</p>
                        <p style={{ color: "#9575a3", fontSize: "clamp(0.65rem, 0.75vw, 0.8rem)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{student.email}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button onClick={handleAddFocusPeer}
            style={{ width: "100%", padding: "1vw", borderRadius: "9999px", background: "linear-gradient(90deg, #b39ddb 0%, #f8bbd0 100%)", color: "#fff", fontWeight: 600, fontSize: "clamp(0.9rem, 1vw, 1.05rem)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "box-shadow 0.2s, filter 0.2s, transform 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(179,157,219,0.5)"; e.currentTarget.style.filter = "brightness(1.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.filter = "brightness(1)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <UserPlus size={18} /> Send Invitation
          </button>
        </div>

        {/* RIGHT: Applications + Peers */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2vw" }}>

          {/* Pending Applications */}
          {pendingApplications.length > 0 && (
            <div className="rounded-3xl" style={{ background: "#fff", border: "1px solid rgba(179,157,219,0.2)", borderLeft: "4px solid #f8bbd0", padding: "2vw" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2vw" }}>
                <h2 className="flex items-center gap-2 font-semibold" style={{ color: "#5a4a61", fontSize: "clamp(1rem, 1.2vw, 1.25rem)" }}>
                  <CheckCircle style={{ color: "#f8bbd0", width: "1.3vw", height: "1.3vw", minWidth: 20 }} />
                  Pending Applications
                </h2>
                <span style={{ background: "rgba(248,187,208,0.15)", color: "#c0608a", fontSize: "clamp(0.7rem, 0.8vw, 0.85rem)", padding: "4px 12px", borderRadius: 999 }}>
                  {pendingApplications.length} Pending
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75vw" }}>
                {pendingApplications.map((app) => (
                  <div key={app.id} style={{ padding: "1.2vw", borderRadius: "1rem", border: "1px solid rgba(179,157,219,0.2)", background: "rgba(248,187,208,0.05)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 700, color: "#5a4a61", fontSize: "clamp(0.85rem, 1vw, 1rem)" }}>
                            {app.name || app.email}
                          </span>
                          <span style={{ fontSize: "clamp(0.65rem, 0.75vw, 0.8rem)", padding: "2px 8px", borderRadius: 999, background: "#fff", border: "1px solid rgba(248,187,208,0.3)", color: "#b39ddb" }}>
                            {app.email}
                          </span>
                          <span style={{ fontSize: "clamp(0.65rem, 0.75vw, 0.8rem)", padding: "2px 8px", borderRadius: 999, background: "rgba(179,157,219,0.1)", color: "#9575a3" }}>
                            CGPA: {app.cgpa?.toFixed(2)}
                          </span>
                        </div>
                        <p style={{ color: "#9575a3", fontSize: "clamp(0.75rem, 0.85vw, 0.9rem)", fontStyle: "italic", marginBottom: 4 }}>"{app.reason}"</p>
                        <p style={{ color: "#c0b4cc", fontSize: "clamp(0.65rem, 0.75vw, 0.8rem)" }}>
                          Applied: {new Date(app.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                        <button onClick={() => handleApproveClick(app)}
                          style={{ padding: "0.4vw 1vw", borderRadius: "0.6rem", background: "#22c55e", color: "#fff", fontWeight: 600, border: "none", cursor: "pointer", fontSize: "clamp(0.75rem, 0.85vw, 0.9rem)", transition: "background 0.18s, box-shadow 0.18s, transform 0.15s" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(34,197,94,0.35)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "#22c55e"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
                          Approve
                        </button>
                        <button onClick={() => handleRejectClick(app)}
                          style={{ padding: "0.4vw 1vw", borderRadius: "0.6rem", background: "rgba(239,68,68,0.05)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", cursor: "pointer", fontSize: "clamp(0.75rem, 0.85vw, 0.9rem)", transition: "background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.15s" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#ef4444"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(239,68,68,0.3)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.05)"; e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Invited Focus Peers */}
          <div className="rounded-3xl" style={{ background: "#fff", border: "1px solid rgba(179,157,219,0.2)", padding: "2vw" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2vw" }}>
              <h2 className="flex items-center gap-2 font-semibold" style={{ color: "#5a4a61", fontSize: "clamp(1rem, 1.2vw, 1.25rem)" }}>
                <Users style={{ color: "#f8bbd0", width: "1.3vw", height: "1.3vw", minWidth: 20 }} />
                Invited Focus Peers
              </h2>
              <span style={{ background: "rgba(248,187,208,0.15)", color: "#f8bbd0", fontSize: "clamp(0.7rem, 0.8vw, 0.85rem)", padding: "4px 12px", borderRadius: 999 }}>
                {focusPeers.length} Total
              </span>
            </div>

            {focusPeers.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3vw 0", color: "#9575a3" }}>
                <Users style={{ width: "4vw", height: "4vw", minWidth: 48, margin: "0 auto 12px", opacity: 0.2 }} />
                <p style={{ fontWeight: 500, marginBottom: 4 }}>No Focus Peers invited yet</p>
                <p style={{ fontSize: "clamp(0.75rem, 0.85vw, 0.9rem)" }}>Use the form on the left to invite students</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1vw" }}>
                {focusPeers.map((peer) => (
                  <div key={peer.id}
                    style={{ padding: "1.2vw", borderRadius: "1rem", border: "2px solid rgba(179,157,219,0.2)", background: "linear-gradient(135deg, rgba(179,157,219,0.05) 0%, rgba(248,187,208,0.05) 100%)", transition: "box-shadow 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 14px rgba(179,157,219,0.15)")}
                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: "2.5vw", height: "2.5vw", minWidth: 36, minHeight: 36, borderRadius: "50%", background: "linear-gradient(135deg, #b39ddb 0%, #f8bbd0 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Mail size={14} color="#fff" />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ color: "#5a4a61", fontWeight: 500, fontSize: "clamp(0.75rem, 0.85vw, 0.9rem)", margin: 0, wordBreak: "break-all", overflowWrap: "anywhere", whiteSpace: "normal" }}>{peer.email}</p>
                          <span style={{ display: "inline-block", marginTop: 3, fontSize: "clamp(0.65rem, 0.72vw, 0.78rem)", padding: "2px 8px", borderRadius: 999, background: peer.status === "registered" ? "rgba(34,197,94,0.1)" : "rgba(234,179,8,0.1)", color: peer.status === "registered" ? "#22c55e" : "#eab308" }}>
                            {peer.status === "registered" ? "Registered" : "Pending"}
                          </span>
                        </div>
                      </div>
                      <button onClick={() => handleDeletePeer(peer.id)}
                        style={{ padding: 6, borderRadius: 8, background: "rgba(239,68,68,0.05)", border: "none", cursor: "pointer", color: "#ef4444", flexShrink: 0, transition: "background 0.18s, box-shadow 0.18s, transform 0.15s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#ef4444"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.boxShadow = "0 3px 10px rgba(239,68,68,0.3)"; e.currentTarget.style.transform = "scale(1.1)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.05)"; e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "scale(1)"; }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div style={{ borderTop: "1px solid rgba(179,157,219,0.2)", paddingTop: 10 }}>
                      <p style={{ color: "#9575a3", fontSize: "clamp(0.65rem, 0.75vw, 0.8rem)", marginBottom: 6 }}>
                        Assigned Students ({peer.assignedStudents.length})
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {peer.assignedStudents.length === 0 ? (
                          <p style={{ color: "#c0b4cc", fontSize: "clamp(0.65rem, 0.72vw, 0.78rem)", fontStyle: "italic" }}>None assigned</p>
                        ) : (
                          peer.assignedStudents.map((studentId) => {
                            const student = ndStudents.find((s) => s.id === studentId);
                            return student ? (
                              <span key={studentId} style={{ padding: "2px 10px", borderRadius: 999, background: "rgba(179,157,219,0.12)", color: "#b39ddb", fontSize: "clamp(0.65rem, 0.72vw, 0.78rem)" }}>
                                {student.name}
                              </span>
                            ) : null;
                          })
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Email Preview Modal ───────────────────────────────────────────────── */}
      {emailModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 24 }}>
          <div style={{ background: "#fff", borderRadius: 24, boxShadow: "0 24px 60px rgba(0,0,0,0.15)", width: "100%", maxWidth: 520, overflow: "hidden" }}>

            {/* Modal header */}
            <div style={{ padding: "20px 28px 16px", borderBottom: "1px solid rgba(179,157,219,0.15)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: emailModal.type === "approve" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Mail size={18} color={emailModal.type === "approve" ? "#22c55e" : "#ef4444"} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: "#5a4a61", margin: 0, fontSize: "0.95rem" }}>
                    {emailModal.type === "approve" ? "Approval Email Preview" : "Rejection Email Preview"}
                  </p>
                  <p style={{ color: "#9575a3", margin: 0, fontSize: "0.78rem" }}>Review before sending</p>
                </div>
              </div>
              <button onClick={() => setEmailModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9575a3", padding: 4 }}>
                <X size={20} />
              </button>
            </div>

            {/* Email content */}
            <div style={{ padding: "20px 28px" }}>
              {/* To / From */}
              <div style={{ background: "rgba(179,157,219,0.06)", borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontSize: "0.82rem" }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                  <span style={{ color: "#9575a3", width: 36 }}>To:</span>
                  <span style={{ color: "#5a4a61", fontWeight: 600 }}>{emailModal.app.email}</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ color: "#9575a3", width: 36 }}>From:</span>
                  <span style={{ color: "#5a4a61", fontWeight: 600 }}>ehsas@habib.edu.pk</span>
                </div>
              </div>

              {/* Email body */}
              <div style={{ border: "1px solid rgba(179,157,219,0.2)", borderRadius: 12, padding: "16px 20px", fontSize: "0.85rem", color: "#5a4a61", lineHeight: 1.7, background: "#fdfbff" }}>
                {emailModal.type === "approve" ? (
                  <>
                    <p style={{ margin: "0 0 10px" }}>Dear <strong>{emailModal.app.name || emailModal.app.email}</strong>,</p>
                    <p style={{ margin: "0 0 10px" }}>
                      We are pleased to inform you that your application to become a <strong>Focus Peer</strong> at Habib University has been <strong style={{ color: "#22c55e" }}>approved</strong>.
                    </p>
                    <p style={{ margin: "0 0 10px" }}>
                      You can now log in to the NeuroZaviya platform using your registered email and password to access the Focus Peer dashboard.
                    </p>
                    <p style={{ margin: "0 0 10px" }}>
                      If you have any questions, please reach out to us at <strong>ehsas@habib.edu.pk</strong>.
                    </p>
                    <p style={{ margin: 0 }}>Warm regards,<br /><strong>Ehsas Support Services</strong><br />Habib University</p>
                  </>
                ) : (
                  <>
                    <p style={{ margin: "0 0 10px" }}>Dear <strong>{emailModal.app.name || emailModal.app.email}</strong>,</p>
                    <p style={{ margin: "0 0 10px" }}>
                      Thank you for your interest in the <strong>Focus Peer</strong> programme at Habib University.
                    </p>
                    <p style={{ margin: "0 0 10px" }}>
                      After careful review, we regret to inform you that your application has <strong style={{ color: "#ef4444" }}>not been selected</strong> at this time. This decision does not reflect negatively on you — we encourage you to reapply in a future cycle.
                    </p>
                    <p style={{ margin: "0 0 10px" }}>
                      For feedback or further queries, contact <strong>ehsas@habib.edu.pk</strong>.
                    </p>
                    <p style={{ margin: 0 }}>Kind regards,<br /><strong>Ehsas Support Services</strong><br />Habib University</p>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div style={{ padding: "0 28px 24px", display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setEmailModal(null)}
                style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid rgba(179,157,219,0.3)", background: "#fff", color: "#9575a3", cursor: "pointer", fontWeight: 500, fontSize: "0.85rem" }}>
                Cancel
              </button>
              <button
                onClick={() => emailModal.type === "approve" ? commitApprove(emailModal.app) : commitReject(emailModal.app.id)}
                style={{ padding: "10px 22px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", color: "#fff", background: emailModal.type === "approve" ? "#22c55e" : "#ef4444", display: "flex", alignItems: "center", gap: 7 }}>
                <Send size={15} />
                Send Email & {emailModal.type === "approve" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ─────────────────────────────────────────────────────────────────────── */}

      {/* Error Modal */}
      {showErrorModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "#fff", padding: "2rem 2.5rem", borderRadius: "1.5rem", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, maxWidth: 380 }}>
            <X size={44} color="#ef4444" />
            <div style={{ textAlign: "center" }}>
              <p style={{ fontWeight: 600, color: "#5a4a61", marginBottom: 6 }}>Error</p>
              <p style={{ color: "#9575a3", fontSize: "0.9rem" }}>{errorMessage}</p>
            </div>
            <button onClick={() => setShowErrorModal(false)} style={{ padding: "0.5rem 1.5rem", borderRadius: 999, background: "#b39ddb", color: "#fff", border: "none", cursor: "pointer", fontWeight: 500 }}>OK</button>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div style={{ position: "fixed", bottom: 32, right: 32, zIndex: 50, background: "#22c55e", color: "#fff", padding: "0.75rem 1.5rem", borderRadius: 999, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircle size={18} />
          <span style={{ fontSize: "0.9rem" }}>Invitation sent successfully!</span>
        </div>
      )}
    </div>
  );
}

export default FocusPeerManagement;