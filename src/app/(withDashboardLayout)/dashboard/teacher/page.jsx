'use client';
import React, { useEffect, useState } from 'react';
import {
  Users,
  FileText,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Search,
  Bell,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import TeacherRoute from '@/components/TeacherRoute';
import { auth } from '@/lib/firebase.init';
import { onAuthStateChanged } from 'firebase/auth';

const TeacherDashboard = () => {
  const [exams, setExams] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [avgScore, setAvgScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchAllData(currentUser.email);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchAllData = async (teacherEmail) => {
    try {
      setLoading(true);

      // ১. টিচারের তৈরি করা এক্সামসমূহ আনা
      const examRes = await fetch(`/api/exams/create?email=${teacherEmail}`);
      const examData = await examRes.json();
      const teacherExams = examData.data || [];
      setExams(teacherExams);

      // ২. মোট স্টুডেন্ট সংখ্যা আনা (role=student)
      const userRes = await fetch('/api/users'); // নিশ্চিত করুন আপনার এই API-তে সব ইউজার দেয়
      const userData = await userRes.json();
      const studentsOnly = userData.filter((u) => u.role === 'student');
      setTotalStudents(studentsOnly.length);

      // ৩. এই টিচারের নেওয়া সব এক্সামের রেজাল্ট থেকে এভারেজ বের করা
      // এখানে আমরা একটি নতুন API কল করছি যা শুধুমাত্র এই টিচারের রেজাল্ট আনবে
      const resultRes = await fetch(
        `/api/exams/submit?teacherEmail=${teacherEmail}`,
      );
      const resultData = await resultRes.json();

      if (resultData.success && resultData.data.length > 0) {
        const totalPercentage = resultData.data.reduce((acc, curr) => {
          const percentage = (curr.totalMark / curr.totalQuestions) * 100;
          return acc + percentage;
        }, 0);
        setAvgScore(Math.round(totalPercentage / resultData.data.length));
      }
    } catch (error) {
      console.error('Dashboard Data Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Total Students',
      value: loading ? '...' : totalStudents,
      icon: <Users size={20} />,
      trend: 'Platform-wide',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Your Exams',
      value: loading ? '...' : exams.length,
      icon: <FileText size={20} />,
      trend: 'Created by you',
      color: 'text-primary',
      bg: 'bg-primary-light',
    },
    {
      title: 'Active Rooms',
      value: exams.length > 0 ? exams.length : '0',
      icon: <Clock size={20} />,
      trend: 'Live',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  return (
    <TeacherRoute>
      <div className="p-6 md:p-10 bg-[#f9fafb] min-h-screen space-y-8">
        {/* হেডার */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Teacher Dashboard
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Hello {user?.displayName || 'Teacher'}! Monitoring your
              performance.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
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

        {/* স্ট্যাটাস কার্ড */}
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
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg ${stat.bg} ${stat.color}`}
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

        {/* টেবিল এবং অ্যাকশন */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Your Recent Exams</h3>
              <Link
                href="/dashboard/teacher/my-exams"
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
                    <th className="px-6 py-4">Questions</th>
                    <th className="px-6 py-4">Code</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-10">
                        <Loader2 className="animate-spin mx-auto text-primary" />
                      </td>
                    </tr>
                  ) : exams.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-10 text-slate-400 font-medium"
                      >
                        You haven't created any exams yet.
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
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {exam.questions?.length || 0}
                        </td>
                        <td className="px-6 py-4 font-mono text-sm font-bold text-primary bg-primary/5 px-2 rounded">
                          {exam.roomCode}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-bold px-2 py-1 rounded-md uppercase bg-green-100 text-green-600">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#0f172a] p-8 rounded-3xl text-white relative overflow-hidden shadow-xl shadow-slate-200">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2 text-primary">
                  Quick Action
                </h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Ready to evaluate your students? Create a new room instantly.
                </p>
                <Link
                  href="/dashboard/teacher/create-exam"
                  className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  Create New Exam <ArrowUpRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TeacherRoute>
  );
};

export default TeacherDashboard;
