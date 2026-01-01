"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"

interface User {
    id: string;
    username: string;
    fullName: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (userData: any, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("auth_user");
        const token = Cookies.get("auth_token");

        if (storedUser && token) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                // If parsing fails, clear everything
                localStorage.removeItem("auth_user");
                Cookies.remove("auth_token");
            }
        }
        setIsLoading(false);
    }, []);

    const login = (userData: any, token: string) => {
        // Use user object without token for storage
        const userObj = {
            id: userData.id,
            username: userData.username,
            fullName: userData.fullName,
            role: userData.role
        };

        setUser(userObj);
        localStorage.setItem("auth_user", JSON.stringify(userObj));

        // Use secure flag only in production (HTTPS), sameSite: 'lax' for better compatibility
        const isProduction = window.location.protocol === 'https:';
        Cookies.set("auth_token", token, {
            expires: 7,
            secure: isProduction,
            sameSite: 'lax'
        });

        router.push("/admin/dashboard");
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("auth_user");
        Cookies.remove("auth_token");
        router.push("/auth/login");
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
