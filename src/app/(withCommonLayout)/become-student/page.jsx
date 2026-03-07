'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  School,
  BookOpen,
  Building2,
  Phone,
  ArrowRight,
  Info,
  GraduationCap,
} from 'lucide-react';

const BecomeStudent = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    institution: '',
    currentClass: '',
    department: '',
    phone: '',
    agreeToTerms: false, // চেকবক্সের স্টেট
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      alert('Please agree to the Terms and Conditions');
      return;
    }
    console.log('Registration Data:', formData);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 md:px-0">
      <div className="max-w-[720px] mx-auto flex flex-col gap-6">
        {/* Form Card */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-[#1fbb32]/5 border border-[#1fbb32]/10 overflow-hidden">
          <div className="relative h-48 w-full bg-[#1fbb32]/5 flex items-center px-8 md:px-12 overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-[#0f172a] text-3xl font-black">
                Student Registration
              </h1>
              <p className="text-[#64748b]">
                Complete your profile to access premium exams.
              </p>
            </div>
            <GraduationCap
              size={120}
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
                <label className="text-sm font-bold text-[#475569] uppercase">
                  Full Name *
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type="text"
                    required
                    className="w-full h-14 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-[#1fbb32] outline-none transition-all"
                    placeholder="e.g. Alex Johnson"
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* School / College */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-bold text-[#475569] uppercase">
                  School / College *
                </label>
                <div className="relative">
                  <School
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type="text"
                    required
                    className="w-full h-14 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-[#1fbb32] outline-none"
                    placeholder="University of Excellence"
                    onChange={(e) =>
                      setFormData({ ...formData, institution: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Class */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#475569] uppercase">
                  Class *
                </label>
                <div className="relative">
                  <BookOpen
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <select
                    required
                    className="w-full h-14 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-[#1fbb32] outline-none appearance-none bg-white"
                    onChange={(e) =>
                      setFormData({ ...formData, currentClass: e.target.value })
                    }
                  >
                    <option value="">Select Class</option>
                    <option value="high-school">High School</option>
                    <option value="undergraduate">Undergraduate</option>
                  </select>
                </div>
              </div>

              {/* Department */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#475569] uppercase">
                  Department
                </label>
                <div className="relative">
                  <Building2
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type="text"
                    className="w-full h-14 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-[#1fbb32] outline-none"
                    placeholder="e.g. Science"
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-bold text-[#475569] uppercase">
                  Phone *
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type="tel"
                    required
                    className="w-full h-14 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-[#1fbb32] outline-none"
                    placeholder="+880 1XXX XXXXXX"
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start gap-3 p-4 bg-[#f0fdf4] rounded-xl border border-[#1fbb32]/10 transition-all hover:bg-[#1fbb32]/5">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="w-5 h-5 text-[#1fbb32] border-slate-300 rounded focus:ring-[#1fbb32] accent-[#1fbb32] cursor-pointer"
                  onChange={(e) =>
                    setFormData({ ...formData, agreeToTerms: e.target.checked })
                  }
                />
              </div>
              <label
                htmlFor="terms"
                className="text-sm text-[#475569] cursor-pointer leading-tight"
              >
                I agree to the{' '}
                <span className="text-[#1fbb32] font-bold hover:underline cursor-pointer">
                  Terms of Service
                </span>{' '}
                and{' '}
                <span className="text-[#1fbb32] font-bold hover:underline cursor-pointer">
                  Privacy Policy
                </span>{' '}
                regarding student data management.
              </label>
            </div>

            <button
              type="submit"
              className={`flex w-full items-center justify-center gap-3 h-14 text-white text-lg font-bold rounded-2xl transition-all shadow-lg active:scale-[0.98] ${
                formData.agreeToTerms
                  ? 'bg-[#1fbb32] hover:bg-[#16a34a] shadow-[#1fbb32]/25'
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
              disabled={!formData.agreeToTerms}
            >
              Submit Application <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BecomeStudent;
