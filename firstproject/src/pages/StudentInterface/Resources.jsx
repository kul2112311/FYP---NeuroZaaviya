import React, { useState } from "react";
import { BookOpen, Video, FileText, Headphones, Download, ExternalLink, Star } from "lucide-react";

export function Resources() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const resources = [
    {
      id: "1",
      title: "Mindfulness for Students – UCLA Guided Meditation",
      type: "video",
      category: "Wellness",
      duration: "5 min",
      favorite: true,
      description: "Calm your mind before exams with this breathing-focused guided meditation from UCLA Health.",
      url: "https://www.youtube.com/watch?v=O-6f5wQXSu8"
    },
    {
      id: "2",
      title: "Crash Course Study Skills (Full Playlist)",
      type: "video",
      category: "Study Skills",
      duration: "10 episodes",
      favorite: true,
      description: "Thomas Frank's complete guide to note-taking, memory, focus, and acing exams — free on YouTube.",
      url: "https://www.youtube.com/watch?v=IhuwS5ZLwKY&list=PL8dPuuaLjXtNcAJRf3bE1IJU6nMfHj86W"
    },
    {
      id: "3",
      title: "How to Focus & Concentrate Better – Thomas Frank",
      type: "video",
      category: "Study Skills",
      duration: "11 min",
      description: "Practical science-backed techniques for deep focus, beating procrastination, and staying on task.",
      url: "https://www.youtube.com/watch?v=Hu4Yvq-g7_Y"
    },
    {
      id: "4",
      title: "Lofi Hip Hop Radio – Beats to Study/Relax to",
      type: "audio",
      category: "Wellness",
      duration: "24/7 live",
      favorite: true,
      description: "The iconic Lofi Girl 24/7 stream — chill beats, zero ads, perfect background for deep work.",
      url: "https://www.youtube.com/watch?v=jfKfPfyJRdk"
    },
    {
      id: "5",
      title: "Time Management for Students – 7 Simple Strategies",
      type: "video",
      category: "Productivity",
      duration: "9 min",
      description: "Stop feeling overwhelmed — learn how to plan your week, prioritise tasks, and stop procrastinating.",
      url: "https://www.youtube.com/watch?v=iONDebHX9qk"
    },
    {
      id: "6",
      title: "Student Wellbeing & Self-Care – What Actually Helps",
      type: "video",
      category: "Wellness",
      duration: "14 min",
      description: "Evidence-based self-care habits for students: sleep, movement, digital breaks, and mental resets.",
      url: "https://www.youtube.com/watch?v=ZXsQAXx_ao0"
    },
    {
      id: "7",
      title: "Study Tips for ADHD & Neurodivergent Students",
      type: "video",
      category: "Study Skills",
      duration: "16 min",
      description: "Real ADHD-friendly strategies: body doubling, Pomodoro tweaks, sensory environments, and more.",
      url: "https://www.youtube.com/watch?v=t-PW4YM8q6I"
    },
    {
      id: "8",
      title: "The Pomodoro Technique – Study With Me (2h)",
      type: "audio",
      category: "Productivity",
      duration: "2 hours",
      description: "25-min work / 5-min break sessions with a timer on screen. Great for staying accountable solo.",
      url: "https://www.youtube.com/watch?v=mNBmG24djoY"
    },
    {
      id: "9",
      title: "Cornell Note-Taking System Explained",
      type: "video",
      category: "Study Skills",
      duration: "8 min",
      description: "The most widely recommended note-taking method — learn cues, notes, and summary sections.",
      url: "https://www.youtube.com/watch?v=nEY2QS3YqM8"
    },
    {
      id: "10",
      title: "Headspace – Meditation for Beginners (10 min)",
      type: "audio",
      category: "Wellness",
      duration: "10 min",
      description: "A beginner-friendly guided meditation to reduce stress and build a daily mindfulness habit.",
      url: "https://www.youtube.com/watch?v=inpok4MKVLM"
    },
    {
      id: "11",
      title: "How I Study Smarter, Not Harder – Ali Abdaal",
      type: "video",
      category: "Productivity",
      duration: "18 min",
      favorite: true,
      description: "Evidence-based study methods from a Cambridge medical student: active recall, spaced repetition, and more.",
      url: "https://www.youtube.com/watch?v=ukLnPbIffxE"
    },
    {
      id: "12",
      title: "Ambient Cafe Study Sounds – 3 Hours",
      type: "audio",
      category: "Wellness",
      duration: "3 hours",
      description: "Coffee shop background noise for focus — soft chatter, cups clinking, rain outside the window.",
      url: "https://www.youtube.com/watch?v=2DlJWUeEBsk"
    },
  ];

  const suggestedResources = [
    {
      title: "Study Less, Study Smart – Marty Lobdell",
      duration: "59 min",
      icon: Video,
      description: "The legendary Pierce College lecture on how memory actually works — a must-watch.",
      url: "https://www.youtube.com/watch?v=IlU-zDU6aQ0"
    },
    {
      title: "10-Minute Guided Breathing for Stress",
      duration: "10 min",
      icon: Headphones,
      description: "Box breathing technique to calm nerves before exams or overwhelming workdays.",
      url: "https://www.youtube.com/watch?v=tybOi4hjZFQ"
    },
    {
      title: "Active Recall: The Best Study Method",
      duration: "12 min",
      icon: Video,
      description: "Why flashcards beat re-reading — the science of retrieving information from memory.",
      url: "https://www.youtube.com/watch?v=ukLnPbIffxE"
    },
    {
      title: "Deep Work Playlist – 4 Hours Focus Music",
      duration: "4 hours",
      icon: Headphones,
      description: "Instrumental focus music for long study or work sessions with no distractions.",
      url: "https://www.youtube.com/watch?v=sjkrrmBnpGE"
    },
  ];

  const getIcon = (type) => {
    switch (type) {
      case "video":   return Video;
      case "audio":   return Headphones;
      case "document": return FileText;
      default:        return BookOpen;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "video":   return { bg: "#fce4ec", text: "#f06292" };
      case "audio":   return { bg: "#e8eaf6", text: "#7986cb" };
      case "document":return { bg: "#f3e5f5", text: "#ab47bc" };
      default:        return { bg: "#e1bee7", text: "#9575cd" };
    }
  };

  const categories = ["All", "Wellness", "Study Skills", "Productivity"];

  const filteredResources =
    selectedCategory === "All"
      ? resources
      : resources.filter((r) => r.category === selectedCategory);

  return (
    <div className="min-h-screen p-8" style={{ background: "#f5eef8" }}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold mb-1" style={{ color: "#5a4a61" }}>
            Learning Resources
          </h1>
          <p className="text-base" style={{ color: "#9575a3" }}>
            Curated YouTube videos, guided meditations, and study tools — all free, all real links
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="px-6 py-2 rounded-full whitespace-nowrap transition-all font-medium"
              style={{
                background: selectedCategory === category ? "#b39ddb" : "#ffffff",
                border: selectedCategory === category ? "none" : "1px solid rgba(179,157,219,0.2)",
                color: selectedCategory === category ? "#ffffff" : "#5a4a61",
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
            const typeColor = getTypeColor(resource.type);
            return (
              <div key={resource.id}
                className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all group flex flex-col"
                style={{ border: "1px solid rgba(179,157,219,0.2)" }}>

                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0"
                    style={{ background: typeColor.bg }}>
                    <Icon className="h-6 w-6" style={{ color: typeColor.text }} />
                  </div>
                  {resource.favorite && (
                    <Star className="h-5 w-5 flex-shrink-0" style={{ fill: "#f8bbd0", color: "#f8bbd0" }} />
                  )}
                </div>

                {/* Title + description */}
                <h3 className="font-semibold mb-1 leading-snug" style={{ color: "#5a4a61" }}>
                  {resource.title}
                </h3>
                {resource.description && (
                  <p className="text-xs mb-3 leading-relaxed flex-1" style={{ color: "#9575a3" }}>
                    {resource.description}
                  </p>
                )}

                {/* Tags */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ background: "#e1bee7", color: "#5a4a61" }}>
                    {resource.category}
                  </span>
                  {resource.duration && (
                    <span className="text-xs" style={{ color: "#9575a3" }}>{resource.duration}</span>
                  )}
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: typeColor.bg, color: typeColor.text }}>
                    {resource.type}
                  </span>
                </div>

                {/* Action */}
                <button
                  onClick={() => window.open(resource.url, "_blank", "noopener,noreferrer")}
                  className="w-full rounded-full py-2.5 px-4 text-sm font-medium text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  style={{ background: "#b39ddb" }}>
                  <ExternalLink className="h-3.5 w-3.5" />
                  Watch on YouTube
                </button>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredResources.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(179,157,219,0.1)" }}>
              <BookOpen className="h-10 w-10" style={{ color: "#b39ddb" }} />
            </div>
            <h3 className="mb-2 font-medium" style={{ color: "#5a4a61" }}>No resources found</h3>
            <p className="text-sm" style={{ color: "#9575a3" }}>Try selecting a different category</p>
          </div>
        )}

        {/* Suggested Resources */}
        <div className="rounded-3xl p-6" style={{
          background: "linear-gradient(to bottom right, rgba(248,187,208,0.15), rgba(179,157,219,0.15))",
          border: "1px solid rgba(179,157,219,0.2)"
        }}>
          <h3 className="mb-4 font-semibold text-lg" style={{ color: "#5a4a61" }}>✨ Highly Recommended</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestedResources.map((s, i) => (
              <div key={i}
                className="flex items-start gap-4 rounded-2xl p-4 cursor-pointer hover:shadow-md transition-all"
                style={{ background: "rgba(255,255,255,0.85)" }}
                onClick={() => window.open(s.url, "_blank", "noopener,noreferrer")}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: i % 2 === 0 ? "#f3e5f5" : "#e8eaf6" }}>
                  <s.icon className="h-5 w-5" style={{ color: i % 2 === 0 ? "#ab47bc" : "#7986cb" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm mb-0.5" style={{ color: "#5a4a61" }}>{s.title}</p>
                  <p className="text-xs mb-1" style={{ color: "#9575a3" }}>{s.description}</p>
                  <span className="text-xs" style={{ color: "#b39ddb" }}>{s.duration}</span>
                </div>
                <ExternalLink className="h-4 w-4 flex-shrink-0 mt-1" style={{ color: "#b39ddb" }} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Resources;