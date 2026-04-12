import { X } from "lucide-react";
import { useState } from "react";

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
  red:       "#ef4444",
  white:     "#FFFFFF",
};

// ── Shared input style ────────────────────────────────────────────────────────
const inputStyle = {
  width: "100%",
  border: `1px solid ${C.purple300}`,
  borderRadius: 10,
  padding: "8px 12px",
  fontSize: 13,
  color: C.purple800,
  background: C.white,
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  color: C.purple800,
  marginBottom: 6,
};

function Field({ label, required, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label style={labelStyle}>
        {label}
        {required && <span style={{ color: C.red, marginLeft: 2 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function AppointmentModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    student: "",
    date: "",
    time: "",
    duration: "1 hour",
    type: "",
    location: "",
    notes: "",
  });

  const handleChange = (field, value) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    if (!form.student || !form.date || !form.time || !form.type || !form.location) return;
    onSave(form);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "relative",
          background: C.white,
          borderRadius: 20,
          width: "100%",
          maxWidth: 460,
          margin: "0 16px",
          padding: 28,
          maxHeight: "90vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div>
          <h2 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 600, color: C.purple800 }}>
            Schedule New Appointment
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: C.purple600 }}>
            Fill in the details to schedule an appointment with a student.
          </p>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: C.purple400,
            padding: 4,
          }}
        >
          <X size={20} />
        </button>

        {/* Student */}
        <Field label="Student" required>
          <select
            style={inputStyle}
            value={form.student}
            onChange={e => handleChange("student", e.target.value)}
          >
            <option value="">Select a student</option>
            <option>Alice Johnson</option>
            <option>Bob Smith</option>
          </select>
        </Field>

        {/* Date & Time */}
        <div style={{ display: "flex", gap: 12 }}>
          <Field label="Date" required>
            <input
              type="date"
              style={inputStyle}
              value={form.date}
              onChange={e => handleChange("date", e.target.value)}
            />
          </Field>
          <Field label="Time" required>
            <select
              style={inputStyle}
              value={form.time}
              onChange={e => handleChange("time", e.target.value)}
            >
              <option value="">Select time</option>
              {["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00"].map(t => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
        </div>

        {/* Duration */}
        <Field label="Duration">
          <select
            style={inputStyle}
            value={form.duration}
            onChange={e => handleChange("duration", e.target.value)}
          >
            <option>30 minutes</option>
            <option>1 hour</option>
            <option>1.5 hours</option>
            <option>2 hours</option>
          </select>
        </Field>

        {/* Appointment Type */}
        <Field label="Appointment Type" required>
          <select
            style={inputStyle}
            value={form.type}
            onChange={e => handleChange("type", e.target.value)}
          >
            <option value="">Select appointment type</option>
            <option>Academic Review</option>
            <option>Career Guidance</option>
            <option>Wellness Check-in</option>
          </select>
        </Field>

        {/* Location */}
        <Field label="Location" required>
          <select
            style={inputStyle}
            value={form.location}
            onChange={e => handleChange("location", e.target.value)}
          >
            <option value="">Select location</option>
            <option>Office Room 101</option>
            <option>Online (Zoom)</option>
            <option>Library</option>
          </select>
        </Field>

        {/* Notes */}
        <Field label="Notes">
          <textarea
            rows={3}
            placeholder="Add any additional notes or agenda items..."
            style={{ ...inputStyle, resize: "none", lineHeight: 1.5 }}
            value={form.notes}
            onChange={e => handleChange("notes", e.target.value)}
          />
        </Field>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
          <button
            onClick={handleSubmit}
            style={{
              flex: 1,
              background: C.purple500,
              color: C.white,
              border: "none",
              borderRadius: 10,
              padding: "10px 0",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Schedule Appointment
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
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

export default AppointmentModal;