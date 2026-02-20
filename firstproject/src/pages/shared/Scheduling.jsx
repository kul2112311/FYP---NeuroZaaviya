import { List, Search, ChevronDown } from "lucide-react";
import { useState } from "react";

import  Calendar   from "../../components/CommunityComponents/Calendar.jsx"; 
import "react-calendar/dist/Calendar.css";
import AppointmentModal from "../../components/CommunityComponents/AppointmentModal.jsx"; 


function Schedule(){
    const [date, setDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    return(
      
       <div className="p-6 pl-12 space-y-6" style={{ width: '80vw' }}>
        {isModalOpen && (
        <AppointmentModal onClose={() => setIsModalOpen(false)} />
      )}
        <div className="rounded-3xl p-6 bg-white flex justify-between items-center gap-5">
            
            <div className="flex flex-col">
            <h4 className="text-2xl font-semibold text-grey-800" >
                Schedule Your Week
            </h4>
            <p className="text-grey-700">Manage and schedule meetings with your assigned students</p>
            </div>
            <button onClick ={()=>setIsModalOpen(true)} className="bg-[#B39DDB] text-white px-4 py-2 rounded-lg hover:bg-[#9575CD] transition-colors">+ Schedule Appointment</button>
        </div>
        <div className="bg-white rounded-3xl p-4 flex items-center justify-between gap-4 mb-6">
      {/* Left: View Toggle */}
      <div className="flex gap-3">
        <button className="bg-[#B39DDB] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#9575CD] transition-colors">
          {/* <Calendar size={18} /> */}
          <span>Calendar View</span>
        </button>
        <button className="bg-white text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100 transition-colors border border-gray-200">
          <List size={18} />
          <span>List View</span>
        </button>
      </div>

      {/* Right: Search & Filter */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search appointments..." 
            className="pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#B39DDB]"
          />
        </div>
        
        <select className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:border-[#B39DDB] cursor-pointer focus:outline-none focus:border-[#B39DDB]">
          <option>All Status</option>
          <option>Scheduled</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
      </div>
    </div>

   <div className="flex gap-6">
          <Calendar onDateSelect={setDate} />

          <div className="flex-1 bg-white rounded-3xl p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </h3>
            <p className="text-gray-600">No appointments scheduled for this date</p>
          </div>
        </div>

    </div>
    )
}
export default Schedule;