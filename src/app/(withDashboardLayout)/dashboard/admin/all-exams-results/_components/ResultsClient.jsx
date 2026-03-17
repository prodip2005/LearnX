'use client';
import React, { useState } from 'react';
import {
  Search,
  Trash2,
  User,
  Mail,
  Book,
  Trophy,
  Calendar,
  AlertTriangle,
  Filter,
} from 'lucide-react';
import Swal from 'sweetalert2';

const ResultsClient = ({ initialResults }) => {
  const [results, setResults] = useState(initialResults);
  const [searchTerm, setSearchTerm] = useState('');

  // সার্চ লজিক (নাম, ইমেইল বা সাবজেক্ট দিয়ে)
  const filteredResults = results.filter(
    (res) =>
      res.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.studentEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.examSubject?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // সিঙ্গেল ডিলিট
  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Delete this record?',
      text: "You won't be able to revert this student's score!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      confirmButtonText: 'Yes, delete',
    }).then(async (choice) => {
      if (choice.isConfirmed) {
        const res = await fetch(`/api/exams/submit?id=${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setResults(results.filter((r) => r._id !== id));
          Swal.fire('Deleted!', 'Record removed.', 'success');
        }
      }
    });
  };

  // সব ডিলিট
  const handleDeleteAll = async () => {
    Swal.fire({
      title: 'Clear All Results?',
      text: "This will wipe out every student's score from the database!",
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, WIPE ALL',
    }).then(async (choice) => {
      if (choice.isConfirmed) {
        const res = await fetch(`/api/exams/submit?all=true`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setResults([]);
          Swal.fire('Cleared!', 'All results have been wiped.', 'success');
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="bg-white p-5 rounded-[2.5rem] border border-primary/10 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by student, email or subject..."
            className="w-full pl-12 pr-4 py-3 bg-primary/5 border border-primary/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold text-slate-700"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={handleDeleteAll}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all active:scale-95"
        >
          <AlertTriangle size={16} />
          Clear All Records
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-primary/10 shadow-md shadow-primary/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Student</th>
                <th className="px-8 py-5">Exam Details</th>
                <th className="px-8 py-5 text-center">Score</th>
                <th className="px-8 py-5">Submission Date</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {filteredResults.map((result) => (
                <tr
                  key={result._id}
                  className="hover:bg-primary/5 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs border border-primary/20">
                        {result.studentName?.[0]}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-sm tracking-tight capitalize">
                          {result.studentName}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold">
                          {result.studentEmail}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs font-black text-slate-700 uppercase">
                      {result.examSubject}
                    </p>
                    <p className="text-[9px] text-primary font-bold">
                      Code: {result.roomCode}
                    </p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1.5 font-black text-slate-800 text-base">
                        <Trophy size={14} className="text-primary" />
                        {result.totalMark}{' '}
                        <span className="text-slate-300 text-xs font-bold">
                          / {result.totalQuestions}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                      <Calendar size={12} className="text-primary/40" />
                      {new Date(result.submittedAt).toLocaleDateString(
                        'en-GB',
                        { day: 'numeric', month: 'short', year: 'numeric' },
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button
                      onClick={() => handleDelete(result._id)}
                      className="p-2.5 text-rose-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all shadow-sm"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredResults.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/10">
                <Filter className="text-primary/20" size={30} />
              </div>
              <p className="text-primary/40 font-black text-[10px] uppercase tracking-widest">
                No matching results found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsClient;
