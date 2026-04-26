import { useState } from 'react';
import { Search, X, Calendar as CalendarIcon, Trash2, PartyPopper } from 'lucide-react';
import { EventCard, EventModal } from '../../components/CommunityComponents/EventCard.jsx';

function EventsPage({ isAdmin = false }) {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const availableTags = ["OAP", "Wellness", "Ehsaas", "Workshop", "Mental Health", "Social"];

  // CLEAN SLATE! Removed hardcoded events.
  const [events, setEvents] = useState([]);

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

      {/* Grid Area */}
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

        {/* Empty State */}
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-[#E1BEE7] rounded-3xl bg-purple-50/20">
             <PartyPopper size={48} className="text-[#CE93D8] mb-4 opacity-70" />
             <h3 className="text-xl font-semibold text-[#5A4A61]">No Upcoming Events</h3>
             <p className="text-sm text-gray-500 mt-2 text-center max-w-sm">
               The event calendar is currently empty. Check back later or add a new event to get the community engaged!
             </p>
             {isAdmin && (
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="mt-6 px-6 py-2 bg-[#B39DDB] text-white rounded-xl font-medium shadow-sm hover:bg-[#9575CD] transition-all"
                >
                  Create the first event
                </button>
             )}
          </div>
        ) : (
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
            
            {/* If there are events, but the search filter hides them all */}
            {filteredEvents.length === 0 && events.length > 0 && (
               <div className="col-span-full py-12 text-center text-gray-400">
                  No events match your current search or tag filters.
               </div>
            )}
          </div>
        )}
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
    date: '', 
    time: '', 
    location: '',
    description: '',
    requirements: '',
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