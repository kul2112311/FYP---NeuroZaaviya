import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./usercontext";

const DEMO_ACCOUNTS = [
  { email: "ub07100@st.habib.edu.pk",     password: "Student@123",    role: "student",              name: "Ushna Batool"   },
  { email: "sarah.ahmed@st.habib.edu.pk", password: "FocusPeer@123", role: "focus-peer",           name: "Sarah Ahmed"    },
  { email: "fatima.khan@habib.edu.pk",    password: "OAP@123",        role: "oap",                  name: "Dr. Fatima Khan"},
  { email: "sara.ali@habib.edu.pk",       password: "Ehsas@123",      role: "ehsas-counsellor",     name: "Sara Ali"       },
  { email: "dr.zainab@habib.edu.pk",      password: "Wellness@123",   role: "wellness-counsellor",  name: "Dr. Zainab"     },
  { email: "dr.ahmed@habib.edu.pk",       password: "Faculty@123",    role: "professor",            name: "Dr. Ahmed"      },
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { setUser } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("nz_auth_user");
  });

  useEffect(() => {
    const saved = localStorage.getItem("nz_auth_user");
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
  }, []);

  const signIn = async (email, password) => {
    const account = DEMO_ACCOUNTS.find(
      a => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );
    if (!account) return { success: false, error: "Invalid email or password. Use a demo account from the list." };

    const userObj = { role: account.role, name: account.name, email: account.email };
    setUser(userObj);
    localStorage.setItem("nz_auth_user", JSON.stringify(userObj));
    setIsAuthenticated(true);
    return { success: true };
  };

  const signOut = () => {
    localStorage.removeItem("nz_auth_user");
    setIsAuthenticated(false);
    setUser({ role: "student", name: "Guest" });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}