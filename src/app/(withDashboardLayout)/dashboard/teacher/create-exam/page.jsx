'use client';
import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Filter,
  MoreVertical,
  Calendar,
  Users,
  Eye,
} from 'lucide-react';
import Link from 'next/link';

const CreateExam = () => {
  // ফাংশনের নাম পরিবর্তন করা হলো
  const [examList] = useState([
    {
      id: 1,
      name: 'Advanced Physics - Midterm',
      category: 'Science',
      date: '2024-10-25',
      students: 45,
      status: 'Active',
    },
    {
      id: 2,
      name: 'Organic Chemistry Quiz',
      category: 'Science',
      date: '2024-10-20',
      students: 38,
      status: 'Completed',
    },
    {
      id: 3,
      name: 'Basic Algebra Mock',
      category: 'Mathematics',
      date: '2024-10-15',
      students: 52,
      status: 'Draft',
    },
    {
      id: 4,
      name: 'English Literature Final',
      category: 'Literature',
      date: '2024-10-10',
      students: 30,
      status: 'Completed',
    },
  ]);

  return (
    // এখানে w-full ব্যবহার করা হয়েছে যাতে ডানে ফাঁকা না থাকে
    <div className="p-6 md:p-10 w-full bg-[#f9fafb] min-h-screen space-y-8">
      {/* ১. হেডার সেকশন */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Create Exam
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage and monitor all your examination rooms.
          </p>
        </div>

        <Link
          href="/dashboard/teacher/create-exam/new"
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all"
        >
          <Plus size={18} /> New Exam Room
        </Link>
      </div>

      {/* ২. ফিল্টার এবং সার্চ বার */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search exams..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-primary transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Filter size={16} /> Filter
          </button>
          <select className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 outline-none cursor-pointer">
            <option>All Status</option>
            <option>Active</option>
            <option>Completed</option>
            <option>Draft</option>
          </select>
        </div>
      </div>

      {/* ৩. এক্সাম লিস্ট গ্রিড (বড় স্ক্রিনে ৪ কলাম করা হয়েছে) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {examList.map((exam) => (
          <div
            key={exam.id}
            className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:border-primary/30 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center">
                <FileText size={24} />
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${
                    exam.status === 'Active'
                      ? 'bg-green-100 text-green-600'
                      : exam.status === 'Completed'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {exam.status}
                </span>
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            <h3 className="font-bold text-slate-800 mb-1 group-hover:text-primary transition-colors line-clamp-1">
              {exam.name}
            </h3>
            <p className="text-xs text-slate-400 font-medium mb-4">
              {exam.category}
            </p>

            <div className="grid grid-cols-2 gap-2 py-4 border-t border-slate-50">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Calendar size={13} className="text-primary" />
                <span className="text-[11px] font-semibold">{exam.date}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <Users size={13} className="text-primary" />
                <span className="text-[11px] font-semibold">
                  {exam.students} Students
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-all">
                <Eye size={14} /> Details
              </button>
              {exam.status === 'Active' && (
                <button className="px-3 py-2.5 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary hover:text-white transition-all">
                  Results
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateExam;
