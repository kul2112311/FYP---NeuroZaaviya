import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';  // Import Navigate
import Community from './pages/shared/CommunityPage.jsx';
import FocusPeerPage from './pages/StudentInterface/FocusPeerPage.jsx';
import NavBar, { SideBarItem } from './components/navbar/NavBar.jsx';
import { LayoutDashboard, BookOpen, Newspaper, Users, Settings } from "lucide-react";
import FocusPeer from './pages/FocusPeerInterface/FocusPeer.jsx';
import GiveFeedbackForm from './pages/FocusPeerInterface/GiveFeedBackPage.jsx';
import Dashboard from './pages/StudentInterface/Dashboard.jsx';
import DetailedProgress from './pages/StudentInterface/DetailedProgress';  // without the .jsx extension
 // Import DetailedProgress

function AppContent() {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("token") !== null; // Check if user is logged in

  const CURRENT_INTERFACE = 'focuspeer';  // Change to 'focuspeer' to see FocusPeer interface
  
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
          text={CURRENT_INTERFACE === 'student' ? 'FocusPeer' : 'My Students'}
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
            <Route path="/" element={<Dashboard />} /> 
            {/* Ensure login condition for DetailedProgress */}
            <Route path="/detailed-progress" 
              element={<DetailedProgress />} 
            />
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
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
