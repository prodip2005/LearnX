'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { auth } from '@/lib/firebase.init'; // আপনার পাথ অনুযায়ী ঠিক করে নিন
import { onAuthStateChanged } from 'firebase/auth';
import {
  User,
  School,
  BookOpen,
  Building2,
  Phone,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';

const BecomeStudent = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // লগইন করা ইউজার রাখার জন্য

  const [formData, setFormData] = useState({
    fullName: '',
    institution: '',
    currentClass: '',
    department: '',
    phone: '',
    agreeToTerms: false,
  });

  // লগইন করা ইউজারের তথ্য চেক করা
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setFormData((prev) => ({
          ...prev,
          fullName: currentUser.displayName || '',
        }));
      } else {
        // যদি লগইন না থাকে তবে লগইন পেজে পাঠিয়ে দেওয়া ভালো
        Swal.fire('Access Denied', 'Please login first!', 'warning');
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agreeToTerms) {
      Swal.fire('Error', 'Please agree to the Terms and Conditions', 'error');
      return;
    }

    if (!user?.email) {
      Swal.fire('Error', 'User email not found. Please re-login.', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/become-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          email: user.email, // এখানে ইউজারের ইমেইলটি যাচ্ছে
          status: false,
          role: 'student',
          appliedAt: new Date(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Swal.fire({
          title: 'Application Sent!',
          text: 'Your application is pending for approval.',
          icon: 'success',
          confirmButtonColor: '#1fbb32',
        });
        router.push('/');
      } else {
        throw new Error(data.message || 'Failed to submit');
      }
    } catch (error) {
      Swal.fire('Error', error.message || 'Something went wrong.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 md:px-0 font-display">
      <div className="max-w-[720px] mx-auto flex flex-col gap-6">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-[#1fbb32]/5 border border-[#1fbb32]/10 overflow-hidden">
          <div className="relative h-40 w-full bg-[#1fbb32]/5 flex items-center px-8 md:px-12 overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-[#0f172a] text-2xl font-black">
                Student Registration
              </h1>
              <p className="text-[#64748b] text-sm">
                Register as a student with{' '}
                <span className="text-[#1fbb32] font-bold">{user?.email}</span>
              </p>
            </div>
            <GraduationCap
              size={100}
              className="absolute right-8 opacity-10 text-[#1fbb32]"
            />
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-8 md:p-12 flex flex-col gap-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-bold text-[#475569] uppercase">
                  Full Name *
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-[#1fbb32] outline-none text-sm"
                    placeholder="e.g. Alex Johnson"
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* School / College */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-bold text-[#475569] uppercase">
                  School / College *
                </label>
                <div className="relative">
                  <School
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    required
                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-[#1fbb32] outline-none text-sm"
                    placeholder="Your Institution"
                    onChange={(e) =>
                      setFormData({ ...formData, institution: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Class Selection */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#475569] uppercase">
                  Class *
                </label>
                <div className="relative">
                  <BookOpen
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <select
                    required
                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-[#1fbb32] outline-none appearance-none bg-white text-sm"
                    onChange={(e) =>
                      setFormData({ ...formData, currentClass: e.target.value })
                    }
                  >
                    <option value="">Select Class</option>
                    {[...Array(12)].map((_, i) => (
                      <option key={i} value={i + 1}>
                        Class {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Department */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#475569] uppercase">
                  Department
                </label>
                <div className="relative">
                  <Building2
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-[#1fbb32] outline-none text-sm"
                    placeholder="Science / Commerce / Arts"
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-bold text-[#475569] uppercase">
                  Phone *
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="tel"
                    required
                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-[#1fbb32] outline-none text-sm"
                    placeholder="+880 1XXX XXXXXX"
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-[#f0fdf4] rounded-xl border border-[#1fbb32]/10 transition-all">
              <input
                id="terms"
                type="checkbox"
                required
                className="w-5 h-5 mt-0.5 text-[#1fbb32] border-slate-300 rounded focus:ring-[#1fbb32] accent-[#1fbb32] cursor-pointer"
                onChange={(e) =>
                  setFormData({ ...formData, agreeToTerms: e.target.checked })
                }
              />
              <label
                htmlFor="terms"
                className="text-xs text-[#475569] cursor-pointer leading-tight"
              >
                I agree to the{' '}
                <span className="text-[#1fbb32] font-bold">Terms</span> and{' '}
                <span className="text-[#1fbb32] font-bold">Privacy Policy</span>
                .
              </label>
            </div>

            <button
              type="submit"
              disabled={!formData.agreeToTerms || loading}
              className={`flex w-full items-center justify-center gap-3 h-12 text-white text-sm font-bold rounded-xl transition-all shadow-lg active:scale-[0.98] ${
                formData.agreeToTerms && !loading
                  ? 'bg-[#1fbb32] hover:bg-[#16a34a] shadow-[#1fbb32]/25'
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              {loading ? 'Processing...' : 'Submit Application'}{' '}
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BecomeStudent;
