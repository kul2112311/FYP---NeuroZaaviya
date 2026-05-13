import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, AlertTriangle } from 'lucide-react';

export default function SessionFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch('${import.meta.env.VITE_API_URL}/api/monitor/feedback');
        if (res.ok) setFeedbacks(await res.json());
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };
    fetchFeedback();
  }, []);

  if (isLoading) return <div className="p-8 text-center text-[#9575a3]">Loading feedback logs...</div>;

  return (
    <div className="bg-white rounded-3xl p-6 border border-[rgba(179,157,219,0.2)] mt-6">
      <h2 className="text-xl font-bold text-[#5a4a61] mb-6">University Session Feedback Logs</h2>

      {feedbacks.length === 0 ? (
        <p className="text-center text-[#9575a3] py-8">No feedback submitted yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="p-5 rounded-2xl border border-[rgba(179,157,219,0.2)] bg-[#fdf7fd] flex flex-col md:flex-row gap-6 items-start">
              
              {/* Left Column: People & Meta */}
              <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-[rgba(179,157,219,0.2)] pb-4 md:pb-0 md:pr-6">
                <div className="mb-3">
                  <p className="text-xs text-[#9575a3] uppercase font-bold tracking-wider mb-1">Reviewed By (Student)</p>
                  <p className="font-semibold text-[#5a4a61]">{fb.student_name}</p>
                </div>
                <div>
                  <p className="text-xs text-[#b39ddb] uppercase font-bold tracking-wider mb-1">Focus Peer</p>
                  <p className="font-semibold text-[#5a4a61]">{fb.peer_name}</p>
                </div>
                <p className="text-xs text-[#9575a3] mt-4">{fb.date}</p>
              </div>

              {/* Right Column: Review */}
              <div className="flex-1 w-full">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill={i < fb.rating ? "#f59e0b" : "none"} color={i < fb.rating ? "#f59e0b" : "#d8cfe0"} />
                  ))}
                </div>
                <div className="flex items-start gap-2 bg-white p-4 rounded-xl border border-[rgba(179,157,219,0.15)] shadow-sm">
                  <MessageSquare size={16} className="text-[#b39ddb] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-[#5a4a61] italic">"{fb.feedback_text}"</p>
                </div>

                {/* ✨ NEW: Render the Alert Warning Box if an alert was generated! */}
                {fb.alert_text && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 shadow-sm">
                    <AlertTriangle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-red-700 uppercase tracking-wider block mb-1">
                        High Priority Alert Raised
                      </span>
                      <span className="text-sm text-red-600 leading-relaxed">
                        {fb.alert_text}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}