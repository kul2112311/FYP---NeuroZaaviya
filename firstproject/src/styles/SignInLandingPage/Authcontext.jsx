import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./usercontext";

const DEMO_ACCOUNTS = [
  { email: "ub07100@st.habib.edu.pk",     password: "Student@123",    role: "student",             name: "Ushna Batool"    },
  { email: "sarah.ahmed@st.habib.edu.pk", password: "FocusPeer@123", role: "focus-peer",          name: "Sarah Ahmed"     },
  { email: "fatima.khan@habib.edu.pk",    password: "OAP@123",        role: "oap",                 name: "Dr. Fatima Khan" },
  { email: "sara.ali@habib.edu.pk",       password: "Ehsas@123",      role: "ehsas-counsellor",    name: "Sara Ali"        },
  { email: "dr.zainab@habib.edu.pk",      password: "Wellness@123",   role: "wellness-counsellor", name: "Dr. Zainab"      },
  { email: "dr.ahmed@habib.edu.pk",       password: "Faculty@123",    role: "professor",           name: "Dr. Ahmed"       },
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
    const normalised = email.trim().toLowerCase();

    // 1. Hardcoded demo accounts
    const demo = DEMO_ACCOUNTS.find(
      a => a.email.toLowerCase() === normalised && a.password === password
    );
    if (demo) {
      const userObj = { role: demo.role, name: demo.name, email: demo.email };
      setUser(userObj);
      localStorage.setItem("nz_auth_user", JSON.stringify(userObj));
      setIsAuthenticated(true);
      return { success: true };
    }

    // 2. OAP-approved registered users
    const registered = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const match = registered.find(
      u => u.email.toLowerCase() === normalised && u.password === password
    );
    if (match) {
      const userObj = { role: match.role, name: match.name, email: match.email };
      setUser(userObj);
      localStorage.setItem("nz_auth_user", JSON.stringify(userObj));
      setIsAuthenticated(true);
      return { success: true };
    }

    // 3. Exists but pending / rejected?
    const allRequests = JSON.parse(localStorage.getItem("accessRequests") || "[]");
    const found = allRequests.find(r => r.email.toLowerCase() === normalised);
    if (found) {
      if (found.status === "pending")
        return { success: false, error: "Your account request is still pending OAP approval." };
      if (found.status === "rejected")
        return { success: false, error: "Your account request was not approved. Contact oap@habib.edu.pk." };
    }

    return { success: false, error: "Invalid email or password. Use a demo account from the list." };
  };

  const signOut = () => {
    localStorage.removeItem("nz_auth_user");
    setIsAuthenticated(false);
    setUser({ role: "student", name: "Ushna Batool", id: "a1111111-1111-1111-1111-111111111111" });
  };

  const registerFocusPeer = async ({ name, email, cgpa, reason, password }) => {
    try {
      const existing = JSON.parse(localStorage.getItem("accessRequests") || "[]");
      const duplicate = existing.find(
        r => r.email.toLowerCase() === email.trim().toLowerCase() && r.status === "pending"
      );
      if (duplicate) return { success: false, error: "A pending application already exists for this email." };

      const newApp = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        cgpa: parseFloat(cgpa),
        reason: reason.trim(),
        password,
        role: "focuspeer",
        appliedAt: new Date().toISOString(),
        status: "pending",
        source: "focuspeer_register",
      };
      localStorage.setItem("accessRequests", JSON.stringify([...existing, newApp]));
      return { success: true };
    } catch {
      return { success: false, error: "Registration failed. Please try again." };
    }
  };

  const registerUser = async ({ name, email, role, password }) => {
    try {
      const existing = JSON.parse(localStorage.getItem("accessRequests") || "[]");
      const duplicate = existing.find(
        r => r.email.toLowerCase() === email.trim().toLowerCase() && r.status === "pending"
      );
      if (duplicate) return { success: false, error: "A pending request already exists for this email." };

      const newRequest = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        password,
        appliedAt: new Date().toISOString(),
        status: "pending",
        source: "signup",
      };
      localStorage.setItem("accessRequests", JSON.stringify([...existing, newRequest]));
      return { success: true };
    } catch {
      return { success: false, error: "Registration failed. Please try again." };
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut, registerFocusPeer, registerUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export default AuthProvider;