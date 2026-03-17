'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase.init';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Swal from 'sweetalert2';
import {
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  UserCircle,
  Settings,
  ChevronDown,
} from 'lucide-react';
import Logo from './Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // ড্রপডাউন স্টেট
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  // ক্লিক বাইরে পড়লে ড্রপডাউন বন্ধ করার লজিক
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          console.error('Error fetching user data:', error);
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
      setIsProfileOpen(false);
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
    { name: 'Home', href: '/', show: true },
    { name: 'Tutors', href: '/tutors', show: true },
    { name: 'Online Exams', href: '/exams', show: dbUser?.role === 'student' },
    { name: 'About', href: '/about', show: true },
  ];

  const dashboardRoles = ['admin', 'teacher', 'student'];
  const hasDashboardAccess =
    dbUser?.role && dashboardRoles.includes(dbUser.role);
  const dashboardLink = dbUser?.role
    ? `/dashboard/${dbUser.role}`
    : '/dashboard';

  const userProfile = {
    name: dbUser?.name || firebaseUser?.displayName || 'User',
    image:
      dbUser?.image ||
      firebaseUser?.photoURL ||
      'https://i.ibb.co/5GzXkwq/default-avatar.png',
    role: dbUser?.role || 'user',
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-white/80 backdrop-blur-md px-6 md:px-20 lg:px-40 py-3">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary">
            <Logo />
            <h2 className="text-2xl font-black tracking-tighter text-[#0f172a]">
              Learn <span className="text-primary text-3xl">X</span>
            </h2>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {navLinks
              .filter((link) => link.show)
              .map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[15px] font-bold transition-colors ${pathname === link.href ? 'text-primary' : 'text-[#475569] hover:text-primary'}`}
                >
                  {link.name}
                </Link>
              ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-4">
              {firebaseUser ? (
                <div className="flex items-center gap-4">
                  {hasDashboardAccess && (
                    <Link
                      href={dashboardLink}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm transition-all duration-300 ${pathname.startsWith('/dashboard') ? 'bg-primary text-white' : 'bg-primary-light text-primary hover:bg-primary hover:text-white'}`}
                    >
                      <LayoutDashboard size={18} /> Dashboard
                    </Link>
                  )}

                  {dbUser?.role === 'user' && (
                    <Link
                      href="/become-student"
                      className="bg-primary text-white px-5 py-2 rounded-xl text-xs font-bold shadow-lg hover:bg-primary-hover transition-all"
                    >
                      Be a Student
                    </Link>
                  )}

                  {/* Profile Dropdown Container */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 group cursor-pointer focus:outline-none"
                    >
                      <div
                        className={`relative w-10 h-10 overflow-hidden rounded-full border-2 transition-all ${isProfileOpen ? 'border-primary ring-4 ring-primary/10' : 'border-primary/20'}`}
                      >
                        <Image
                          src={userProfile.image}
                          alt="Profile"
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-bold text-slate-700 max-w-[100px] truncate leading-none">
                          {userProfile.name}
                        </span>
                        <span className="text-[10px] font-bold text-primary uppercase">
                          {userProfile.role}
                        </span>
                      </div>
                      <ChevronDown
                        size={14}
                        className={`text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Desktop Dropdown Menu */}
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-3 w-56 bg-white border border-primary/10 rounded-2xl shadow-2xl shadow-primary/10 py-2 animate-in fade-in zoom-in duration-200">
                        <div className="px-4 py-3 border-b border-slate-50 mb-1">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Account
                          </p>
                        </div>

                        <Link
                          href="/update-profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-primary/5 hover:text-primary transition-all"
                        >
                          <UserCircle size={18} /> Update Profile
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
                        >
                          <LogOut size={18} /> Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-8 py-2 text-sm bg-primary text-white rounded-[10px] font-bold hover:bg-primary-hover transition-all"
                >
                  Login
                </Link>
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

        {/* Mobile Sidebar */}
        <div
          className={`md:hidden absolute top-full left-0 w-full bg-white border-b shadow-2xl p-6 flex flex-col gap-5 transition-all duration-500 z-40 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}
        >
          {firebaseUser && (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 overflow-hidden rounded-full border-2 border-primary">
                  <Image
                    src={userProfile.image}
                    alt="Profile"
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="text-lg font-black text-[#0f172a]">
                    {userProfile.name}
                  </p>
                  <p className="text-xs font-bold text-primary uppercase">
                    {userProfile.role}
                  </p>
                </div>
              </div>
              <Link
                href="/update-profile"
                onClick={() => setIsOpen(false)}
                className="p-3 bg-white shadow-sm border border-slate-200 rounded-xl text-primary"
              >
                <Settings size={20} />
              </Link>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {hasDashboardAccess && (
              <Link
                href={dashboardLink}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 font-bold rounded-xl ${pathname.startsWith('/dashboard') ? 'bg-primary text-white' : 'text-primary bg-primary-light'}`}
              >
                <LayoutDashboard size={20} /> Go to Dashboard
              </Link>
            )}

            {navLinks
              .filter((link) => link.show)
              .map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 font-bold rounded-xl ${pathname === link.href ? 'text-primary bg-primary-light' : 'text-[#334155]'}`}
                >
                  {link.name}
                </Link>
              ))}
          </div>

          <div className="pt-2">
            {dbUser?.role === 'user' && (
              <Link
                href="/become-student"
                onClick={() => setIsOpen(false)}
                className="flex mb-2 items-center justify-center gap-3 px-4 py-3 font-bold rounded-xl text-white bg-primary"
              >
                Be a Student
              </Link>
            )}
            {firebaseUser ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 bg-red-50 text-red-600 py-4 rounded-2xl font-bold"
              >
                <LogOut size={22} /> Logout Account
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full py-4 text-center bg-primary text-white font-bold rounded-2xl"
              >
                Login
              </Link>
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
