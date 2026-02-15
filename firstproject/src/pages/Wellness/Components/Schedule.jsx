import PeerCard from "./PeerCard";
function Schedule() {
  const dummyPeers = [
    {
      id: 1,
      name: "Sarah Ahmed",
      specialty: "CS | SDP",
      rating: 4.8,
      initials: "SA",
      avatarColor: "bg-red-500",
      totalSessions: 45,
      upcomingSessions: 6,
      availability: [
        { day: "Mon", time: "10:00 AM" },
        { day: "Mon", time: "2:00 PM" },
        { day: "Wed", time: "11:00 AM" },
        { day: "Fri", time: "3:00 PM" }
      ]
    },
    {
      id: 2,
      name: "Marcus Chen",
      specialty: "EE | CE",
      rating: 4.9,
      initials: "MC",
      avatarColor: "bg-gray-700",
      totalSessions: 52,
      upcomingSessions: 8,
      availability: [
        { day: "Sun", time: "9:00 AM" },
        { day: "Tue", time: "1:00 PM" },
        { day: "Thu", time: "4:00 PM" },
        { day: "Sat", time: "10:00 AM" }
      ]
    },
    {
      id: 3,
      name: "Layla Hassan",
      specialty: "CND | CH",
      rating: 4.7,
      initials: "LH",
      avatarColor: "bg-green-600",
      totalSessions: 38,
      upcomingSessions: 5,
      availability: [
        { day: "Mon", time: "3:00 PM" },
        { day: "Tue", time: "11:00 AM" },
        { day: "Thu", time: "2:00 PM" },
        { day: "Sun", time: "1:00 PM" }
      ]
    },
    {
      id: 4,
      name: "Jordan Taylor",
      specialty: "CH | CS",
      rating: 4.6,
      initials: "JT",
      avatarColor: "bg-purple-500",
      totalSessions: 29,
      upcomingSessions: 4,
      availability: [
        { day: "Sun", time: "2:00 PM" },
        { day: "Wed", time: "9:00 AM" },
        { day: "Fri", time: "11:00 AM" },
        { day: "Mon", time: "3:00 PM" }
      ]
    }
  ];

 return (
    <div className="bg-white p-6" style={{ borderRadius: '24px' }}>
      <h2 className="text-sm mb-6" style={{ color: '#E1BEE7' }}>Focus Peer Schedule</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dummyPeers.map(peer => (
          <PeerCard key={peer.id} peer={peer} />
        ))}
      </div>
    </div>
  )}
export default Schedule;