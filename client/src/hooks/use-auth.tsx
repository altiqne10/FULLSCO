import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // In a real application, we would fetch the current user from an API endpoint
  // For now, we'll just use a mock user since we didn't implement authentication
  const mockUser: User = {
    id: 1,
    username: "admin",
    password: "", // We wouldn't expose this in a real app
  };

  return (
    <AuthContext.Provider
      value={{
        user: mockUser,
        isLoading: false,
        error: null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
