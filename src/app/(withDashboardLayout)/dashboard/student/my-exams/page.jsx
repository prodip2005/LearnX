'use client';
import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase.init';
import { onAuthStateChanged } from 'firebase/auth';
import {
  Loader2,
  BookOpen,
  CheckCircle2,
  Clock,
  User,
  Hash,
  Trophy,
  CalendarDays,
} from 'lucide-react';
import StudentRoute from '@/components/StudentRoute';

const StudentExams = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [allExams, setAllExams] = useState([]);
  const [joinedExams, setJoinedExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) fetchData(user.email);
    });
    return () => unsubscribe();
  }, []);

  const fetchData = async (email) => {
    try {
      setLoading(true);
      const resAll = await fetch('/api/exams/create');
      const dataAll = await resAll.json();

      const resJoined = await fetch(`/api/exams/submit?email=${email}`);
      const dataJoined = await resJoined.json();

      if (dataAll.success) setAllExams(dataAll.data);
      if (dataJoined.success) setJoinedExams(dataJoined.data);
    } catch (err) {
      console.error('Data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );

  return (
    <StudentRoute>
      <div className="p-6 md:p-10 bg-[#f9fafb] min-h-screen font-sans">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Student Dashboard
          </h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">
            Academic Progress & Exams
          </p>
        </div>

        {/* Tabs Design */}
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 w-fit mb-8 shadow-sm">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300
          ${
            activeTab === 'all'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'text-slate-500 hover:bg-slate-50'
          }`}
          >
            <BookOpen size={16} /> All Available Exams
          </button>

          <button
            onClick={() => setActiveTab('joined')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300
          ${
            activeTab === 'joined'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'text-slate-500 hover:bg-slate-50'
          }`}
          >
            <CheckCircle2 size={16} /> My Results ({joinedExams.length})
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {activeTab === 'all' ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-slate-50">
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                      Exam Title
                    </th>
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                      Category
                    </th>
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                      Duration
                    </th>
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                      Created Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allExams.map((exam) => (
                    <tr
                      key={exam._id}
                      className="border-b border-slate-50 last:border-0 hover:bg-[#f0fdf4]/30 transition-colors group"
                    >
                      <td className="p-5">
                        <div className="font-bold text-slate-700 group-hover:text-primary transition-colors">
                          {exam.examTitle || exam.roomTitle}
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[11px] font-bold">
                          {exam.category || 'Science'}
                        </span>
                      </td>
                      <td className="p-5 text-sm text-slate-600 font-medium">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-slate-300" />{' '}
                          {exam.duration}
                        </div>
                      </td>
                      <td className="p-5 text-sm text-slate-500 font-medium">
                        <div className="flex items-center gap-2">
                          <CalendarDays size={14} className="text-slate-300" />
                          {new Date(exam.createdAt).toLocaleDateString(
                            'en-GB',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            },
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-slate-50">
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                      Exam Subject
                    </th>
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                      Teacher
                    </th>

                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                      Final Score
                    </th>
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                      Verification
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {joinedExams.map((result) => (
                    <tr
                      key={result._id}
                      className="border-b border-slate-50 last:border-0 hover:bg-[#f0fdf4]/30 transition-colors group"
                    >
                      <td className="p-5">
                        <div className="font-bold text-slate-700">
                          {result.examSubject}
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                          <User size={14} className="text-slate-300" />{' '}
                          {result.teacherEmail}
                        </div>
                      </td>

                      <td className="p-5">
                        <div className="flex items-center gap-2 font-black text-slate-800">
                          <Trophy size={16} className="text-primary" />
                          {result.totalMark}{' '}
                          <span className="text-slate-300 font-bold">
                            / {result.totalQuestions}
                          </span>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase bg-primary/5 w-fit px-3 py-1 rounded-full border border-primary/10">
                          <CheckCircle2 size={12} /> Verified
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Empty State Design */}
        {((activeTab === 'all' && allExams.length === 0) ||
          (activeTab === 'joined' && joinedExams.length === 0)) && (
          <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-[2rem] mt-8">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Hash className="text-slate-200" size={30} />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
              No data recorded yet
            </p>
          </div>
        )}
      </div>
    </StudentRoute>
  );
};

export default StudentExams;
