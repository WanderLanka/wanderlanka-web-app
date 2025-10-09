import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Breadcrumb component for navigation hierarchy
 * @param {Array} items - Array of breadcrumb items with { label, path, isActive }
 * @param {string} className - Additional CSS classes
 */
const Breadcrumb = ({ items = [], className = '' }) => {
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <nav 
            className={`flex items-center space-x-2 text-sm ${className}`}
            aria-label="Breadcrumb"
        >
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                
                return (
                    <React.Fragment key={index}>
                        {/* Separator */}
                        {index > 0 && (
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                        )}
                        
                        {/* Breadcrumb Item */}
                        {isLast ? (
                            // Active/Current page - not clickable
                            <span 
                                className="text-slate-600 font-medium truncate max-w-xs"
                                aria-current="page"
                            >
                                {item.label}
                            </span>
                        ) : (
                            // Clickable link
                            <Link
                                to={item.path}
                                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 flex items-center truncate max-w-xs"
                            >
                                {/* Home icon for dashboard */}
                                {item.isHome && (
                                    <Home className="w-4 h-4 mr-1" />
                                )}
                                {item.label}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};

export default Breadcrumb;