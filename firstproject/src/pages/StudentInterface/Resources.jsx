import React, { useState } from "react";
import ResourceCard from "./ResourceCard"; // Import the ResourceCard component
import "./resources.css"; // Import the associated styles

function Resources() {
  // Static resources data
  const [resources, setResources] = useState([
    {
      id: 1,
      title: "Learning React",
      durationText: "30 min",
      progress: 60,
      openUrl: "https://reactjs.org",
      downloadUrl: "https://reactjs.org/downloads",
      starred: false,
      icon: "📄", // Default icon
    },
    {
      id: 2,
      title: "JavaScript Basics",
      durationText: "45 min",
      progress: 80,
      openUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
      downloadUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
      starred: true,
      icon: "📘", // PDF icon
    },
    {
      id: 3,
      title: "CSS Grid Layout",
      durationText: "20 min",
      progress: 30,
      openUrl: "https://css-tricks.com/snippets/css/complete-guide-grid/",
      downloadUrl: "https://css-tricks.com/snippets/css/complete-guide-grid/",
      starred: false,
      icon: "📄", // Default icon
    },
  ]);

  // Handle toggling the starred state of a resource
  const toggleStar = (id) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, starred: !r.starred } : r))
    );
  };

  return (
    <div className="resourcesPage">
      <div className="mainText">
        <h1>Learning Resources</h1>
        <p>Your personalized collection of study materials</p>
      </div>

      <div className="resourcesGrid">
        {resources.map((r) => (
          <ResourceCard
            key={r.id}
            icon={<span className="rc-emojiIcon">{r.icon}</span>}
            title={r.title}
            durationText={r.durationText}
            progress={r.progress}
            openUrl={r.openUrl}
            downloadUrl={r.downloadUrl}
            isStarred={r.starred}
            onToggleStar={() => toggleStar(r.id)} // Toggle the starred state
          />
        ))}
      </div>
    </div>
  );
}

// Icon helper function to choose an appropriate icon based on the URL
function pickIcon(url) {
  if (!url) return "📄"; // Default to document icon
  if (url.includes("youtube") || url.includes("video")) return "📹"; // Video URL
  if (url.includes(".pdf")) return "📘"; // PDF URL
  return "📄"; // Default document icon
}

export default Resources;
