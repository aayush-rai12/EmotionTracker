import React, { createContext, useState, useEffect, useContext } from 'react';
import App from '../App';
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    }
  }, []);

  return (
    <UserContext.Provider value={{ isOnline, working:"ha kam kr rha hai" }}>
      {children} {/* it becomes <App/> */}
      {/* <App/> */}
    </UserContext.Provider>
  );
}
export const useUserContext = () => useContext(UserContext);