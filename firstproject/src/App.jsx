
// import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
// import Community from './pages/shared/CommunityPage.jsx'
// import FocusPeerPage from './pages/StudentInterface/FocusPeerPage.jsx'
// import NavBar, { SideBarItem } from './components/navbar/NavBar.jsx'
// import { LayoutDashboard, BookOpen, Newspaper, Users, Settings } from "lucide-react";
// import FocusPeer from './pages/FocusPeerInterface/FocusPeer.jsx';

// function AppContent() {
//   const location = useLocation();
  
//   return (
//     <div className="flex">
//       <NavBar>
//         <SideBarItem 
//           icon={<LayoutDashboard size={20}/>} 
//           text="Dashboard" 
//           to="/"
//           active={location.pathname === '/'}
//         />
//         <SideBarItem 
//           icon={<BookOpen size={20}/>} 
//           text="Resources" 
//           to="/resources"
//           active={location.pathname === '/resources'}
//         />
//         <SideBarItem 
//           icon={<Newspaper size={20}/>} 
//           text="Forum" 
//           to="/forum"
//           active={location.pathname === '/forum'}
//         />
//         <SideBarItem 
//           icon={<Users size={20}/>} 
//           text="FocusPeer" 
//           to="/focuspeer"
//           active={location.pathname === '/focuspeer'}
//         />
//         <SideBarItem 
//           icon={<Settings size={20}/>} 
//           text="Settings" 
//           to="/settings"
//           active={location.pathname === '/settings'}
//         />
//       </NavBar>
      
//       <main className="flex-1">
//         <Routes>
//           <Route path="/" element={<div>Dashboard Page</div>} />
//           <Route path="/resources" element={<div>Resources Page</div>} />
//           <Route path="/forum" element={<Community />} />
//           <Route path="/focuspeer" element={<FocusPeerPage />} />
//           <Route path="/settings" element={<div>Settings Page</div>} />
//         </Routes>
//       </main>
//     </div>
//   )
// }

// function App() {
//   return (
//     <BrowserRouter>
//       <AppContent />
//     </BrowserRouter>
//   )
// }

// export default App

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Community from './pages/shared/CommunityPage.jsx'
import FocusPeerPage from './pages/StudentInterface/FocusPeerPage.jsx'
import NavBar, { SideBarItem } from './components/navbar/NavBar.jsx'
import { LayoutDashboard, BookOpen, Newspaper, Users, Settings } from "lucide-react";
import FocusPeer from './pages/FocusPeerInterface/FocusPeer.jsx';
import GiveFeedbackForm from './pages/FocusPeerInterface/GiveFeedBackPage.jsx';

function AppContent() {
  const location = useLocation();
  
  // ========== SWITCH BETWEEN INTERFACES HERE ==========
  const CURRENT_INTERFACE = 'student';  // Change to 'focuspeer' to see FocusPeer interface or students for Student interface
  // const CURRENT_INTERFACE = 'focuspeer';  // Uncomment this line and comment above
  // ===================================================
  
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
          text={CURRENT_INTERFACE === 'student' ? 'Find FocusPeer' : 'My Students'}
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
      
      <main className="flex-1" style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '1200px' }}>
          <Routes>
            <Route path="/" element={<div>Dashboard Page</div>} />
            <Route path="/resources" element={<div>Resources Page</div>} />
            <Route path="/forum" element={<Community />} />
            <Route 
              path="/focuspeer" 
              element={CURRENT_INTERFACE === 'student' ? <FocusPeerPage /> : <FocusPeer />} 
            />
            <Route path="/settings" element={<div>Settings Page</div>} />
            <Route path="/feedback-form" element={<GiveFeedbackForm />} />
          </Routes>
        </div>
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
