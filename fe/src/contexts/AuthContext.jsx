import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Khi tải trang: xác minh phiên qua server (cookie httpOnly)
    useEffect(() => {
        api.get('/api/me')
            .then(d => setUser(d.user))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const login = useCallback(async (email, mat_khau) => {
        const data = await api.post('/api/dang-nhap', { email, mat_khau });
        setUser(data.user);
        return data; // { user, redirectUrl }
    }, []);

    const register = useCallback(async (ho_ten, email, mat_khau) => {
        const data = await api.post('/api/dang-ky', { ho_ten, email, mat_khau });
        setUser(data.user);
        return data; // { user, redirectUrl }
    }, []);

    const logout = useCallback(async () => {
        try { await api.post('/api/dang-xuat', {}); } catch (e) { /* bỏ qua lỗi mạng */ }
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, isAdmin: user?.vai_tro === 'admin', login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
