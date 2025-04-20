import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      const [firstName, lastName] = parsed.name?.split(" ") || ["", ""];
      setUser({ ...parsed, firstName, lastName });
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    const [firstName, lastName] = userData.name?.split(" ") || ["", ""];
    const formattedUser = {
      ...userData,
      firstName,
      lastName,
    };
    setUser(formattedUser);
    localStorage.setItem("user", JSON.stringify(formattedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};