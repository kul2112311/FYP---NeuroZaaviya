import React, { useState, useEffect } from "react";
import { Calendar, User, FileText, Clock, X } from "lucide-react";

function CheckupCard({ checkup }) {
  const dateObj = new Date(checkup.date);
  const displayDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const displayTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-[20.8px] pt-[20.8px] pb-[20.8px] flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
            <User size={20} className="text-[#B39DDB]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#5A4A61] leading-tight">{checkup.title}</h3>
            <p className="text-xs text-gray-500 mt-1">with {checkup.studentName}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 flex-1">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={16} className="text-gray-400" />
          <span>{displayDate}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock size={16} className="text-gray-400" />
          <span>{displayTime}</span>
        </div>
        
        <div className="pt-3 border-t border-gray-100 mt-2">
          <div className="flex items-start gap-2">
            <FileText size={16} className="text-gray-400 mt-0.5 shrink-0" />
            <p className="text-xs text-gray-500 italic leading-relaxed">
              {checkup.description}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#B39DDB] bg-purple-50 px-2 py-1 rounded">
          {checkup.status === 'pending' ? 'Upcoming Check-in' : checkup.status}
        </span>
      </div>
    </div>
  );
}

export default function UpcomingCheckups() {
  const [checkins, setCheckins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // FIXED: Now using Sarah Ahmed's actual Focus Peer ID
  const PEER_USER_ID = "b1111111-1111-1111-1111-111111111111";

  useEffect(() => {
    const fetchCheckins = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/checkups/peer/${PEER_USER_ID}`);
        const data = await response.json();
        
        if (response.ok) {
          setCheckins(data);
        } else {
          console.error("Failed to fetch checkups:", data.error);
        }
      } catch (err) {
        console.error("Network error fetching checkups:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCheckins();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Scheduled Check-ups</h2>
        <p className="text-sm text-gray-500">Monitor your upcoming follow-up meetings with students.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <p className="text-gray-500 animate-pulse">Loading your check-ups...</p>
        </div>
      ) : checkins.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {checkins.map((checkup) => (
            <CheckupCard key={checkup.id} checkup={checkup} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-12 text-center">
          <p className="text-gray-500 font-medium">No check-ups scheduled yet.</p>
          <p className="text-xs text-gray-400 mt-1">Schedule one from the 'My Sessions' tab.</p>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// CREATE CHECKUP MODAL
// -------------------------------------------------------------
export function CreateCheckupModal({ student, isOpen, onClose, onCreate }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({
      title: formData.title,
      description: formData.description,
      rawDate: formData.date, 
      rawTime: formData.time, 
      studentId: student?.id, 
      studentName: student?.name
    });
    setFormData({ title: "", description: "", date: "", time: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Create Check-up</h2>
            <p className="text-gray-600 text-sm">Schedule a check-in with {student?.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input 
              type="text" name="title" value={formData.title} onChange={handleChange}
              placeholder="e.g. Weekly Progress Check"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea 
              name="description" value={formData.description} onChange={handleChange}
              placeholder="What to discuss..." rows="3"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:outline-none resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input 
                type="date" name="date" value={formData.date} onChange={handleChange}
                min={new Date().toISOString().split('T')[0]} 
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <input 
                type="time" name="time" value={formData.time} onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-medium">
              Cancel
            </button>
            <button type="submit" className="flex-1 px-4 py-3 text-white bg-purple-500 rounded-full hover:bg-purple-600 transition font-semibold shadow-md">
              Save Check-up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}