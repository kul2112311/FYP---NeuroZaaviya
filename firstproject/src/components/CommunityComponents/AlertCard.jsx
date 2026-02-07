import { ChevronUp } from "lucide-react";
import { useState } from "react";

function AlertCard({ alert }) {
  const [showDetails, setShowDetails] = useState(false);

  if (showDetails) {
    return (
      <div className="bg-white rounded-2xl p-6 mb-4 border border-gray-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold">{alert.studentName}</h3>
              <StatusBadge status={alert.status} />
            </div>
            <p className='text-gray-600 text-sm'>{alert.title}</p>
            <p className='text-gray-500 text-xs mt-2'>
              ⓘ by {alert.raisedBy} • {alert.date} • Assigned to: {alert.assignedTo}
            </p>
          </div>
          <button 
            onClick={() => setShowDetails(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <ChevronUp size={24} />
          </button>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-2">Description:</h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            {alert.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 flex-wrap">
          <ActionButton 
            label="Mark In Progress" 
            bgColor="bg-orange-500 hover:bg-orange-600"
          />
          <ActionButton 
            label="Mark Resolved" 
            bgColor="bg-green-500 hover:bg-green-600"
          />
          <ActionButton 
            label="Contact Focus Peer" 
            bgColor="bg-purple-500 hover:bg-purple-600"
          />
          <ActionButton 
            label="View Student Profile" 
            bgColor="bg-purple-300 hover:bg-purple-400"
          />
        </div>
      </div>
    );
  }

  // Collapsed view
  return (
    <div className="bg-white rounded-2xl p-6 mb-4 flex items-start gap-4 justify-between border border-gray-200">
      
      {/* Alert Icon */}
      <div className="flex-shrink-0">
        <AlertIcon status={alert.status} />
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-semibold">{alert.studentName}</h3>
          <StatusBadge status={alert.status} />
        </div>
        <p className='text-gray-600 text-sm'>{alert.title}</p>
        <p className='text-gray-500 text-xs mt-2'>
          ⓘ by {alert.raisedBy} • {alert.date} • Assigned to: {alert.assignedTo}
        </p>
      </div>

      {/* Expand Button */}
      <button 
        onClick={() => setShowDetails(true)}
        className="text-gray-500 hover:text-gray-700 flex-shrink-0"
      >
        <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-500 transition-colors">
          <span className="text-xs">ⓘ</span>
        </div>
      </button>
    </div>
  );
}

// Alert Icon based on status
function AlertIcon({ status }) {
  const icons = {
    open: "",
    "in-progress": "",
    resolved: ""
  };
  
  return (
    <div className="text-2xl">
      {icons[status]}
    </div>
  );
}

// Status Badge
function StatusBadge({ status }) {
  const styles = {
    open: "bg-red-100 text-red-700",
    "in-progress": "bg-yellow-100 text-yellow-700",
    resolved: "bg-green-100 text-green-700"
  };

  const labels = {
    open: "Open",
    "in-progress": "In Progress",
    resolved: "Resolved"
  };

  return (
    <span className={`text-xs px-2 py-1 rounded ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

// Reusable Action Button
function ActionButton({ label, bgColor, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`${bgColor} text-white px-3 py-2 rounded text-sm font-medium transition-colors`}
    >
      {label}
    </button>
  );
}

export default AlertCard;