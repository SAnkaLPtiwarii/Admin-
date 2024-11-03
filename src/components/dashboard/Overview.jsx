import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent } from '../ui/Card';
import { getUserStats } from '../../services/api';
import {
    Users, UserPlus, UserCheck, TrendingUp, Activity, ArrowUp,
    ArrowDown, MoreHorizontal, Bell, Calendar, Settings,
    RefreshCcw, Download, Filter, Search, ChevronDown
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import CountUp from 'react-countup';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

// Mini Sparkline Component
const MiniSparkline = ({ data }) => (
    <ResponsiveContainer width="100%" height={50}>
        <LineChart data={data}>
            <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
            />
        </LineChart>
    </ResponsiveContainer>
);

// Search Results Component
const SearchResults = ({ results, onClose }) => {
    if (!results || results.length === 0) {
        return (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-4">
                <p className="text-sm text-gray-500">No results found</p>
            </div>
        );
    }

    return (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
            <div className="p-4 space-y-2">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-gray-700">Search Results</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                {results.map((result, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer group"
                        onClick={() => {
                            const element = document.getElementById(
                                result.type + '-' + (result.title || result.message)?.toLowerCase().replace(/\s+/g, '-')
                            );
                            if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                element.classList.add('highlight');
                                setTimeout(() => element.classList.remove('highlight'), 2000);
                            }
                            onClose();
                        }}
                    >
                        <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${result.type === 'stat' ? 'bg-blue-100 text-blue-600' :
                                    result.type === 'metric' ? 'bg-green-100 text-green-600' :
                                        'bg-purple-100 text-purple-600'
                                }`}>
                                {result.type === 'stat' ? <Users className="w-4 h-4" /> :
                                    result.type === 'metric' ? <Activity className="w-4 h-4" /> :
                                        <Bell className="w-4 h-4" />}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">
                                    {result.title || result.message}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// Notification Item Component
const NotificationItem = ({ notification }) => (
    <div className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg">
        <div className={`mt-1 w-2 h-2 rounded-full ${notification.type === 'alert' ? 'bg-yellow-400' :
                notification.type === 'warning' ? 'bg-red-400' :
                    'bg-green-400'
            }`} />
        <div>
            <p className="text-sm text-gray-800">{notification.message}</p>
            <p className="text-xs text-gray-500">{notification.time}</p>
        </div>
    </div>
);

// Main Overview Component
const Overview = () => {
    const [stats, setStats] = useState(null);
    const [timeRange, setTimeRange] = useState('7d');
    const [isLoading, setIsLoading] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState(null);

    // Mock data for sparklines
    const generateSparklineData = (count = 10) => {
        return Array.from({ length: count }, (_, i) => ({
            value: Math.random() * 100
        }));
    };

    // Static data
    const notifications = [
        {
            id: 1,
            type: 'alert',
            message: 'System update scheduled for maintenance',
            time: '5 mins ago'
        },
        {
            id: 2,
            type: 'warning',
            message: 'High traffic alert on main server',
            time: '10 mins ago'
        },
        {
            id: 3,
            type: 'success',
            message: 'Backup completed successfully',
            time: '1 hour ago'
        }
    ];

    const performanceMetrics = {
        cpu: 65,
        memory: 82,
        storage: 45,
        network: 78
    };

    // Memoized stat cards
    const statCards = useMemo(() => [
        {
            title: "Total Users",
            value: stats?.totalUsers || 0,
            icon: Users,
            color: "bg-gradient-to-br from-blue-500 to-blue-600",
            increase: "+12%",
            isPositive: true,
            sparklineData: generateSparklineData(),
            subStats: {
                verified: "85%",
                premium: "35%"
            }
        },
        {
            title: "Active Users",
            value: stats?.activeUsers || 0,
            icon: UserCheck,
            color: "bg-gradient-to-br from-green-500 to-green-600",
            increase: "+8%",
            isPositive: true,
            sparklineData: generateSparklineData(),
            subStats: {
                daily: "62%",
                weekly: "78%"
            }
        },
        {
            title: "New Sign-ups",
            value: stats?.newSignups || 0,
            icon: UserPlus,
            color: "bg-gradient-to-br from-purple-500 to-purple-600",
            increase: "+15%",
            isPositive: true,
            sparklineData: generateSparklineData(),
            subStats: {
                organic: "45%",
                referral: "55%"
            }
        },
        {
            title: "Growth Rate",
            value: "23%",
            icon: TrendingUp,
            color: "bg-gradient-to-br from-orange-500 to-orange-600",
            increase: "+5%",
            isPositive: true,
            sparklineData: generateSparklineData(),
            subStats: {
                monthly: "18%",
                yearly: "23%"
            }
        }
    ], [stats]);

    // Load data effect
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const data = await getUserStats();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [timeRange]);

    // Search handler
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        if (!stats || query.trim() === '') {
            setFilteredData(null);
            return;
        }

        // Define searchable items
        const searchableItems = [
            ...statCards.map(card => ({
                ...card,
                type: 'stat',
                searchableText: `${card.title} ${Object.entries(card.subStats).map(([key, value]) => `${key} ${value}`).join(' ')}`
            })),
            ...Object.entries(performanceMetrics).map(([metric, value]) => ({
                title: metric,
                value: value,
                type: 'metric',
                searchableText: `${metric} usage performance metrics`
            })),
            ...notifications.map(notif => ({
                ...notif,
                type: 'notification',
                searchableText: `${notif.message} ${notif.time}`
            }))
        ];

        // Filter items
        const results = searchableItems.filter(item =>
            item.searchableText.toLowerCase().includes(query)
        );

        setFilteredData(results);
    };

    // Reset search
    const resetSearch = () => {
        setSearchQuery('');
        setFilteredData(null);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center space-y-4"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
                    />
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 font-medium"
                    >
                        Loading dashboard data...
                    </motion.p>
                </motion.div>
            </div>
        );
    }

    // Main render
    return (
        <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold text-gray-800"
                    >
                        Dashboard Overview
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-500 mt-1"
                    >
                        Welcome back! Here's what's happening
                    </motion.p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4">
                    {/* Search */}
                    <div className="relative">
                        <div className="flex items-center">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Search dashboard..."
                                    className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                            </div>
                            {searchQuery && (
                                <button
                                    className="ml-2 p-1 hover:bg-gray-100 rounded-full"
                                    onClick={resetSearch}
                                >
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        <AnimatePresence>
                            {searchQuery && (
                                <SearchResults
                                    results={filteredData}
                                    onClose={resetSearch}
                                />
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Time Range Selector */}
                    <select
                        className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                    </select>

                    {/* Action Icons */}
                    <div className="flex items-center space-x-2">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
                        >
                            <RefreshCcw className="w-5 h-5 text-gray-600" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
                        >
                            <Download className="w-5 h-5 text-gray-600" />
                        </motion.button>

                        {/* Notifications */}
                        <div className="relative">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <Bell className="w-5 h-5 text-gray-600" />
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                                    {notifications.length}
                                </span>
                            </motion.button>

                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                                    >
                                        <div className="p-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="font-semibold text-gray-900">Notifications</h3>
                                                <button
                                                    onClick={() => setShowNotifications(false)}
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="space-y-3">
                                                {notifications.map((notification) => (
                                                    <NotificationItem
                                                        key={notification.id}
                                                        notification={notification}
                                                    />
                                                ))}
                                            </div>
                                            <button
                                                className="mt-4 w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                View all notifications
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        id={`stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group"
                    >
                        <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                        <h3 className="text-2xl font-bold mt-2 text-gray-900">
                                            <CountUp
                                                end={Number(stat.value)}
                                                duration={2}
                                                separator=","
                                                decimals={stat.title === "Growth Rate" ? 1 : 0}
                                                suffix={stat.title === "Growth Rate" ? "%" : ""}
                                            />
                                        </h3>
                                        <div className="flex items-center mt-2">
                                            <span className={`flex items-center text-sm ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                                {stat.isPositive ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                                                {stat.increase}
                                            </span>
                                            <span className="text-gray-500 text-sm ml-2">vs last month</span>
                                        </div>
                                    </div>
                                    <div className={`${stat.color} p-3 rounded-lg shadow-lg transform transition-transform group-hover:scale-110`}>
                                        {React.createElement(stat.icon, { className: 'w-6 h-6 text-white' })}
                                    </div>
                                </div>

                                {/* Sparkline with Animation */}
                                <motion.div
                                    className="mt-4 h-12"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <MiniSparkline data={stat.sparklineData} />
                                </motion.div>

                                {/* Sub Stats with Hover Effect */}
                                <div className="mt-4 grid grid-cols-2 gap-2">
                                    {Object.entries(stat.subStats).map(([key, value]) => (
                                        <div
                                            key={key}
                                            className="bg-gray-50 rounded-lg p-2 transition-all duration-200 hover:bg-gray-100"
                                        >
                                            <p className="text-xs text-gray-500 capitalize">{key}</p>
                                            <p className="text-sm font-semibold text-gray-700">{value}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Performance Metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {Object.entries(performanceMetrics).map(([metric, value], index) => (
                    <motion.div
                        key={metric}
                        id={`metric-${metric.toLowerCase()}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group"
                    >
                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="w-24 h-24 transform transition-transform group-hover:scale-110">
                                        <CircularProgressbar
                                            value={value}
                                            text={`${value}%`}
                                            styles={buildStyles({
                                                pathColor: `rgba(62, 152, 199, ${value / 100})`,
                                                textColor: '#2e2e2e',
                                                trailColor: '#d6d6d6',
                                                pathTransitionDuration: 1.5,
                                            })}
                                        />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold capitalize">{metric}</h3>
                                        <p className="text-sm text-gray-500">Current Usage</p>
                                        <div className="mt-2">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${value > 80 ? 'bg-red-100 text-red-800' :
                                                    value > 60 ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-green-100 text-green-800'
                                                }`}>
                                                {value > 80 ? 'High' : value > 60 ? 'Medium' : 'Low'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Add CSS for animations */}
            <style jsx>{`
                .highlight {
                    animation: highlightAnimation 2s ease-in-out;
                }

                @keyframes highlightAnimation {
                    0% {
                        transform: scale(1);
                        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5);
                    }
                    50% {
                        transform: scale(1.02);
                        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5);
                    }
                    100% {
                        transform: scale(1);
                        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5);
                    }
                }
            `}</style>
        </div>
    );
};

export default Overview;


