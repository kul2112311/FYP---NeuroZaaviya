import { useState, useRef, useEffect } from "react";
import { Paperclip, Phone, Video, MoreVertical, Send, X, FileText } from "lucide-react";

// ─── Fake current user (swap with real auth later) ────────────────────────────
const CURRENT_USER = {
  id: 1,
  name: "Ushna Batool",
  role: "Student",
  initials: "UB",
};

// ─── Mock messages (swap with API later) ─────────────────────────────────────
const MOCK_MESSAGES = [
  {
    id: 1,
    senderId: 2,
    text: "Hi Ushna! Thanks for booking a session with me. How can I help you today?",
    timestamp: "2:30 PM",
    status: "read",
    file: null,
  },
  {
    id: 2,
    senderId: 1,
    text: "Hi Asad! I'm working on a CS project and could use some help breaking it down into smaller tasks.",
    timestamp: "3:15 PM",
    status: "read",
    file: null,
  },
  {
    id: 3,
    senderId: 2,
    text: "Absolutely! Let's work through it together. We can use the Eisenhower Matrix to prioritize your tasks.",
    timestamp: "3:20 PM",
    status: "read",
    file: null,
  },
];

// ─── ChatHeader ───────────────────────────────────────────────────────────────
function ChatHeader({ conversation }) {
  if (!conversation) return (
    <div className="h-16 border-b border-purple-100 bg-white flex items-center px-6">
      <p className="text-sm text-gray-400">Select a conversation</p>
    </div>
  );

  const { name, role, isOnline, initials } = conversation;

  return (
    <div className="h-16 border-b border-purple-100 bg-white flex items-center justify-between px-6 shrink-0 ">
      {/* Left — avatar + name */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
            <span className="text-sm font-semibold text-purple-700">{initials}</span>
          </div>
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{name}</p>
          <p className="text-xs text-purple-400">
            {isOnline ? "Active now" : `${role}`}
          </p>
        </div>
      </div>

      {/* Right — action icons */}
      <div className="flex items-center gap-4 text-gray-400">
       
      
      </div>
    </div>
  );
}

// ─── MessageBubble ────────────────────────────────────────────────────────────
function MessageBubble({ message, isMe }) {
  const { text, timestamp, status, file } = message;

  return (
    <div className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
      
      <div className={`flex flex-col gap-1 max-w-[60%] ${isMe ? "items-end" : "items-start"}`}>

        {text && (
        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-all overflow-hidden ${
            isMe
            ? "bg-purple-500 text-white rounded-br-sm"
            : "bg-white border border-purple-100 text-gray-700 rounded-bl-sm shadow-sm"
        }`}>
            {text}
        </div>
        )}

        <div className={`flex items-center gap-1 px-1 ${isMe ? "flex-row-reverse" : ""}`}>
          <span className="text-[10px] text-gray-400">{timestamp}</span>
          {isMe && (
            <span className="text-[10px] text-purple-400">
              {status === "read" ? "Read" : status === "delivered" ? "Delivered" : "Sent"}
            </span>
          )}
        </div>
      </div>

    </div>
  );
}
// ─── MessageInput ─────────────────────────────────────────────────────────────
function MessageInput({ onSend }) {
  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    setAttachment({
      file,
      name: file.name,
      type: isImage ? "image" : "file",
      url: isImage ? URL.createObjectURL(file) : null,
    });
  };

  const handleSend = () => {
    if (!text.trim() && !attachment) return;
    onSend?.({ text: text.trim(), file: attachment });
    setText("");
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  return (
    <div className="border-t border-purple-100 bg-white px-4 py-3 shrink-0">

      {/* Attachment preview */}
      {attachment && (
        <div className="mb-2 flex items-center gap-2 bg-purple-50 rounded-xl px-3 py-2">
          {attachment.type === "image" ? (
            <img src={attachment.url} alt="preview" className="w-10 h-10 rounded-lg object-cover" />
          ) : (
            <FileText size={18} className="text-purple-400 shrink-0" />
          )}
          <span className="text-xs text-gray-600 truncate flex-1">{attachment.name}</span>
          <button
            onClick={() => setAttachment(null)}
            className="text-gray-400 hover:text-red-400 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-3">

        {/* Attachment button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0 text-gray-400 hover:text-purple-500 transition-colors mb-1"
          aria-label="Attach file"
        >
          <Paperclip size={18} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Text input */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 resize-none bg-purple-50 rounded-2xl px-4 py-2.5 text-sm text-gray-700 placeholder-purple-300 outline-none border-none focus:ring-2 focus:ring-purple-300 transition-all leading-relaxed"
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!text.trim() && !attachment}
          className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all mb-0.5 ${
            text.trim() || attachment
              ? "bg-purple-500 text-white hover:bg-purple-600 shadow-sm"
              : "bg-purple-100 text-purple-300 cursor-not-allowed"
          }`}
          aria-label="Send message"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}

// ─── RightPanel (default export) ──────────────────────────────────────────────
export default function RightPanel({ conversation }) {
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset messages when conversation changes
  useEffect(() => {
    setMessages(MOCK_MESSAGES);
  }, [conversation?.id]);

  const handleSend = ({ text, file }) => {
    const newMessage = {
      id: messages.length + 1,
      senderId: CURRENT_USER.id,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
      file: file
        ? { name: file.name, type: file.type, url: file.url }
        : null,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

// // Empty state — remove the inline style
// if (!conversation) {
//   return (
//     // Added flex-1 to make sure it expands to fill the width
//     // Added min-w-0 to allow it to shrink properly if the window is resized
//     <div className="flex-1 min-w-0 h-full w-full flex flex-col items-center justify-center bg-[#faf8ff] gap-3">
//       <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
//         <Send size={24} className="text-purple-300" />
//       </div>
//       <p className="text-sm text-purple-300 font-medium">
//         Select a conversation to start chatting
//       </p>
//     </div>
//   );
// }
//  return (
//   <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
//     <ChatHeader conversation={conversation} />

//     <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4 bg-[#faf8ff]">
//       {messages.map((msg) => (
//         <MessageBubble
//           key={msg.id}
//           message={msg}
//           isMe={msg.senderId === CURRENT_USER.id}
//         />
//       ))}
//       <div ref={messagesEndRef} />
//     </div>

//     <MessageInput onSend={handleSend} />
//   </div>
// )};
return (
    <div className="flex-1 flex flex-col h-full min-w-0 w-full overflow-hidden bg-[#faf8ff]">
      {!conversation ? (
        /* --- EMPTY STATE CONTENT --- */
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
            <Send size={24} className="text-purple-300" />
          </div>
          <p className="text-sm text-purple-300 font-medium">
            Select a conversation to start chatting
          </p>
        </div>
      ) : (
        /* --- ACTIVE CHAT CONTENT --- */
        <>
          <ChatHeader conversation={conversation} />

          <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isMe={msg.senderId === CURRENT_USER.id}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <MessageInput onSend={handleSend} />
        </>
      )}
    </div>
  );
}