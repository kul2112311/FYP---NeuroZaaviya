// src/components/CommunityComponents/AppointmentModal.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AppointmentModal({ onClose, onCreate }) {
  const [studentName, setStudentName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('Scheduled');

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id: Date.now().toString(),
      studentName,
      date,
      time,
      duration: `${duration} minutes`,
      location,
      notes,
      status
    };
    if (onCreate) onCreate(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">Schedule Appointment</h3>
            <div className="text-sm text-gray-500">Create a new appointment with a student</div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Student name</label>
              <input value={studentName} onChange={(e) => setStudentName(e.target.value)} className="w-full rounded-lg border px-3 py-2" placeholder="Student name" required />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-lg border px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Time</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full rounded-lg border px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Duration (minutes)</label>
              <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full rounded-lg border px-3 py-2">
                <option value="30">30</option>
                <option value="45">45</option>
                <option value="60">60</option>
                <option value="90">90</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Location</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full rounded-lg border px-3 py-2" placeholder="Online / Room name" />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded-lg border px-3 py-2 min-h-[80px]" placeholder="Optional notes for the appointment" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-[#B39DDB] text-white hover:bg-[#9575CD]">Schedule</button>
          </div>
        </form>
      </div>
    </div>
  );
}
