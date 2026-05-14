import React, { useState } from "react";
import { X, Mail, MapPin, Clock, CheckCircle } from "lucide-react";
// 1. Import the user context! (Double check this path matches your folder structure)
import { useUser } from "../../styles/SignInLandingPage/usercontext.jsx";

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
  green:     "#22c55e",
  greenBg:   "rgba(34,197,94,0.1)",
  white:     "#FFFFFF",
  btnGrad:   "linear-gradient(90deg, #b39ddb 0%, #f8bbd0 100%)",
};

const TIME_SLOTS = [
  "Mon 10:00 AM", "Tue 2:00 PM",  "Thu 11:00 AM",
  "Fri 3:00 PM",  "Tue 9:00 AM",  "Wed 1:00 PM",
];

// ── Request Meeting Modal ─────────────────────────────────────────────────────
function RequestModal({ staff, onClose, onSubmit }) {
  const [subject, setSubject]     = useState("");
  const [description, setDesc]    = useState("");
  const [selectedSlot, setSlot]      = useState(null);
  const [otherTime, setOtherTime]    = useState(false);
  const [preferredTime, setPreferredTime] = useState("");

  if (!staff) return null;

  const isValid = subject && description && (selectedSlot || (otherTime && preferredTime));

  const handleSubmit = () => {
    if (!isValid) return;
    // Pass the data back up to the parent modal wrapper
    onSubmit({ subject, description, slot: otherTime ? preferredTime : selectedSlot });
  };

  const inputStyle = {
    width: "100%",
    border: `1px solid ${C.purple300}`,
    borderRadius: 10,
    padding: "9px 12px",
    fontSize: 13,
    color: C.purple800,
    background: C.white,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 60,
        background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: C.white,
          borderRadius: 20,
          width: "100%",
          maxWidth: 420,
          maxHeight: "90vh",
          overflowY: "auto",
          padding: 28,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: C.purple100,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: C.purple500,
            }}>
              <Clock size={20} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.purple800 }}>Request Meeting</p>
              <p style={{ margin: 0, fontSize: 12, color: C.purple600 }}>with {staff.name}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.purple400 }}>
            <X size={20} />
          </button>
        </div>

        {/* Meeting Subject */}
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.purple800, marginBottom: 6 }}>
            Meeting Subject <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Accommodation Review, Academic Advising"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Description */}
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.purple800, marginBottom: 6 }}>
            Description <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <textarea
            rows={3}
            placeholder="Briefly describe what you'd like to discuss in this meeting..."
            value={description}
            onChange={e => setDesc(e.target.value)}
            style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
          />
        </div>

        {/* Time Slots */}
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.purple800, marginBottom: 10 }}>
            <Clock size={13} style={{ display: "inline", marginRight: 5, verticalAlign: "middle" }} />
            Available Time Slots
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
            {TIME_SLOTS.map(slot => {
              const active = selectedSlot === slot && !otherTime;
              return (
                <button
                  key={slot}
                  onClick={() => { setSlot(slot); setOtherTime(false); }}
                  style={{
                    padding: "8px 6px",
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 500,
                    border: `1.5px solid ${active ? C.purple500 : C.purple300}`,
                    background: active ? C.purple100 : C.white,
                    color: active ? C.purple800 : C.purple600,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {slot}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => { setOtherTime(true); setSlot(null); setPreferredTime(""); }}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 12,
              color: otherTime ? C.purple800 : C.purple500,
              fontWeight: otherTime ? 600 : 400,
              textDecoration: "underline", textUnderlineOffset: 3,
              padding: 0,
            }}
          >
            Other — I'm not available at these times
          </button>

          {otherTime && (
            <div style={{ marginTop: 12 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.purple800, marginBottom: 6 }}>
                What is your preferred time? <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Weekdays after 3pm, Friday mornings..."
                value={preferredTime}
                onChange={e => setPreferredTime(e.target.value)}
                style={{
                  width: "100%",
                  border: `1.5px solid ${C.purple500}`,
                  borderRadius: 10,
                  padding: "9px 12px",
                  fontSize: 13,
                  color: C.purple800,
                  background: C.purple50,
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            style={{
              flex: 1,
              background: isValid ? C.btnGrad : C.purple300,
              color: C.white,
              border: "none",
              borderRadius: 10,
              padding: "11px 0",
              fontSize: 14,
              fontWeight: 600,
              cursor: isValid ? "pointer" : "not-allowed",
              opacity: isValid ? 1 : 0.6,
            }}
          >
            Submit Request
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "11px 20px",
              borderRadius: 10,
              border: `1px solid ${C.purple300}`,
              background: C.white,
              color: C.purple800,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Staff Profile Modal ───────────────────────────────────────────────────────
function SupportStaffModal({ staff, isOpen, onClose }) {
  const { user } = useUser(); // Grab the logged-in student!
  const [requestOpen, setRequestOpen] = useState(false);
  const [submitted, setSubmitted]     = useState(false);

  if (!isOpen || !staff) return null;

  const StaffIcon = staff.icon;

  // 2. The real Backend Fetch Call
  const handleRequestSubmit = async (requestDetails) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,             // The student requesting
          staffId: staff.staff_id,     // The OAP staff ID from the database
          subject: requestDetails.subject,
          description: requestDetails.description,
          slot: requestDetails.slot
        })
      });

      if (response.ok) {
        setSubmitted(true);
        setRequestOpen(false);
      } else {
        alert("Failed to submit request.");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Network error.");
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <>
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 50,
          background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 16,
        }}
        onClick={handleClose}
      >
        <div
          style={{
            background: C.white,
            borderRadius: 22,
            width: "100%",
            maxWidth: 500,
            maxHeight: "90vh",
            overflowY: "auto",
            boxSizing: "border-box",
            borderTop: `7px solid ${staff.bgColor || '#b39ddb'}`,
            display: "flex",
            flexDirection: "column",
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Modal header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "18px 24px",
            borderBottom: `1px solid ${C.purple200}`,
          }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: C.purple800 }}>{staff.name}</span>
            <button onClick={handleClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.purple400 }}>
              <X size={22} />
            </button>
          </div>

          <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Success banner */}
            {submitted && (
              <div style={{
                background: C.greenBg,
                border: `1px solid ${C.green}44`,
                borderRadius: 12,
                padding: "12px 16px",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <CheckCircle size={18} style={{ color: C.green, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: C.purple800, fontWeight: 500 }}>
                  Meeting request sent! You'll receive a confirmation at your student email.
                </span>
              </div>
            )}

            {/* Avatar + name block */}
            <div style={{
              display: "flex", alignItems: "center", gap: 16,
              background: C.purple50,
              borderRadius: 14, padding: "14px 16px",
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: `${staff.bgColor || '#b39ddb'}30`,
                border: `2px solid ${staff.bgColor || '#b39ddb'}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, color: C.purple800,
              }}>
                {StaffIcon && <StaffIcon size={28} />}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: C.purple800 }}>{staff.name}</p>
                <p style={{ margin: "2px 0 0", fontSize: 13, color: C.purple600 }}>{staff.role || 'Staff'}</p>
                <p style={{ margin: "1px 0 0", fontSize: 12, color: C.purple400 }}>{staff.department || 'Office of Academic Performance'}</p>
              </div>
            </div>

            {/* About */}
            <div>
              <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, color: C.purple800 }}>About</p>
              <p style={{ margin: 0, fontSize: 13, color: C.purple600, lineHeight: 1.6 }}>{staff.about || "Academic support professional dedicated to student success."}</p>
            </div>

            {/* Contact info */}
            <div>
              <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: C.purple800 }}>Contact Information</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { icon: Mail,   label: "Email",           value: staff.email },
                  { icon: MapPin, label: "Office Location",  value: staff.location || "OAP Office, Main Building" },
                  { icon: Clock,  label: "Working Hours",    value: staff.availability || "Mon-Fri, 9AM-5PM" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{
                    display: "flex", alignItems: "flex-start", gap: 12,
                    background: C.purple50,
                    border: `1px solid ${C.purple200}`,
                    borderRadius: 10, padding: "10px 14px",
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: C.purple100,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <Icon size={15} style={{ color: C.purple500 }} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 11, color: C.purple400 }}>{label}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 13, color: C.purple800, fontWeight: 500 }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
              <a
                href={`mailto:${staff.email}`}
                style={{
                  flex: 1,
                  background: C.btnGrad,
                  color: C.white,
                  border: "none",
                  borderRadius: 10,
                  padding: "11px 0",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "center",
                  textDecoration: "none",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                }}
              >
                <Mail size={16} /> Send Email
              </a>
              <button
                onClick={() => setRequestOpen(true)}
                style={{
                  flex: 1,
                  background: C.white,
                  color: C.purple800,
                  border: `1.5px solid ${C.purple300}`,
                  borderRadius: 10,
                  padding: "11px 0",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Request Meeting
              </button>
              <button
                onClick={handleClose}
                style={{
                  padding: "11px 18px",
                  borderRadius: 10,
                  border: `1px solid ${C.purple300}`,
                  background: C.white,
                  color: C.purple600,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Request Meeting sub-modal */}
      {requestOpen && (
        <RequestModal
          staff={staff}
          onClose={() => setRequestOpen(false)}
          onSubmit={handleRequestSubmit}
        />
      )}
    </>
  );
}

export default SupportStaffModal;