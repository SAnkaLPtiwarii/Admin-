import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white shadow">
            <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <span>{user?.name}</span>
                        <Button onClick={logout}>Logout</Button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;