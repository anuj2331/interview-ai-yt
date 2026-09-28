import { useState, useEffect } from "react";
import { AuthContext } from "./auth.context.js";
import { getMe } from "./services/auth.api";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe();
                if (data && data.user) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch {
                console.log("No active user session");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        getAndSetUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
};