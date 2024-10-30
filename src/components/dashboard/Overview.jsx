// src/components/dashboard/Overview.jsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { getUserStats } from '../../services/api';
import UserGrowthChart from '../charts/UserGrowthChart';
import { Users, UserPlus, UserCheck, TrendingUp, Activity, ArrowUp, ArrowDown, MoreHorizontal } from 'lucide-react';

const Overview = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            const data = await getUserStats();
            setStats(data);
        };
        fetchStats();
    }, []);

    if (!stats) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600">Loading dashboard data...</p>
            </div>
        </div>
    );

    const statCards = [
        {
            title: "Total Users",
            value: stats.totalUsers.toLocaleString(),
            icon: Users,
            color: "bg-gradient-to-br from-blue-500 to-blue-600",
            increase: "+12%",
            isPositive: true,
            description: "Total users on platform"
        },
        {
            title: "Active Users",
            value: stats.activeUsers.toLocaleString(),
            icon: UserCheck,
            color: "bg-gradient-to-br from-green-500 to-green-600",
            increase: "+8%",
            isPositive: true,
            description: "Currently active users"
        },
        {
            title: "New Sign-ups",
            value: stats.newSignups,
            icon: UserPlus,
            color: "bg-gradient-to-br from-purple-500 to-purple-600",
            increase: "+15%",
            isPositive: true,
            description: "New users this month"
        },
        {
            title: "Growth Rate",
            value: "23%",
            icon: TrendingUp,
            color: "bg-gradient-to-br from-orange-500 to-orange-600",
            increase: "+5%",
            isPositive: true,
            description: "User growth rate"
        }
    ];

    const recentActivities = [
        { action: "New user registration", time: "2 minutes ago", type: "signup" },
        { action: "Premium plan subscription", time: "1 hour ago", type: "subscription" },
        { action: "Profile update", time: "3 hours ago", type: "update" },
        { action: "New feature access", time: "5 hours ago", type: "feature" }
    ];

    return (
        <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-1">Welcome back! Here's what's happening</p>
                </div>
                <div className="flex items-center space-x-4">
                    <select className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>Last 90 days</option>
                    </select>
                    <button className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50">
                        <MoreHorizontal className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, index) => (
                    <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <h3 className="text-2xl font-bold mt-2 text-gray-900">{stat.value}</h3>
                                    <div className="flex items-center mt-2">
                                        <span className={`flex items-center text-sm ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                            {stat.isPositive ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                                            {stat.increase}
                                        </span>
                                        <span className="text-gray-500 text-sm ml-2">vs last month</span>
                                    </div>
                                </div>
                                <div className={`${stat.color} p-3 rounded-lg shadow-lg`}>
                                    {React.createElement(stat.icon, { className: 'w-6 h-6 text-white' })}
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts and Activity Section */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Chart */}
                <Card className="lg:col-span-2 hover:shadow-lg transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xl font-bold text-gray-800">User Growth Analytics</CardTitle>
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-sm text-gray-600">New Users</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-sm text-gray-600">Active Users</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[400px] mt-4">
                            <UserGrowthChart data={stats.userGrowth} />
                        </div>
                    </CardContent>
                </Card>

                {/* Activity Feed */}
                <Card className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-gray-800">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivities.map((activity, index) => (
                                <div key={index} className="flex items-center p-4 bg-white rounded-lg border border-gray-100 hover:border-blue-500 transition-colors">
                                    <div className="relative">
                                        <Activity className="w-5 h-5 text-blue-500" />
                                        {index !== recentActivities.length - 1 && (
                                            <div className="absolute top-10 left-2.5 w-0.5 h-full -ml-px bg-gray-200"></div>
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                        <p className="text-xs text-gray-500">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Stats Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Weekly Report</p>
                                <h4 className="mt-2 text-2xl font-bold text-blue-900">85%</h4>
                                <p className="text-sm text-blue-600">Growth in engagement</p>
                            </div>
                            <div className="w-16 h-16">
                                {/* Add a circular progress indicator or icon here */}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600">User Satisfaction</p>
                                <h4 className="mt-2 text-2xl font-bold text-green-900">92%</h4>
                                <p className="text-sm text-green-600">Based on feedback</p>
                            </div>
                            <div className="w-16 h-16">
                                {/* Add a satisfaction indicator or icon here */}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-600">Platform Status</p>
                                <h4 className="mt-2 text-2xl font-bold text-purple-900">Healthy</h4>
                                <p className="text-sm text-purple-600">All systems operational</p>
                            </div>
                            <div className="w-16 h-16">
                                {/* Add a status indicator or icon here */}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Overview;