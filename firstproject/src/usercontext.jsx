// UserContext.jsx
// This file helps us share user information (like their role) across our entire app

import { createContext, useContext, useState } from 'react';

// Step 1: Create a "box" to store our user information
const UserContext = createContext();

// Step 2: Create a component that wraps our app and provides user info to everyone
export function UserProvider({ children }) {
  // This is like a variable that holds our user's info
  // We can change it using setUser
  const [user, setUser] = useState({
    role: 'wellness-counsellor',  // What type of user? (student, focus-peer, wellness-counsellor, oap, professor)
    name: 'John Doe'  // Their name
  });

  // This wraps our app and makes user info available everywhere
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Step 3: Create an easy way to get user info from any component
// Instead of writing useContext(UserContext), we just write useUser()
export function useUser() {
  return useContext(UserContext);
}