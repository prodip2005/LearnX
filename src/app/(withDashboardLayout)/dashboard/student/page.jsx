'use client';
import React from 'react';
import {
  BookOpen,
  Trophy,
  Clock,
  Calendar,
  ArrowUpRight,
  CheckCircle2,
  PlayCircle,
} from 'lucide-react';
import Image from 'next/image';

const StudentDashboard = () => {
  // স্টুডেন্টের ডামি ডাটা (পরবর্তীতে ডাটাবেস থেকে আনতে পারবেন)
  const stats = [
    {
      title: 'Enrolled Exams',
      value: '12',
      icon: <BookOpen className="text-blue-600" />,
      bg: 'bg-blue-50',
    },
    {
      title: 'Completed',
      value: '08',
      icon: <CheckCircle2 className="text-[#1fbb32]" />,
      bg: 'bg-[#f0fdf4]',
    },
    {
      title: 'Avg. Score',
      value: '88%',
      icon: <Trophy className="text-orange-600" />,
      bg: 'bg-orange-50',
    },
    {
      title: 'Study Hours',
      value: '42h',
      icon: <Clock className="text-purple-600" />,
      bg: 'bg-purple-50',
    },
  ];

  const upcomingExams = [
    {
      id: 1,
      title: 'Advanced Chemistry Batch A',
      date: 'Oct 24, 2023',
      time: '10:00 AM',
      category: 'Science',
    },
    {
      id: 2,
      title: 'Modern Physics Quiz',
      date: 'Oct 26, 2023',
      time: '02:30 PM',
      category: 'Physics',
    },
  ];

  return (
    <div className="p-6 md:p-10 bg-[#f9fafb] min-h-screen space-y-8">
      {/* ১. স্বাগতম সেকশন */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome Back, Student!
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Here's what's happening with your studies today.
          </p>
        </div>
        <button className="bg-[#1fbb32] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-[#1fbb32]/20 hover:bg-[#19a32b] transition-all flex items-center gap-2">
          Join New Exam <PlayCircle size={18} />
        </button>
      </div>

      {/* ২. স্ট্যাটাস কার্ডস */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}
            >
              {stat.icon}
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.title}</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ৩. রিসেন্ট অ্যাক্টিভিটি / কন্টিনিউ লার্নিং */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-lg">
                My Performance Trend
              </h3>
              <select className="text-xs font-bold text-slate-500 bg-slate-50 border-none outline-none p-1 rounded">
                <option>Last 7 Days</option>
                <option>Last Month</option>
              </select>
            </div>
            <div className="p-10 flex flex-col items-center justify-center text-center">
              <div className="w-full h-40 bg-slate-50 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-200">
                <p className="text-slate-400 text-sm italic">
                  Analytics chart will appear here after your first exam.
                </p>
              </div>
            </div>
          </div>

          {/* ৪. এনরোল করা এক্সাম টেবিল */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50">
              <h3 className="font-bold text-slate-800">Recent Exam Results</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Exam Name</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <p className="font-bold text-sm text-slate-700">
                        Biology Mock Test
                      </p>
                      <p className="text-[10px] text-slate-400">12 Oct, 2023</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-700">
                      85/100
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-100 text-green-600 text-[10px] font-bold rounded-md">
                        PASSED
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-[#1fbb32] text-xs font-bold hover:underline">
                        Review
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ৫. ডান পাশের সাইডবার (Upcoming Exams) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-[#1fbb32]" /> Upcoming Exams
            </h3>
            <div className="space-y-4">
              {upcomingExams.map((exam) => (
                <div
                  key={exam.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-100 group hover:border-[#1fbb32]/30 transition-all"
                >
                  <p className="text-[10px] font-bold text-[#1fbb32] uppercase mb-1">
                    {exam.category}
                  </p>
                  <h4 className="text-sm font-bold text-slate-700 mb-3">
                    {exam.title}
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                      <Clock size={12} /> {exam.time}
                    </div>
                    <button className="p-1.5 bg-white rounded-lg shadow-sm group-hover:bg-[#1fbb32] group-hover:text-white transition-all">
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-bold hover:border-[#1fbb32] hover:text-[#1fbb32] transition-all">
              View All Schedule
            </button>
          </div>

          {/* প্রমোশনাল বা হেল্প কার্ড */}
          <div className="bg-[#0f172a] p-6 rounded-2xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold mb-2">Need Help?</h3>
              <p className="text-slate-400 text-xs mb-4">
                Chat with our mentors and get instant support for your exams.
              </p>
              <button className="text-xs font-bold bg-[#1fbb32] px-4 py-2 rounded-lg hover:bg-[#19a32b]">
                Contact Mentor
              </button>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#1fbb32]/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
