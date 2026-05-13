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

  const isReadOnly = !!session?.hasFeedback;

  const fetchBadges = async () => {
    try {
      const response = await fetch('https://fyp-neuro-zaaviya-server-01.vercel.app/api/badges');
      const data = await response.json();
      setAvailableBadges(data);
      
      // ✨ NEW: Pre-fill the form if feedback already exists!
      if (session?.hasFeedback) {
        setFeedback(session.feedbackText || '');
        setRaiseAlert(!!session.alertDescription);
        setAlertDescription(session.alertDescription || '');
        if (session.badgesAwarded) {
          const awarded = data.filter(b => session.badgesAwarded.includes(b.id));
          setAwardedBadges(awarded);
        }
      }
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
      // ✅ FIXED: Changed localhost to 127.0.0.1
      const response = await fetch('https://fyp-neuro-zaaviya-server-01.vercel.app/api/session-feedback', {
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
      <div className="p-6 pl-12 space-y-6" style={{ width: '80vw', margin: '0 auto' }}>
        <Loader className="animate-spin" size={32} />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="p-6 pl-12 space-y-6" style={{ width: '80vw', margin: '0 auto' }}>
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
                disabled={isReadOnly}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts about the session, what you worked on together, and the student's progress..."
                className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
            </div>

           

            {/* Alert Section */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <input
                  disabled={isReadOnly}
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
                        disabled={isReadOnly}
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
                {isReadOnly ? "Back to Sessions" : "Cancel"}
              </button>
              
              {/* ✨ FIXED: Completely hides the submit button if feedback was already given! */}
              {!isReadOnly && (
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
              )}
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
}

export default GiveFeedbackForm;