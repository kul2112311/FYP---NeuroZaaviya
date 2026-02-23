import React, { useState } from "react";
import { Heart, Sun } from "lucide-react"; // Swapped to Sun for consistency
import SupportStaffCard from "../../components/CommunityComponents/StudentSupportCard.jsx";
import SupportStaffModal from "../../components/CommunityComponents/SupportStaffModal.jsx";
import { User, ShieldCheck, HeartPulse, GraduationCap } from "lucide-react";
function SupportSupport() {
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Theme Colors: 
  // Primary: #B3DDB9 (Green)
  // Secondary: #CE93D8 (Purple)
  // Light: #E1BEE7 (Lavender)
  // Text: #5A4A61 (Dark Purple)

  const staffData = [
  {
    id: 1,
    name: "Zainab Mansoor",
    role: "OAP Advisor",
    icon: ShieldCheck, 
    department: "Office of Accessible Programs",
    // calendlyLink: "https://calendly.com/your-link",
    email: "ZainabMansoor@habib.edu.pk",
    location: "Student Services, Room 205",
    availability: "Mon-Fri 9:00 AM - 5:00 PM",
    bgColor: "#B3DDB9", // Primary Green
    about: "Zainab focuses on ensuring all students have the necessary accommodations to thrive academically.",
    expertise: ["ADHD Support", "Executive Functioning"]
  },
  {
    id: 2,
    name: "Omar Siddiqui",
    role: "Ehsas Counselor",
    icon: HeartPulse,
    department: "Ehsas Support Services",
    // calendlyLink: "https://calendly.com/your-link",
    email: "OmarSiddiqui@habib.edu.pk",
    location: "Ehsas Office, Room 102",
    availability: "Mon-Fri 10:00 AM - 6:00 PM",
    bgColor: "#E1BEE7", // Light Lavender
    about: "Omar provides a safe space for students to discuss mental health and emotional well-being.",
    expertise: ["Mental Health", "Anxiety Management"]
  },
  {
    id: 3,
    name: "Dr. Anum Rashid",
    role: "Wellness Counselor",
    icon: HeartPulse, 
    department: "Counseling & Wellness Services",
    // calendlyLink: "https://calendly.com/your-link",
    email: "AnumRashid@habib.edu.pk",
    location: "Wellness Center, Room 3",
    availability: "Mon-Thu 8:30 AM - 4:30 PM",
    bgColor: "#CE93D8", // Medium Purple
    about: "Dr. Anum specializes in holistic wellness and sensory-friendly therapeutic practices.",
    expertise: ["Wellness Planning", "Sensory Regulation"]
  },
  {
    id: 4,
    name: "Prof. Bilal Ahmed",
    role: "Associate Professor",
    icon: GraduationCap,
    department: "Computer Science",
    // calendlyLink: "https://calendly.com/your-link",
    email: "bilal.ahmed@habib.edu.pk",
    location: "Information Processing Lab",
    availability: "Mon & Wed 2:00 PM - 4:00 PM",
    bgColor: "#B3DDB9", // Primary Green
    about: "Prof. Bilal is passionate about neuro-inclusive teaching methods in STEM.",
    expertise: ["Academic Mentoring", "Technical Guidance"]
  },
  {
    id: 5,
    name: "Mariam Jameel",
    role: "Student Life Lead",
    icon: User,
    department: "Office of Student Life",
    // calendlyLink: "https://calendly.com/your-link",
    email: "MariamJameel@habib.edu.pk",
    location: "Student Life Office 4",
    availability: "Tue-Fri 11:00 AM - 5:00 PM",
    bgColor: "#E1BEE7", // Light Lavender
    about: "Mariam helps organize low-stimulus social events and parallel-play workshops.",
    expertise: ["Social Integration", "Event Planning"]
  }
];
  const handleViewProfile = (staff) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 pl-12 space-y-8" style={{ width: '80vw', margin: '0 auto', color: '#5A4A61' }}>
      
      {/* Header Section */}
      <div className="rounded-2xl p-8 border" style={{ backgroundColor: '#E1BEE7', borderColor: '#CE93D8' }}>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2" style={{ color: '#5A4A61' }}>
          Support Team Directory <Sun size={32} />
        </h1>
        <p style={{ color: '#5A4A61' }}>
          Meet the dedicated professionals here to support you throughout your academic journey. Click on any staff member to view their full profile.
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
      <div className="bg-white rounded-2xl p-8 border" style={{ borderColor: '#E1BEE7' }}>
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: '#5A4A61' }}>
          <Heart size={20} style={{ color: '#CE93D8' }} /> Quick Contact Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Using a mix of your palette for the contact boxes */}
          <div className="rounded-xl p-6" style={{ backgroundColor: '#B3DDB9' }}>
            <p className="font-medium mb-1">OAP Office</p>
            <p className="font-bold">oap@habib.edu.pk</p>
          </div>
          
          <div className="rounded-xl p-6" style={{ backgroundColor: '#E1BEE7' }}>
            <p className="font-medium mb-1">Wellness Services</p>
            <p className="font-bold">wellness@habib.edu.pk</p>
          </div>
          
          <div className="rounded-xl p-6" style={{ backgroundColor: '#CE93D8' }}>
            <p className="font-medium mb-1">Ehsas Support</p>
            <p className="font-bold">ehsas@habib.edu.pk</p>
          </div>
        </div>
      </div>

      <SupportStaffModal 
        staff={selectedStaff}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default SupportSupport;