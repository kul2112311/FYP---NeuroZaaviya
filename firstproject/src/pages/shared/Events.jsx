import { useState } from 'react';
import { Search } from 'lucide-react';
import EventCard from '../../components/CommunityComponents/EventCard.jsx';
function Events(){
    const [search, setSearch] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const availableTags = [
    "OAP", "Wellness", "Ehsaas", "Workshop"
    , "Mental Health", "Social"
  ];
  const [events, setEvents] = useState([
  {
    id: 1,
    tag: "Wellness",
    daysUntil: 10,
    title: "Mindfulness & Meditation Session",
    description: "A calming guided meditation session designed to help students reduce anxiety...",
    date: "Jan 28",
    time: "4:00 PM - 5:00 PM",
    location: "Wellness Center - Quiet Room",
    attendees: 18,
    capacity: 25
  },
  {
    id: 2,
    tag: "OAP",
    daysUntil: 16,
    title: "Academic Accommodation Workshop",
    description: "Learn about various academic accommodations available for students with learning differences...",
    date: "Jan 30",
    time: "2:00 PM - 4:00 PM",
    location: "Student Center - Main Hall",
    attendees: 67,
    capacity: 100
  }
]);
  const handleTagToggle = (tag) =>{
    const isSelected = selectedTags.includes(tag);
    if(isSelected){
        const updatedTags=selectedTags.filter(item => item !== tag);
        setSelectedTags(updatedTags);
    }
    else{
        const updatedTags = [...selectedTags, tag];
        setSelectedTags(updatedTags);
    }
  }
  const filteredEvents = events.filter(event => 
  selectedTags.length === 0 || selectedTags.includes(event.tag)
);
    return(
         <div className="p-6 pl-12 space-y-6" style={{ width: '80vw' }}>
            <div className="rounded-3xl p-6 bg-white flex justify-between items-center gap-5">
            
            <div className="flex flex-col">
            <h4 className="text-2xl font-semibold text-grey-800" >
                Upcoming Events
            </h4>
            <p className="text-grey-700">View upcoming univeristy events</p>
            </div>
            <button className="bg-[#B39DDB] text-white px-4 py-2 rounded-lg hover:bg-[#9575CD] transition-colors">+ Add an Event</button>
        </div>
        <div className="bg-white rounded-3xl p-6">
            <form className='space-y-4'>
                    {/* Search Bar */}
                    <div className='flex items-center gap-3 pb-4 border-b border-gray-200 rounded-2xl px-4 py-3 bg-gray-50'>
                        <Search size={20} className='text-gray-400' />
                        <input
                            type='text'
                            placeholder='Search by event name, tags....'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className='flex-1 border border-gray-300 text-gray-700 placeholder-gray-400 bg-transparent rounded-2xl'
                        />
                    </div>

                    {/* Filters */}
                   


                        
                    
                </form>
                {/* Tags Section */}
                    <div className="mt-4 gap-6  flex">
                        {
                            availableTags.map(tag=>(
                                <button
                                key={tag}
                                onClick={() => handleTagToggle(tag)}
                                 className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                        selectedTags.includes(tag)
                                        ? 'bg-[#B39DDB] text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {tag}
                                </button>
                            ))
                }
                    </div>
                <div >

            <div className="grid grid-cols-3 gap-6 mt-6">
                {filteredEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        </div>
        </div>
        </div>
    )
}
export default Events;