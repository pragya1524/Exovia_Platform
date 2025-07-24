
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  isActive: boolean;
  uploadsCount: number;
  chartsCount: number;
  joinDate: Date;
}

interface UserContextType {
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string, role?: 'admin' | 'user') => boolean;
  register: (userData: { name: string; email: string; password: string; role: 'admin' | 'user' }) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  toggleUserStatus: (userId: string) => void;
  deleteUser: (userId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Initialize with sample users including admin
    const initialUsers: User[] = [
      {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@Exovia.com',
        role: 'admin',
        isActive: true,
        uploadsCount: 15,
        chartsCount: 8,
        joinDate: new Date('2024-01-01')
      },
      {
        id: 'user-1',
        name: 'John Smith',
        email: 'john@example.com',
        role: 'user',
        isActive: true,
        uploadsCount: 5,
        chartsCount: 3,
        joinDate: new Date('2024-02-15')
      },
      {
        id: 'user-2',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        role: 'user',
        isActive: false,
        uploadsCount: 2,
        chartsCount: 1,
        joinDate: new Date('2024-03-01')
      }
    ];

    setUsers(initialUsers);
    // Auto-login as admin on app start
    setCurrentUser(initialUsers[0]);
  }, []);

  const login = (email: string, password: string, role: 'admin' | 'user' = 'user'): boolean => {
    if (email && password) {
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        setCurrentUser(existingUser);
        return true;
      }
      
      // Create new user if not found
      const newUser: User = {
        id: role === 'admin' ? 'admin-new' : `user-${Date.now()}`,
        name: role === 'admin' ? 'Admin User' : 'Regular User',
        email,
        role,
        isActive: true,
        uploadsCount: 0,
        chartsCount: 0,
        joinDate: new Date()
      };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      return true;
    }
    return false;
  };

  const register = (userData: { name: string; email: string; password: string; role: 'admin' | 'user' }): boolean => {
    // Check if user already exists
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      return false;
    }

    const newUser: User = {
      id: `${userData.role}-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      isActive: true,
      uploadsCount: 0,
      chartsCount: 0,
      joinDate: new Date()
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  return (
    <UserContext.Provider value={{
      currentUser,
      users,
      login,
      register,
      logout,
      isAuthenticated: !!currentUser,
      isAdmin: currentUser?.role === 'admin',
      toggleUserStatus,
      deleteUser
    }}>
      {children}
    </UserContext.Provider>
  );
};
