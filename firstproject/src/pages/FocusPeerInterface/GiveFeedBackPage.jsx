import React, { useState, useEffect } from 'react';
import { ArrowLeft, Award, AlertTriangle, Send, Loader, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

function GiveFeedbackForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = location.state?.session;
  
  const [feedback, setFeedback] = useState('');
  const [availableBadges, setAvailableBadges] = useState([]);
  const [selectedBadgeId, setSelectedBadgeId] = useState('');
  const [awardedBadges, setAwardedBadges] = useState([]);
  const [raiseAlert, setRaiseAlert] = useState(false);
  const [alertDescription, setAlertDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/badges');
      const data = await response.json();
      console.log('🏆 Available badges:', data);
      setAvailableBadges(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching badges:", error);
      setIsLoading(false);
    }
  };

  const handleAddBadge = () => {
    if (!selectedBadgeId) return;
    
    const badge = availableBadges.find(b => b.id === selectedBadgeId);
    if (badge && !awardedBadges.find(b => b.id === selectedBadgeId)) {
      setAwardedBadges([...awardedBadges, badge]);
      setSelectedBadgeId('');
    }
  };

  const handleRemoveBadge = (badgeId) => {
    setAwardedBadges(awardedBadges.filter(b => b.id !== badgeId));
  };

  const handleBack = () => {
    navigate('/focuspeer');
  };

  const handleSubmit = async () => {
    if (!feedback.trim() && awardedBadges.length === 0) {
      alert("Please provide feedback or award at least one badge.");
      return;
    }

    if (raiseAlert && !alertDescription.trim()) {
      alert("Please describe the concern if raising an alert.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/session-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: session.id,
          feedback_text: feedback.trim(),
          badge_ids: awardedBadges.map(b => b.id),
          raise_alert: raiseAlert,
          alert_description: raiseAlert ? alertDescription.trim() : ''
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Feedback submitted:', result);
        alert(`Feedback submitted successfully! ${result.badges_awarded} badge(s) awarded.`);
        navigate('/focuspeer');
      } else {
        const errorData = await response.json();
        alert(`Failed: ${errorData.error || "Could not submit feedback"}`);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("An error occurred while submitting feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPreviewBadge = () => {
    if (selectedBadgeId) {
      return availableBadges.find(b => b.id === selectedBadgeId);
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="animate-spin" size={32} />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

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
                <div className={`w-16 h-16 ${session?.avatarColor || 'bg-blue-500'} rounded-full flex items-center justify-center text-white font-semibold text-xl`}>
                  {session?.avatar || 'UB'}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {session?.name || 'Student'}
                  </h2>
                  <p className="text-gray-600">
                    {session?.major || 'Major'} • {session?.date || 'Date'} • {session?.time || 'Time'}
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
                Select badges to award from the dropdown. Each badge gives the student +10 XP!
              </p>
              
              {/* Badge Selector */}
              <div className="flex gap-3 mb-4">
                <select
                  value={selectedBadgeId}
                  onChange={(e) => setSelectedBadgeId(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                >
                  <option value="">Select a badge...</option>
                  {availableBadges.map(badge => (
                    <option key={badge.id} value={badge.id}>
                      {badge.name}
                    </option>
                  ))}
                </select>
                <button 
                  onClick={handleAddBadge}
                  disabled={!selectedBadgeId}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                    selectedBadgeId 
                      ? 'bg-purple-400 hover:bg-purple-500 text-white' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Award size={16} />
                  Add Badge
                </button>
              </div>

              {/* Awarded Badges List */}
              {awardedBadges.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Badges to Award:</h4>
                  <div className="flex flex-wrap gap-2">
                    {awardedBadges.map(badge => (
                      <div 
                        key={badge.id}
                        className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm border border-purple-200"
                      >
                        <Award size={14} />
                        <span>{badge.name}</span>
                        <button
                          onClick={() => handleRemoveBadge(badge.id)}
                          className="hover:bg-purple-100 rounded-full p-0.5 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Student will receive +{awardedBadges.length * 10} XP
                  </p>
                </div>
              )}
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
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || (!feedback.trim() && awardedBadges.length === 0)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors font-medium ${
                  (feedback.trim() || awardedBadges.length > 0) && !isSubmitting
                    ? 'bg-purple-400 hover:bg-purple-500 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Feedback
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Side - Badge Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Badge Preview
              </h3>
              <div className="flex flex-col items-center justify-center py-8">
                {getPreviewBadge() ? (
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <Award size={48} className="text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-800 text-lg mb-2">
                      {getPreviewBadge().name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {getPreviewBadge().description}
                    </p>
                  </div>
                ) : (
                  <div className="text-gray-400 text-center">
                    <Award size={64} strokeWidth={1} />
                    <p className="mt-4 text-sm">
                      Select a badge to preview
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GiveFeedbackForm;