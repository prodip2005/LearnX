'use client';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import {
  Trash2,
  Eye,
  Search,
  Mail,
  Calendar,
  ShieldCheck,
  X,
} from 'lucide-react';
import Image from 'next/image';

const UserManagementClient = ({ initialUsers }) => {
  const [users, setUsers] = useState(initialUsers);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const tabs = [
    { id: 'all', label: 'All Users' },
    { id: 'admin', label: 'Admins' },
    { id: 'teacher', label: 'Teachers' },
    { id: 'student', label: 'Students' },
    { id: 'user', label: 'Normal Users' },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesTab = activeTab === 'all' || user.role === activeTab;
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // রোল আপডেট
  const handleRoleChange = async (id, newRole) => {
    // চেক: যদি অন্তত একজন অ্যাডমিন রাখার প্রয়োজন হয়
    const currentAdmins = users.filter((u) => u.role === 'admin');
    const userToChange = users.find((u) => u._id === id);

    if (
      userToChange?.role === 'admin' &&
      newRole !== 'admin' &&
      currentAdmins.length <= 1
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Action Denied',
        text: 'System must have at least one administrator!',
        confirmButtonColor: '#0f172a',
      });
      return;
    }

    const res = await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role: newRole }),
    });

    if (res.ok) {
      setUsers(users.map((u) => (u._id === id ? { ...u, role: newRole } : u)));
      Swal.fire('Updated!', `Role changed to ${newRole}`, 'success');
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This user will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Delete',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          setUsers(users.filter((u) => u._id !== id));
          Swal.fire('Deleted!', 'User removed.', 'success');
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Search and Tabs Layout */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-72">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Quick search..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Profile</th>
                <th className="px-8 py-5">Role Status</th>
                <th className="px-8 py-5">Role Assignment</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      {/* Table Profile Image */}
                      <div className="relative w-11 h-11 shrink-0">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name}
                            fill
                            className="rounded-2xl object-cover border border-slate-100 shadow-sm"
                          />
                        ) : (
                          <div className="w-full h-full rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary border border-primary/5">
                            {user.name?.[0]}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-400 font-medium">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span
                      className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg ${
                        user.role === 'admin'
                          ? 'bg-rose-50 text-rose-600'
                          : user.role === 'teacher'
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-3 py-1.5 outline-none hover:bg-white transition-all cursor-pointer"
                    >
                      <option value="user">Normal User</option>
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-8 py-5 text-right space-x-2">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="p-2.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
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

      {/* Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl relative overflow-hidden animate-in zoom-in duration-300">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-6 right-6 z-20 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all"
            >
              <X size={20} />
            </button>

            <div className="relative pt-16 pb-10 px-8 flex flex-col items-center">
              <div className="relative group">
                <div className="w-32 h-32 rounded-[2.5rem] bg-white p-1.5 shadow-2xl transition-transform group-hover:scale-105 duration-500">
                  {selectedUser.image ? (
                    <div className="relative w-full h-full">
                      <Image
                        fill
                        src={selectedUser.image}
                        alt={selectedUser.name}
                        className="rounded-[2.2rem] object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-[2.2rem] bg-primary flex items-center justify-center text-white text-4xl font-black">
                      {selectedUser.name?.[0]}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 border-4 border-white w-8 h-8 rounded-full shadow-lg flex items-center justify-center text-white">
                  <ShieldCheck size={14} />
                </div>
              </div>

              <div className="text-center mt-6">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-none">
                  {selectedUser.name}
                </h3>
                <div className="mt-3">
                  <span
                    className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                      selectedUser.role === 'admin'
                        ? 'bg-rose-50 border-rose-100 text-rose-600'
                        : selectedUser.role === 'teacher'
                          ? 'bg-indigo-50 border-indigo-100 text-indigo-600'
                          : 'bg-blue-50 border-blue-100 text-blue-600'
                    }`}
                  >
                    {selectedUser.role}
                  </span>
                </div>
              </div>

              <div className="w-full mt-10 space-y-3">
                <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-[1.8rem] border border-slate-100/50 hover:bg-white hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
                    <Mail size={18} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-black uppercase text-slate-400">
                      Email Address
                    </p>
                    <p className="text-sm font-bold text-slate-700 truncate">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-[1.8rem] border border-slate-100/50 hover:bg-white hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">
                      System ID
                    </p>
                    <p className="text-[11px] font-mono font-bold text-slate-500 uppercase">
                      {selectedUser._id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-[1.8rem] border border-slate-100/50 hover:bg-white hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">
                      Registration Date
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {new Date(selectedUser.createdAt).toLocaleDateString(
                        'en-GB',
                        { day: 'numeric', month: 'long', year: 'numeric' },
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="w-full mt-10 bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] hover:bg-black transition-all shadow-xl shadow-slate-200"
              >
                Confirm & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};;

export default UserManagementClient;
