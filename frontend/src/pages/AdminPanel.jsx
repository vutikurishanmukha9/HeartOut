import React, { useState, useEffect } from 'react';
import { Users, FileText, Flag, TrendingUp, Shield } from 'lucide-react';

export default function AdminPanel() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPosts: 0,
        reportedPosts: 0,
        activeUsers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('/api/admin/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary-200 rounded-full animate-spin border-t-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading admin panel...</p>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            color: 'from-blue-500 to-cyan-600',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            title: 'Total Stories',
            value: stats.totalPosts,
            icon: FileText,
            color: 'from-green-500 to-emerald-600',
            bgColor: 'bg-green-50 dark:bg-green-900/20'
        },
        {
            title: 'Reported Content',
            value: stats.reportedPosts,
            icon: Flag,
            color: 'from-red-500 to-rose-600',
            bgColor: 'bg-red-50 dark:bg-red-900/20'
        },
        {
            title: 'Active Users',
            value: stats.activeUsers,
            icon: TrendingUp,
            color: 'from-purple-500 to-pink-600',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex items-center space-x-3 mb-2">
                    <Shield className="w-8 h-8 text-primary-600" />
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Admin Panel
                    </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                    Manage users, content, and platform statistics
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.title}
                            className={`${stat.bgColor} rounded-lg p-6 border border-gray-200 dark:border-gray-700`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                {stat.title}
                            </h3>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                {stat.value}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="p-4 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <Users className="w-6 h-6 text-blue-600 mb-2" />
                        <h3 className="font-medium text-gray-900 dark:text-white">Manage Users</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">View and moderate users</p>
                    </button>

                    <button className="p-4 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <FileText className="w-6 h-6 text-green-600 mb-2" />
                        <h3 className="font-medium text-gray-900 dark:text-white">Review Content</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Moderate stories and posts</p>
                    </button>

                    <button className="p-4 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <Flag className="w-6 h-6 text-red-600 mb-2" />
                        <h3 className="font-medium text-gray-900 dark:text-white">Handle Reports</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Review reported content</p>
                    </button>
                </div>
            </div>
        </div>
    );
}
