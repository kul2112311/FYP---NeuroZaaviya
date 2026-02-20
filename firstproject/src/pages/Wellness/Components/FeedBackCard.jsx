import { Sparkle } from "lucide-react";
function FeedbackCard({ feedback }) {
  return (
    <div className="bg-[#B39DDB]/20 border border-[#B39DDB] rounded-xl p-4 m-2">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-gray-800 font-medium text-base">{feedback.peerName}</h3>
          
        </div>
        <button className="bg-white rounded-full p-3 text-white-500 text-sm hover:text-white-700 flex items-center gap-1">
          
          <span>View Details</span>
        </button>
      </div>

      <div className="text-sm text-gray-600 mb-3">
        <span>Session with Ushna Khan • {feedback.date}</span>
      </div>

      <p className="text-gray-700 text-base leading-relaxed mb-3">
        {feedback.feedbackText}
      </p>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="text-base"><Sparkle size={16} className="text-purple-500" /></span>
        <span>+{feedback.points} points awarded</span>
      </div>
    </div>
  );
}
export default FeedbackCard
