'use client';
import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase.init';
import { onAuthStateChanged } from 'firebase/auth';
import Swal from 'sweetalert2';
import {
  Trash2,
  BookOpen,
  Layers,
  Calendar,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

const AllExamsByTheTeacher = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // ইউজারের লগইন স্ট্যাটাস এবং ডাটা ফেচ করা
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchExams(currentUser.email);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // টিচারের ইমেইল দিয়ে এপিআই থেকে ডাটা আনা
  const fetchExams = async (email) => {
    try {
      // পাথ আপনার এপিআই ডিরেক্টরি অনুযায়ী দেওয়া হয়েছে
      const res = await fetch(`/api/exams/create?email=${email}`);
      const data = await res.json();
      if (data.success) {
        setExams(data.data);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  // এক্সাম ডিলিট করার ফাংশন
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This exam room will be deleted forever!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/exams/create?id=${id}`, {
          method: 'DELETE',
        });
        const data = await res.json();

        if (data.success) {
          setExams(exams.filter((exam) => exam._id !== id));
          Swal.fire('Deleted!', 'Exam room has been removed.', 'success');
        }
      } catch (error) {
        Swal.fire('Error', 'Failed to delete. Try again.', 'error');
      }
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-[#1fbb32] mb-2" size={32} />
        <p className="text-slate-500 font-medium italic">
          Loading your classrooms...
        </p>
      </div>
    );

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Teacher's Desk
          </h1>
          <p className="text-slate-500">
            Manage and monitor all your created exam rooms.
          </p>
        </div>
      </div>

      {/* Exam Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <div
            key={exam._id}
            className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-[#1fbb32]/10 transition-all duration-500 group relative"
          >
            {/* Room Code Badge */}
            <div className="absolute top-6 right-20 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
              Code: {exam.roomCode}
            </div>

            <div className="p-8 pb-0 flex justify-between items-start">
              <div className="w-14 h-14 bg-[#1fbb32]/10 text-[#1fbb32] rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <BookOpen size={28} />
              </div>
              <button
                onClick={() => handleDelete(exam._id)}
                className="p-2.5  text-red-300 hover:text-red-500 hover:bg-red-50 bg-red-50 rounded-xl transition-all"
                title="Delete Room"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="p-8">
              <h3 className="text-xl font-black text-slate-800 mb-2 line-clamp-1 group-hover:text-[#1fbb32] transition-colors">
                {exam.examTitle}
              </h3>
              <p className="text-xs text-slate-400 font-bold mb-6 flex items-center gap-1 uppercase">
                <Calendar size={14} /> Created:{' '}
                {new Date(exam.createdAt).toLocaleDateString()}
              </p>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl mb-6">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Class
                  </p>
                  <p className="font-black text-slate-700">
                    {exam.targetClass}
                  </p>
                </div>
                <div className="w-[1px] h-8 bg-slate-200" />
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Questions
                  </p>
                  <p className="font-black text-slate-700">
                    {exam.questions?.length || 0}
                  </p>
                </div>
              </div>

              <button className="w-full py-4 bg-white text-slate-700 rounded-2xl font-black text-xs hover:bg-slate-900 hover:text-white transition-all border-2 border-slate-100 flex items-center justify-center gap-2 group/btn shadow-sm">
                VIEW RESULTS{' '}
                <ExternalLink
                  size={14}
                  className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform"
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {exams.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <Layers size={32} />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">
            No exam rooms found
          </p>
          <p className="text-slate-400 text-xs mt-1">
            Start by creating your first exam room.
          </p>
        </div>
      )}
    </div>
  );
};

export default AllExamsByTheTeacher;
