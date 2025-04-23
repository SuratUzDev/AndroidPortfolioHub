import { createContext, useState, useContext, useEffect, ReactNode } from "react";

// Define simplified user type for PostgreSQL
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Define context type
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  loginAsDemo: () => Promise<void>;
  logout: () => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Props type for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // Set to false since we're not loading anything

  // Login with email and password (PostgreSQL implementation)
  async function loginWithEmail(email: string, password: string): Promise<User> {
    // In a real scenario, we would make an API call to verify the credentials
    // For now, we'll just return a demo user
    console.log("Login with email attempted:", email);
    const user: User = {
      uid: "email-user-123",
      email: email,
      displayName: email.split('@')[0],
      photoURL: null
    };
    setCurrentUser(user);
    return user;
  }

  // Login with Google (PostgreSQL implementation)
  async function loginWithGoogle(): Promise<User> {
    // In a real scenario, we would redirect to Google OAuth
    // For now, we'll just return a demo user
    console.log("Login with Google attempted");
    const user: User = {
      uid: "google-user-123",
      email: "google-user@example.com",
      displayName: "Google User",
      photoURL: null
    };
    setCurrentUser(user);
    return user;
  }

  // Demo login function for testing
  async function loginAsDemo(): Promise<void> {
    // Create a simple user object
    const demoUser: User = {
      uid: "demo-user-123",
      email: "admin@example.com",
      displayName: "Admin User",
      photoURL: null
    };
    
    // Set the demo user
    setCurrentUser(demoUser);
  }

  // Logout
  function logout(): Promise<void> {
    // Simply clear the current user
    setCurrentUser(null);
    return Promise.resolve();
  }

  // Initialize auth state
  useEffect(() => {
    // Auto-login as demo user for development
    loginAsDemo().then(() => {
      console.log("Auto-logged in as demo user");
    });
  }, []);

  // Context value
  const value = {
    currentUser,
    loading,
    loginWithEmail,
    loginWithGoogle,
    loginAsDemo,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}