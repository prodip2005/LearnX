'use client';
import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthActions } from '@/hooks/useAuth';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  LogIn,
  ShieldCheck,
} from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import Image from 'next/image';
import Logo from '@/components/shared/Logo';

// Next.js এ useSearchParams ব্যবহার করলে Suspense দিয়ে র‍্যাপ করা ভালো প্র্যাকটিস
const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginUser, loginWithGoogle, loading } = useAuthActions();

  // URL থেকে 'redirect' প্যারামিটার নেওয়া হচ্ছে, না থাকলে ডিফল্ট '/'
  const redirectTo = searchParams.get('redirect') || '/';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await loginUser(formData.email, formData.password);
    if (success) {
      router.push(redirectTo);
    }
  };

  const handleGoogleLogin = async () => {
    const success = await loginWithGoogle();
    if (success) {
      router.push(redirectTo);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center py-12 px-4 selection:bg-primary/30">
      <div className="max-w-4xl w-full bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(31,187,50,0.1)] border border-white overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Left Side: Illustration Section */}
        <div className="hidden md:flex w-[45%] bg-[#0f172a] p-12 flex-col justify-between relative overflow-hidden text-white">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-20"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-20"></div>
          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-2 text-primary">
              {/* <GraduationCap size={45} strokeWidth={2.5} /> */}
              {/* <Image
                height={1080}
                width={1080}
                className="h-16 w-14"
                alt="main Logo"
                src={'/mainLogo.png'}
              /> */}

              <Logo/>
              <span className="text-3xl font-black text-white">LearnX</span>
            </Link>
          </div>
          <div className="relative z-10 space-y-6">
            <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl backdrop-blur-md">
              <LogIn className="text-primary mb-2" size={24} />
              <h3 className="text-xl font-bold">Welcome Back!</h3>
              <p className="text-slate-400 text-sm">
                Log in to continue your premium learning journey.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <ShieldCheck size={18} className="text-primary" /> Secure Access
              </div>
            </div>
          </div>
          <div className="relative z-10 text-xs text-slate-500">
            Trusted by students worldwide.
          </div>
        </div>

        {/* Right Side: Form Section */}
        <div className="w-full md:w-[55%] p-10 md:p-14 bg-white">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-black text-[#0f172a] mb-2">Sign In</h2>
            <p className="text-slate-500 font-medium">
              Enter your details below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary"
                  size={20}
                />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-primary outline-none text-sm font-medium"
                  placeholder="alex@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary"
                  size={20}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full h-14 pl-12 pr-12 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-primary outline-none text-sm font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-3 h-16 text-white text-lg font-black rounded-2xl transition-all shadow-xl ${
                loading
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-hover active:scale-[0.98]'
              }`}
            >
              {loading ? 'Signing In...' : 'Sign In Now'}{' '}
              <ArrowRight size={22} />
            </button>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                Or continue with
              </span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full h-14 flex items-center justify-center gap-3 border-2 border-slate-100 rounded-2xl hover:bg-slate-50 transition-all font-bold text-slate-700 active:scale-[0.98]"
            >
              <FcGoogle className="w-7 h-7" />
              Google
            </button>

            <p className="text-center text-sm font-semibold text-slate-500 pt-2">
              New to LearnX?{' '}
              <Link
                href="/register"
                className="text-primary hover:underline font-black"
              >
                Create Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

// মেইন এক্সপোর্ট (Suspense ব্যবহার করে যতি searchParams কোনো এরর না দেয়)
export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
