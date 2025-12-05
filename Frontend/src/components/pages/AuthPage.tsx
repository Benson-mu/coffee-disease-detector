import React, { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '../../types';
import AlertMessage from '../ui/AlertMessage';
import InputField from '../ui/InputField';

type FastAPIValidationError = {
    loc?: (string | number)[];
    msg: string;
    type: string;
};

const formatError = (data: unknown, defaultMessage: string): string => {
    if (!data) return defaultMessage;
    if (typeof data === 'object' && data !== null) {
        const d = data as { detail?: unknown; error?: string; message?: string };
        if (Array.isArray(d.detail)) {
            return d.detail.map((item: FastAPIValidationError) => {
                const fieldName = item.loc?.slice(-1).join('') || 'field';
                return `${fieldName}: ${item.msg}`;
            }).join('; ');
        }
        if (typeof d.detail === 'string') return d.detail;
        if (d.error) return d.error;
        if (d.message) return d.message;
    }
    return defaultMessage;
};

const AuthPage: React.FC<{ onLoginSuccess: (id: string, email: string, token: string) => void }> = ({ onLoginSuccess }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [view, setView] = useState<'register' | 'login'>(location.pathname === '/register' ? 'register' : 'login');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        setView(location.pathname === '/register' ? 'register' : 'login');
        setMessage(null);
    }, [location.pathname]);

    const handleLogin = useCallback(async () => {
        setMessage(null);
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json().catch(() => null);
            if (response.ok && data) {
                onLoginSuccess(data.user_id?.toString() || '0', data.email || email, data.token);
            } else {
                setMessage({ text: formatError(data, 'Login failed. Check your credentials.'), type: 'error' });
            }
        } catch {
            setMessage({ text: 'Could not connect to the backend API.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [email, password, onLoginSuccess]);

    const handleRegister = useCallback(async () => {
        setMessage(null);
        if (!username) {
            setMessage({ text: 'Username is required.', type: 'error' });
            return;
        }
        if (password !== confirmPassword) {
            setMessage({ text: 'Passwords do not match.', type: 'error' });
            return;
        }
        if (password.length < 6) {
            setMessage({ text: 'Password must be at least 6 characters long.', type: 'error' });
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await response.json().catch(() => null);
            if (response.ok && data) {
                setMessage({ text: 'Registration successful. Please sign in.', type: 'success' });
                setUsername('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                navigate('/login');
            } else {
                setMessage({ text: formatError(data, 'Registration failed.'), type: 'error' });
            }
        } catch {
            setMessage({ text: 'Could not connect to backend API.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [username, email, password, confirmPassword, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        view === 'register' ? handleRegister() : handleLogin();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-4 py-6 font-inter">
            <div className="w-full max-w-sm bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-lg">
                <button
                    onClick={() => navigate('/')}
                    className="mb-4 flex items-center gap-2 text-amber-300 hover:text-amber-400"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <div className="text-center mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold text-amber-300">
                        {view === 'register' ? 'Create Account' : 'Welcome Back'}
                    </h1>
                    <p className="text-amber-400 text-sm mt-1">
                        {view === 'register' ? 'Start analyzing your crop health.' : 'Sign in to your account.'}
                    </p>
                </div>

                <AlertMessage message={message?.text || null} type={message?.type || null} />

                <form onSubmit={handleSubmit} className="space-y-4">
                    {view === 'register' && (
                        <>
                            <label className="block text-sm font-medium text-amber-300">Username</label>
                            <InputField
                                icon={() => null}
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </>
                    )}

                    <label className="block text-sm font-medium text-amber-300">Email</label>
                    <InputField
                        icon={Mail}
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label className="block text-sm font-medium text-amber-300">Password</label>
                    <InputField
                        icon={Lock}
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {view === 'register' && (
                        <>
                            <label className="block text-sm font-medium text-amber-300">Confirm Password</label>
                            <InputField
                                icon={Lock}
                                type="password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 mt-2 rounded-xl font-semibold transition-all duration-300 shadow-lg
                            ${isLoading ? 'bg-amber-500/50 cursor-not-allowed text-black' : 'bg-amber-300 hover:bg-amber-400 active:bg-amber-500 text-black'}`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-black" />
                                Processing...
                            </div>
                        ) : view === 'register' ? 'Register Account' : 'Sign In'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-amber-400">
                    {view === 'register' ? (
                        <>
                            Already have an account?{' '}
                            <Link to="/login" className="text-amber-300 font-medium hover:text-amber-400">Sign In</Link>
                        </>
                    ) : (
                        <>
                            Don't have an account?{' '}
                            <Link to="/register" className="text-amber-300 font-medium hover:text-amber-400">Create Account</Link>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
