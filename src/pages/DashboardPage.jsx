import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Settings, BookOpen, TrendingUp, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user } = useUser();

  const dashboardStats = [
    { icon: BookOpen, label: 'Articles Read', value: '24', color: 'text-blue-500' },
    { icon: TrendingUp, label: 'Trending Posts', value: '8', color: 'text-green-500' },
    { icon: Bell, label: 'Notifications', value: '3', color: 'text-yellow-500' },
  ];

  const quickActions = [
    { title: 'Read Latest Stories', description: 'Catch up on the hottest drama', link: '/blog', icon: BookOpen },
    { title: 'Check Trending', description: 'See what\'s breaking the internet', link: '/trending', icon: TrendingUp },
    { title: 'Update Profile', description: 'Manage your account settings', link: '/profile', icon: Settings },
  ];

  return (
    <div className="min-h-screen saisa-bg text-white">
      {/* Header */}
      <div className="bg-[#0A0A2A]/80 backdrop-blur-sm border-b border-[#FFA500]/20">
        <div className="container mx-auto px-6 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, <span className="saisa-text-yellow">{user?.firstName || 'User'}</span>!
            </h1>
            <p className="text-gray-300 text-lg">
              Here's what's happening in the SA entertainment world
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {dashboardStats.map((stat, index) => (
            <Card key={index} className="bg-[#0A0A2A]/50 border-[#FFA500]/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold saisa-text-yellow">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 saisa-text-yellow">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.link}>
                <Card className="bg-[#0A0A2A]/50 border-[#FFA500]/30 hover:border-[#FFA500] transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <action.icon className="h-8 w-8 saisa-text-yellow group-hover:scale-110 transition-transform" />
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">{action.title}</h3>
                        <p className="text-gray-400 text-sm">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="bg-[#0A0A2A]/50 border-[#FFA500]/30">
            <CardHeader>
              <CardTitle className="saisa-text-yellow">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-[#0A0A2A]/30 rounded-lg">
                  <BookOpen className="h-6 w-6 saisa-text-yellow" />
                  <div>
                    <p className="text-white font-medium">Read "Latest Celebrity Drama"</p>
                    <p className="text-gray-400 text-sm">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-[#0A0A2A]/30 rounded-lg">
                  <TrendingUp className="h-6 w-6 saisa-text-yellow" />
                  <div>
                    <p className="text-white font-medium">Checked trending stories</p>
                    <p className="text-gray-400 text-sm">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-[#0A0A2A]/30 rounded-lg">
                  <User className="h-6 w-6 saisa-text-yellow" />
                  <div>
                    <p className="text-white font-medium">Updated profile information</p>
                    <p className="text-gray-400 text-sm">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
