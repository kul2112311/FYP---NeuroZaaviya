

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import CheckInCard from "./CheckinCard.jsx";

function CheckIn() {
  const [checkins, setCheckins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - Replace with API call later
  useEffect(() => {
    const mockCheckins = [
      {
        id: 1,
        peerName: "Asad Ali",
        title: "Weekly Progress Check",
        description: "Review progress on the history assignment and discuss any blockers.",
        date: "Feb 22, 3:05 PM",
        avatarColor: "purple",
        initials: "AA"
      },
      {
        id: 2,
        peerName: "Sarah Khan",
        title: "Assignment Review",
        description: "Go through your calculus assignment solutions and clarify concepts.",
        date: "Feb 23, 2:00 PM",
        avatarColor: "blue",
        initials: "SK"
      },
      {
        id: 3,
        peerName: "Ali Hassan",
        title: "Study Session Prep",
        description: "Prepare for upcoming midterm exams with focused study sessions.",
        date: "Feb 24, 4:30 PM",
        avatarColor: "purple",
        initials: "AH"
      }
    ];

    // Simulate API delay
    setTimeout(() => {
      setCheckins(mockCheckins);
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 px-[20.8px] pt-[20.8px] pb-[20.8px]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Clock size={20} className="text-purple-500" />
        <h2 className="text-lg font-semibold text-[#B39DDB]">
          Upcoming Check-ins with your Focus Peers
        </h2>
      </div>

      {/* Grid */}
      {isLoading ? (
        <p className="text-gray-600">Loading check-ins...</p>
      ) : checkins.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {checkins.map(checkin => (
            <CheckInCard key={checkin.id} checkin={checkin} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No upcoming check-ins scheduled yet.</p>
        </div>
      )}
    </div>
  );
}

export default CheckIn;