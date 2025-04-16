import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import {
  User,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

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
  const [loading, setLoading] = useState(true);

  // Login with email and password
  async function loginWithEmail(email: string, password: string): Promise<User> {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  }

  // Login with Google
  async function loginWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  }

  // Demo login function for testing
  async function loginAsDemo(): Promise<void> {
    // Create a mock user object that mimics Firebase User
    const mockUser = {
      uid: "demo-user-123",
      email: "admin@example.com",
      displayName: "Admin User",
      emailVerified: true,
      photoURL: null,
      isAnonymous: false,
      metadata: {
        creationTime: new Date().toISOString(),
        lastSignInTime: new Date().toISOString()
      },
      providerData: [],
      // Add other required properties to match Firebase User type
      delete: () => Promise.resolve(),
      getIdToken: () => Promise.resolve("demo-token"),
      getIdTokenResult: () => Promise.resolve({ token: "demo-token" } as any),
      reload: () => Promise.resolve(),
      toJSON: () => ({}),
      tenantId: null,
      phoneNumber: null,
      providerId: "demo"
    } as unknown as User;
    
    // Set the mock user
    setCurrentUser(mockUser);
  }

  // Logout
  function logout(): Promise<void> {
    // If it's a demo user, just clear it locally
    if (currentUser?.uid === "demo-user-123") {
      setCurrentUser(null);
      return Promise.resolve();
    }
    // Otherwise, use Firebase logout
    return signOut(auth);
  }

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
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
      {!loading && children}
    </AuthContext.Provider>
  );
}