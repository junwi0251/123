import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // localStorage에서 토큰 확인
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuthenticated(true); // 토큰이 있으면 인증 상태로 설정
        }
    }, []);

    const login = (token) => {
        localStorage.setItem("token", token); // 토큰 저장
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("token"); // 토큰 삭제
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
