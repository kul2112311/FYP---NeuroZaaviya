import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    id: 'a1111111-1111-1111-1111-111111111111', // Matches Ushna Batool in your database
    role: 'student',
    name: 'Ushna Batool',
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}