import React, { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as lucide from 'lucide-react';
import type { NavbarProps } from '../../types';

// Icons
const LogOut = lucide.LogOut;
const Grid = lucide.LayoutGrid;
const Menu = lucide.Menu;
const X = lucide.X;

const Navbar: React.FC<NavbarProps> = ({ userToken, onLogout }) => {

    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

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
        setMobileOpen(false); // Close menu after clicking section
    }, []);

    return (
        <nav className="bg-brown-800 py-5 px-5 shadow-lg fixed top-0 left-0 right-0 z-20">
            <div className="max-w-7xl mx-auto flex justify-between items-center">

                {/* Logo */}
                <Link to="/" className="text-white text-4xl font-extrabold cursor-pointer">
                    CoffeeScanAI
                </Link>

                {/* Desktop Navigation */}
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

                {/* Auth Buttons (Desktop) */}
                <div className="hidden sm:flex items-center space-x-4">
                    {userToken ? (
                        <>
                            <Link to="/dashboard" className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-brown-700 font-bold rounded-lg transition-colors duration-200">
                                <Grid className="h-5 w-5" />
                                <span>Dashboard</span>
                            </Link>
                            <button onClick={onLogout} className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white hover:bg-red-700 font-bold rounded-lg shadow-md transition-colors duration-200">
                                <LogOut className="h-5 w-5" />
                                <span>Logout</span>
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

                {/* Mobile Hamburger Button */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <X size={32} /> : <Menu size={32} />}
                </button>
            </div>

            {/* Mobile Dropdown Menu */}
            {mobileOpen && (
                <div className="md:hidden mt-4 bg-brown-900 rounded-xl shadow-lg p-5 space-y-5 animate-fade-in-down">

                    {/* Sections */}
                    <div className="flex flex-col space-y-4">
                        {['how-it-works','features','why-us','contact'].map(section => (
                            <button
                                key={section}
                                onClick={(e) => scrollToSection(e, section)}
                                className="text-white text-lg text-left hover:text-amber-400 transition-colors"
                            >
                                {section.replace(/-/g,' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </button>
                        ))}
                    </div>

                    {/* Auth Buttons */}
                    <div className="border-t border-brown-700 pt-5 flex flex-col space-y-4">
                        {userToken ? (
                            <>
                                <Link 
                                    to="/dashboard" 
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center space-x-2 px-4 py-3 bg-brown-700 text-white rounded-lg font-bold"
                                >
                                    <Grid className="h-5 w-5" />
                                    <span>Dashboard</span>
                                </Link>

                                <button 
                                    onClick={() => { onLogout(); setMobileOpen(false); }}
                                    className="flex items-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg font-bold"
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/login"
                                    onClick={(e) => { handleDelayedNavigation(e, '/login'); setMobileOpen(false); }}
                                    className="px-4 py-3 text-white bg-brown-700 rounded-lg text-center font-bold"
                                >
                                    Login
                                </Link>

                                <Link 
                                    to="/register"
                                    onClick={(e) => { handleDelayedNavigation(e, '/register'); setMobileOpen(false); }}
                                    className="px-4 py-3 bg-amber-400 text-brown-900 rounded-lg text-center font-bold"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
