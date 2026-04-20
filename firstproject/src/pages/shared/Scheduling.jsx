import { List, Search, CalendarCheck, CalendarX } from "lucide-react";
import { useState } from "react";
import Calendar from "../../components/CommunityComponents/Calendar.jsx";
import AppointmentModal from "../../components/CommunityComponents/AppointmentModal.jsx";

function RequestCard({ req, onConfirm, onDecline }) {
  return (
    <div className="bg-white border border-purple-200 rounded-2xl p-4 flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-purple-900">{req.student}</span>
          <span className="text-xs font-semibold bg-amber-50 text-amber-500 border border-amber-200 rounded-full px-2 py-0.5">
            Pending
          </span>
        </div>
        <span className="text-xs text-purple-400 font-medium">{req.time}</span>
      </div>

      <p className="text-xs text-purple-600 m-0">
        {req.type} · {req.duration} · {req.location}
      </p>
      <p className="text-xs text-purple-400 m-0">
        {new Date(req.date + "T00:00:00").toLocaleDateString("en-US", {
          weekday: "short", month: "short", day: "numeric", year: "numeric",
        })}
      </p>
      {req.notes && (
        <p className="text-xs text-purple-400 italic m-0">"{req.notes}"</p>
      )}

      <div className="flex gap-2 mt-1">
        <button
          onClick={() => onConfirm(req)}
          className="flex-1 bg-green-50 text-green-600 border border-green-200 rounded-xl py-1.5 text-xs font-medium cursor-pointer hover:bg-green-100 transition-colors"
        >
          Confirm
        </button>
        <button
          onClick={() => onDecline(req.id)}
          className="flex-1 bg-red-50 text-red-500 border border-red-200 rounded-xl py-1.5 text-xs font-medium cursor-pointer hover:bg-red-100 transition-colors"
        >
          Decline
        </button>
      </div>
    </div>
  );
}

function AppointmentCard({ appt, onCancel }) {
  return (
    <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-sm text-purple-900">{appt.student}</span>
        <span className="text-xs text-purple-600 font-medium">{appt.time}</span>
      </div>
      <p className="text-xs text-purple-600 m-0">
        {appt.type} · {appt.duration}
      </p>
      <p className="text-xs text-purple-400 m-0">{appt.location}</p>
      {appt.notes && (
        <p className="text-xs text-purple-400 italic m-0">{appt.notes}</p>
      )}
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs font-semibold bg-green-50 text-green-600 border border-green-200 rounded-full px-2 py-0.5">
          Scheduled
        </span>
        <button
          onClick={() => onCancel(appt.id)}
          className="bg-transparent border-none text-red-500 text-xs cursor-pointer underline p-0 hover:text-red-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function Schedule() {
  const [date, setDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  
  // CLEAN SLATE! No more MOCK_REQUESTS
  const [requests, setRequests] = useState([]); 
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const handleSave = (newAppointment) => {
    setAppointments(prev => [
      ...prev,
      { ...newAppointment, id: Date.now().toString(), source: "oap" },
    ]);
  };

  const handleConfirm = (req) => {
    setAppointments(prev => [
      ...prev,
      { ...req, id: req.id + "_confirmed", source: "student" },
    ]);
    setRequests(prev => prev.filter(r => r.id !== req.id));

    const [year, month, day] = req.date.split("-").map(Number);
    setDate(new Date(year, month - 1, day));
  };

  const handleDecline = (id) => {
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  const handleCancel = (id) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const appointmentsForDate = appointments.filter(appt => {
    const [year, month, day] = appt.date.split("-").map(Number);
    return (
      year  === date.getFullYear() &&
      month === date.getMonth() + 1 &&
      day   === date.getDate()
    );
  });

  const filteredAppointments = appointmentsForDate.filter(appt => {
    const matchesSearch =
      search.trim() === "" ||
      appt.student.toLowerCase().includes(search.toLowerCase()) ||
      appt.type.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" || statusFilter === "Scheduled";
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 pl-12 w-[80vw] box-border">

      {isModalOpen && (
        <AppointmentModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {/* Header */}
      <div className="bg-white border border-purple-200 rounded-3xl px-6 py-5 flex justify-between items-center mb-5">
        <div className="flex items-center gap-3">
          <CalendarCheck size={24} className="text-purple-400" />
          <div>
            <h4 className="m-0 text-xl font-semibold text-purple-400">
              Schedule Your Week
            </h4>
            <p className="m-0 text-xs text-purple-600">
              Manage and schedule meetings with your assigned students
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-400 text-white border-none rounded-xl px-4 py-2 text-sm font-medium cursor-pointer hover:bg-purple-500 transition-colors"
        >
          + Schedule Appointment
        </button>
      </div>

      {/* Student Appointment Requests */}
      <div className="bg-white border border-purple-200 rounded-3xl px-6 py-5 mb-5">
        <div className="mb-4">
          <h4 className="m-0 mb-1 text-base font-semibold text-purple-900">
            Student Appointment Requests
          </h4>
          <p className="m-0 text-xs text-purple-600">
            Review and confirm requests submitted by students
          </p>
        </div>

        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-purple-100 rounded-2xl bg-purple-50/30">
            <CalendarX size={32} className="text-purple-300 mb-2" />
            <p className="text-sm font-medium text-purple-800 m-0">No pending requests</p>
            <p className="text-xs text-purple-500 m-0 mt-1">You are all caught up!</p>
          </div>
        ) : (
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {requests.map(req => (
              <RequestCard
                key={req.id}
                req={req}
                onConfirm={handleConfirm}
                onDecline={handleDecline}
              />
            ))}
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-purple-200 rounded-3xl px-6 py-4 mb-5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-2">
          <button className="bg-purple-400 text-white border-none rounded-xl px-4 py-2 text-xs font-medium cursor-pointer hover:bg-purple-500 transition-colors">
            Calendar View
          </button>
          <button className="bg-white text-purple-900 border border-purple-200 rounded-xl px-4 py-2 text-xs font-medium cursor-pointer flex items-center gap-1.5 hover:bg-purple-50 transition-colors">
            <List size={14} /> List View
          </button>
        </div>

        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-xl px-3 py-2">
            <Search size={14} className="text-purple-300" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border-none bg-transparent outline-none text-xs text-purple-900 w-44 placeholder-purple-300"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-purple-200 text-xs text-purple-900 bg-white cursor-pointer outline-none"
          >
            <option>All Status</option>
            <option>Scheduled</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>

      {/* Calendar + Appointments Panel */}
      <div className="flex gap-5">
        <Calendar onDateSelect={setDate} appointments={appointments} />

        <div className="flex-1 bg-white rounded-3xl p-6 border border-purple-200">
          <h3 className="m-0 mb-4 text-base font-semibold text-purple-900">
            {date.toLocaleDateString("en-US", {
              weekday: "short", year: "numeric", month: "short", day: "numeric",
            })}
          </h3>

          {filteredAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40">
                <p className="text-xs text-purple-400 m-0">No appointments scheduled for this date.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {filteredAppointments.map(appt => (
                <AppointmentCard key={appt.id} appt={appt} onCancel={handleCancel} />
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default Schedule;