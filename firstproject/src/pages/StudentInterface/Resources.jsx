import React, { useState } from "react";
import { BookOpen, Video, FileText, Headphones, Download, ExternalLink, Star } from "lucide-react";

export function Resources() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const resources = [
    {
      id: "1",
      title: "Introduction to Mindful Learning",
      type: "video",
      category: "Wellness",
      duration: "12 min",
      progress: 75,
      favorite: true,
      url: "https://www.youtube.com/watch?v=ZToicYcHIOU" // Mindfulness for Students
    },
    {
      id: "2",
      title: "Study Techniques for Neurodivergent Students",
      type: "document",
      category: "Study Skills",
      favorite: true,
      url: "https://www.youtube.com/watch?v=cy9_ORzJVTE" // Study tips for neurodivergent students
    },
    {
      id: "3",
      title: "Focus & Concentration Guide",
      type: "book",
      category: "Resources",
      progress: 45,
      url: "https://www.youtube.com/watch?v=GR1kOeUO7-c" // How to focus and concentrate
    },
    {
      id: "4",
      title: "Ambient Study Sounds",
      type: "audio",
      category: "Wellness",
      duration: "60 min",
      url: "https://www.youtube.com/watch?v=jfKfPfyJRdk" // Lofi study music
    },
    {
      id: "5",
      title: "Time Management Strategies",
      type: "video",
      category: "Productivity",
      duration: "18 min",
      url: "https://www.youtube.com/watch?v=iONDebHX9qk" // Time management for students
    },
    {
      id: "6",
      title: "Self-Care for Students",
      type: "document",
      category: "Wellness",
      progress: 100,
      url: "https://www.youtube.com/watch?v=W_ZAv1UDRBg" // Student self-care
    },
  ];

  // Suggested resources with YouTube links
  const suggestedResources = [
    {
      title: "Advanced Note-Taking Methods",
      duration: "15 min",
      icon: Video,
      url: "https://www.youtube.com/watch?v=ErSjc1PBJX8" // Cornell note-taking
    },
    {
      title: "Meditation for Focus",
      duration: "10 min",
      icon: Headphones,
      url: "https://www.youtube.com/watch?v=ZHJUGEdFeboU" // Meditation for students
    }
  ];

  const getIcon = (type) => {
    switch (type) {
      case "video":
        return Video;
      case "document":
        return FileText;
      case "audio":
        return Headphones;
      default:
        return BookOpen;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "video":
        return "bg-pink-100 text-pink-400";
      case "document":
        return "bg-purple-100 text-purple-400";
      case "audio":
        return "bg-pink-200 text-pink-400";
      default:
        return "bg-purple-100 text-purple-400";
    }
  };

  const handleOpenResource = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDownload = (resource) => {
    // For demo purposes - you could implement actual download functionality
    alert(`Downloading: ${resource.title}`);
  };

  const categories = ["All", "Wellness", "Study Skills", "Resources", "Productivity"];

  const filteredResources =
    selectedCategory === "All"
      ? resources
      : resources.filter((r) => r.category === selectedCategory);

  return (
    <div className="min-h-screen p-8" style={{ background: '#f5eef8' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold mb-2" style={{ color: '#5a4a61' }}>
            Learning Resources
          </h1>
          <p className="text-base" style={{ color: '#9575a3' }}>
            Your personalized collection of study materials
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full whitespace-nowrap transition-all font-medium ${
                selectedCategory === category
                  ? "shadow-md text-white"
                  : "bg-white hover:border-purple-300"
              }`}
              style={{
                background: selectedCategory === category ? '#b39ddb' : '#ffffff',
                border: selectedCategory === category ? 'none' : '1px solid rgba(179, 157, 219, 0.2)',
                color: selectedCategory === category ? '#ffffff' : '#5a4a61'
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => {
            const Icon = getIcon(resource.type);
            return (
              <div
                key={resource.id}
                className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all group"
                style={{ border: '1px solid rgba(179, 157, 219, 0.2)' }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl ${getTypeColor(
                      resource.type
                    )} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  {resource.favorite && (
                    <Star className="h-5 w-5 fill-pink-300 text-pink-300" />
                  )}
                </div>

                {/* Content */}
                <h3 className="mb-2 line-clamp-2 font-medium" style={{ color: '#5a4a61' }}>
                  {resource.title}
                </h3>
                
                <div className="flex items-center gap-2 mb-4">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ background: '#e1bee7', color: '#5a4a61' }}
                  >
                    {resource.category}
                  </span>
                  {resource.duration && (
                    <span className="text-xs" style={{ color: '#9575a3' }}>
                      {resource.duration}
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                {resource.progress !== undefined && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1" style={{ color: '#9575a3' }}>
                      <span>Progress</span>
                      <span>{resource.progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#e1bee7' }}>
                      <div
                        className="h-full transition-all"
                        style={{ 
                          width: `${resource.progress}%`,
                          background: resource.progress === 100 
                            ? '#4ade80' 
                            : 'linear-gradient(to right, #b39ddb, #f8bbd0)'
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleOpenResource(resource.url)}
                    className="flex-1 rounded-full gap-2 py-2 px-4 text-sm font-medium text-white hover:opacity-90 transition-opacity flex items-center justify-center"
                    style={{ background: '#b39ddb' }}
                  >
                    <ExternalLink className="h-3 w-3" />
                    Open
                  </button>
                  <button
                    onClick={() => handleDownload(resource)}
                    className="rounded-full w-10 h-10 flex items-center justify-center bg-white hover:bg-purple-50 transition-colors"
                    style={{ border: '1px solid rgba(179, 157, 219, 0.2)' }}
                  >
                    <Download className="h-4 w-4" style={{ color: '#b39ddb' }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State for filtered results */}
        {filteredResources.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(179, 157, 219, 0.1)' }}>
              <BookOpen className="h-10 w-10" style={{ color: '#b39ddb' }} />
            </div>
            <h3 className="mb-2 font-medium" style={{ color: '#5a4a61' }}>No resources found</h3>
            <p className="text-sm" style={{ color: '#9575a3' }}>
              Try selecting a different category
            </p>
          </div>
        )}

        {/* Suggested Resources */}
        <div className="rounded-3xl p-6" style={{ 
          background: 'linear-gradient(to bottom right, rgba(248, 187, 208, 0.2), rgba(179, 157, 219, 0.2))',
          border: '1px solid rgba(179, 157, 219, 0.2)' 
        }}>
          <h3 className="mb-4 font-semibold" style={{ color: '#5a4a61' }}>Suggested for You</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestedResources.map((suggested, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 rounded-2xl p-4 hover:bg-white transition-colors cursor-pointer" 
                style={{ background: 'rgba(255, 255, 255, 0.7)' }}
              >
                <div className={`w-10 h-10 rounded-xl ${index === 0 ? 'bg-purple-100 text-purple-400' : 'bg-pink-100 text-pink-400'} flex items-center justify-center flex-shrink-0`}>
                  <suggested.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium" style={{ color: '#5a4a61' }}>{suggested.title}</p>
                  <p className="text-sm" style={{ color: '#9575a3' }}>{suggested.duration}</p>
                </div>
                <button 
                  onClick={() => handleOpenResource(suggested.url)}
                  className="px-4 py-1 rounded-full text-sm font-medium hover:opacity-90 transition-opacity" 
                  style={{ background: 'transparent', color: '#b39ddb' }}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resources;