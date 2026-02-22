import React, { useState } from "react";
import { Heart } from "lucide-react";
import SupportStaffCard from "../../components/CommunityComponents/StudentSupportCard.jsx";
import SupportStaffModal from "../../components/CommunityComponents/SupportStaffModal.jsx";
import { User } from "lucide-react";

function SupportSupport() {
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const staffData = [
    {
      id: 1,
      name: "Fatima Khan",
      role: "OAP Advisor",
      department: "Office of Accessible Programs",
      image: "https://via.placeholder.com/150?text=Fatima",
      email: "fatima.khan@university.edu",
      location: "Student Services Building, Room 205",
      availability: "Monday-Friday 9:00 AM - 5:00 PM",
      batches: ["Class of 2022", "Class of 2023", "Class of 2024", "Class of 2025"],
      bgColor: "bg-[#E0E7FF]",
      calendlyLink: "https://calendly.com/fatima-khan",
      about: "Khan has over 15 years of experience in accessible education and student support. She specializes in creating individualized accommodation plans and advocating for neurodivergent students.",
      expertise: ["ADHD Support", "Executive Function Coaching", "Accommodation Planning", "Academic Advising"]
    },
    {
      id: 2,
      name: "Sara Ali",
      role: "Ehsas Counselor",
      department: "Ehsas Support Services",
      image: "https://via.placeholder.com/150?text=Sara",
      email: "sara.ali@university.edu",
      location: "Ehsas Office, Room 102",
      availability: "Monday-Friday 10:00 AM - 6:00 PM",
      batches: ["Class of 2023", "Class of 2024", "Class of 2025"],
      bgColor: "bg-[#E0E7FF]",
      calendlyLink: "https://calendly.com/sara-ali",
      about: "Sara provides compassionate mental health support and counseling services to help students navigate emotional and psychological challenges during their academic journey.",
      expertise: ["Mental Health Support", "Stress Management", "Crisis Intervention", "Student Wellness"]
    },
    {
      id: 3,
      name: "Dr. James Wilson",
      role: "Wellness Counselor",
      department: "Counseling & Wellness Services",
      image: "https://via.placeholder.com/150?text=James",
      email: "james.wilson@university.edu",
      location: "Wellness Center, Room 3",
      availability: "Monday-Thursday 8:30 AM - 4:30 PM",
      batches: ["Class of 2022", "Class of 2023", "Class of 2024", "Class of 2025"],
      bgColor: "bg-[#E0E7FF]",
      calendlyLink: "https://calendly.com/james-wilson",
      about: "Dr. Wilson is dedicated to promoting holistic wellness among students through counseling, lifestyle coaching, and evidence-based therapeutic approaches.",
      expertise: ["Counseling", "Wellness Planning", "Behavioral Health", "Student Development"]
    },
    {
      id: 4,
      name: "Prof. Maria Garcia",
      role: "Associate Professor",
      department: "Computer Science",
      image: "https://via.placeholder.com/150?text=Maria",
      email: "maria.garcia@university.edu",
      location: "CS Building, Room 401",
      availability: "Monday, Wednesday, Friday 2:00 PM - 4:00 PM (Office Hours)",
      batches: ["Class of 2024", "Class of 2025", "Class of 2026"],
      bgColor: "bg-[#E0E7FF]",
      calendlyLink: "https://calendly.com/maria-garcia",
      about: "Prof. Garcia is an experienced educator with expertise in computer science and a passion for mentoring students in their academic and professional development.",
      expertise: ["Academic Mentoring", "Career Development", "Technical Guidance", "Research Support"]
    }
  ];

  const handleViewProfile = (staff) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStaff(null);
  };

  return (
    <div className="p-6 pl-12 space-y-8" style={{ width: '80vw', margin: '0 auto' }}>
      
      {/* Header Section */}
      <div className="bg-purple-50 rounded-2xl p-8 border border-purple-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          Support Team Directory <span className="text-3xl">☀️</span>
        </h1>
        <p className="text-gray-700">
          Meet the dedicated professionals here to support you throughout your academic journey. Click on any staff member to view their full profile and contact information.
        </p>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {staffData.map(staff => (
          <SupportStaffCard 
            key={staff.id}
            staff={staff}
            onViewProfile={handleViewProfile}
          />
        ))}
      </div>

      {/* Quick Contact Information */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <Heart size={20} className="text-red-500" /> Quick Contact Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-red-50 rounded-xl p-6">
            <p className="text-gray-600 font-medium mb-2">OAP Office</p>
            <p className="text-purple-600 font-semibold">oap@university.edu</p>
          </div>
          
          <div className="bg-green-50 rounded-xl p-6">
            <p className="text-gray-600 font-medium mb-2">Wellness Services</p>
            <p className="text-green-600 font-semibold">wellness@university.edu</p>
          </div>
          
          <div className="bg-red-50 rounded-xl p-6">
            <p className="text-gray-600 font-medium mb-2">Ehsas Support</p>
            <p className="text-red-600 font-semibold">ehsas@university.edu</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      <SupportStaffModal 
        staff={selectedStaff}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default SupportSupport;