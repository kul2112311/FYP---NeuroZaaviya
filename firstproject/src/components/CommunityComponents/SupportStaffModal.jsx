import React from "react";
import { Mail, MapPin, Clock, X } from "lucide-react";

function SupportStaffModal({ staff, isOpen, onClose }) {
  if (!isOpen || !staff) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header with Close Button */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">{staff.name}</h2>
            <p className="text-gray-600">{staff.role}</p>
            <p className="text-sm text-gray-500">{staff.department}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">About</h3>
            <p className="text-gray-700 leading-relaxed">
              {staff.about}
            </p>
          </div>

          {/* Areas of Expertise */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Areas of Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {staff.expertise.map((skill, idx) => (
                <span 
                  key={idx}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail size={20} className="text-gray-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-gray-800 font-medium">{staff.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-gray-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Office Location</p>
                  <p className="text-gray-800 font-medium">{staff.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={20} className="text-gray-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Availability</p>
                  <p className="text-gray-800 font-medium">{staff.availability}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Batches */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Assigned Batches</h3>
            <div className="flex flex-wrap gap-2">
              {staff.batches.map((batch, idx) => (
                <span 
                  key={idx}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm"
                >
                  {batch}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <a 
              href={staff.calendlyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold text-center"
            >
              📅 Book via Calendly
            </a>
            <button 
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupportStaffModal;