'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, Mail, Award, ChevronLeft, Search } from 'lucide-react';
import Link from 'next/link';
import TeacherRoute from '@/components/TeacherRoute';

const ExamResult = () => {
  const searchParams = useSearchParams();
  const questionId = searchParams.get('id'); // URL থেকে ইউনিক প্রশ্ন আইডি নেওয়া
  const roomCode = searchParams.get('room'); // দেখানোর জন্য রুম কোড

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (questionId) {
      fetchResults();
    }
  }, [questionId]);

  const fetchResults = async () => {
    try {
      const res = await fetch(`/api/exams/submit`);
      const data = await res.json();
      if (data.success) {
        // প্রশ্নপত্রের ইউনিক ID (questionID) দিয়ে ফিল্টার করা হচ্ছে
        const filteredResults = data.data.filter(
          (res) => res.questionID === questionId,
        );
        setResults(filteredResults);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBySearch = results.filter(
    (item) =>
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="mt-4 text-slate-500 font-bold uppercase text-[10px] tracking-widest">
          Loading Results...
        </p>
      </div>
    );

  return (
    <TeacherRoute>
      <div className="p-6 md:p-12 bg-[#fcfcfd] min-h-screen">
        <div className="mx-auto">
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <Link
                href="/dashboard/teacher/my-exams"
                className="flex items-center gap-2 text-primary font-bold text-sm mb-4 hover:underline"
              >
                <ChevronLeft size={16} /> Back to Exams
              </Link>
              <h1 className="text-3xl font-black text-slate-900">
                Exam <span className="text-primary">Results</span>
              </h1>
              <p className="text-slate-500 font-medium">
                Room Code:{' '}
                <span className="font-black text-slate-700">{roomCode}</span>
              </p>
            </div>

            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by student name..."
                className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-primary w-full md:w-80 transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {filteredBySearch.length > 0 ? (
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                        Student Information
                      </th>
                      <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                        Score
                      </th>
                      <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                        Performance
                      </th>
                      <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                        Submitted At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBySearch.map((res, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold uppercase">
                              {res.studentName?.charAt(0) || 'S'}
                            </div>
                            <div>
                              <p className="font-black text-slate-800">
                                {res.studentName}
                              </p>
                              <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                <Mail size={12} /> {res.studentEmail}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-black text-slate-800">
                              {res.totalMark}
                            </span>
                            <span className="text-slate-300 font-bold">/</span>
                            <span className="text-slate-400 font-bold">
                              {res.totalQuestions}
                            </span>
                          </div>
                        </td>
                        <td className="p-6">
                          {(() => {
                            const percentage =
                              (res.totalMark / res.totalQuestions) * 100;
                            let color = 'bg-red-500';
                            if (percentage >= 80) color = 'bg-green-500';
                            else if (percentage >= 50) color = 'bg-yellow-500';

                            return (
                              <div className="flex flex-col gap-1 w-32">
                                <div className="flex justify-between text-[10px] font-black uppercase">
                                  <span className="text-slate-400">Score</span>
                                  <span className="text-slate-700">
                                    {percentage.toFixed(0)}%
                                  </span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${color}`}
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })()}
                        </td>
                        <td className="p-6 text-slate-500 text-xs font-bold">
                          {new Date(res.submittedAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
              <Award className="mx-auto text-slate-200 mb-4" size={60} />
              <h3 className="text-xl font-black text-slate-800">
                No Participations Yet
              </h3>
              <p className="text-slate-400 font-medium">
                Students who take the exam will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </TeacherRoute>
  );
};

export default ExamResult;
