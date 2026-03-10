'use client';
import React, { useEffect, useState } from 'react';
import {
  Users,
  FileText,
  TrendingUp,
  Clock,
  MoreHorizontal,
  ArrowUpRight,
  Search,
  Bell,
} from 'lucide-react';
import Link from 'next/link';

const TeacherDashboard = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  // ডাটাবেস থেকে এক্সাম লিস্ট ফেচ করা
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await fetch('/api/exams/create'); 
        const data = await res.json();
        if (data.success) {
          setExams(data.data);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const stats = [
    {
      title: 'Total Students',
      value: '1,284',
      icon: <Users size={20} />,
      trend: '+12%',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Total Exams',
      value: loading ? '...' : exams.length,
      icon: <FileText size={20} />,
      trend: 'Real-time',
      color: 'text-primary',
      bg: 'bg-primary-light',
    },
    {
      title: 'Avg. Score',
      value: '84%',
      icon: <TrendingUp size={20} />,
      trend: '+5%',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      title: 'Active Rooms',
      value: exams.filter((e) => e.status === 'Active').length || '0',
      icon: <Clock size={20} />,
      trend: 'Live',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  return (
    <div className="p-6 md:p-10 bg-[#f9fafb] min-h-screen space-y-8">
      {/* ১. হেডার */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Teacher Dashboard
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Welcome back! Monitoring {exams.length} exams.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search data..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-primary w-64"
            />
          </div>
          <Bell className="text-slate-400 cursor-pointer" size={20} />
        </div>
      </div>

      {/* ২. স্ট্যাটাস কার্ড গ্রিড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>
              <span
                className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.bg} ${stat.color}`}
              >
                {stat.trend}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.title}</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      {/* ৩. মেইন কন্টেন্ট */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* বাম পাশ: ডাইনামিক এক্সাম টেবিল */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">
              Recent Exams Performance
            </h3>
            <Link
              href="/dashboard/teacher/create-exam"
              className="text-sm font-bold text-primary hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Exam Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Questions</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Code</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-10 text-slate-400"
                    >
                      Loading exams...
                    </td>
                  </tr>
                ) : exams.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-10 text-slate-400"
                    >
                      No exams created yet.
                    </td>
                  </tr>
                ) : (
                  exams.slice(0, 5).map((exam) => (
                    <tr
                      key={exam._id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-sm text-slate-700">
                        {exam.roomTitle}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {exam.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                        {exam.questions?.length || 0}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold px-2 py-1 rounded-md uppercase bg-primary-light text-primary">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-sm font-bold text-slate-500">
                        {exam.roomCode}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ডান পাশ: অ্যাকশন কার্ড */}
        <div className="space-y-6">
          <div className="bg-primary p-8 rounded-2xl text-white relative overflow-hidden shadow-lg shadow-primary/20">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Create New Exam</h3>
              <p className="text-white/80 text-xs mb-6 leading-relaxed">
                Setup a new exam room and invite your students.
              </p>
              <Link
                href="/dashboard/teacher/create-exam/new"
                className="w-full py-3 bg-white text-primary rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                Get Started <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
