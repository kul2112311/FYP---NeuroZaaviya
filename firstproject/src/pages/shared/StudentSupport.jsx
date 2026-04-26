import React, { useState, useEffect } from "react";
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

function SupportSupport() {
  const [staffData, setStaffData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isModalOpen, setIsModalOpen]     = useState(false);

  // 1. Fetch real OAP accounts from the backend!
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/support-staff');
        if (response.ok) {
          const data = await response.json();
          
          // 2. Map the real database info onto your beautiful UI design
          const mappedStaff = data.map((member, index) => {
             const isOAP = member.role === 'oap';
             const isWellness = member.role === 'wellness-counsellor';
             
             return {
                id: member.staff_id, // We need this to send appointment requests to the right person!
                staff_id: member.staff_id, 
                name: member.name,
                email: member.email,
                department: member.department || 'Office of Academic Performance',
                
                // Formatting the role visually based on the DB string
                role: isOAP ? 'OAP Advisor' : isWellness ? 'Wellness Counselor' : 'Ehsas Counselor',
                icon: isOAP ? ShieldCheck : HeartPulse,
                bgColor: isOAP ? "#B3DDB9" : isWellness ? "#CE93D8" : "#E1BEE7",
                
                // Keeping your dummy presentation data so the UI doesn't look empty
                location: isOAP ? "Student Services, Room 205" : "Ehsas Office, Room 102",
                availability: "Mon-Fri 9:00 AM - 5:00 PM",
                availability_status: "available",
                about: "Academic support professional dedicated to student success and well-being.",
                expertise: ["Academic Mentoring", "Student Support"],
                batches: ["Class of 2025", "Class of 2026"],
             };
          });

          setStaffData(mappedStaff);
        }
      } catch (error) {
        console.error("Failed to load staff:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, []);

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
      {isLoading ? (
         <p style={{ textAlign: 'center', color: C.purple600, padding: '40px 0' }}>Loading Support Team...</p>
      ) : staffData.length === 0 ? (
         <p style={{ textAlign: 'center', color: C.purple600, padding: '40px 0' }}>No support staff registered yet.</p>
      ) : (
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
      )}

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