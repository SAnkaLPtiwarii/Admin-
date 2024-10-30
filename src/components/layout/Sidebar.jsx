import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
    const { user } = useAuth();

    return (
        <aside className="w-64 bg-white shadow-md min-h-screen">
            <nav className="mt-5 px-2">
                <Link
                    to="/dashboard"
                    className="group flex items-center px-2 py-2 text-base font-medium rounded-md"
                >
                    Overview
                </Link>
                {user?.role === 'admin' && (
                    <Link
                        to="/users"
                        className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md"
                    >
                        User Management
                    </Link>
                )}
                <Link
                    to="/profile"
                    className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md"
                >
                    Profile
                </Link>
            </nav>
        </aside>
    );
};

export default Sidebar;