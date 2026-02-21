// App.jsx - Updated with Role-Based Navigation
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Community from './pages/shared/CommunityPage.jsx'
import FocusPeerPage from './pages/StudentInterface/FocusPeerPage.jsx'
import NavBar, { SideBarItem } from './components/navbar/NavBar.jsx'
import { LayoutDashboard, BookOpen, Newspaper, Users, Settings, FileText, Folder } from "lucide-react";
import FocusPeer from './pages/FocusPeerInterface/FocusPeer.jsx';
import GiveFeedbackForm from './pages/FocusPeerInterface/GiveFeedBackPage.jsx';
import { UserProvider, useUser } from './usercontext';
import FocuspeerMonitor from './pages/Wellness/FocuspeerMonitor.jsx';
import Dashboard from './pages/StudentInterface/Dashboard.jsx';
import DetailedProgress from './pages/StudentInterface/DetailedProgress.jsx';
import Resources from './pages/StudentInterface/Resources.jsx';
import { AITaskBreakdownPage } from './pages/StudentInterface/Aitaskbreakdownpage.jsx';
import { EisenhowerMatrixPage } from './pages/StudentInterface/Eisenhowermatrixpage.jsx';

import WellnessDashboard from './pages/Wellness/WellnessDashboard.jsx';
import Student  from './pages/Wellness/Students.jsx';
import Alert from './pages/shared/Alerts.jsx';
// ========== MENU CONFIGURATION ==========
// This object defines what menu items each role can see
const menuConfig = {
  student: [
    { icon: <LayoutDashboard size={20}/>, text: "Dashboard", to: "/" },
    { icon: <BookOpen size={20}/>, text: "Resources", to: "/resources" },
    { icon: <Newspaper size={20}/>, text: "Forum", to: "/forum" },
    { icon: <Users size={20}/>, text: "FocusPeer", to: "/focuspeer" },
    { icon: <Settings size={20}/>, text: "Settings", to: "/settings" }
  ],
  'focus-peer': [
    { icon: <LayoutDashboard size={20}/>, text: "Dashboard", to: "/" },
    { icon: <BookOpen size={20}/>, text: "Resources", to: "/resources" },
    { icon: <Newspaper size={20}/>, text: "Forum", to: "/forum" },
    { icon: <Users size={20}/>, text: "My Students", to: "/focuspeer" },
    { icon: <FileText size={20}/>, text: "Reports", to: "/reports" },
    { icon: <Settings size={20}/>, text: "Settings", to: "/settings" }
  ],
  'wellness-counsellor': [
    { icon: <LayoutDashboard size={20}/>, text: "Dashboard", to: "/" },
    { icon: <Users size={20}/>, text: "Students", to: "/students" },
    { icon: <FileText size={20}/>, text: "Alerts", to: "/alerts" },
    { icon: <BookOpen size={20}/>, text: "Resources", to: "/resources" },
    { icon: <Settings size={20}/>, text: "Settings", to: "/settings" },
    { icon: <Users size={20}/>, text: "Focus Peers", to: "/focuspeer-monitor"},
    
  ],
  oap: [
    { icon: <LayoutDashboard size={20}/>, text: "Dashboard", to: "/" },
    { icon: <Users size={20}/>, text: "Students", to: "/students" },
    { icon: <Folder size={20}/>, text: "Files", to: "/files" },
    { icon: <FileText size={20}/>, text: "Reports", to: "/reports" },
    { icon: <Settings size={20}/>, text: "Settings", to: "/settings" }
  ],
  //hhhhh
  professor: [
    { icon: <LayoutDashboard size={20}/>, text: "Dashboard", to: "/" },
    { icon: <BookOpen size={20}/>, text: "Courses", to: "/courses" },
    { icon: <Users size={20}/>, text: "Students", to: "/students" },
    { icon: <Folder size={20}/>, text: "Files", to: "/files" },
    { icon: <Settings size={20}/>, text: "Settings", to: "/settings" }
  ]
};

function AppContent() {
  const location = useLocation();
  const { user } = useUser();  // Get the current user's role
  
  // Get the menu items for the current user's role
  const menuItems = menuConfig[user.role] || [];
  let dashboardToShow;
  if(user.role === 'student'){
    dashboardToShow = <Dashboard/>;
  }
  else if(user.role === 'focus-peer'){
    dashboardToShow = <Dashboard/>;
  }
  else if(user.role === 'wellness-counsellor'){
    dashboardToShow = <WellnessDashboard/>;
  }
  else if(user.role === 'oap'){
    dashboardToShow = <OAPDashboard/>;
  }
  else if (user.role === 'professor'){
    dashboardToShow = <ProfessorDashboard/>;
  }
  
  return (
    <div className="flex">
      <NavBar>
        {/* Loop through menu items and show only the ones for this role */}
        {menuItems.map((item, index) => (
          <SideBarItem 
            key={index}
            icon={item.icon} 
            text={item.text} 
            to={item.to}
            active={location.pathname === item.to}
          />
        ))}
      </NavBar>
      
      <main className="flex-1 flex justify-center" >
        <div style={{ width: '100%' }}>
          <Routes>
            <Route path="/" element={dashboardToShow} /> 
            <Route path="/detailed-progress" element={<DetailedProgress />} />
            <Route path="/ai-task-breakdown" element={<AITaskBreakdownPage />} />
            <Route path="/eisenhower-matrix" element={<EisenhowerMatrixPage />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/forum" element={<Community />} />
            <Route 
              path="/focuspeer" 
              element={user.role === 'student' ? <FocusPeerPage /> : <FocusPeer />} 
            />
            <Route path="/settings" element={<div>Settings Page</div>} />
            <Route path="/feedback-form" element={<GiveFeedbackForm />} />
            <Route path="/reports" element={<div>Reports Page</div>} />
            <Route path="/files" element={<div>Files Page</div>} />
            <Route path="/students" element={<Student />} />
            <Route path="/courses" element={<div>Courses Page</div>} />
            <Route path="/focuspeer-monitor" element={<FocuspeerMonitor />}/>
            <Route path="/accomodations" element={<Student />}/>
            <Route path="/alerts" element={<Alert/>} />
            
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;