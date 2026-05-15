import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("sw_token"));
    const [user, setUser]   = useState(() => {
        const stored = localStorage.getItem("sw_user");
        return stored ? JSON.parse(stored) : null;
    });

    function login(newToken, userInfo) {
        localStorage.setItem("sw_token", newToken);
        localStorage.setItem("sw_user", JSON.stringify(userInfo));
        setToken(newToken);
        setUser(userInfo);
    }

    function logout() {
        localStorage.removeItem("sw_token");
        localStorage.removeItem("sw_user");
        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}