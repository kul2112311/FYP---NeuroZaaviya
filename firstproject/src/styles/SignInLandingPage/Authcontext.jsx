import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./usercontext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { setUser } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("nz_auth_user");
    const token = localStorage.getItem("nz_token");
    
    if (savedUser && token) {
      try { 
        setUser(JSON.parse(savedUser)); 
        setIsAuthenticated(true);
      } catch {}
    }
  }, []);

  const signIn = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password })
      });
      
      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("nz_token", data.token);
        localStorage.setItem("nz_auth_user", JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: data.error || "Invalid credentials." };
      }
    } catch (error) {
      console.error("Login Error:", error);
      return { success: false, error: "Network error. Is the backend server running?" };
    }
  };

  const signOut = () => {
    localStorage.removeItem("nz_token");
    localStorage.removeItem("nz_auth_user");
    setIsAuthenticated(false);
    setUser(null);
  };

  // ADDED: cgpa and reason to the payload so they actually reach the database!
  const registerUser = async ({ name, email, role, password, cgpa, reason }) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: name.trim(), 
          email: email.trim().toLowerCase(), 
          role, 
          password,
          cgpa,    // Now this gets sent
          reason   // Now this gets sent
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true };
      } else {
        return { success: false, error: data.error || "Registration failed." };
      }
    } catch (error) {
      console.error("Registration Error:", error);
      return { success: false, error: "Network error. Please try again later." };
    }
  };

  const registerFocusPeer = async ({ name, email, cgpa, reason, password }) => {
    // We now pass cgpa and reason down the chain!
    return await registerUser({ name, email, role: 'focus-peer', password, cgpa, reason });
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