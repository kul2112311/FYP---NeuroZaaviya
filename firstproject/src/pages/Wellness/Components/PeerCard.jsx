import { Calendar, Clock, Star } from 'lucide-react';

function PeerCard({ peer }) {
  return (
    <div className="bg-[#B39DDB]/10  rounded-2xl shadow-sm border border-gray-200 p-6">
      {/* Peer Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className={`w-16 h-16 rounded-full ${peer.avatarColor} flex items-center justify-center text-white text-xl font-semibold`}>
          {peer.initials}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{peer.name}</h3>
          <p className="text-sm text-gray-500">{peer.specialty}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star size={16} fill="#fbbf24" color="#fbbf24" />
            <span className="text-sm font-medium text-gray-700">{peer.rating}</span>
          </div>
        </div>
      </div>

      {/* Session Stats */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 bg-white rounded-2xl border border-[#B39DDB]/30 p-2 text-center">
          <p className="text-xs text-gray-500 mb-1">Total Sessions</p>
          <p className="text-2xl font-semibold text-gray-400">{peer.totalSessions}</p>
        </div>
        <div className="flex-1 bg-white rounded-2xl border border-[#B39DDB]/30 p-2 text-center">
          <p className="text-xs text-gray-500 mb-1">Upcoming</p>
          <p className="text-2xl font-semibold text-gray-400">{peer.upcomingSessions}</p>
        </div>
      </div>

      {/* Available This Week */}
      <div className=' bg-white rounded-2xl border border-[#B39DDB]/30 p-2'>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Available This Week</h4>
        <div className="grid grid-cols-2 gap-3">
          {peer.availability.map((slot, index) => (
            <div key={index} className="space-y-1 p-2 bg-[#E1BEE7]/20 rounded-2xl border border-[#B39DDB]/30 flex flex-col">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={14} className="text-gray-400" />
                <span>{slot.day}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={14} className="text-gray-400" />
                <span>{slot.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PeerCard;
