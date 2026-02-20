import { List, Search, X, ChevronDown } from "lucide-react";
import { useState } from "react";

function AppointmentModal({ onClose }) {
    const [form, setForm] = useState({
        student:"",
        date:"",
        time:"",
        duration:"1 hour",
        tyep:"",
        location:"",
        notes:"",
    })

    const handleChange = (field, value)=>
        setForm(prev => ({...prev, [field]: value}));
     return (
    /*
     * OVERLAY:
     * - `fixed inset-0`  → covers the entire viewport (top/right/bottom/left = 0)
     * - `z-50`           → sits above everything else
     * - `bg-black/40`    → semi-transparent dark backdrop
     * - `flex items-center justify-center` → centres the modal box
     *
     * Clicking the overlay itself (not the box) calls onClose,
     * so the user can dismiss by clicking outside.
     */
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
      onClick={onClose}
    >
      {/*
       * MODAL BOX:
       * - `relative`         → so the X button can be positioned inside it
       * - `onClick e.stopPropagation()` → prevents clicks *inside* the box
       *   from bubbling up to the overlay and accidentally closing it
       */}
      <div
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Schedule New Appointment
          </h2>
          <p className="text-sm text-gray-500">
            Fill in the details to schedule a new appointment with a student.
          </p>
        </div>

        {/* X close button – also calls onClose */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        {/* ── Student ── */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Student <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:border-[#B39DDB]"
            value={form.student}
            onChange={(e) => handleChange("student", e.target.value)}
          >
            <option value="">Select a student</option>
            <option>Alice Johnson</option>
            <option>Bob Smith</option>
          </select>
        </div>

        {/* ── Date & Time ── */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            
            <input
              type="date"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:border-[#B39DDB]"
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:border-[#B39DDB]"
              value={form.time}
              onChange={(e) => handleChange("time", e.target.value)}
            >
              <option value="">Select time</option>
              {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"].map(
                (t) => <option key={t}>{t}</option>
              )}
            </select>
          </div>
        </div>

        {/* ── Duration ── */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration
          </label>
          <select
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:border-[#B39DDB]"
            value={form.duration}
            onChange={(e) => handleChange("duration", e.target.value)}
          >
            <option>30 minutes</option>
            <option>1 hour</option>
            <option>1.5 hours</option>
            <option>2 hours</option>
          </select>
        </div>

        {/* ── Appointment Type ── */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Appointment Type <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:border-[#B39DDB]"
            value={form.type}
            onChange={(e) => handleChange("type", e.target.value)}
          >
            <option value="">Select appointment type</option>
            <option>Academic Review</option>
            <option>Career Guidance</option>
            <option>Wellness Check-in</option>
          </select>
        </div>

        {/* ── Location ── */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:border-[#B39DDB]"
            value={form.location}
            onChange={(e) => handleChange("location", e.target.value)}
          >
            <option value="">Select location</option>
            <option>Office Room 101</option>
            <option>Online (Zoom)</option>
            <option>Library</option>
          </select>
        </div>

        {/* ── Notes ── */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            rows={3}
            placeholder="Add any additional notes or agenda items..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:border-[#B39DDB] resize-none"
            value={form.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
          />
        </div>

        {/* ── Actions ── */}
        <div className="flex gap-3 pt-2">
          <button
            className="flex-1 bg-[#B39DDB] text-white py-2 rounded-lg hover:bg-[#9575CD] transition-colors font-medium"
            onClick={() => {
              console.log("Submitting:", form);
              onClose(); // close after submit
            }}
          >
            Schedule Appointment
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
export default AppointmentModal;