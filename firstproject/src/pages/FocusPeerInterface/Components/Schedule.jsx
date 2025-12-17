import React, { useState, useEffect } from 'react';
import { Clock, X, Plus, Loader } from 'lucide-react';

function Schedule() {
  // Sarah Ahmed's user ID
  const PEER_USER_ID = "a2222222-2222-2222-2222-222222222222";
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [schedule, setSchedule] = useState({
    Monday: [], Tuesday: [], Wednesday: [], Thursday: [],
    Friday: [], Saturday: [], Sunday: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Day name to number mapping (0=Sunday, 6=Saturday)
  const dayToNumber = {
    'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
    'Thursday': 4, 'Friday': 5, 'Saturday': 6
  };
  
  const numberToDay = {
    0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday',
    4: 'Thursday', 5: 'Friday', 6: 'Saturday'
  };

  // 24-hour time options for backend compatibility
  const timeOptions = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'
  ];

  // Convert 24h to 12h format for display
  const formatTime12h = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Fetch schedule from backend
  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/api/peer-schedule/${PEER_USER_ID}`);
      const data = await response.json();
      
      console.log('📅 Fetched schedule:', data);
      
      // Organize by day
      const organized = {
        Monday: [], Tuesday: [], Wednesday: [], Thursday: [],
        Friday: [], Saturday: [], Sunday: []
      };
      
      data.forEach(slot => {
        const dayName = numberToDay[slot.day_of_week];
        organized[dayName].push({
          id: slot.id,
          start: slot.start_time,
          end: slot.end_time
        });
      });
      
      setSchedule(organized);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching schedule:", error);
      setIsLoading(false);
    }
  };

  const handleAddSlot = async () => {
    if (!selectedDay || !startTime || !endTime) return;
    
    // Validate end time is after start time
    if (startTime >= endTime) {
      alert("End time must be after start time!");
      return;
    }
    
    setIsSaving(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/peer-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: PEER_USER_ID,
          day_of_week: dayToNumber[selectedDay],
          start_time: startTime,
          end_time: endTime
        })
      });

      if (response.ok) {
        const newSlot = await response.json();
        console.log('✅ Slot added:', newSlot);
        
        // Update local state
        setSchedule(prev => ({
          ...prev,
          [selectedDay]: [...prev[selectedDay], {
            id: newSlot.id,
            start: newSlot.start_time,
            end: newSlot.end_time
          }]
        }));
        
        setIsModalOpen(false);
        setSelectedDay('Monday');
        setStartTime('09:00');
        setEndTime('10:00');
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to add time slot");
      }
    } catch (error) {
      console.error("Error adding slot:", error);
      alert("An error occurred while adding the slot");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveSlot = async (day, slotId, index) => {
    if (!confirm("Are you sure you want to remove this time slot?")) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/peer-schedule/${slotId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        console.log('✅ Slot removed');
        
        // Update local state
        setSchedule(prev => ({
          ...prev,
          [day]: prev[day].filter((_, i) => i !== index)
        }));
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to remove time slot");
      }
    } catch (error) {
      console.error("Error removing slot:", error);
      alert("An error occurred while removing the slot");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex items-center justify-center">
        <Loader className="animate-spin" size={32} />
        <span className="ml-2">Loading schedule...</span>
      </div>
    );
  }

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
                      key={slot.id || index}
                      className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-[#B39DDB] rounded-full text-sm border border-purple-200"
                    >
                      <Clock size={14} />
                      <span>{formatTime12h(slot.start)} - {formatTime12h(slot.end)}</span>
                      <button
                        onClick={() => handleRemoveSlot(day, slot.id, index)}
                        className="hover:bg-purple-100 rounded-full p-0.5 transition-colors"
                        title="Remove this time slot"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
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
                    <option key={time} value={time}>{formatTime12h(time)}</option>
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
                    <option key={time} value={time}>{formatTime12h(time)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isSaving}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSlot}
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-[#B39DDB] hover:bg-[#9575CD] text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Slot'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Schedule;