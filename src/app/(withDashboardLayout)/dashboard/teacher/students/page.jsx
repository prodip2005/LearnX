'use client';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  UserCheck,
  UserMinus,
  Users,
  Eye,
  X,
  Mail,
  Phone,
  School,
  BookOpen,
  Calendar,
  Building,
} from 'lucide-react';
import TeacherRoute from '@/components/TeacherRoute';

const AllStudents = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null); // মোডাল কন্ট্রোল করবে

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/become-student/manage');
      const data = await res.json();
      if (data.success) setStudents(data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAccept = async (id) => {
    try {
      const res = await fetch(`/api/become-student/manage?id=${id}`, {
        method: 'PATCH',
      });
      if (res.ok) {
        Swal.fire('Approved!', 'User role updated to student.', 'success');
        fetchStudents();
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to update', 'error');
    }
  };

  const handleReject = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Application will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove',
    });

    if (result.isConfirmed) {
      const res = await fetch(`/api/become-student/manage?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        Swal.fire('Deleted!', 'Record removed.', 'success');
        fetchStudents();
        setSelectedStudent(null); // মোডাল খোলা থাকলে বন্ধ করে দিবে
      }
    }
  };

  const filteredStudents =
    activeTab === 'all'
      ? students.filter((s) => s.status === true)
      : students.filter((s) => s.status === false);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
        <Users className="animate-bounce text-primary mb-4" size={48} />
        <p className="text-slate-400 font-bold animate-pulse">
          Fetching Student Data...
        </p>
      </div>
    );

  return (
    <TeacherRoute>
      <div className="p-8 bg-[#f8fafc] min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Student <span className="text-primary">Management</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Approve or manage students registered in your system.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-200/50 p-1 rounded-2xl w-fit mb-8 border border-slate-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'all' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Active Students
          </button>
          <button
            onClick={() => setActiveTab('applied')}
            className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'applied' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Pending Applications ({students.filter((s) => !s.status).length})
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] font-black uppercase text-slate-400 tracking-[0.15em]">
              <tr>
                <th className="px-8 py-5">Full Name & Email</th>
                <th className="px-8 py-5">Class & Dept</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-20 text-slate-400 font-bold uppercase text-xs tracking-widest"
                  >
                    No Records Found
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr
                    key={student._id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-800 text-[15px]">
                          {student.fullName}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {student.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-700 text-sm">
                          Class {student.currentClass}
                        </span>
                        <span className="text-[10px] font-bold text-primary uppercase">
                          {student.department}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${student.status ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${student.status ? 'bg-emerald-500' : 'bg-orange-500'}`}
                        />
                        {student.status ? 'Verified' : 'Reviewing'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="p-2.5 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        {activeTab === 'applied' && (
                          <button
                            onClick={() => handleAccept(student._id)}
                            className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                            title="Approve Student"
                          >
                            <UserCheck size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleReject(student._id)}
                          className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          title="Remove/Reject"
                        >
                          <UserMinus size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- Student Details Modal --- */}
        {selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
              onClick={() => setSelectedStudent(null)}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
              {/* Modal Header */}
              <div className="bg-slate-900 p-8 text-white relative">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-3xl font-black">
                    {selectedStudent.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight">
                      {selectedStudent.fullName}
                    </h3>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                      {selectedStudent.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1.5">
                      <Mail size={12} /> Email Address
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {selectedStudent.email}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1.5">
                      <Phone size={12} /> Phone Number
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {selectedStudent.phone || 'Not Provided'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1.5">
                      <School size={12} /> Institution
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {selectedStudent.institution}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1.5">
                      <BookOpen size={12} /> Class & Dept
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {selectedStudent.currentClass} (
                      {selectedStudent.department})
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1.5">
                      <Calendar size={12} /> Joined Date
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {new Date(selectedStudent.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1.5">
                      <Building size={12} /> Status
                    </p>
                    <span
                      className={`inline-block mt-1 px-3 py-0.5 rounded-full text-[10px] font-black uppercase ${selectedStudent.status ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}
                    >
                      {selectedStudent.status
                        ? 'Active Student'
                        : 'Under Review'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons in Modal */}
                <div className="pt-6 border-t border-slate-100 flex gap-3">
                  {!selectedStudent.status && (
                    <button
                      onClick={() => handleAccept(selectedStudent._id)}
                      className="flex-1 bg-primary text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                    >
                      Approve Student
                    </button>
                  )}
                  <button
                    onClick={() => handleReject(selectedStudent._id)}
                    className="flex-1 bg-red-50 text-red-500 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                  >
                    Delete Record
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherRoute>
  );
};

export default AllStudents;
