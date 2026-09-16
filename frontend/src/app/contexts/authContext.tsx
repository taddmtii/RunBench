'use client'

import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { User } from "../../../generated/prisma/client"

interface AuthContextType {
    user: User | null;
    logout: () => Promise<void>;
    setUser: Dispatch<SetStateAction<User | null>>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const logout = async () => {
        await fetch("/api/auth/logout", {
        method: "POST"
        })
        setUser(null)
        setIsLoading(false)
     }

    // validate user on mount
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch('/api/auth/me')
                if (!res.ok) {
                    setUser(null)
                    setIsLoading(false)
                    return 
                }
                const data = await res.json();
                setUser(data)
            } catch (e) {
                console.error("Session validation error: ", e)
            } finally {
                setIsLoading(false)
            }
        }
        getUser();
    }, [])

    return <AuthContext.Provider value={{user, logout, setUser, isLoading}}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}