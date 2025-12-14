// import { createContext, useContext, useState } from "react"
// import { Link } from 'react-router-dom'
// import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react"
// const SidebarContext = createContext();

// function NavBar({children}) {
//   const [expanded, setExpanded] = useState(true);
//   return (
//     <>
//        <aside className="h-screen sticky top-0">
//                 <nav className="h-full flex flex-col bg-white border-r border-gray-100">
//                     <div className="p-4 pb-2 flex justify-between items-center gap-4">
//                         <img 
//                             src="src/assets/Container.png" 
//                             className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`}
//                             alt="Logo" 
//                             />
//                         <button onClick={()=>setExpanded((curr)=>!curr)}className="p-1 rounded-md hover:bg-gray-200 transition-colors">
//                            {expanded ? <ChevronFirst size={20}/> : <ChevronLast size={20}/>}
                           
//                         </button>
                     
//                     </div>
//                     <SidebarContext.Provider value={{ expanded }}>
//                         <ul className="flex-1 px-3">
//                         {children}
//                         </ul>
//                     </SidebarContext.Provider>
                    
//                     <div className="border-t flex p-3">


//                     </div>

//                 </nav>
//         </aside>
//     </>
//   );
// }

// export function SideBarItem({icon, text, active, to}){
//     const {expanded} = useContext(SidebarContext);
//     return(
//         <Link to={to}>
//             <li className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${active ? "bg-[#B39DDB] text-white" : "hover:bg-[#B39DDB] hover:text-white text-gray-400"}`}>
//                 {icon}
//                 <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>{text}</span>
                
//                 {!expanded && (
//                     <div className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-[#B39DDB] text-white-400 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}>
//                         {text}
//                     </div>
//                 )}
           
//             </li>
//         </Link>
//     )
// }
// export default NavBar;

import { createContext, useContext } from "react"
import { Link } from 'react-router-dom'

const SidebarContext = createContext();

function NavBar({children}) {
  const expanded = true; // Always expanded
  
  return (
    <>
       <aside className="h-screen sticky top-0 left-0">
                <nav className="h-full flex flex-col bg-white border-r border-gray-100">
                    <div className="p-4 pb-2 flex justify-between items-center">
                        <img 
                            src="src/assets/Container.png" 
                            className="w-32"
                            alt="Logo" 
                        />
                    </div>
                    
                    <SidebarContext.Provider value={{ expanded }}>
                        <ul className="flex-1 px-3">
                            {children}
                        </ul>
                    </SidebarContext.Provider>
                    
                    <div className="border-t flex p-3">
                        {/* Footer content if needed */}
                    </div>
                </nav>
        </aside>
    </>
  );
}

export function SideBarItem({icon, text, active, to}){
    const {expanded} = useContext(SidebarContext);
    
    return(
        <Link to={to}>
            <li className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors ${active ? "bg-[#B39DDB] text-white" : "hover:bg-[#B39DDB] hover:text-white text-gray-400"}`}>
                {icon}
                <span className="w-52 ml-3">{text}</span>
            </li>
        </Link>
    )
}

export default NavBar;