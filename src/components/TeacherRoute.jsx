'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase.init';
import { Loader2 } from 'lucide-react';

const TeacherRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false); // নাম পরিবর্তন করা হয়েছে স্পষ্টতার জন্য
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const res = await fetch(`/api/users?email=${user.email}`);
          const data = await res.json();

          // শিক্ষক অথবা এডমিন—উভয়কেই এক্সেস দেওয়া হচ্ছে
          if (data?.role === 'teacher' || data?.role === 'admin') {
            setHasAccess(true);
          } else {
            // যদি স্টুডেন্ট এই রুটে আসার চেষ্টা করে তাকে হোমে পাঠিয়ে দেওয়া হবে
            router.push('/');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          router.push(`/login?redirect=${pathname}`);
        }
      } else {
        router.push(`/login?redirect=${pathname}`);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-primary mb-3" size={42} />
        <p className="text-slate-500 font-semibold animate-pulse">
          Authenticating Access...
        </p>
      </div>
    );
  }

  return hasAccess ? children : null;
};

export default TeacherRoute;
