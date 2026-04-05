// App.jsx - Updated with Role-Based Navigation
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useState } from 'react'                                         
import Community from './pages/shared/CommunityPage.jsx'
import FocusPeerPage from './pages/StudentInterface/FocusPeerPage.jsx'
import NavBar, { SideBarItem } from './components/navbar/NavBar.jsx'
import { LayoutDashboard, BookOpen, Newspaper, Users, Settings, FileText, Folder, CalendarSync, CalendarHeart, CalendarDays, UserPlus, MessageCircle } from "lucide-react";
import FocusPeer from './pages/FocusPeerInterface/FocusPeer.jsx';
import GiveFeedbackForm from './pages/FocusPeerInterface/GiveFeedBackPage.jsx';
import { UserProvider, useUser } from './styles/SignInLandingPage/usercontext.jsx';
import { AuthProvider, useAuth } from './styles/SignInLandingPage/Authcontext.jsx';
import { SignInPage } from './styles/SignInLandingPage/Signinpage.jsx';
import { FocusPeerRegisterPage } from './styles/SignInLandingPage/Focuspeerregisterpage.jsx'; 
import FocuspeerMonitor from './pages/Wellness/FocuspeerMonitor.jsx';
import Dashboard from './pages/StudentInterface/Dashboard.jsx';
import DetailedProgress from './pages/StudentInterface/DetailedProgress.jsx';
import Resources from './pages/StudentInterface/Resources.jsx';
import { AITaskBreakdownPage } from './pages/StudentInterface/Aitaskbreakdownpage.jsx';
import { EisenhowerMatrixPage } from './pages/StudentInterface/Eisenhowermatrixpage.jsx';
import WellnessDashboard from './pages/Wellness/WellnessDashboard.jsx';
import OAPDashboard from './pages/OAP/OAPDashboard.jsx';
import EhsasDashboard from './pages/Ehsas/EhsasDashboard.jsx';
import Student from './pages/shared/Students.jsx';
import Alert from './pages/shared/Alerts.jsx';
import Scheduling from './pages/shared/Scheduling.jsx';
import Events, { AdminInterfaceEvent , StudentInterfaceEvents} from './pages/shared/Events.jsx';
import SuperCalendarPage from './pages/StudentInterface/SuperCalendarPage.jsx';
import Accommodations from './pages/OAP/Accommodations.jsx';
import Files from './pages/OAP/Files.jsx';
import FocusPeerManagement from './pages/OAP/Focuspeermanagement.jsx';       
import EhsasFocusPeerManagement from './pages/Ehsas/Focuspeermanagement.jsx';  
import DeepWorkSession from "./pages/StudentInterface/Deepworksession.jsx";
import ChatPage from "./pages/shared/Chats/ChatPage.jsx";


const menuConfig = {
  student: [
    { icon: <LayoutDashboard size={20}/>, text: "Dashboard", to: "/" },
    { icon: <CalendarDays size={20}/>, text: "Calendar", to: "/calendar" },
    { icon: <BookOpen size={20}/>, text: "Resources", to: "/resources" },
    { icon: <Newspaper size={20}/>, text: "Forum", to: "/forum" },
    { icon: <Users size={20}/>, text: "FocusPeer", to: "/focuspeer" },
    { icon: <CalendarHeart size={20}/>, text: "Events", to: "/events" },
    {icon: <MessageCircle size={20}/>, text: "Chats", to: "/chats"}
  ],
  'focus-peer': [
    { icon: <LayoutDashboard size={20}/>, text: "My Dashboard", to: "/" },
    { icon: <BookOpen size={20}/>, text: "Resources", to: "/resources" },
    { icon: <Newspaper size={20}/>, text: "Forum", to: "/forum" },
    { icon: <CalendarHeart size={20}/>, text: "Events", to: "/events" },
    {icon: <MessageCircle size={20}/>, text: "Chats", to: "/chats"}

  ],
  'wellness-counsellor': [
    { icon: <LayoutDashboard size={20}/>, text: "Dashboard", to: "/" },
    { icon: <Users size={20}/>, text: "Students", to: "/students" },
    { icon: <FileText size={20}/>, text: "Alerts", to: "/alerts" },
    { icon: <BookOpen size={20}/>, text: "Resources", to: "/resources" },
    { icon: <CalendarHeart size={20}/>, text: "Events", to: "/events" },
    { icon: <Users size={20}/>, text: "Focus Peers", to: "/focuspeer-monitor" },
    { icon: <CalendarSync size={20}/>, text: "Scheduling", to: "/scheduling" },
    { icon: <Newspaper size={20}/>, text: "Forum", to: "/forum" },
    {icon: <MessageCircle size={20}/>, text: "Chats", to: "/chats"}
  ],
  'ehsas-counsellor': [
    // { icon: <LayoutDashboard size={20}/>, text: "Dashboard", to: "/" },
    // { icon: <Users size={20}/>, text: "Students", to: "/students" },
    // { icon: <FileText size={20}/>, text: "Alerts", to: "/alerts" },
    { icon: <BookOpen size={20}/>, text: "Resources", to: "/resources" },
    { icon: <CalendarHeart size={20}/>, text: "Events", to: "/events" },
    { icon: <Users size={20}/>, text: "Focus Peers", to: "/focuspeer-monitor" },
    { icon: <UserPlus size={20}/>, text: "Focus Peer Management", to: "/ehsas-fp-management" }, 
    { icon: <CalendarSync size={20}/>, text: "Scheduling", to: "/scheduling" },
    { icon: <Newspaper size={20}/>, text: "Forum", to: "/forum" },
    {icon: <MessageCircle size={20}/>, text: "Chats", to: "/chats"}
  ],
  'oap': [
    { icon: <LayoutDashboard size={20}/>, text: "Dashboard", to: "/" },
    { icon: <Users size={20}/>, text: "Students", to: "/students" },
    { icon: <Folder size={20}/>, text: "Files", to: "/files" },
    { icon: <FileText size={20}/>, text: "Accommodations", to: "/accomodations" },
    { icon: <UserPlus size={20}/>, text: "Focus Peers", to: "/focuspeer-management" },
    { icon: <CalendarHeart size={20}/>, text: "Events", to: "/events" },
    { icon: <Newspaper size={20}/>, text: "Forum", to: "/forum" },
    { icon: <CalendarSync size={20}/>, text: "Scheduling", to: "/scheduling" },
    { icon: <FileText size={20}/>, text: "Alerts", to: "/alerts" },
    {icon: <MessageCircle size={20}/>, text: "Chats", to: "/chats"}
  ],
  // professor: [
  //   { icon: <LayoutDashboard size={20}/>, text: "Dashboard", to: "/" },
  //   { icon: <BookOpen size={20}/>, text: "Courses", to: "/courses" },
  //   { icon: <Users size={20}/>, text: "Students", to: "/students" },
  //   { icon: <Folder size={20}/>, text: "Files", to: "/files" },
  //   { icon: <CalendarHeart size={20}/>, text: "Events", to: "/events" }
  // ]
};

function AppContent() {
  const location = useLocation();
  const { user } = useUser();
  const { isAuthenticated, signOut } = useAuth();

  // ── NEW: pre-auth page state (only active when not authenticated) ──────────
  const [preAuthPage, setPreAuthPage] = useState('signin'); // 'signin' | 'focuspeer-register'
  // ──────────────────────────────────────────────────────────────────────────

  const menuItems = menuConfig[user.role] || [];

  let dashboardToShow;
  if (user.role === 'student') {
    dashboardToShow = <Dashboard />;
  } else if (user.role === 'focus-peer') {
    dashboardToShow = <FocusPeer />;
  } else if (user.role === 'wellness-counsellor') {
    dashboardToShow = <WellnessDashboard />;
  } else if (user.role === 'ehsas-counsellor') {
    dashboardToShow = <EhsasDashboard />;
  } else if (user.role === 'oap') {
    dashboardToShow = <OAPDashboard />;
  } else {
    dashboardToShow = <Dashboard />;
  }

  // ── NEW: unauthenticated screens ───────────────────────────────────────────
  if (!isAuthenticated) {
    if (preAuthPage === 'focuspeer-register') {
      return (
        <FocusPeerRegisterPage
          onBack={() => setPreAuthPage('signin')}
        />
      );
    }
    return (
      <SignInPage
        onNavigateToRegister={() => setPreAuthPage('focuspeer-register')}
      />
    );
  }
  // ──────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex">
      <NavBar signOut={signOut} userName={user.name}>
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

      <main className="flex-1 flex justify-center">
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
            <Route path="/feedback-form" element={<GiveFeedbackForm />} />
            <Route path="/reports" element={<Accommodations />} />
            <Route path="/files" element={<Files />} />
            <Route path="/students" element={<Student />} />
            <Route path="/courses" element={<div>Courses Page</div>} />
            <Route path="/focuspeer-monitor" element={<FocuspeerMonitor />} />
            <Route path="/accomodations" element={<Accommodations />} />
            <Route path="/focuspeer-management" element={<FocusPeerManagement />} />
            <Route path="/alerts" element={<Alert />} />
            <Route path="/scheduling" element={<Scheduling />} />
            <Route 
              path="/events" 
              element={
                user.role === 'oap' || user.role === 'wellness-counsellor' || user.role === 'ehsas-counsellor'
                  ? <AdminInterfaceEvent />
                  : <Events />
              } 
            />
            <Route path="/calendar" element={<SuperCalendarPage />} />
            <Route path="/deep-work" element={<DeepWorkSession />} />
            <Route path="/ehsas-fp-management" element={<EhsasFocusPeerManagement />} />
            <Route path="/chats" element={<ChatPage />} />
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
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;