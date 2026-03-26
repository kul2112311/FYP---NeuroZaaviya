import { useState, useRef } from "react";

// ─── Mock Data ───────────────────────────────────────────────────────────────
const MOCK_CONVERSATIONS = [
  {
    id: 1,
    name: "Asad Ali",
    role: "FocusPeer",
    lastMessage: "Absolutely! Let's work through...",
    timestamp: "1h ago",
    unreadCount: 1,
    isOnline: true,
    initials: "AA",
  },
  {
    id: 2,
    name: "OAP Office",
    role: "OAP",
    lastMessage: "Of course! We can definitely help...",
    timestamp: "Yesterday",
    unreadCount: 0,
    isOnline: true,
    initials: "OA",
  },
  {
    id: 3,
    name: "Marcus Chen",
    role: "FocusPeer",
    lastMessage: "See you at our next session!",
    timestamp: "2d ago",
    unreadCount: 0,
    isOnline: false,
    initials: "MC",
  },
  {
    id: 4,
    name: "Layla Hassan",
    role: "FocusPeer",
    lastMessage: "Great work on your progress...",
    timestamp: "3d ago",
    unreadCount: 0,
    isOnline: true,
    initials: "LH",
  },
  {
    id: 5,
    name: "Jordan Taylor",
    role: "FocusPeer",
    lastMessage: "Let me know if you need any help!",
    timestamp: "4d ago",
    unreadCount: 0,
    isOnline: false,
    initials: "JT",
  },
  {
    id: 6,
    name: "Fatima Khan",
    role: "Wellness",
    lastMessage: "Remember to practice self-care",
    timestamp: "1w ago",
    unreadCount: 0,
    isOnline: true,
    initials: "FK",
  },
  {
    id: 7,
    name: "Sara Ali",
    role: "Ehsaas Counsellor",
    lastMessage: "Looking forward to our session...",
    timestamp: "1w ago",
    unreadCount: 0,
    isOnline: false,
    initials: "SA",
  },
];

// ─── SearchBar ────────────────────────────────────────────────────────────────
function SearchBar({ onSearch, placeholder = "Search conversations..." }) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onSearch?.(val);
  };

  const handleClear = () => {
    setQuery("");
    onSearch?.("");
    inputRef.current?.focus();
  };

  return (
    <div className="px-3 py-3 w-full">
      <div
        className={`flex items-center gap-2 rounded-full px-3 py-2 w-full transition-all duration-200 ${
          isFocused
            ? "bg-white ring-2 ring-purple-400 shadow-sm"
            : "bg-purple-100 hover:bg-purple-200"
        }`}
      >
        <svg
          className={`w-4 h-4 shrink-0 transition-colors duration-200 ${
            isFocused ? "text-purple-500" : "text-purple-400"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" strokeLinecap="round" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 min-w-0 bg-transparent text-sm text-gray-700 placeholder-purple-300 outline-none border-none"
        />

        {query && (
          <button
            onClick={handleClear}
            className="shrink-0 text-purple-400 hover:text-purple-600 transition-colors duration-150"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// ─── ConversationItem ─────────────────────────────────────────────────────────
function ConversationItem({ conversation, active, onClick }) {
  const { name, role, lastMessage, timestamp, unreadCount, isOnline, initials } = conversation;

  return (
    <li
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-150 ${
        active
          ? "bg-purple-100 border-l-4 border-purple-500"
          : "hover:bg-purple-50 border-l-4 border-transparent"
      }`}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
          <span className="text-sm font-semibold text-purple-700">{initials}</span>
        </div>
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
        )}
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-800 truncate">{name}</span>
          <span className="text-[10px] text-gray-400 shrink-0 ml-1">{timestamp}</span>
        </div>

        {role && (
          <span className="text-[10px] text-purple-400 font-medium">{role}</span>
        )}

        <div className="flex items-center justify-between mt-0.5">
          <p className="text-xs text-gray-400 truncate">{lastMessage}</p>
          {unreadCount > 0 && (
            <span className="ml-2 shrink-0 bg-purple-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </li>
  );
}

// ─── LeftPanel (default export) ───────────────────────────────────────────────
export default function LeftPanel({ onSelectConversation }) {
  const [activeId, setActiveId] = useState(null);
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);

  const handleSearch = (query) => {
    if (!query.trim()) {
      setConversations(MOCK_CONVERSATIONS);
      return;
    }
    setConversations(
      MOCK_CONVERSATIONS.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.role.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const handleSelect = (conv) => {
    setActiveId(conv.id);
    onSelectConversation?.(conv);
  };

  return (
    <>
      <h2 className="px-4 pt-5 pb-1 text-lg font-semibold text-purple-900">Chats</h2>

      <SearchBar onSearch={handleSearch} />

      <ul className="flex-1 overflow-y-auto divide-y divide-purple-50">
        {conversations.length === 0 ? (
          <li className="px-4 py-8 text-center text-sm text-purple-300">
            No conversations found
          </li>
        ) : (
          conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              active={conv.id === activeId}
              onClick={() => handleSelect(conv)}
            />
          ))
        )}
      </ul>
    </>
  );
}