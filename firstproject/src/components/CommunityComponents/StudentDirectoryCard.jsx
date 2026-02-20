import { useState } from "react";
import { ChevronUp } from "lucide-react";

function StudentDirectoryCard({ student }) {
  const [showDetails, setShowDetails] = useState(false);

  if (showDetails) {
    return (
      <div className="bg-white rounded-2xl p-6 mb-4">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-200">
          <img 
            src={student.avatar || 'https://via.placeholder.com/60'} 
            alt={student.name} 
            className='w-16 h-16 rounded-full object-cover'
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold">{student.name}</h3>
            <p className='text-gray-600 text-sm'>{student.email}</p>
            <p className='text-gray-500 text-sm'>ID: {student.id} • {student.year}</p>
          </div>
          <button 
            onClick={() => setShowDetails(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <ChevronUp size={24} />
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <h4 className="flex items-center gap-2 text-gray-700 font-semibold mb-4">
              <span>👤</span> Contact Information
            </h4>
            <div className="space-y-3">
              <div>
                <p className="text-gray-500 text-sm">Email</p>
                <p className="text-gray-700">{student.email}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Phone</p>
                <p className="text-gray-700">+92 300 5678901</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="flex items-center gap-2 text-gray-700 font-semibold mb-4">
              <span>📚</span> Academic Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <InfoField label="Major" value={student.major} />
              <InfoField label="Batch Year" value={student.batch} />
              <InfoField label="Year" value={student.year} />
              <InfoField label="Enrolled" value="Sep 2024" />
            </div>
          </div>
        </div>

        {/* Advisor */}
        <div className="mb-6 pb-6 border-t border-b border-gray-200">
          <h4 className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
            <span>👨‍🏫</span> OAP Advisor
          </h4>
          <p className="text-gray-700">{student.advisor}</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-4">
          <ActionButton icon="✉️" label="Send Email" />
          <ActionButton icon="📅" label="Schedule Meeting" />
          <ActionButton icon="📋" label="View Records" />
        </div>
      </div>
    );
  }

  // Collapsed view
  return (
    <div className="bg-white rounded-2xl p-6 mb-4 flex items-start gap-4 justify-between">
      <img 
        src={student.avatar || 'https://via.placeholder.com/60'} 
        alt={student.name} 
        className='w-16 h-16 rounded-full object-cover'
      />
      
      <div className="flex-1">
        <div className='flex items-center gap-2 mb-2 flex-wrap'>
          <h3 className="text-xl font-semibold">{student.name}</h3>
          <Badge>{student.major}</Badge>
          <Badge color="pink">{student.batch}</Badge>
          {student.accommodations > 0 && (
            <Badge color="purple">{student.accommodations} accommodations</Badge>
          )}
        </div>
        <p className='text-gray-600 text-sm mb-2'>{student.email}</p>
        <p className='text-gray-500 text-sm'>
          ID: {student.id} • {student.year} • Advisor: {student.advisor}
        </p>
      </div>

      <button 
        onClick={() => setShowDetails(true)}
        className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg font-medium flex-shrink-0 transition-colors"
      >
        More Details
      </button>
    </div>
  );
}

// Reusable Badge Component
function Badge({ children, color = "blue" }) {
  const colors = {
    blue: "bg-blue-100 text-blue-800",
    pink: "bg-pink-100 text-pink-800",
    purple: "bg-purple-100 text-purple-800"
  };
  
  return (
    <span className={`${colors[color]} text-xs px-2 py-1 rounded`}>
      {children}
    </span>
  );
}

// Reusable Info Field Component
function InfoField({ label, value }) {
  return (
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-gray-700 font-medium">{value}</p>
    </div>
  );
}

// Reusable Action Button Component
function ActionButton({ icon, label, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center justify-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-3 rounded-lg font-medium transition-colors"
    >
      <span className="text-lg">{icon}</span> {label}
    </button>
  );
}

export default StudentDirectoryCard;