'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "../../../generated/prisma/client"

interface AuthContextType {
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    // validate user on mount
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch('/api/auth/me')
                const data = await res.json();
                if (!res.ok) {
                    console.error("Could not fetch user")
                    return 
                }
                setUser(data)
            } catch (e) {
                console.error("Session validation error: ", e)
            } finally {
                setLoading(false)
            }
        }
        getUser();
    }, [])

    return <AuthContext.Provider value={{user, loading}}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}