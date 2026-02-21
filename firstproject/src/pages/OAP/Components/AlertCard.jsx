// src/components/CommunityComponents/AlertCard.jsx
import React from 'react';
import { Clock, User, AlertCircle } from 'lucide-react';

export default function AlertCard({ alert }) {
  const statusColor = {
    open: 'bg-red-100 text-red-700',
    'in-progress': 'bg-yellow-100 text-yellow-700',
    resolved: 'bg-green-100 text-green-700'
  }[alert.status] || 'bg-gray-100 text-gray-700';

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-semibold">
            {alert.studentName.split(' ').map(n => n[0]).slice(0,2).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="font-semibold text-gray-800">{alert.studentName}</div>
              <div className={`text-xs px-2 py-0.5 rounded-full ${statusColor}`}>{alert.status.replace('-', ' ')}</div>
            </div>
            <div className="text-sm text-gray-600 mt-1">{alert.title}</div>
            <div className="text-xs text-gray-400 mt-2">
              Raised by {alert.raisedBy} • Assigned to {alert.assignedTo}
            </div>
          </div>
        </div>

        <div className="text-right text-sm text-gray-500">
          <div className="flex items-center gap-1 justify-end">
            <Clock size={14} />
            <span>{alert.date}</span>
          </div>
        </div>
      </div>

      {alert.description && (
        <div className="mt-3 text-sm text-gray-700">
          {alert.description}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button className="px-3 py-1 rounded-md bg-[#B39DDB] text-white text-sm hover:bg-[#9575CD]">View</button>
        <button className="px-3 py-1 rounded-md border text-sm">Assign</button>
        <button className="px-3 py-1 rounded-md border text-sm text-red-600">Resolve</button>
      </div>
    </div>
  );
}
