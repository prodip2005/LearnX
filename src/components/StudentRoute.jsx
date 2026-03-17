'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // usePathname যোগ করা হয়েছে
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase.init';
import { Loader2 } from 'lucide-react';

const StudentRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isStudent, setIsStudent] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // বর্তমান পাথটি ক্যাপচার করবে

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const res = await fetch(`/api/users?email=${user.email}`);
          const data = await res.json();

          if (data?.role === 'student') {
            setIsStudent(true);
          } else {
            router.push('/');
          }
        } catch (error) {
          router.push(`/login?redirect=${pathname}`);
        }
      } else {
        // লগইন না থাকলে বর্তমান পাথটি পাঠিয়ে দিবে
        router.push(`/login?redirect=${pathname}`);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return isStudent ? children : null;
};

export default StudentRoute;
