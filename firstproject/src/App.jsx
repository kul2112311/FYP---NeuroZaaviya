
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Community from './pages/CommunityPage.jsx'
import FocusPeerPage from './pages/FocusPeerPage.jsx'
import NavBar, { SideBarItem } from './components/navbar/NavBar.jsx'
import { LayoutDashboard, BookOpen, Newspaper, Users, Settings } from "lucide-react";

function AppContent() {
  const location = useLocation();
  
  return (
    <div className="flex">
      <NavBar>
        <SideBarItem 
          icon={<LayoutDashboard size={20}/>} 
          text="Dashboard" 
          to="/"
          active={location.pathname === '/'}
        />
        <SideBarItem 
          icon={<BookOpen size={20}/>} 
          text="Resources" 
          to="/resources"
          active={location.pathname === '/resources'}
        />
        <SideBarItem 
          icon={<Newspaper size={20}/>} 
          text="Forum" 
          to="/forum"
          active={location.pathname === '/forum'}
        />
        <SideBarItem 
          icon={<Users size={20}/>} 
          text="FocusPeer" 
          to="/focuspeer"
          active={location.pathname === '/focuspeer'}
        />
        <SideBarItem 
          icon={<Settings size={20}/>} 
          text="Settings" 
          to="/settings"
          active={location.pathname === '/settings'}
        />
      </NavBar>
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<div>Dashboard Page</div>} />
          <Route path="/resources" element={<div>Resources Page</div>} />
          <Route path="/forum" element={<Community />} />
          <Route path="/focuspeer" element={<FocusPeerPage />} />
          <Route path="/settings" element={<div>Settings Page</div>} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
// import Community from './pages/CommunityPage.jsx'
// import FocusPeerPage from './pages/FocusPeerPage.jsx'
// import NavBar, { SideBarItem } from './components/navbar/NavBar.jsx'
// import {   LayoutDashboard, 
//   BookOpen,        // For Resources
//   MessageSquare,   // For Forum (bulletin board/discussion)
//   Users, 
//   Newspaper,           // For FocusPeer (peer collaboration)
//   Settings  } from "lucide-react";

// function App() {
//   return (
//     <div className="flex">
//       <NavBar>
//        <SideBarItem icon={<LayoutDashboard size={20}/>} text="Dashboard"/>
//         <SideBarItem icon={<BookOpen size={20}/>} text="Resources"/>
//         <SideBarItem icon={<Newspaper size={20}/>} text="Forum"/>
//         <SideBarItem icon={<Users size={20}/>} text="FocusPeer"/>
//         <SideBarItem icon={<Settings size={20}/>} text="Settings"/>
//       </NavBar>
//       <main  className="flex-1">
//         <FocusPeerPage />
//         {/* <Community/> */}
//       </main>
//     </div>
//   )
// }

// export default App
