'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase.init';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Swal from 'sweetalert2';
import { GraduationCap, Menu, X, LayoutDashboard, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser);
      if (currentUser?.email) {
        try {
          const res = await fetch(`/api/users?email=${currentUser.email}`);
          if (res.ok) {
            const data = await res.json();
            setDbUser(data);
          }
        } catch (error) {
          console.error('Error fetching from MongoDB:', error);
        }
      } else {
        setDbUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setDbUser(null);
      Swal.fire({
        title: 'Logged Out',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Tutors', href: '/tutors' },
    { name: 'Online Exams', href: '/exams' },
    { name: 'About', href: '/about' },
  ];

  const userName = dbUser?.name || firebaseUser?.displayName || 'User';
  const userImage =
    dbUser?.image ||
    firebaseUser?.photoURL ||
    'https://i.ibb.co/5GzXkwq/default-avatar.png';

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#1fbb32]/10 bg-white/80 backdrop-blur-md px-6 md:px-20 lg:px-40 py-3">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#1fbb32]">
            <GraduationCap size={38} strokeWidth={2.5} />
            <h2 className="text-2xl font-black tracking-tighter text-[#0f172a]">
              LearnX
            </h2>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[15px] font-bold transition-colors ${
                    isActive
                      ? 'text-[#1fbb32]'
                      : 'text-[#475569] hover:text-[#1fbb32]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-4">
              {firebaseUser ? (
                <div className="flex items-center gap-4">
                  {/* Dashboard Link */}
                  <Link
                    href="/dashboard"
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm transition-all duration-300 ${
                      pathname.startsWith('/dashboard')
                        ? 'bg-[#1fbb32] text-white border-[#1fbb32]'
                        : 'bg-[#f0fdf4] text-[#1fbb32] border-[#1fbb32]/20 hover:bg-[#1fbb32] hover:text-white'
                    }`}
                  >
                    <LayoutDashboard size={18} /> Dashboard
                  </Link>

                  {/* Role Condition: Only show 'Be a Student' if role is 'user' */}
                  {dbUser?.role === 'user' && (
                    <Link
                      href="/become-student"
                      className="bg-[#1fbb32] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-[#1fbb32]/20 hover:bg-[#19a32b] active:scale-95 transition-all"
                    >
                      Be a Student
                    </Link>
                  )}

                  {/* Profile Info */}
                  <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="relative w-10 h-10 overflow-hidden rounded-full border-2 border-[#1fbb32]/20 shadow-sm">
                      <Image
                        src={userImage}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700 max-w-[100px] truncate leading-none">
                        {userName}
                      </span>
                      {dbUser?.role && (
                        <span className="text-[10px] font-bold text-[#1fbb32] uppercase tracking-tighter">
                          {dbUser.role}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className={`px-4 py-2 text-sm font-bold transition-colors ${pathname === '/login' ? 'text-[#1fbb32]' : 'text-slate-600'}`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/become-student"
                    className="bg-[#1fbb32] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#1fbb32]/20 active:scale-95 transition-all"
                  >
                    Be a Student
                  </Link>
                </div>
              )}
            </div>

            <button
              className="md:hidden p-2 text-[#0f172a] bg-slate-100 rounded-lg"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute top-full left-0 w-full bg-white border-b shadow-2xl p-6 flex flex-col gap-5 transition-all duration-500 z-40 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}
        >
          {firebaseUser && (
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="relative w-14 h-14 overflow-hidden rounded-full border-2 border-[#1fbb32]">
                <Image
                  src={userImage}
                  alt="Profile"
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <p className="text-lg font-black text-[#0f172a]">{userName}</p>
                <p className="text-xs font-bold text-[#1fbb32] uppercase">
                  {dbUser?.role || 'user'}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 font-bold rounded-xl ${pathname.startsWith('/dashboard') ? 'bg-[#1fbb32] text-white' : 'text-[#1fbb32] bg-[#f0fdf4]'}`}
            >
              <LayoutDashboard size={20} /> Go to Dashboard
            </Link>

            {/* Mobile Be a Student Condition */}

            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 font-bold rounded-xl transition-colors ${
                    isActive
                      ? 'text-[#1fbb32] bg-[#f0fdf4]'
                      : 'text-[#334155] hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-2">
            {dbUser?.role === 'user' && (
              <Link
                href="/become-student"
                onClick={() => setIsOpen(false)}
                className="flex mb-2 items-center justify-center gap-3 px-4 py-3 font-bold rounded-xl text-white bg-[#1fbb32]"
              >
                Be a Student
              </Link>
            )}
            {firebaseUser ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 bg-red-50 text-red-600 py-4 rounded-2xl font-bold border border-red-100"
              >
                <LogOut size={22} /> Logout Account
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className={`w-full py-4 text-center font-bold border rounded-2xl ${pathname === '/login' ? 'text-[#1fbb32] border-[#1fbb32] bg-[#f0fdf4]' : 'text-[#334155] border-slate-200'}`}
                >
                  Login
                </Link>
                <Link
                  href="/become-student"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-[#1fbb32] text-white py-4 text-center rounded-2xl font-bold"
                >
                  Be a Student
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
