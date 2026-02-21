import { Calendar, Clock, MapPin, Users, Eye} from 'lucide-react';
function EventCard({event}){
    return(
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
             {/* Tag + Days */}
            <div className="flex justify-between items-start mb-4">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                {event.tag}
                </span>
                <span className="text-gray-500 text-sm">In ~{event.daysUntil} days</span>
            </div>
            {/* Event Title */}
             <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {event.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {event.description}
            </p>
            {/* Date, Time, Location */}
      <div className="space-y-2 mb-4 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-400" />
          {event.date}
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gray-400" />
          {event.time}
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-gray-400" />
          {event.location}
        </div>
      </div>

      {/* Capacity */}
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
            <Users size={16} className="text-gray-400" />
            {event.attendees} / {event.capacity}
            </div>
            <span className="text-sm text-gray-600">
            {Math.round((event.attendees / event.capacity) * 100)}% full
            </span>
        </div>
      {/* View Details Button */}
        <button className="w-full bg-gradient-to-r from-purple-400 to-pink-400 text-white py-2 rounded-full font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <Eye size={18} />
            View Details
        </button>
        </div>
    )
}
export default EventCard;