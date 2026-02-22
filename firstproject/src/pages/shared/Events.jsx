// import { useState } from 'react';
// import { Search } from 'lucide-react';
// import {EventCard, EventModal} from '../../components/CommunityComponents/EventCard.jsx';

// function EventsPage({isAdmin=false}) {
//   const [search, setSearch] = useState('');
//   // Changed selectedTags to a single string for "single-select" logic
//   const [selectedTag, setSelectedTag] = useState(null); 
//   const [selectedEvent, setSelectedEvent] = useState(null);

//   const availableTags = ["OAP", "Wellness", "Ehsaas", "Workshop", "Mental Health", "Social"];

//   const [events, setEvents] = useState([
//     {
//       id: 1,
//       tag: "Wellness",
//       daysUntil: 10,
//       title: "Mindfulness & Meditation Session",
//       description: "A calming guided meditation session designed to help students reduce anxiety and improve focus.",
//       date: "Jan 28",
//       time: "4:00 PM - 5:00 PM",
//       location: "Wellness Center - Quiet Room",
//       attendees: 18,
//       capacity: 25
//     },
//     {
//       id: 2,
//       tag: "OAP",
//       daysUntil: 16,
//       title: "Academic Accommodation Workshop",
//       description: "Learn about various academic accommodations available for students with learning differences.",
//       date: "Jan 30",
//       time: "2:00 PM - 4:00 PM",
//       location: "Student Center - Main Hall",
//       attendees: 67,
//       capacity: 100
//     },
//     // New Ehsaas Event
//     {
//       id: 3,
//       tag: "Ehsaas",
//       daysUntil: 5,
//       title: "Ehsaas Financial Literacy Talk",
//       description: "A session dedicated to managing finances and understanding scholarship opportunities under the Ehsaas program.",
//       date: "Feb 15",
//       time: "11:00 AM - 1:00 PM",
//       location: "Auditorium B",
//       attendees: 45,
//       capacity: 60
//     },
//     // New Wellness Event
//     {
//       id: 4,
//       tag: "Wellness",
//       daysUntil: 12,
//       title: "Yoga for Stress Relief",
//       description: "Join us for a relaxing yoga session aimed at physical and mental rejuvenation.",
//       date: "Feb 22",
//       time: "8:00 AM - 9:30 AM",
//       location: "Gymnasium Hall 1",
//       attendees: 20,
//       capacity: 30
//     },
//     // New Ehsaas Event
//     {
//       id: 5,
//       tag: "Ehsaas",
//       daysUntil: 20,
//       title: "Community Support Meetup",
//       description: "Connect with fellow Ehsaas scholars and build a supportive community network.",
//       date: "March 2",
//       time: "3:00 PM - 5:00 PM",
//       location: "Common Room",
//       attendees: 12,
//       capacity: 40
//     }
//   ]);

//   // Logic to handle "Single-select" tag behavior
//   const handleTagToggle = (tag) => {
//     if (selectedTag === tag) {
//       setSelectedTag(null); // Deselect if clicking the same tag again
//     } else {
//       setSelectedTag(tag); // Switch to the new tag only
//     }
//   };

//   // Filter logic updated for single tag and search text
//   const filteredEvents = events.filter(event => {
//     const matchesTag = selectedTag === null || event.tag === selectedTag;
//     const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) || 
//                           event.tag.toLowerCase().includes(search.toLowerCase());
//     return matchesTag && matchesSearch;
//   });

//   return (
//     <div className="p-6 pl-12 space-y-6" style={{ width: '80vw' }}>
//       <div className="rounded-3xl p-6 bg-gradient-to-r from-[#B39DDB] to-[#F8BBD0] flex justify-between items-center gap-5  shadow-sm">
//         <div className="flex flex-col">
//           <h4 className="text-2xl font-semibold text-white">Upcoming Events</h4>
//           <p className="text-white">View upcoming university events</p>
//         </div>
//         {isAdmin && (
//           <button 
//             className="bg-[#B39DDB] text-white px-4 py-2 rounded-lg hover:bg-[#9575CD] transition-colors shadow-sm"
//             onClick={() => console.log("Open Add Event Modal")}
//           >
//             + Add an Event
//           </button>
//         )}
//       </div>

//       <div className="rounded-3xl p-6  border border-gray-100 ">
//         <div className='flex items-center gap-3 pb-4 border-b border-gray-200 rounded-2xl px-4 py-3 bg-gray-50'>
//           <Search size={20} className='text-gray-400' />
//           <input
//             type='text'
//             placeholder='Search by event name, tags....'
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className='flex-1 border-[#B39DDB] rounded-3xl focus:ring-0 text-gray-700 placeholder-gray-400 bg-transparent'
//           />
//         </div>

//         <div className="mt-4 gap-3 flex flex-wrap">
//           {availableTags.map(tag => (
//             <button
//               key={tag}
//               onClick={() => handleTagToggle(tag)}
//               className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
//                 selectedTag === tag
//                   ? 'bg-[#B39DDB] text-white shadow-md'
//                   : 'bg-white text-gray-600 hover:bg-gray-200 border border-gray-200'
//               }`}
//             >
//               {tag}
//             </button>
//           ))}
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
//           {filteredEvents.map(event => (
//             <EventCard 
//                 key={event.id} 
//                 event={event} 
//                 onViewDetails={() => setSelectedEvent(event)} // Pass the opener
//             />
//         ))}
//         </div>
//       </div>
//       {selectedEvent && (
//         <EventModal 
//           event={selectedEvent} 
//           onClose={() => setSelectedEvent(null)} 
//         />
//       )}
//     </div>
//   );
// }

// export default EventsPage;

// export function StudentInterfaceEvents(){
    


//   return <EventsPage isAdmin={false} />;

// }
// export function AdminInterfaceEvent(){
//     return <EventsPage isAdmin={true} />;
// }

import { useState } from 'react';
import { Search, X, Calendar, Clock, MapPin, Trash2 } from 'lucide-react';
import { EventCard, EventModal } from '../../components/CommunityComponents/EventCard.jsx';

function EventsPage({ isAdmin = false }) {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const availableTags = ["OAP", "Wellness", "Ehsaas", "Workshop", "Mental Health", "Social"];

  const [events, setEvents] = useState([
  {
    id: 1,
    tag: "Wellness",
    title: "Low-Stim Meditation",
    description: "A sensory-friendly meditation with dimmed lighting and zero background music. Fidget tools welcome.",
    date: "2026-05-28",
    time: "16:00",
    location: "Wellness Center (Room 202)",
    requirements: "Comfortable clothes, Noise-canceling headphones",
    attendees: 8,
    capacity: 12
  },
  {
    id: 2,
    tag: "Workshop",
    title: "Executive Functioning Hacks",
    description: "Practical strategies for breaking down large assignments into dopamine-friendly micro-tasks.",
    date: "2026-06-05",
    time: "14:00",
    location: "Learning Commons",
    requirements: "A current syllabus or 'to-do' list",
    attendees: 12,
    capacity: 20
  },
  {
    id: 3,
    tag: "OAP",
    title: "Silent Nature Hike",
    description: "A guided trail walk with a 'no-talking' rule to enjoy the sensory details of the forest without social pressure.",
    date: "2026-06-10",
    time: "09:00",
    location: "North Trailhead",
    requirements: "Sturdy shoes, Sunscreen, Water",
    attendees: 6,
    capacity: 10
  },
  {
    id: 4,
    tag: "Wellness",
    title: "Weighted Blanket Social",
    description: "A cozy hangout space. We provide weighted blankets and bean bags. Great for regulating your nervous system.",
    date: "2026-06-15",
    time: "18:30",
    location: "Student Union Lounge",
    requirements: "Your favorite cozy socks",
    attendees: 15,
    capacity: 15
  },
  {
    id: 5,
    tag: "OAP",
    title: "Intro to Rock Climbing",
    description: "Focus on the physical 'crunch' and movement of climbing. Great for proprioceptive seekers.",
    date: "2026-06-22",
    time: "13:00",
    location: "Campus Rec Wall",
    requirements: "Harness provided, Socks required",
    attendees: 5,
    capacity: 8
  },
  {
    id: 6,
    tag: "Workshop",
    title: "Digital Declutter Party",
    description: "We sit together and clean out our email inboxes and desktop folders. Body-doubling at its finest.",
    date: "2026-06-28",
    time: "11:00",
    location: "Computer Lab 4",
    requirements: "Laptop and charger",
    attendees: 22,
    capacity: 30
  }
  ]);

  const handleTagToggle = (tag) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const handleAddNewEvent = (newEvent) => {
    const eventWithId = {
      ...newEvent,
      id: Date.now(),
      attendees: 0,
    };
    setEvents([eventWithId, ...events]);
    setShowAddModal(false);
  };

  // Logic to remove/cancel an event
  const handleDeleteEvent = (id) => {
    if (window.confirm("Are you sure you want to cancel/remove this event?")) {
      setEvents(events.filter(event => event.id !== id));
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesTag = selectedTag === null || event.tag === selectedTag;
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) ||
                          event.tag.toLowerCase().includes(search.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="p-6 pl-12 space-y-6" style={{ width: '80vw' }}>
      {/* Header Area */}
      <div className="rounded-3xl p-6 bg-[#ce93d8] flex justify-between items-center gap-5 shadow-sm">
        <div className="flex flex-col">
          <h4 className="text-2xl font-semibold text-white">Upcoming Events</h4>
          <p className="text-white">View upcoming university events</p>
        </div>
        {isAdmin && (
          <button 
            className="bg-[#E1BEE7] text-[#5A4A61] px-4 py-2 rounded-lg hover:bg-[#9575CD] transition-colors shadow-sm"
            onClick={() => setShowAddModal(true)}
          >
            + Add an Event
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="rounded-3xl p-6 border border-gray-100 bg-white">
        <div className='flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-2xl border border-transparent focus-within:border-[#B39DDB] mb-6'>
          <Search size={20} className='text-gray-400' />
          <input
            type='text'
            placeholder='Search events...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='flex-1 bg-transparent outline-none text-[#5A4A61] rounded-2xl radius-2xl'
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <div key={event.id} className="relative group">
              <EventCard
                event={event}
                onViewDetails={() => setSelectedEvent(event)}
              />
              {/* Admin Cancel Button */}
              {isAdmin && (
                <button 
                  onClick={() => handleDeleteEvent(event.id)}
                  className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                  title="Cancel Event"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <AddEventModal 
          onClose={() => setShowAddModal(false)} 
          onSubmit={handleAddNewEvent} 
          tags={availableTags}
        />
      )}
      
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}

function AddEventModal({ onClose, onSubmit, tags }) {
  const [formData, setFormData] = useState({
    title: '',
    tag: tags[0],
    date: '', // HTML Date Input
    time: '', // HTML Time Input
    location: '',
    description: '',
    requirements: '',
    capacity: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="p-6 bg-[#B39DDB] text-white flex justify-between items-center">
          <h3 className="text-xl font-bold">Create New Event</h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full"><X /></button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="p-8 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Event Title</label>
            <input required name="title" onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-xl outline-none focus:border-[#B39DDB]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date</label>
              <input type="date" required name="date" onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-xl outline-none focus:border-[#B39DDB] text-gray-600" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Time</label>
              <input type="time" required name="time" onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-xl outline-none focus:border-[#B39DDB] text-gray-600" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Requirements</label>
            <input name="requirements" onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-xl outline-none focus:border-[#B39DDB]" placeholder="e.g. Bring CNIC, Laptop" />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</label>
            <textarea required name="description" onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-xl outline-none focus:border-[#B39DDB] h-20" />
          </div>

          <button type="submit" className="w-full bg-[#B39DDB] text-white py-3 rounded-2xl font-bold hover:bg-[#9575CD] transition-all">
            Publish Event
          </button>
        </form>
      </div>
    </div>
  );
}

export default EventsPage;

export function StudentInterfaceEvents(){
    


  return <EventsPage isAdmin={false} />;

}
export function AdminInterfaceEvent(){
    return <EventsPage isAdmin={true} />;
}