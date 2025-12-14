import React, { useState } from 'react';
import { ArrowLeft, Award, AlertTriangle, Send } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom'; // Add this import

function GiveFeedbackForm() {  // Remove props since we're using routing
  const navigate = useNavigate();  // Add this
  const location = useLocation();  // Add this
  const session = location.state?.session;  // Get session from navigation state
  
  const [feedback, setFeedback] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('');
  const [raiseAlert, setRaiseAlert] = useState(false);
  const [alertDescription, setAlertDescription] = useState('');

  const badges = [
    { id: 'progress', name: 'Great Progress', emoji: '🌟' },
    { id: 'collaborative', name: 'Team Player', emoji: '🤝' },
    { id: 'focused', name: 'Stayed Focused', emoji: '🎯' },
    { id: 'creative', name: 'Creative Thinker', emoji: '💡' },
    { id: 'persistent', name: 'Never Gave Up', emoji: '💪' },
    { id: 'helpful', name: 'Super Helpful', emoji: '🌈' }
  ];

  const handleBack = () => {
    navigate('/focuspeer'); // Go back to FocusPeer page
  };

  const handleSubmit = () => {
    if (feedback.trim() || selectedBadge) {
      console.log({
        feedback,
        badge: selectedBadge,
        raiseAlert,
        alertDescription: raiseAlert ? alertDescription : '',
        sessionId: session?.id
      });
      // TODO: Submit to backend
      navigate('/focuspeer'); // Go back after submitting
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Pending Feedback
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Student Info Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                  {session?.avatar || 'UB'}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {session?.name || 'Ushna Batool'}
                  </h2>
                  <p className="text-gray-600">
                    {session?.major || 'Computer Science'} • {session?.date || 'Dec 6, 2025'} • {session?.time || '2:00 PM - 3:00 PM'}
                  </p>
                </div>
              </div>
            </div>

            {/* Feedback Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Session Feedback
              </h3>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts about the session, what you worked on together, and the student's progress..."
                className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
            </div>

            {/* Award Badges Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Award Badges
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Select a badge from the dropdown and click Add. Hover over options to preview on the right.
              </p>
              
              <div className="flex gap-3">
                <select
                  value={selectedBadge}
                  onChange={(e) => setSelectedBadge(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                >
                  <option value="">Select a badge...</option>
                  {badges.map(badge => (
                    <option key={badge.id} value={badge.id}>
                      {badge.emoji} {badge.name}
                    </option>
                  ))}
                </select>
                <button 
                  onClick={() => {/* Add badge logic */}}
                  disabled={!selectedBadge}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                    selectedBadge 
                      ? 'bg-purple-400 hover:bg-purple-500 text-white' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Award size={16} />
                  Add Badge
                </button>
              </div>
            </div>

            {/* Alert Section */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="raiseAlert"
                  checked={raiseAlert}
                  onChange={(e) => setRaiseAlert(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-purple-500 focus:ring-purple-400"
                />
                <div className="flex-1">
                  <label htmlFor="raiseAlert" className="flex items-center gap-2 font-medium text-amber-800 cursor-pointer">
                    <AlertTriangle size={18} />
                    Raise Alert to OAP & Wellness
                  </label>
                  <p className="text-sm text-amber-700 mt-1">
                    Check this if the student needs additional support or if you noticed concerning behavior during the session.
                  </p>
                  
                  {/* Alert Description Box */}
                  {raiseAlert && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-amber-800 mb-2">
                        Describe the concern: <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        value={alertDescription}
                        onChange={(e) => setAlertDescription(e.target.value)}
                        placeholder="Please provide details about the concerning behavior or situation that requires attention from OAP & Wellness..."
                        className="w-full h-32 p-3 border border-amber-300 rounded-lg resize-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleBack}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!feedback.trim() && !selectedBadge}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors font-medium ${
                  feedback.trim() || selectedBadge
                    ? 'bg-purple-400 hover:bg-purple-500 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send size={18} />
                Submit Feedback
              </button>
            </div>
          </div>

          {/* Right Side - Badge Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Badge Preview
              </h3>
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Award size={64} strokeWidth={1} />
                <p className="mt-4 text-sm text-center">
                  {selectedBadge 
                    ? `Preview: ${badges.find(b => b.id === selectedBadge)?.emoji} ${badges.find(b => b.id === selectedBadge)?.name}`
                    : 'Select a badge to preview'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GiveFeedbackForm;