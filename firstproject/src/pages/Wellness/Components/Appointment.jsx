import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle, Loader } from 'lucide-react';

export default function Appointment() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await fetch('https://fyp-neuro-zaaviya-server-01.vercel.app/api/monitor/appointments');
        if (res.ok) setAppointments(await res.json());
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };
    fetchApps();
  }, []);

  if (isLoading) return <div className="p-8 text-center text-[#9575a3]">Loading all university appointments...</div>;

  return (
    <div className="bg-white rounded-3xl p-6 border border-[rgba(179,157,219,0.2)] mt-6">
      <h2 className="text-xl font-bold text-[#5a4a61] mb-6">University-Wide Appointments</h2>
      
      {appointments.length === 0 ? (
        <p className="text-center text-[#9575a3] py-8">No appointments scheduled yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appointments.map((app) => (
            <div key={app.id} className="p-5 rounded-2xl border border-[rgba(179,157,219,0.2)] bg-[#fdf7fd] hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-semibold text-[#b39ddb] uppercase tracking-wider mb-1">Student</p>
                  <p className="font-bold text-[#5a4a61]">{app.student_name}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                  app.status === 'completed' ? 'bg-green-100 text-green-600' :
                  app.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-purple-100 text-[#b39ddb]'
                }`}>
                  {app.status.toUpperCase()}
                </span>
              </div>
              
              <div className="pt-3 border-t border-[rgba(179,157,219,0.15)]">
                <p className="text-xs font-semibold text-[#b39ddb] uppercase tracking-wider mb-1">Focus Peer</p>
                <div className="flex items-center gap-2 mb-3">
                  <User size={16} className="text-[#9575a3]" />
                  <span className="text-[#5a4a61] font-medium">{app.peer_name}</span>
                </div>
                
                <div className="flex gap-4 text-xs text-[#9575a3]">
                  <div className="flex items-center gap-1"><Calendar size={14}/> {app.date}</div>
                  <div className="flex items-center gap-1"><Clock size={14}/> {app.start_time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}