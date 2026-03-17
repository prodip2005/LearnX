'use client';
import React, { useState } from 'react';
import {
  Eye,
  FileText,
  User,
  Award,
  Search,
  X,
  Trash2,
  Hash,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import Swal from 'sweetalert2';

const AllExamsClient = ({ initialExams, allResults }) => {
  const [exams, setExams] = useState(initialExams);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExamResults, setSelectedExamResults] = useState(null);

  // সার্চ ফিল্টার
  const filteredExams = exams.filter(
    (exam) =>
      exam.roomTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.roomCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.teacherEmail?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // ১. সিঙ্গেল এক্সাম ডিলিট
  const handleDeleteExam = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently remove this exam and its results!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6', // Primary Color
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch(`/api/exams/create?id=${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setExams(exams.filter((e) => e._id !== id));
          Swal.fire('Deleted!', 'Exam room has been removed.', 'success');
        }
      }
    });
  };

  // ২. সব এক্সাম ডিলিট (Delete All)
  const handleDeleteAll = async () => {
    Swal.fire({
      title: 'Delete All Records?',
      text: 'Warning: This will wipe out ALL exams and student results! This action cannot be undone.',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', // Danger Red
      cancelButtonColor: '#3b82f6',
      confirmButtonText: 'Yes, WIPE EVERYTHING',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch(`/api/exams/create?all=true`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setExams([]);
          Swal.fire('Wiped!', 'Database has been cleared.', 'success');
        }
      }
    });
  };

  const handleViewDetails = (roomCode, roomTitle) => {
    const examResults = allResults.filter((r) => r.roomCode === roomCode);
    setSelectedExamResults({
      title: roomTitle,
      code: roomCode,
      data: examResults,
    });
  };

  return (
    <div className="space-y-6">
      {/* Action Bar: Search & Delete All */}
      <div className="bg-white p-5 rounded-[2.5rem] border border-primary/10 shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40"
            size={18}
          />
          <input
            type="text"
            placeholder="Search exams..."
            className="w-full pl-12 pr-4 py-3 bg-primary/5 border border-primary/10 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold text-slate-700"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="hidden md:flex px-4 py-2 bg-primary/5 rounded-xl border border-primary/5 items-center gap-2">
            <Activity size={14} className="text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">
              Total: {exams.length} Rooms
            </span>
          </div>

          <button
            onClick={handleDeleteAll}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-95"
          >
            <AlertTriangle size={16} />
            Wipe All Data
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-primary/10 shadow-md shadow-primary/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Exam Details</th>
                <th className="px-8 py-5">Instructor</th>
                <th className="px-8 py-5">Room Access</th>
                <th className="px-8 py-5">Live Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {filteredExams.map((exam) => (
                <tr
                  key={exam._id}
                  className="hover:bg-primary/5 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-black shadow-lg shadow-primary/30">
                        {exam.roomTitle?.[0]}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-sm italic uppercase tracking-tight">
                          {exam.roomTitle}
                        </p>
                        <p className="text-[10px] text-primary font-bold uppercase">
                          {exam.questions?.length} Questions
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-xs font-bold text-slate-500">
                    {exam.teacherEmail}
                  </td>
                  <td className="px-8 py-5">
                    <span className="font-mono font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg text-xs border border-primary/5">
                      {exam.roomCode}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span
                      className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border ${
                        exam.exam
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-rose-50 text-rose-500 border-rose-100'
                      }`}
                    >
                      {exam.exam ? '● Online' : '○ Closed'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right flex justify-end gap-3">
                    <button
                      onClick={() =>
                        handleViewDetails(exam.roomCode, exam.roomTitle)
                      }
                      className="p-2.5 text-primary/60 hover:text-primary hover:bg-primary/10 rounded-xl transition-all shadow-sm"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteExam(exam._id)}
                      className="p-2.5 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Modal */}
      {selectedExamResults && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden relative animate-in zoom-in duration-300 border border-primary/10">
            <div className="p-8 border-b border-primary/5 flex justify-between items-center bg-primary/5">
              <div>
                <h3 className="text-xl font-black text-primary tracking-tight">
                  {selectedExamResults.title}
                </h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                  <Hash size={12} className="text-primary" />{' '}
                  {selectedExamResults.code} • {selectedExamResults.data.length}{' '}
                  Submissions
                </p>
              </div>
              <button
                onClick={() => setSelectedExamResults(null)}
                className="p-2.5 bg-white shadow-sm border border-primary/10 rounded-full hover:bg-primary hover:text-white transition-all text-primary"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 max-h-[60vh] overflow-y-auto space-y-3">
              {selectedExamResults.data.length > 0 ? (
                selectedExamResults.data.map((result, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-5 bg-white border border-primary/10 rounded-[1.8rem] group hover:bg-primary/[0.02] hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary text-white shadow-md flex items-center justify-center font-black">
                        {result.studentName?.[0]}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-sm uppercase">
                          {result.studentName}
                        </p>
                        <p className="text-[10px] text-primary font-bold">
                          {result.studentEmail}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Award size={18} className="text-primary" />
                        <p className="text-xl font-black text-slate-800">
                          {result.totalMark}
                          <span className="text-primary/30 text-xs ml-1">
                            / {result.totalQuestions}
                          </span>
                        </p>
                      </div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                        {new Date(result.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/10">
                    <FileText className="text-primary/20" size={32} />
                  </div>
                  <p className="text-primary/40 font-black text-[10px] uppercase tracking-[0.2em]">
                    No Submissions Found
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 bg-primary/5 border-t border-primary/5 flex justify-center">
              <button
                onClick={() => setSelectedExamResults(null)}
                className="px-12 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
              >
                Close Records
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllExamsClient;
