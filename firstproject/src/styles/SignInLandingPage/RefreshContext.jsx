import React, { createContext, useContext, useState, useEffect } from 'react';

const RefreshContext = createContext();

export function RefreshProvider({ children }) {
  // This number acts as our heartbeat. Every time it changes, pages will know to fetch fresh data.
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Function to trigger a heartbeat pulse
    const triggerRefresh = () => setRefreshKey(prev => prev + 1);

    // 1. Pulse immediately when the user clicks back into this tab
    window.addEventListener("focus", triggerRefresh);

    // 2. Pulse every 5 seconds in the background (perfect for side-by-side windows)
    const interval = setInterval(triggerRefresh, 5000);

    return () => {
      window.removeEventListener("focus", triggerRefresh);
      clearInterval(interval);
    };
  }, []);

  return (
    <RefreshContext.Provider value={{ refreshKey }}>
      {children}
    </RefreshContext.Provider>
  );
}

export function useRefresh() {
  return useContext(RefreshContext);
}