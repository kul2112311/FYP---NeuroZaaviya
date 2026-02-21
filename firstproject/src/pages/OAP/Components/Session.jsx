// src/components/FocusPeer/SessionListItem.jsx
import { Clock, MapPin, AlertTriangle } from 'lucide-react';

export default function SessionListItem({ session, onOpen }) {
  return (
    <div
      onClick={onOpen}
      className="cursor-pointer bg-white rounded-xl p-4 border border-gray-100 hover:shadow-sm transition"
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-semibold">
              {session.studentName.split(' ').map(n => n[0]).slice(0,2).join('')}
            </div>
            <div>
              <div className="font-semibold">{session.studentName}</div>
              <div className="text-sm text-gray-500">{session.type} • {session.focusPeer}</div>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-500">{new Date(session.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {session.time}</div>
          <div className={`mt-2 inline-block px-3 py-1 rounded-full text-xs ${session.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {session.status}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1"><Clock size={14} /> <span>{session.duration}</span></div>
        <div className="flex items-center gap-1"><MapPin size={14} /> <span>{session.location}</span></div>
        {session.alertCreated && <div className="flex items-center gap-1 text-red-500"><AlertTriangle size={14} /> Alert Created</div>}
      </div>
    </div>
  );
}
