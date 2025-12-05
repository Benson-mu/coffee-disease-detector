import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';

// Import Types and Constants
import type { Page, AlertMessageProps } from './types'; 
// Import Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
// Import Pages
import LandingPage from './components/pages/LandingPage';
import AuthPage from './components/pages/AuthPage';
import DashboardPage from './components/pages/DashboardPage';

// --- CONFIGURATION: 5 Minutes Inactivity Timeout ---
const LOGIN_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
// ----------------------------------------

// --- MAIN ROUTER LOGIC ---
const MainAppLogic: React.FC = () => {
    const navigate = useNavigate(); 
    const location = useLocation();

    const initialToken = localStorage.getItem('userToken');
    const initialId = localStorage.getItem('userId');
    const initialEmail = localStorage.getItem('userEmail');

    const [userToken, setUserToken] = useState<string | null>(initialToken);
    const [userId, setUserId] = useState<string | null>(initialId);
    const [userEmail, setUserEmail] = useState<string | null>(initialEmail);
    const [globalMessage, setGlobalMessage] = useState<AlertMessageProps>({ message: null, type: null });

    const diseaseCategories = [
        "Algal Leaf", "Anthracnose", "Bird Eye Spot",
        "Brown Blight", "Gray Light", "Red Leaf Spot",
        "White Spot", "Healthy", "Other Non-Tea Leaf"
    ];

    // Handler to perform full logout cleanup
    const performLogoutCleanup = useCallback((message?: string) => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('login_time');

        setUserToken(null);
        setUserId(null);
        setUserEmail(null);
        
        navigate('/login'); 
        setGlobalMessage({ message: message || "You have been successfully logged out.", type: 'success' });
    }, [navigate]);

    // --- 1. SESSION VALIDITY CHECK (Initial load) ---
    useEffect(() => {
        const lastLoginTime = localStorage.getItem('login_time');
        
        if (userToken && lastLoginTime) {
            const timeElapsed = Date.now() - parseInt(lastLoginTime, 10);

            if (timeElapsed > LOGIN_TIMEOUT_MS) {
                performLogoutCleanup("Your session has expired due to inactivity. Please log in again.");
            }
        } else if (userToken && !lastLoginTime) {
            performLogoutCleanup("Session data corrupted. Please log in again.");
        }
    }, [userToken, performLogoutCleanup]);

    // --- 2. INACTIVITY TIMER CHECK (Continuous monitoring) ---
    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;

        const resetTimer = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (userToken) {
                    performLogoutCleanup("You were logged out after 5 minutes of inactivity.");
                }
            }, LOGIN_TIMEOUT_MS);
        };
        
        const events = ['mousemove', 'keypress', 'touchstart', 'scroll'];
        events.forEach(event => window.addEventListener(event, resetTimer));

        if (userToken) resetTimer();

        return () => {
            clearTimeout(timeout);
            events.forEach(event => window.removeEventListener(event, resetTimer));
        };
    }, [userToken, performLogoutCleanup]);

    // --- Handlers ---
    const handleLoginSuccess = useCallback((userIdArg: string, emailArg: string, tokenArg?: string) => {
        const currentTime = Date.now().toString();

        if (tokenArg) {
            localStorage.setItem('userToken', tokenArg);
            setUserToken(tokenArg);
        }
        localStorage.setItem('userId', userIdArg);
        localStorage.setItem('userEmail', emailArg);
        localStorage.setItem('login_time', currentTime);

        setUserId(userIdArg);
        setUserEmail(emailArg);
        navigate('/dashboard'); 
        setGlobalMessage({ message: `Login successful. Welcome back, user ${userIdArg}!`, type: 'success' });
    }, [navigate]);

    const handleLogout = useCallback(() => performLogoutCleanup(), [performLogoutCleanup]);

    const handlePageChange = useCallback((page: Page) => {
        if (page === 'landing') navigate('/');
        else if (page === 'auth') navigate('/login');
        else if (page === 'dashboard' && userId) navigate('/dashboard');
        else navigate('/login');
    }, [navigate, userId]);

    const isAuthenticated = useMemo(() => !!userToken && !!userId, [userToken, userId]);
    const shouldShowFooter = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';
    const isDashboardRoute = location.pathname === '/dashboard';
    const mainClasses = `flex-grow ${isDashboardRoute ? 'pt-24' : ''}`;

    return (
        <div className="min-h-screen flex flex-col font-sans bg-gray-50">
            <Navbar setCurrentPage={handlePageChange} userToken={userToken} onLogout={handleLogout} /> 
            <main className={mainClasses}> 
                <Routes>
                    <Route path="/" element={<LandingPage setCurrentPage={handlePageChange} diseaseCategories={diseaseCategories} message={globalMessage} setMessage={setGlobalMessage} />} />
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/dashboard" element={isAuthenticated ? <DashboardPage userToken={userToken} userId={userId} userEmail={userEmail || ''} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
            {shouldShowFooter && <Footer setCurrentPage={handlePageChange} />}
        </div>
    );
};

// --- WRAPPER COMPONENT ---
const App: React.FC = () => (
    <BrowserRouter>
        <MainAppLogic />
    </BrowserRouter>
);

export default App;
