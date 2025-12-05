import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import * as lucide from 'lucide-react';
import type { Page } from '../../types';

const IconMailInternal = lucide.Mail;
const IconLocation = lucide.MapPin;

const Footer: React.FC<{ setCurrentPage: (page: Page) => void }> = ({ setCurrentPage: _unused_setCurrentPage }) => { 
    const scrollToSection = useCallback((e: React.MouseEvent, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    }, []);

    return (
        <footer className="bg-black text-amber-300 py-10 mt-auto">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">

                <div className="text-lg font-bold text-amber-300">
                    CoffeeScanAI
                    <p className="mt-1 text-amber-400">Smarter coffee plant care</p>
                </div>

                <div>
                    <h4 className="font-semibold text-amber-300 mb-2">Links</h4>
                    <ul className="space-y-1">
                        <li><Link to="/" className="hover:text-yellow-300 transition-colors">Home</Link></li>
                        <li>
                            <Link to="/#features" onClick={(e) => scrollToSection(e, 'features')} className="hover:text-yellow-300 transition-colors">
                                Features
                            </Link>
                        </li>
                        <li>
                            <Link to="/#contact" onClick={(e) => scrollToSection(e, 'contact')} className="hover:text-yellow-300 transition-colors">
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold text-amber-300 mb-2">Contact</h4>
                    <p className="flex items-center space-x-2">
                        <IconMailInternal className="h-4 w-4 text-yellow-300" />
                        <span>support@coffeescani.ai</span>
                    </p>
                    <p className="flex items-center space-x-2 mt-1">
                        <IconLocation className="h-4 w-4 text-yellow-300" />
                        <span>Global HQ, CoffeeTech Hub</span>
                    </p>
                </div>

            </div>

            <div className="max-w-7xl mx-auto px-4 mt-6 pt-4 text-center text-amber-400 text-xs">
                &copy; {new Date().getFullYear()} CoffeeScanAI. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
