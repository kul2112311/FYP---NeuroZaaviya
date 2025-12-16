import React, { useState } from 'react';
import { Clock, X, Plus } from 'lucide-react';

function Schedule() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [startTime, setStartTime] = useState('9:00 AM');
  const [endTime, setEndTime] = useState('10:00 AM');
  
  const [schedule, setSchedule] = useState({
    Monday: [{ start: '9:00 AM', end: '10:00 AM' }],
    Tuesday: [],
    Wednesday: [
      { start: '10:00 AM', end: '11:00 AM' },
      { start: '2:00 PM', end: '3:00 PM' }
    ],
    Thursday: [],
    Friday: [
      { start: '11:00 AM', end: '12:00 PM' },
      { start: '1:00 PM', end: '2:00 PM' }
    ],
    Saturday: [{ start: '9:00 AM', end: '1:45 PM' }],
    Sunday: []
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const timeOptions = [
    '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
    '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM'
  ];

  const handleAddSlot = () => {
    if (selectedDay && startTime && endTime) {
      setSchedule(prev => ({
        ...prev,
        [selectedDay]: [...prev[selectedDay], { start: startTime, end: endTime }]
      }));
      setIsModalOpen(false);
      // Reset to defaults
      setSelectedDay('Monday');
      setStartTime('9:00 AM');
      setEndTime('10:00 AM');
    }
  };

  const handleRemoveSlot = (day, index) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Your Availability Schedule
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#B39DDB] hover:bg-[#9575CD] text-white rounded-lg transition-colors"
          >
            <Plus size={18} />
            Add Time Slot
          </button>
        </div>

        {/* Schedule List */}
        <div className="space-y-4">
          {days.map(day => (
            <div key={day} className="border-b border-gray-200 pb-4 last:border-b-0">
              <h3 className="font-semibold text-gray-700 mb-2">{day}</h3>
              
              {schedule[day].length === 0 ? (
                <p className="text-gray-400 italic text-sm">No availability set</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {schedule[day].map((slot, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-[#B39DDB] rounded-full text-sm border border-purple-200"
                    >
                      <Clock size={14} />
                      <span>{slot.start} - {slot.end}</span>
                      <button
                        onClick={() => handleRemoveSlot(day, index)}
                        className="hover:bg-purple-100 rounded-full p-0.5 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black-500/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Add Availability Slot
            </h3>

            {/* Day Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Day
              </label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B39DDB] focus:border-transparent"
              >
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            {/* Time Selectors */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B39DDB] focus:border-transparent"
                >
                  {timeOptions.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B39DDB] focus:border-transparent"
                >
                  {timeOptions.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSlot}
                className="flex-1 px-4 py-2 bg-[#B39DDB] hover:bg-[#9575CD] text-white rounded-lg transition-colors"
              >
                Add Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Schedule;