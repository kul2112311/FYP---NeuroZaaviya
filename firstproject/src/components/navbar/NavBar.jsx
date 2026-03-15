import { createContext, useContext } from "react";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import logo from '../../assets/Container.png';

const SidebarContext = createContext();

function NavBar({ children, signOut, userName }) {
  const expanded = true;

  return (
    <aside className="h-screen sticky top-0 left-0">
      <nav className="h-full flex flex-col bg-white border-r border-gray-100">
        {/* Logo */}
        <div className="p-4 pb-2 flex justify-between items-center">
          <img src={logo} className="w-32" alt="Logo" />
        </div>

        {/* Nav items */}
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3 overflow-y-auto">
            {children}
          </ul>
        </SidebarContext.Provider>

        {/* Footer — user info + sign out */}
        <div className="p-3" style={{ borderTop: "1px solid rgba(179,157,219,0.2)" }}>
          {userName && (
            <div className="px-3 py-2 mb-1 rounded-xl" style={{ background: "rgba(179,157,219,0.08)" }}>
              <p className="text-xs font-semibold truncate" style={{ color: "#5a4a61" }}>{userName}</p>
              <p className="text-[10px]" style={{ color: "#9575a3" }}>Signed in</p>
            </div>
          )}
          {signOut && (
            <button onClick={signOut}
              className="w-full flex items-center gap-3 py-2 px-3 rounded-xl transition-colors hover:opacity-80"
              style={{ color: "#9575a3", background: "transparent" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(229,115,115,0.08)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <LogOut size={18} style={{ color: "#e57373" }} />
              <span className="text-sm font-medium" style={{ color: "#e57373" }}>Sign Out</span>
            </button>
          )}
        </div>
      </nav>
    </aside>
  );
}

export function SideBarItem({ icon, text, active, to }) {
  const { expanded } = useContext(SidebarContext);
  return (
    <Link to={to}>
      <li className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors ${
        active ? "bg-[#B39DDB] text-white" : "hover:bg-[#B39DDB] hover:text-white text-gray-400"
      }`}>
        {icon}
        <span className="w-52 ml-3">{text}</span>
      </li>
    </Link>
  );
}

export default NavBar;