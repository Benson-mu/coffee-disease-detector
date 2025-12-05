import React, { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as lucide from 'lucide-react';
import type { NavbarProps } from '../../types';

// Icons for buttons
const LogOut = lucide.LogOut;
const Grid = lucide.LayoutGrid;

const Navbar: React.FC<NavbarProps> = ({ userToken, onLogout }) => {
    // 🛑 START OF MODIFICATION 🛑
    // To ensure the Navbar component does not render on the dashboard (or anywhere it's used)
    // and based on the previous context that the Navbar is unwanted, we return null.
    // If you intend to use this Navbar on OTHER pages (like the landing page) but just
    // want to ensure it doesn't clash with the DashboardHeader, you MUST handle that 
    // logic where the component is called/imported (e.g., in App.tsx or Layout.tsx), 
    // or by adding a prop here (e.g., isDashboard: boolean) and conditionally returning null.
    // Based purely on your request to remove its appearance, returning null works:
    return null;
    // 🛑 END OF MODIFICATION 🛑

    /* The original logic below is now unreachable (dead code) because 'return null;' is the first line. */
    const navigate = useNavigate();

    const handleDelayedNavigation = useCallback((e: React.MouseEvent, path: string) => {
        e.preventDefault();
        const target = e.currentTarget;
        target.classList.add('bg-brown-700', 'cursor-wait');

        setTimeout(() => {
            target.classList.remove('bg-brown-700', 'cursor-wait');
            navigate(path);
        }, 500);
    }, [navigate]);

    const scrollToSection = useCallback((e: React.MouseEvent, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    }, []);

    return (
        <nav className="bg-brown-800 py-5 px-5 shadow-lg fixed top-0 left-0 right-0 z-20">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                
                {/* Logo Text Only */}
                <Link to="/" className="text-white text-4xl font-extrabold cursor-pointer">
                    CoffeeScanAI
                </Link>

                {/* Center Links */}
                <div className="hidden md:flex items-center space-x-16 mx-auto absolute left-1/2 transform -translate-x-1/2">
                    {['how-it-works','features','why-us','contact'].map(section => (
                        <Link
                            key={section}
                            to={`/#${section}`}
                            onClick={(e) => scrollToSection(e, section)}
                            className="text-white text-base py-2 hover:text-amber-400 transition-colors"
                        >
                            {section.replace(/-/g,' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Link>
                    ))}
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center space-x-4">
                    {userToken ? (
                        <>
                            <Link to="/dashboard" className="hidden sm:flex items-center space-x-2 px-4 py-2 text-white hover:bg-brown-700 font-bold rounded-lg transition-colors duration-200">
                                <Grid className="h-5 w-5" />
                                <span>Dashboard</span>
                            </Link>
                            <button onClick={onLogout} className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white hover:bg-red-700 font-bold rounded-lg shadow-md transition-colors duration-200">
                                <LogOut className="h-5 w-5" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link 
                                to="/login" 
                                onClick={(e) => handleDelayedNavigation(e, '/login')}
                                className="px-4 py-2 text-white font-bold rounded-lg transition-colors duration-200 hover:bg-brown-700"
                            >
                                Login
                            </Link>
                            <Link 
                                to="/register" 
                                onClick={(e) => handleDelayedNavigation(e, '/register')}
                                className="px-4 py-2 bg-amber-400 text-brown-900 hover:bg-amber-300 font-bold rounded-lg shadow-md transition-colors duration-200"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;