import React, { useState } from "react";
import { Bell, X } from "lucide-react";

function Notifications({ notifications = [] }) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition"
      >
        <Bell size={24} className="text-gray-700" />
        
        {/* Red Dot */}
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {notifications.map((notif, idx) => (
                  <div key={idx} className="p-4 hover:bg-gray-50 transition">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-1 flex-shrink-0"></div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-sm">{notif.title}</h4>
                        <p className="text-gray-600 text-xs mt-1">{notif.message}</p>
                        <p className="text-gray-400 text-xs mt-2">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500 text-sm">No notifications yet</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications;