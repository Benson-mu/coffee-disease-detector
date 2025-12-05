import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface DelayedLinkProps {
    to: string;
    className: string;
    children: React.ReactNode;
    delayMs?: number;
}

const DelayedLink: React.FC<DelayedLinkProps> = ({ to, className, children, delayMs = 500 }) => {
    const [isTransitioning, setIsTransitioning] = useState(false);
    const navigate = useNavigate();

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsTransitioning(true);

        setTimeout(() => {
            navigate(to);
        }, delayMs);
    }, [to, delayMs, navigate]);

    // Dark-theme friendly transition classes
    const transitionClasses = isTransitioning 
        ? 'bg-green-600 cursor-wait text-gray-100 flex items-center justify-center space-x-2'
        : '';

    return (
        <Link
            to={to}
            className={`${className} ${transitionClasses} transition-all duration-300`}
            onClick={handleClick}
            aria-disabled={isTransitioning}
        >
            {isTransitioning ? (
                <>
                    <Loader2 className="animate-spin h-5 w-5 text-gray-100" />
                    <span>Loading...</span>
                </>
            ) : (
                children
            )}
        </Link>
    );
};

export default DelayedLink;
