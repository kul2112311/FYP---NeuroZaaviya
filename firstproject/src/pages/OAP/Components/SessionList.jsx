import React from 'react';
import { User, CalendarDays, Clock, ChevronDown } from 'lucide-react';

const TYPE_COLORS = {
  'General Check-In': { bg: '#fff8e1', text: '#f59e0b' },
  'Study Support':    { bg: '#e8f5e9', text: '#4caf50' },
  'Task Planning':    { bg: '#e3f2fd', text: '#42a5f5' },
  'Stress Management':{ bg: '#fce4ec', text: '#e91e63' },
};

const STATUS_COLORS = {
  'Scheduled': { bg: '#e8f5e9', text: '#4caf50' },
  'Completed':  { bg: '#ede7f6', text: '#7e57c2' },
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
}

export default function SessionListItem({ session, onOpen }) {
  const typeStyle = TYPE_COLORS[session.type] || { bg: '#f3f4f6', text: '#6b7280' };
  const statusStyle = STATUS_COLORS[session.status] || { bg: '#f3f4f6', text: '#6b7280' };

  return (
    <div
      className="bg-white rounded-2xl px-5 py-4 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      onClick={onOpen}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          {/* Name + badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-800">{session.studentName}</span>
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ backgroundColor: typeStyle.bg, color: typeStyle.text }}
            >
              {session.type}
            </span>
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
            >
              {session.status}
            </span>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-5 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <User size={13} />
              Focus Peer: {session.focusPeer}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays size={13} />
              {formatDate(session.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              {formatTime(session.time)} ({session.duration})
            </span>
          </div>
        </div>

        <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
      </div>
    </div>
  );
}