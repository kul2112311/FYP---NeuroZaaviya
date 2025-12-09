import { useState } from 'react';
import { X, Tag } from 'lucide-react';

function CreatePostModal({ isOpen, onClose, onSubmit }) {
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTag, setCustomTag] = useState('');

  const availableTags = [
    "OAP", "Help", "Anxiety", "Focus Peer"
    , "Mental Health", "Academic Support", "Ehsaas"
  ];

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = () => {
    if (customTag && !selectedTags.includes(customTag)) {
      setSelectedTags([...selectedTags, customTag]);
      setCustomTag('');
    }
  };

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit({
        content,
        isAnonymous,
        tags: selectedTags
      });
      setContent('');
      setSelectedTags([]);
      setIsAnonymous(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
  className="fixed inset-0 flex items-center justify-center z-50 p-4"
  style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)' }}
  >
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-semibold">Create a Post</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Anonymous Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="anonymous" className="text-sm text-gray-600">
              Post anonymously
            </label>
          </div>

          {/* Post Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's on your mind?
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your concerns, announcements, or ask for help..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#B39DDB] focus:border-transparent"
              rows={6}
            />
          </div>

          {/* Tags Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Tag size={16} />
              Add Tags
            </label>
            
            {/* Available Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-[#B39DDB] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Custom Tag Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTag()}
                placeholder="Add custom tag..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#B39DDB] focus:border-transparent"
              />
              <button
                onClick={handleAddCustomTag}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
              >
                Add
              </button>
            </div>

            {/* Selected Tags Display */}
            {selectedTags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Selected:</span>
                {selectedTags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-[#B39DDB] text-white rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      onClick={() => handleTagToggle(tag)}
                      className="hover:bg-white hover:bg-opacity-20 rounded-full"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className={`px-6 py-2 rounded-lg transition-colors ${
              content.trim()
                ? 'bg-[#B39DDB] text-white hover:bg-[#9575CD]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatePostModal;