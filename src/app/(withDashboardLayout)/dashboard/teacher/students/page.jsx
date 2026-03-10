'use client';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  UserCheck,
  UserMinus,
  Users,
  Clock,
  Eye,
  X,
  Mail,
  Phone,
  School,
  Hash,
} from 'lucide-react';

const AllStudents = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/become-student/manage');
      const data = await res.json();
      if (data.success) {
        setStudents(data.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
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
        Swal.fire({
          title: 'Approved!',
          text: 'Student access has been granted.',
          icon: 'success',
          confirmButtonColor: '#1fbb32',
        });
        fetchStudents();
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to accept', 'error');
    }
  };

  const handleReject = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, remove it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/become-student/manage?id=${id}`, {
            method: 'DELETE',
          });
          if (res.ok) {
            Swal.fire('Deleted', 'Record has been removed.', 'success');
            fetchStudents();
          }
        } catch (error) {
          Swal.fire('Error', 'Failed to delete', 'error');
        }
      }
    });
  };

  const filteredStudents =
    activeTab === 'all'
      ? students.filter((s) => s.status === true)
      : students.filter((s) => s.status === false);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1fbb32]"></div>
      </div>
    );

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
          Student Management
        </h1>
        <p className="text-slate-500 text-sm">
          Review applications and manage your current student list.
        </p>
      </div>

      {/* Modern Tab Navigation */}
      <div className="flex p-1.5 bg-slate-200/50 rounded-2xl w-fit mb-8 backdrop-blur-sm">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
            activeTab === 'all'
              ? 'bg-white text-[#1fbb32] shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users size={18} />
          Current Students
          <span
            className={`ml-1.5 px-2 py-0.5 rounded-md text-[10px] ${activeTab === 'all' ? 'bg-[#1fbb32]/10 text-[#1fbb32]' : 'bg-slate-300 text-slate-600'}`}
          >
            {students.filter((s) => s.status === true).length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('applied')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
            activeTab === 'applied'
              ? 'bg-white text-[#1fbb32] shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Clock size={18} />
          Pending Applications
          <span
            className={`ml-1.5 px-2 py-0.5 rounded-md text-[10px] ${activeTab === 'applied' ? 'bg-[#1fbb32]/10 text-[#1fbb32]' : 'bg-slate-300 text-slate-600'}`}
          >
            {students.filter((s) => s.status === false).length}
          </span>
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Student Information
                </th>
                <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Class / Dept
                </th>
                <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Status
                </th>
                <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.map((student) => (
                <tr
                  key={student._id}
                  className="group hover:bg-[#f0fdf4]/30 transition-all duration-300"
                >
                  <td className="p-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700 group-hover:text-[#1fbb32] transition-colors">
                        {student.fullName}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail size={12} /> {student.email}
                      </span>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-600">
                        Class {student.currentClass}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">
                        {student.department || 'General'}
                      </span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        student.status
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-amber-100 text-amber-600'
                      }`}
                    >
                      {student.status ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="p-2.5 bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-500 rounded-xl transition-all shadow-sm"
                      >
                        <Eye size={18} />
                      </button>
                      {activeTab === 'applied' && (
                        <button
                          onClick={() => handleAccept(student._id)}
                          className="p-2.5 bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl transition-all shadow-sm"
                        >
                          <UserCheck size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleReject(student._id)}
                        className="p-2.5 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"
                      >
                        <UserMinus size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredStudents.length === 0 && (
          <div className="py-20 text-center">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-slate-300" size={32} />
            </div>
            <p className="text-slate-400 font-medium">
              No records found in this category.
            </p>
          </div>
        )}
      </div>

      {/* Detailed Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={() => setSelectedStudent(null)}
          />
          <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 animate-in fade-in zoom-in duration-300 border border-white">
            <div className="h-32 bg-gradient-to-br from-[#1fbb32] to-[#16a34a] p-8 flex items-end relative">
              <button
                onClick={() => setSelectedStudent(null)}
                className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-all"
              >
                <X size={20} />
              </button>
              <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-[#1fbb32] absolute -bottom-10 left-8 border-4 border-white">
                <Users size={36} strokeWidth={2.5} />
              </div>
            </div>

            <div className="p-8 pt-14">
              <h2 className="text-2xl font-black text-slate-800">
                {selectedStudent.fullName}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-[#1fbb32] animate-pulse"></span>
                <span className="text-xs font-bold text-[#1fbb32] uppercase tracking-widest">
                  {selectedStudent.role}
                </span>
              </div>

              <div className="mt-8 space-y-5">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#1fbb32]/10 group-hover:text-[#1fbb32] transition-all">
                    <School size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      Institution
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {selectedStudent.institution}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#1fbb32]/10 group-hover:text-[#1fbb32] transition-all">
                      <Hash size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        Class
                      </p>
                      <p className="text-sm font-bold text-slate-700">
                        {selectedStudent.currentClass}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#1fbb32]/10 group-hover:text-[#1fbb32] transition-all">
                      <Users size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        Dept
                      </p>
                      <p className="text-sm font-bold text-slate-700">
                        {selectedStudent.department || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#1fbb32]/10 group-hover:text-[#1fbb32] transition-all">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      Contact
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {selectedStudent.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#1fbb32]/10 group-hover:text-[#1fbb32] transition-all">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      Email
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {selectedStudent.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Date Applied:{' '}
                  {new Date(selectedStudent.appliedAt).toLocaleDateString()}
                </span>
                {activeTab === 'applied' && (
                  <button
                    onClick={() => {
                      handleAccept(selectedStudent._id);
                      setSelectedStudent(null);
                    }}
                    className="bg-[#1fbb32] text-white px-5 py-2 rounded-xl text-xs font-black shadow-lg shadow-[#1fbb32]/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    Approve Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllStudents;
