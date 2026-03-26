import { useState } from "react";
import LeftPanel from "../../../components/CommunityComponents/ChatComponents/leftpanel.jsx";
import RightPanel from "../../../components/CommunityComponents/ChatComponents/rightpanel.jsx";

// export default function ChatPage() {
//   const [activeConversation, setActiveConversation] = useState(null);

//   return (
//     <div className="flex overflow-hidden" style={{ height: '100vh', maxWidth: '100%' }}>
      
//       <aside className="w-64 shrink-0 bg-purple-50 border-r border-purple-100 flex flex-col" style={{ height: '100vh' }}>
//         <LeftPanel onSelectConversation={setActiveConversation} />
//       </aside>

//       <div className="flex-1 overflow-hidden" style={{ height: '100vh', maxWidth: '100%' }}>
//         <RightPanel conversation={activeConversation} />
//       </div>

//     </div>
//   );
// }
export default function ChatPage() {
  const [activeConversation, setActiveConversation] = useState(null);

  return (
    <div className="flex items-start justify-center w-full px-34"
         style={{ width: '80vw' }}>
      
      {/* Main chat container */}
      <div className="flex w-full max-w-6xl h-full rounded-2xl overflow-hidden shadow-sm border border-purple-100 bg-white">
        
        <aside className="w-72 shrink-0 bg-purple-50 border-r border-purple-100 flex flex-col">
          <LeftPanel onSelectConversation={setActiveConversation} />
        </aside>

        <div className="flex-1 flex overflow-hidden">
          <RightPanel conversation={activeConversation} />
        </div>

      </div>
    </div>
  );
}