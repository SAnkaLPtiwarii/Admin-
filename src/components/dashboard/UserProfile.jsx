// src/components/dashboard/UserProfile.jsx (continued)
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { User, Mail, Shield, Calendar, MapPin, Phone, Edit2, Clock, Bell, Lock, Settings } from 'lucide-react';

const UserProfile = () => {
    const { user } = useAuth();

    if (!user) return null;

    const userDetails = [
        { icon: User, label: 'Full Name', value: user.name },
        { icon: Mail, label: 'Email', value: user.email },
        { icon: Shield, label: 'Role', value: user.role },
        { icon: Calendar, label: 'Member Since', value: 'January 2024' },
        { icon: MapPin, label: 'Location', value: 'New York, USA' },
        { icon: Phone, label: 'Contact', value: '+1 (555) 123-4567' },
    ];

    const recentActivities = [
        { action: 'Logged in', time: '2 hours ago', icon: Clock },
        { action: 'Updated profile picture', time: '1 day ago', icon: User },
        { action: 'Changed password', time: '3 days ago', icon: Lock },
        { action: 'Updated settings', time: '1 week ago', icon: Settings },
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800">Profile</h2>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Profile Information Card */}
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-800">Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center mb-6">
                            <div className="relative group">
                                <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center hover:opacity-90 cursor-pointer transition-opacity">
                                    <span className="text-4xl font-medium text-white">
                                        {user.name.charAt(0)}
                                    </span>
                                </div>
                                <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all">
                                    <Edit2 className="h-6 w-6 text-white opacity-0 group-hover:opacity-100" />
                                </div>
                            </div>
                            <div className="ml-6">
                                <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
                                <p className="text-gray-500">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
                                <div className="mt-2 flex space-x-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Active
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Verified
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {userDetails.map((detail, index) => (
                                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="bg-white p-2 rounded-full shadow-sm">
                                        {React.createElement(detail.icon, { className: 'h-5 w-5 text-blue-600' })}
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <p className="text-sm text-gray-500">{detail.label}</p>
                                        <p className="text-sm font-medium text-gray-900">{detail.value}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-600">
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Right Column Cards */}
                <div className="space-y-6">
                    {/* Recent Activity Card */}
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold text-gray-800">Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivities.map((activity, index) => (
                                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="bg-blue-100 p-2 rounded-full">
                                            {React.createElement(activity.icon, { className: 'h-5 w-5 text-blue-600' })}
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                            <p className="text-xs text-gray-500">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notification Preferences Card */}
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold text-gray-800">
                                <div className="flex items-center">
                                    <Bell className="h-5 w-5 mr-2 text-blue-600" />
                                    Notification Preferences
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {['Email Notifications', 'Push Notifications', 'SMS Alerts'].map((pref, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-900">{pref}</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked={index === 0} />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;