// src/components/Accommodations/StudentAccommodationCard.jsx
import React from 'react';
import { X } from 'lucide-react';

export default function StudentAccommodationCard({ student, onAdd, onRemove }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center text-purple-800 font-semibold">
            {student.name.split(' ').map(n => n[0]).slice(0,2).join('')}
          </div>
          <div>
            <div className="font-semibold">{student.name}</div>
            <div className="text-sm text-gray-500">{student.email} • ID: {student.id}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => onAdd(student)} className="text-sm px-3 py-1 rounded-md bg-white border border-gray-200 hover:bg-gray-100">+ Add Accommodation</button>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {student.accommodations.map(acc => (
          <div key={acc.id} className="flex items-start justify-between bg-white p-3 rounded-lg border border-gray-100">
            <div>
              <div className="font-medium">{acc.type}</div>
              <div className="text-sm text-gray-600">{acc.details}</div>
              <div className="text-xs text-gray-400 mt-1">
                Granted: {new Date(acc.granted).toLocaleDateString()} {acc.expires ? `• Expires: ${new Date(acc.expires).toLocaleDateString()}` : ''}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => onRemove(student.id, acc.id)} className="text-red-500 hover:text-red-600" aria-label="Remove accommodation">
                <X size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
