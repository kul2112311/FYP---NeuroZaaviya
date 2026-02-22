// src/pages/OAP/Components/SessionModal.jsx
import { X, Star } from 'lucide-react';

export default function SessionDetailModal({ session, onClose }) {
  if (!session) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-auto max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">{session.studentName} — {session.type}</h3>
            <div className="text-sm text-gray-500">{session.focusPeer} • {new Date(session.date).toLocaleDateString()} • {session.time}</div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X /></button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <h4 className="font-medium">Session Notes</h4>
              <p className="text-gray-700 mt-2 whitespace-pre-line">{session.notes || 'No notes recorded.'}</p>
            </div>

            <div className="col-span-1 bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500">Status</div>
              <div className="font-semibold mt-1">{session.status}</div>

              <div className="mt-4">
                <div className="text-sm text-gray-500">Rating</div>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} className={i < (session.rating || 0) ? 'text-yellow-400' : 'text-gray-300'} />
                  ))}
                </div>
                {session.points != null && <div className="text-sm text-gray-500 mt-3">Points awarded: <span className="font-medium">{session.points}</span></div>}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-lg bg-[#B39DDB] text-white hover:bg-[#9575CD]">Mark Completed</button>
            <button className="px-4 py-2 rounded-lg border">Create Alert</button>
            <button className="px-4 py-2 rounded-lg border">Add Follow-up</button>
          </div>

          <div className="text-xs text-gray-400">Booked on: Dec 6 • Completed at: {session.status === 'Completed' ? 'Dec 10, 10:00 AM' : '—'}</div>
        </div>
      </div>
    </div>
  );
}
