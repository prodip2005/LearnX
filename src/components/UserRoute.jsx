'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase.init';
import { Loader2 } from 'lucide-react';

const UserRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isNormalUser, setIsNormalUser] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const res = await fetch(`/api/users?email=${user.email}`);
          const data = await res.json();
          if (data?.role === 'user') {
            setIsNormalUser(true);
          } else {
            console.log('Access Denied: Your role is', data?.role);
            router.push('/');
          }
        } catch (error) {
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
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return isNormalUser ? children : null;
};

export default UserRoute;
