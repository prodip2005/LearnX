'use client';
import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Trophy,
  Clock,
  Calendar,
  PlayCircle,
  Loader2,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';
import StudentRoute from '@/components/StudentRoute';
import { auth } from '@/lib/firebase.init';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // ১. ফায়ারবেস থেকে বর্তমান ইউজার চেক করা
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchStudentStats(currentUser.email);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // ২. এপিআই থেকে স্টুডেন্টের রেজাল্ট ডাটা ফেচ করা
  const fetchStudentStats = async (email) => {
    try {
      const res = await fetch(`/api/exams/submit?email=${email}`);
      const json = await res.json();
      if (json.success) {
        setResults(json.data);
      }
    } catch (error) {
      console.error('Error fetching student stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // ৩. ডাইনামিক ক্যালকুলেশনস
  const totalExams = results.length;

  const avgScore =
    totalExams > 0
      ? Math.round(
          results.reduce(
            (acc, curr) => acc + (curr.totalMark / curr.totalQuestions) * 100,
            0,
          ) / totalExams,
        )
      : 0;

  const lastExam = results.length > 0 ? results[0] : null;

  const stats = [
    {
      title: 'Passed Exams',
      value: loading
        ? '...'
        : results
            .filter((r) => r.totalMark / r.totalQuestions >= 0.4)
            .length.toString()
            .padStart(2, '0'),
      icon: <CheckCircle2 className="text-primary" size={24} />,
      bg: 'bg-primary-light',
    },
    {
      title: 'Avg. Score',
      value: loading ? '...' : `${avgScore}%`,
      icon: <Trophy className="text-orange-600" size={24} />,
      bg: 'bg-orange-50',
    },
    {
      title: 'Latest Score',
      value: loading
        ? '...'
        : lastExam
          ? `${lastExam.totalMark}/${lastExam.totalQuestions}`
          : 'N/A',
      icon: <Clock className="text-purple-600" size={24} />,
      bg: 'bg-purple-50',
    },
   
  ];

  if (loading && !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary mb-4" size={50} />
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  return (
    <StudentRoute>
      <div className="p-6 md:p-10 bg-[#f9fafb] min-h-screen space-y-10">
        {/* --- স্বাগতম সেকশন --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
              Welcome,{' '}
              <span className="text-primary italic">
                {user?.displayName?.split(' ')[0] || 'Scholar'}!
              </span>
            </h1>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-tighter opacity-70">
              {totalExams > 0
                ? `You have successfully completed ${totalExams} examinations.`
                : 'Your academic journey starts here. Join your first exam!'}
            </p>
          </div>
          <Link href="/exams">
            <button className="bg-primary text-white px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.15em] shadow-2xl shadow-primary/30 hover:bg-primary-hover transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3">
              Join New Exam <PlayCircle size={20} />
            </button>
          </Link>
        </div>

        {/* --- স্ট্যাটাস কার্ডস --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all duration-500"
            >
              <div
                className={`w-16 h-16 rounded-[1.2rem] ${stat.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}
              >
                {stat.icon}
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                {stat.title}
              </p>
              <h3 className="text-3xl font-black text-slate-800 italic tracking-tighter">
                {stat.value}
              </h3>
            </div>
          ))}
        </div>

        {/* --- কন্টেন্ট এরিয়া --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-black text-slate-800 text-xl tracking-tight italic">
                  Recent Performance
                </h3>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Live Updates
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                {results.length > 0 ? (
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                      <tr>
                        <th className="px-10 py-6">Subject / Date</th>
                        <th className="px-10 py-6">Marks Obtained</th>
                        <th className="px-10 py-6">Result Status</th>
                        <th className="px-10 py-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {results.slice(0, 5).map((result, idx) => (
                        <tr
                          key={idx}
                          className="group hover:bg-slate-50/30 transition-all"
                        >
                          <td className="px-10 py-7">
                            <p className="font-black text-slate-700 text-base italic group-hover:text-primary transition-colors leading-none">
                              {result.examSubject}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 mt-2 flex items-center gap-1.5 uppercase tracking-tighter">
                              <Calendar size={12} className="text-primary" />{' '}
                              {new Date(result.submittedAt).toLocaleDateString(
                                'en-GB',
                                {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                },
                              )}
                            </p>
                          </td>
                          <td className="px-10 py-7">
                            <div className="flex items-center gap-3">
                              <span className="text-lg font-black text-slate-800">
                                {result.totalMark}
                              </span>
                              <span className="text-slate-300 font-bold">
                                /
                              </span>
                              <span className="text-sm font-bold text-slate-400">
                                {result.totalQuestions}
                              </span>
                            </div>
                          </td>
                          <td className="px-10 py-7">
                            <span
                              className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-2 ${
                                result.totalMark / result.totalQuestions >= 0.4
                                  ? 'bg-primary/10 text-primary'
                                  : 'bg-red-50 text-red-500'
                              }`}
                            >
                              {result.totalMark / result.totalQuestions >= 0.4
                                ? 'PASSED'
                                : 'FAILED'}
                            </span>
                          </td>
                          <td className="px-10 py-7 text-right">
                            <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm group/btn">
                              <ArrowUpRight size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-24 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <BookOpen className="text-slate-200" size={32} />
                    </div>
                    <p className="text-slate-400 font-bold italic">
                      No exam history found.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-[#0f172a] p-10 rounded-2xl text-white relative overflow-hidden group shadow-2xl shadow-slate-200">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center mb-8">
                  <Trophy className="text-primary" size={28} />
                </div>
                <h3 className="font-black text-2xl mb-4 tracking-tight leading-tight italic">
                  Reach for the <br /> Top 1%
                </h3>
                <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed opacity-80">
                  Your current average is{' '}
                  <span className="text-primary font-black">{avgScore}%</span>.
                  Students with 90%+ score get exclusive platform rewards!
                </p>
                <button className="w-full py-4 bg-primary text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-primary-hover transition-all shadow-lg shadow-primary/20">
                  Contact Mentor
                </button>
              </div>
              <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-primary opacity-10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-700"></div>
            </div>

            <div className="p-8 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <h4 className="font-black text-slate-800 text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-primary" /> Quick Tip
              </h4>
              <p className="text-slate-500 text-xs font-medium leading-relaxed italic">
                "Consistent practice is the key to mastering any subject. Try to
                review your mistakes after every exam."
              </p>
            </div>
          </div>
        </div>
      </div>
    </StudentRoute>
  );
};

export default StudentDashboard;
