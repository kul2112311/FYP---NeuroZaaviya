import React, { useState, useEffect } from 'react';
import { Clock, User } from 'lucide-react';

export default function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const daysMap = { 0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' };

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/monitor/schedules');
        if (res.ok) setSchedules(await res.json());
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };
    fetchSchedules();
  }, []);

  if (isLoading) return <div className="p-8 text-center text-[#9575a3]">Loading schedules...</div>;

  // Group by peer name
  const grouped = schedules.reduce((acc, slot) => {
    if (!acc[slot.peer_name]) acc[slot.peer_name] = [];
    acc[slot.peer_name].push(slot);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-3xl p-6 border border-[rgba(179,157,219,0.2)] mt-6">
      <h2 className="text-xl font-bold text-[#5a4a61] mb-6">Global Peer Availability</h2>

      {Object.keys(grouped).length === 0 ? (
        <p className="text-center text-[#9575a3] py-8">No peers have set their availability yet.</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([peerName, slots]) => (
            <div key={peerName} className="p-5 rounded-2xl border border-[rgba(179,157,219,0.2)] bg-[#fdf7fd]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#e1bee7] flex items-center justify-center">
                  <User size={20} className="text-[#5a4a61]" />
                </div>
                <h3 className="font-bold text-[#5a4a61] text-lg">{peerName}</h3>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {slots.map(slot => (
                  <div key={slot.id} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-[rgba(179,157,219,0.3)] shadow-sm text-sm">
                    <span className="font-bold text-[#b39ddb]">{daysMap[slot.day_of_week]}</span>
                    <Clock size={14} className="text-[#9575a3]" />
                    <span className="text-[#5a4a61]">{slot.start_time} - {slot.end_time}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}