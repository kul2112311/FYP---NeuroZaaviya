import { useState } from "react";
import { UserPlus, Mail, Users, Trash2, CheckCircle, X, Send, Edit3 } from "lucide-react";

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

  // ── Email modal state (now includes editable body) ────────────────────────
  const [emailModal, setEmailModal] = useState(null); // { type, app, body }

  const ndStudents = [
    { id: "1", name: "Sarah Ahmed",  email: "sarah.ahmed@university.edu"  },
    { id: "2", name: "Ali Hassan",   email: "ali.hassan@university.edu"   },
    { id: "3", name: "Fatima Khan",  email: "fatima.khan@university.edu"  },
    { id: "4", name: "Omar Ibrahim", email: "omar.ibrahim@university.edu" },
    { id: "5", name: "Zainab Malik", email: "zainab.malik@university.edu" },
    { id: "6", name: "Hassan Ali",   email: "hassan.ali@university.edu"   },
  ];

  // ── Email templates ────────────────────────────────────────────────────────
  const approvalEmailTemplate = (app) =>
`Dear ${app.name || app.email},

We are pleased to inform you that your application to become a Focus Peer at Habib University has been approved.

You can now log in to the NeuroZaviya platform using your registered email and password to access the Focus Peer dashboard.

If you have any questions, please reach out to us at ehsas@habib.edu.pk.

Warm regards,
Ehsas Support Services
Habib University`;

  const rejectionEmailTemplate = (app) =>
`Dear ${app.name || app.email},

Thank you for your interest in the Focus Peer programme at Habib University.

After careful review, we regret to inform you that your application has not been selected at this time. This decision does not reflect negatively on you — we encourage you to reapply in a future cycle.

For feedback or further queries, contact ehsas@habib.edu.pk.

Kind regards,
Ehsas Support Services
Habib University`;

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  const handleAddFocusPeer = () => {
    if (!newPeerEmail.trim())         { setErrorMessage("Please enter an email address");                  setShowErrorModal(true); return; }
    if (!newPeerEmail.includes("@"))  { setErrorMessage("Please enter a valid email address");             setShowErrorModal(true); return; }
    if (selectedStudents.length === 0){ setErrorMessage("Please select at least one student to assign");  setShowErrorModal(true); return; }

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

  // ── Open modal with pre-filled editable body ───────────────────────────────
  const handleApproveClick = (app) => setEmailModal({ type: "approve", app, body: approvalEmailTemplate(app) });
  const handleRejectClick  = (app) => setEmailModal({ type: "reject",  app, body: rejectionEmailTemplate(app) });

  // ── Commit approve: creates registeredUsers entry so they can sign in ─────
  const commitApprove = (application) => {
    // Update accessRequests status
    const allReqs = JSON.parse(localStorage.getItem("accessRequests") || "[]");
    const updatedReqs = allReqs.map((req) =>
      req.id === application.id ? { ...req, status: "approved", reviewedAt: new Date().toISOString() } : req
    );
    localStorage.setItem("accessRequests", JSON.stringify(updatedReqs));
    setRequests(updatedReqs.filter((r) => r.role === "focuspeer"));

    // Create login account in registeredUsers
    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    if (!users.find((u) => u.email === application.email)) {
      users.push({
        id: Date.now().toString(),
        name: application.name,
        email: application.email,
        password: application.password,
        role: "focus-peer", // matches menuConfig key in App.jsx
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("registeredUsers", JSON.stringify(users));
    }

    // Update focusPeers list
    const existingIdx = focusPeers.findIndex((p) => p.email === application.email);
    let updatedPeers = [...focusPeers];
    if (existingIdx >= 0) {
      updatedPeers[existingIdx] = { ...updatedPeers[existingIdx], status: "registered", registeredAt: new Date().toISOString() };
    } else {
      updatedPeers.push({ id: Date.now().toString(), email: application.email, name: application.name, assignedStudents: [], status: "registered", registeredAt: new Date().toISOString() });
    }
    setFocusPeers(updatedPeers);
    localStorage.setItem("focusPeers", JSON.stringify(updatedPeers));
    setEmailModal(null);
  };

  // ── Commit reject: clears status so they can reapply ─────────────────────
  const commitReject = (appId) => {
    const allReqs = JSON.parse(localStorage.getItem("accessRequests") || "[]");
    // Mark as rejected but DON'T permanently block — they can submit a new request
    const updatedReqs = allReqs.map((req) =>
      req.id === appId ? { ...req, status: "rejected", reviewedAt: new Date().toISOString() } : req
    );
    localStorage.setItem("accessRequests", JSON.stringify(updatedReqs));
    setRequests(updatedReqs.filter((r) => r.role === "focuspeer"));
    setEmailModal(null);
  };

  const pendingApplications = requests.filter((req) => req.status === "pending");
  const allApplications = requests; // show all for history

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
            Review Focus Peer applications and manage assignments
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2vw", alignItems: "start" }}>

        {/* LEFT: Applications */}
        <div className="rounded-3xl" style={{ background: "#fff", border: "1px solid rgba(179,157,219,0.2)", padding: "2vw" }}>
          <h2 style={{ color: "#5a4a61", fontSize: "clamp(1rem, 1.2vw, 1.25rem)", fontWeight: 600, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <Mail style={{ color: "#b39ddb", width: 20, height: 20 }} />
            Focus Peer Applications
          </h2>

          {allApplications.length === 0 ? (
            <p style={{ color: "#c0b4cc", fontSize: "0.9rem", textAlign: "center", padding: "2rem 0" }}>No applications yet</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {allApplications.map((app) => (
                <div key={app.id} style={{
                  border: "1px solid rgba(179,157,219,0.2)", borderRadius: 14, padding: "14px 16px",
                  background: app.status === "pending" ? "rgba(245,158,11,0.04)" : app.status === "approved" ? "rgba(34,197,94,0.04)" : "rgba(239,68,68,0.04)",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <p style={{ fontWeight: 700, color: "#5a4a61", margin: 0, fontSize: "0.92rem" }}>{app.name || "—"}</p>
                      <p style={{ color: "#9575a3", margin: "2px 0 0", fontSize: "0.8rem" }}>{app.email}</p>
                      {app.cgpa && <p style={{ color: "#b39ddb", margin: "2px 0 0", fontSize: "0.78rem" }}>CGPA: {app.cgpa}</p>}
                    </div>
                    <span style={{
                      fontSize: "0.72rem", padding: "3px 10px", borderRadius: 999, fontWeight: 700,
                      background: app.status === "pending" ? "rgba(245,158,11,0.12)" : app.status === "approved" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.1)",
                      color: app.status === "pending" ? "#f59e0b" : app.status === "approved" ? "#22c55e" : "#ef4444",
                    }}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>

                  {app.reason && (
                    <p style={{ color: "#6e5878", fontSize: "0.8rem", margin: "0 0 10px", lineHeight: 1.5, background: "rgba(179,157,219,0.06)", borderRadius: 8, padding: "8px 10px" }}>
                      {app.reason}
                    </p>
                  )}

                  {app.status === "pending" && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => handleApproveClick(app)} style={{
                        flex: 1, padding: "7px", borderRadius: 9, border: "1px solid rgba(34,197,94,0.3)",
                        background: "rgba(34,197,94,0.08)", color: "#22c55e", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "all 0.18s",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#22c55e"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(34,197,94,0.08)"; e.currentTarget.style.color = "#22c55e"; }}>
                        <CheckCircle size={13} /> Approve
                      </button>
                      <button onClick={() => handleRejectClick(app)} style={{
                        flex: 1, padding: "7px", borderRadius: 9, border: "1px solid rgba(239,68,68,0.25)",
                        background: "rgba(239,68,68,0.06)", color: "#ef4444", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "all 0.18s",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#ef4444"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.06)"; e.currentTarget.style.color = "#ef4444"; }}>
                        <X size={13} /> Reject
                      </button>
                    </div>
                  )}
                  {app.status === "rejected" && (
                    <p style={{ fontSize: "0.75rem", color: "#c0b4cc", fontStyle: "italic", margin: 0 }}>
                      Rejected — applicant can reapply
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Registered Focus Peers */}
        <div className="rounded-3xl" style={{ background: "#fff", border: "1px solid rgba(179,157,219,0.2)", padding: "2vw" }}>
          <h2 style={{ color: "#5a4a61", fontSize: "clamp(1rem, 1.2vw, 1.25rem)", fontWeight: 600, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <Users style={{ color: "#b39ddb", width: 20, height: 20 }} />
            Active Focus Peers
          </h2>

          {focusPeers.filter(p => p.status === "registered").length === 0 ? (
            <p style={{ color: "#c0b4cc", fontSize: "0.9rem", textAlign: "center", padding: "2rem 0" }}>No active Focus Peers yet</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {focusPeers.filter(p => p.status === "registered").map((peer) => (
                <div key={peer.id} style={{ border: "1px solid rgba(179,157,219,0.2)", borderRadius: 14, padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div>
                      <p style={{ fontWeight: 700, color: "#5a4a61", margin: 0, fontSize: "0.9rem" }}>{peer.name || peer.email}</p>
                      <p style={{ color: "#9575a3", margin: "2px 0 0", fontSize: "0.78rem" }}>{peer.email}</p>
                    </div>
                    <button onClick={() => handleDeletePeer(peer.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: 4 }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div style={{ borderTop: "1px solid rgba(179,157,219,0.15)", paddingTop: 10 }}>
                    <p style={{ color: "#9575a3", fontSize: "0.75rem", marginBottom: 6 }}>Assigned Students ({peer.assignedStudents?.length || 0})</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {(peer.assignedStudents || []).length === 0 ? (
                        <p style={{ color: "#c0b4cc", fontSize: "0.72rem", fontStyle: "italic" }}>None assigned</p>
                      ) : (
                        (peer.assignedStudents || []).map((studentId) => {
                          const student = ndStudents.find((s) => s.id === studentId);
                          return student ? (
                            <span key={studentId} style={{ padding: "2px 10px", borderRadius: 999, background: "rgba(179,157,219,0.12)", color: "#b39ddb", fontSize: "0.72rem" }}>
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

      {/* ── Email Modal with editable body ───────────────────────────────────── */}
      {emailModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 24 }}>
          <div style={{ background: "#fff", borderRadius: 24, boxShadow: "0 24px 60px rgba(0,0,0,0.15)", width: "100%", maxWidth: 560, overflow: "hidden" }}>

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
                  <p style={{ color: "#9575a3", margin: 0, fontSize: "0.78rem" }}>Sending to {emailModal.app.email}</p>
                </div>
              </div>
              <button onClick={() => setEmailModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9575a3", padding: 4 }}>
                <X size={20} />
              </button>
            </div>

            {/* To / From */}
            <div style={{ padding: "16px 28px 0" }}>
              <div style={{ background: "rgba(179,157,219,0.06)", borderRadius: 12, padding: "11px 15px", fontSize: "0.82rem", display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ color: "#9575a3", minWidth: 36 }}>To:</span>
                  <span style={{ color: "#5a4a61", fontWeight: 600 }}>{emailModal.app.email}</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ color: "#9575a3", minWidth: 36 }}>From:</span>
                  <span style={{ color: "#5a4a61", fontWeight: 600 }}>ehsas@habib.edu.pk</span>
                </div>
              </div>
            </div>

            {/* Editable email body */}
            <div style={{ padding: "14px 28px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <Edit3 size={13} color="#9575a3" />
                <span style={{ fontSize: "0.75rem", color: "#9575a3", fontWeight: 600 }}>Edit email before sending</span>
              </div>
              <textarea
                value={emailModal.body}
                onChange={e => setEmailModal(prev => ({ ...prev, body: e.target.value }))}
                rows={10}
                style={{
                  width: "100%", borderRadius: 12, border: "1px solid rgba(179,157,219,0.3)",
                  padding: "14px 16px", fontSize: "0.84rem", color: "#5a4a61", lineHeight: 1.7,
                  background: "#fdfbff", fontFamily: "inherit", resize: "vertical",
                  outline: "none", boxSizing: "border-box",
                }}
              />
            </div>

            {/* Actions */}
            <div style={{ padding: "12px 28px 24px", display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setEmailModal(null)}
                style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid rgba(179,157,219,0.3)", background: "#fff", color: "#9575a3", cursor: "pointer", fontWeight: 500, fontSize: "0.85rem" }}>
                Cancel
              </button>
              <button
                onClick={() => emailModal.type === "approve" ? commitApprove(emailModal.app) : commitReject(emailModal.app.id)}
                style={{ padding: "10px 22px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", color: "#fff", background: emailModal.type === "approve" ? "#22c55e" : "#ef4444", display: "flex", alignItems: "center", gap: 7, transition: "all 0.18s" }}
                onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.filter = "brightness(1)"; e.currentTarget.style.transform = "none"; }}>
                <Send size={15} />
                Send Email & {emailModal.type === "approve" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

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
          <span style={{ fontSize: "0.9rem" }}>Action completed successfully!</span>
        </div>
      )}
    </div>
  );
}

export default FocusPeerManagement;