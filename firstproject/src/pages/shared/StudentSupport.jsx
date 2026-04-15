// import React, { useState } from "react";
// import { Heart, Sun } from "lucide-react"; // Swapped to Sun for consistency
// import SupportStaffCard from "../../components/CommunityComponents/StudentSupportCard.jsx";
// import SupportStaffModal from "../../components/CommunityComponents/SupportStaffModal.jsx";
// import { User, ShieldCheck, HeartPulse, GraduationCap } from "lucide-react";
// function SupportSupport() {
//   const [selectedStaff, setSelectedStaff] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Theme Colors: 
//   // Primary: #B3DDB9 (Green)
//   // Secondary: #CE93D8 (Purple)
//   // Light: #E1BEE7 (Lavender)
//   // Text: #5A4A61 (Dark Purple)

//   const staffData = [
//   {
//     id: 1,
//     name: "Zainab Mansoor",
//     role: "OAP Advisor",
//     icon: ShieldCheck, 
//     department: "Office of Accessible Programs",
//     // calendlyLink: "https://calendly.com/your-link",
//     email: "ZainabMansoor@habib.edu.pk",
//     location: "Student Services, Room 205",
//     availability: "Mon-Fri 9:00 AM - 5:00 PM",
//     bgColor: "#B3DDB9", // Primary Green
//     about: "Zainab focuses on ensuring all students have the necessary accommodations to thrive academically.",
//     expertise: ["ADHD Support", "Executive Functioning"]
//   },
//   {
//     id: 2,
//     name: "Omar Siddiqui",
//     role: "Ehsas Counselor",
//     icon: HeartPulse,
//     department: "Ehsas Support Services",
//     // calendlyLink: "https://calendly.com/your-link",
//     email: "OmarSiddiqui@habib.edu.pk",
//     location: "Ehsas Office, Room 102",
//     availability: "Mon-Fri 10:00 AM - 6:00 PM",
//     bgColor: "#E1BEE7", // Light Lavender
//     about: "Omar provides a safe space for students to discuss mental health and emotional well-being.",
//     expertise: ["Mental Health", "Anxiety Management"]
//   },
//   {
//     id: 3,
//     name: "Dr. Anum Rashid",
//     role: "Wellness Counselor",
//     icon: HeartPulse, 
//     department: "Counseling & Wellness Services",
//     // calendlyLink: "https://calendly.com/your-link",
//     email: "AnumRashid@habib.edu.pk",
//     location: "Wellness Center, Room 3",
//     availability: "Mon-Thu 8:30 AM - 4:30 PM",
//     bgColor: "#CE93D8", // Medium Purple
//     about: "Dr. Anum specializes in holistic wellness and sensory-friendly therapeutic practices.",
//     expertise: ["Wellness Planning", "Sensory Regulation"]
//   },
//   {
//     id: 4,
//     name: "Prof. Bilal Ahmed",
//     role: "Associate Professor",
//     icon: GraduationCap,
//     department: "Computer Science",
//     // calendlyLink: "https://calendly.com/your-link",
//     email: "bilal.ahmed@habib.edu.pk",
//     location: "Information Processing Lab",
//     availability: "Mon & Wed 2:00 PM - 4:00 PM",
//     bgColor: "#B3DDB9", // Primary Green
//     about: "Prof. Bilal is passionate about neuro-inclusive teaching methods in STEM.",
//     expertise: ["Academic Mentoring", "Technical Guidance"]
//   },
//   {
//     id: 5,
//     name: "Mariam Jameel",
//     role: "Student Life Lead",
//     icon: User,
//     department: "Office of Student Life",
//     // calendlyLink: "https://calendly.com/your-link",
//     email: "MariamJameel@habib.edu.pk",
//     location: "Student Life Office 4",
//     availability: "Tue-Fri 11:00 AM - 5:00 PM",
//     bgColor: "#E1BEE7", // Light Lavender
//     about: "Mariam helps organize low-stimulus social events and parallel-play workshops.",
//     expertise: ["Social Integration", "Event Planning"]
//   }
// ];
//   const handleViewProfile = (staff) => {
//     setSelectedStaff(staff);
//     setIsModalOpen(true);
//   };

//   return (
//     <div className="p-6 pl-12 space-y-8" style={{ width: '80vw', margin: '0 auto', color: '#5A4A61' }}>
      
//       {/* Header Section */}
//       <div className="rounded-2xl p-8 border" style={{ backgroundColor: '#E1BEE7', borderColor: '#CE93D8' }}>
//         <h1 className="text-3xl font-bold mb-2 flex items-center gap-2" style={{ color: '#5A4A61' }}>
//           Support Team Directory <Sun size={32} />
//         </h1>
//         <p style={{ color: '#5A4A61' }}>
//           Meet the dedicated professionals here to support you throughout your academic journey. Click on any staff member to view their full profile.
//         </p>
//       </div>

//       {/* Staff Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {staffData.map(staff => (
//           <SupportStaffCard 
//             key={staff.id}
//             staff={staff}
//             onViewProfile={handleViewProfile}
//           />
//         ))}
//       </div>

//       {/* Quick Contact Information */}
//       <div className="bg-white rounded-2xl p-8 border" style={{ borderColor: '#E1BEE7' }}>
//         <h2 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: '#5A4A61' }}>
//           <Heart size={20} style={{ color: '#CE93D8' }} /> Quick Contact Information
//         </h2>
        
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Using a mix of your palette for the contact boxes */}
//           <div className="rounded-xl p-6" style={{ backgroundColor: '#B3DDB9' }}>
//             <p className="font-medium mb-1">OAP Office</p>
//             <p className="font-bold">oap@habib.edu.pk</p>
//           </div>
          
//           <div className="rounded-xl p-6" style={{ backgroundColor: '#E1BEE7' }}>
//             <p className="font-medium mb-1">Wellness Services</p>
//             <p className="font-bold">wellness@habib.edu.pk</p>
//           </div>
          
//           <div className="rounded-xl p-6" style={{ backgroundColor: '#CE93D8' }}>
//             <p className="font-medium mb-1">Ehsas Support</p>
//             <p className="font-bold">ehsas@habib.edu.pk</p>
//           </div>
//         </div>
//       </div>

//       <SupportStaffModal 
//         staff={selectedStaff}
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//       />
//     </div>
//   );
// }

// export default SupportSupport;

import React, { useState } from "react";
import { Heart, Sun, ShieldCheck, HeartPulse, GraduationCap, User } from "lucide-react";
import SupportStaffCard from "../../components/CommunityComponents/StudentSupportCard.jsx";
import SupportStaffModal from "../../components/CommunityComponents/SupportStaffModal.jsx";

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  purple800: "#5a4a61",
  purple600: "#9575a3",
  purple500: "#b39ddb",
  purple400: "#c0b4cc",
  purple300: "#d8cfe0",
  purple200: "#e8e0f0",
  purple100: "rgba(179,157,219,0.15)",
  purple50:  "rgba(179,157,219,0.08)",
  pink:      "#f8bbd0",
  pinkText:  "#c0608a",
  teal:      "#6b9e9a",
  tealBg:    "rgba(107,158,154,0.1)",
  ehsas:     "#9b7fbd",
  ehsasBg:   "rgba(155,127,189,0.1)",
  green:     "#22c55e",
  greenBg:   "rgba(34,197,94,0.1)",
  red:       "#ef4444",
  redBg:     "rgba(239,68,68,0.06)",
  amber:     "#f59e0b",
  amberBg:   "rgba(245,158,11,0.1)",
  white:     "#FFFFFF",
  pageBg:    "#f5eef8",
  btnGrad:   "linear-gradient(90deg, #b39ddb 0%, #f8bbd0 100%)",
};

const staffData = [
  {
    id: 1,
    name: "Zainab Mansoor",
    role: "OAP Advisor",
    icon: ShieldCheck,
    department: "Office of Accessible Programs",
    email: "ZainabMansoor@habib.edu.pk",
    location: "Student Services, Room 205",
    availability: "Mon-Fri 9:00 AM - 5:00 PM",
    availability_status: "available",
    bgColor: "#B3DDB9",
    about: "Zainab focuses on ensuring all students have the necessary accommodations to thrive academically.",
    expertise: ["ADHD Support", "Executive Functioning", "Accommodation Planning"],
    batches: ["Class of 2022", "Class of 2023", "Class of 2024", "Class of 2025"],
  },
  {
    id: 2,
    name: "Omar Siddiqui",
    role: "Ehsas Counselor",
    icon: HeartPulse,
    department: "Ehsas Support Services",
    email: "OmarSiddiqui@habib.edu.pk",
    location: "Ehsas Office, Room 102",
    availability: "Mon-Fri 10:00 AM - 6:00 PM",
    availability_status: "meeting",
    bgColor: "#E1BEE7",
    about: "Omar provides a safe space for students to discuss mental health and emotional well-being.",
    expertise: ["Mental Health", "Anxiety Management"],
    batches: ["Class of 2023", "Class of 2024", "Class of 2025"],
  },
  {
    id: 3,
    name: "Dr. Anum Rashid",
    role: "Wellness Counselor",
    icon: HeartPulse,
    department: "Counseling & Wellness Services",
    email: "AnumRashid@habib.edu.pk",
    location: "Wellness Center, Room 3",
    availability: "Mon-Thu 8:30 AM - 4:30 PM",
    availability_status: "unavailable",
    bgColor: "#CE93D8",
    about: "Dr. Anum specializes in holistic wellness and sensory-friendly therapeutic practices.",
    expertise: ["Wellness Planning", "Sensory Regulation"],
    batches: ["Class of 2022", "Class of 2023"],
  },
  {
    id: 4,
    name: "Prof. Bilal Ahmed",
    role: "Associate Professor",
    icon: GraduationCap,
    department: "Computer Science",
    email: "bilal.ahmed@habib.edu.pk",
    location: "Information Processing Lab",
    availability: "Mon & Wed 2:00 PM - 4:00 PM",
    availability_status: "available",
    bgColor: "#B3DDB9",
    about: "Prof. Bilal is passionate about neuro-inclusive teaching methods in STEM.",
    expertise: ["Academic Mentoring", "Technical Guidance"],
    batches: ["Class of 2024", "Class of 2025"],
  },
  {
    id: 5,
    name: "Mariam Jameel",
    role: "Student Life Lead",
    icon: User,
    department: "Office of Student Life",
    email: "MariamJameel@habib.edu.pk",
    location: "Student Life Office 4",
    availability: "Tue-Fri 11:00 AM - 5:00 PM",
    availability_status: "away",
    bgColor: "#E1BEE7",
    about: "Mariam helps organize low-stimulus social events and parallel-play workshops.",
    expertise: ["Social Integration", "Event Planning"],
    batches: ["Class of 2023", "Class of 2024", "Class of 2025"],
  },
];

function SupportSupport() {
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isModalOpen, setIsModalOpen]     = useState(false);

  const handleViewProfile = (staff) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  return (
    <div style={{ padding: "24px 24px 24px 48px", width: "80vw", boxSizing: "border-box", color: C.purple800 }}>

      {/* Header */}
      <div style={{
        background: C.purple100,
        border: `1px solid ${C.purple300}`,
        borderRadius: 20,
        padding: "28px 32px",
        marginBottom: 24,
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <Sun size={28} style={{ color: C.purple500, flexShrink: 0 }} />
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: 26, fontWeight: 700, color: C.purple800 }}>
            Support Team Directory
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: C.purple600 }}>
            Meet the dedicated professionals here to support you throughout your academic journey. Click on any staff member to view their full profile.
          </p>
        </div>
      </div>

      {/* Staff Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
        gap: 18,
        marginBottom: 24,
      }}>
        {staffData.map(staff => (
          <SupportStaffCard
            key={staff.id}
            staff={staff}
            onViewProfile={handleViewProfile}
          />
        ))}
      </div>

      {/* Quick Contact */}
      <div style={{
        background: C.white,
        border: `1px solid ${C.purple300}`,
        borderRadius: 20,
        padding: "24px 28px",
      }}>
        <h2 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 700, color: C.purple800, display: "flex", alignItems: "center", gap: 8 }}>
          <Heart size={18} style={{ color: C.purple500 }} />
          Quick Contact Information
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }}>
          {[
            { label: "OAP Office",       email: "oap@habib.edu.pk",      bg: "#B3DDB9" },
            { label: "Wellness Services", email: "wellness@habib.edu.pk", bg: "#E1BEE7" },
            { label: "Ehsas Support",    email: "ehsas@habib.edu.pk",    bg: "#CE93D8" },
          ].map(({ label, email, bg }) => (
            <div key={label} style={{ background: bg, borderRadius: 14, padding: "16px 18px" }}>
              <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 500, color: C.purple800 }}>{label}</p>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: C.purple800 }}>{email}</p>
            </div>
          ))}
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