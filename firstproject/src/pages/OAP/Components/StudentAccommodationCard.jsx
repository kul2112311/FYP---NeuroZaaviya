import React from 'react';
import { X, Clock, Calendar, BookOpen, Settings, AlarmClock, Mic } from 'lucide-react';

const ACCOMMODATION_ICONS = {
  'Extra Time on Exams': Clock,
  'Additional Absences': Calendar,
  'Note-Taker Support': BookOpen,
  'Quiet Testing Room': Settings,
  'Flexible Deadlines': AlarmClock,
  'Audio Recording Permission': Mic,
};

function getIcon(type, isExpired) {
  const Icon = ACCOMMODATION_ICONS[type] || Clock;
  return <Icon size={16} style={{ color: isExpired ? '#ef5350' : '#4caf50' }} />;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

export default function StudentAccommodationCard({ student, onAdd, onRemove }) {
  const initials = student.name.split(' ').map(n => n[0]).slice(0, 2).join('');
  const now = new Date();

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">

      {/* Student header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0"
            style={{ backgroundColor: '#ede7f6', color: '#7e57c2' }}
          >
            {initials}
          </div>
          <div>
            <div className="font-semibold text-gray-800">{student.name}</div>
            <div className="text-sm text-gray-500">
              {student.email} &bull; ID: {student.id}
            </div>
          </div>
        </div>

        <button
          onClick={() => onAdd(student)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#B39DDB' }}
        >
          + Add Accommodation
        </button>
      </div>

      {/* Active Accommodations label */}
      {student.accommodations.length > 0 && (
        <div className="mt-4 mb-3">
          <span className="text-sm font-semibold" style={{ color: '#7e57c2' }}>
            Active Accommodations:
          </span>
        </div>
      )}

      {/* Accommodation cards — 2-col grid */}
      {student.accommodations.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {student.accommodations.map(acc => {
            const isExpired = acc.expires && new Date(acc.expires) < now;
            return (
              <div
                key={acc.id}
                className="relative rounded-xl p-3 border"
                style={{
                  backgroundColor: isExpired ? '#fff5f5' : '#f0fdf4',
                  borderColor: isExpired ? '#fecaca' : '#bbf7d0',
                }}
              >
                <button
                  onClick={() => onRemove(student.id, acc.id)}
                  className="absolute top-2 right-2 text-red-400 hover:text-red-600 transition-colors"
                  aria-label="Remove accommodation"
                >
                  <X size={14} />
                </button>

                <div className="flex items-center gap-2 mb-1 pr-5">
                  {getIcon(acc.type, isExpired)}
                  <span className="font-semibold text-sm text-gray-800">{acc.type}</span>
                </div>

                <div className="text-xs text-gray-600 mb-1">{acc.details}</div>

                <div className="text-xs text-gray-400">
                  Granted: {formatDate(acc.granted)}
                  {acc.expires && (
                    <span className={`ml-3 ${isExpired ? 'text-red-400 font-medium' : ''}`}>
                      {isExpired ? 'Expired:' : 'Expires:'} {formatDate(acc.expires)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}