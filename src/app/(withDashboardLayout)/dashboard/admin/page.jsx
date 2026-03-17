'use client';
import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  GraduationCap,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Search,
} from 'lucide-react';
import AdminRoute from '@/components/AdminRoute';

const AdminDashboard = () => {
  // ডামি ডাটা (পরবর্তীতে API থেকে আসবে)
  const stats = [
    {
      id: 1,
      name: 'Total Students',
      value: '12,450',
      icon: <Users size={24} />,
      trend: '+12%',
      up: true,
      color: 'bg-blue-500',
    },
    {
      id: 2,
      name: 'Total Teachers',
      value: '840',
      icon: <GraduationCap size={24} />,
      trend: '+5%',
      up: true,
      color: 'bg-purple-500',
    },
    {
      id: 3,
      name: 'Active Exams',
      value: '124',
      icon: <FileText size={24} />,
      trend: '-2%',
      up: false,
      color: 'bg-orange-500',
    },
    {
      id: 4,
      name: 'Success Rate',
      value: '94.2%',
      icon: <TrendingUp size={24} />,
      trend: '+3%',
      up: true,
      color: 'bg-emerald-500',
    },
  ];

  const recentUsers = [
    {
      id: 1,
      name: 'Ariful Islam',
      email: 'arif@example.com',
      role: 'Student',
      status: 'Active',
      date: '2 mins ago',
    },
    {
      id: 2,
      name: 'Dr. Sarah',
      email: 'sarah@univ.edu',
      role: 'Teacher',
      status: 'Pending',
      date: '1 hour ago',
    },
    {
      id: 3,
      name: 'Tanvir Hossain',
      email: 'tanvir@test.com',
      role: 'Student',
      status: 'Active',
      date: '3 hours ago',
    },
  ];

  return (
    <AdminRoute>
      <div className="p-6 bg-[#f8fafc] min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              System Overview
            </h1>
            <p className="text-slate-500 font-medium">
              Welcome back, Admin. Here's what's happening today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search data..."
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full md:w-64 transition-all"
              />
            </div>
            <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg shadow-slate-200">
              Export Report
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stat.id * 0.1 }}
              className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`${stat.color} p-3 rounded-2xl text-white shadow-lg`}
                >
                  {stat.icon}
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-black ${stat.up ? 'text-emerald-500' : 'text-rose-500'}`}
                >
                  {stat.trend}{' '}
                  {stat.up ? (
                    <ArrowUpRight size={14} />
                  ) : (
                    <ArrowDownRight size={14} />
                  )}
                </div>
              </div>
              <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">
                {stat.name}
              </h3>
              <p className="text-2xl font-black text-slate-800">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Users Table */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 flex items-center justify-between border-b border-slate-50">
              <h2 className="text-lg font-black text-slate-800">
                Recent User Registrations
              </h2>
              <button className="text-primary font-bold text-sm hover:underline">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <th className="px-8 py-4">User</th>
                    <th className="px-8 py-4">Role</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                            {user.name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              {user.name}
                            </p>
                            <p className="text-xs text-slate-400 font-medium">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg ${
                            user.role === 'Teacher'
                              ? 'bg-purple-50 text-purple-600'
                              : 'bg-blue-50 text-blue-600'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                          ></div>
                          <span className="text-sm font-bold text-slate-600">
                            {user.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 hover:bg-white rounded-lg transition-colors">
                          <MoreVertical size={16} className="text-slate-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* System Health / Summary Sidebar */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-lg font-black mb-6">System Health</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2 opacity-60">
                    <span>Server Load</span>
                    <span>42%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '42%' }}
                      className="h-full bg-emerald-400"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2 opacity-60">
                    <span>Database Usage</span>
                    <span>18%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '18%' }}
                      className="h-full bg-blue-400"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-3xl">
                <p className="text-sm font-bold opacity-80 mb-2">Notice</p>
                <p className="text-xs opacity-60 leading-relaxed">
                  System update scheduled for March 20th at 03:00 AM UTC. Please
                  notify all teachers.
                </p>
              </div>
            </div>

            {/* Decorative Circle */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"></div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
};

export default AdminDashboard;
