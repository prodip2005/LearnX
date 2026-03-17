'use client';
import React, { useState, useEffect } from 'react';
import { PlayCircle } from 'lucide-react';
import { auth } from '@/lib/firebase.init';
import { onAuthStateChanged } from 'firebase/auth';
import Swal from 'sweetalert2';
import JoinModal from './_components/JoinModal';
import ExamHall from './_components/ExamHall';
import Image from 'next/image';
import StudentRoute from '@/components/StudentRoute';

const ExamsPage = () => {
  const [user, setUser] = useState(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [examData, setExamData] = useState(null);
  const [result, setResult] = useState(null);

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  useEffect(() => {
    const savedExam = localStorage.getItem('activeExam');
    if (savedExam) {
      setExamData(JSON.parse(savedExam));
    }

    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleJoin = async (targetCode = roomCode) => {
    if (!user)
      return Toast.fire({ icon: 'warning', title: 'Please login to join!' });
    if (targetCode.length < 6)
      return Toast.fire({ icon: 'warning', title: 'Enter 6-digit code' });

    setJoinLoading(true);
    try {
      // ১. প্রথমে রুম কোড দিয়ে পরীক্ষার তথ্য নিয়ে আসা
      const res = await fetch(`/api/exams/create?code=${targetCode}`);
      const data = await res.json();

      if (data.success) {
        const foundExam = data.exam;
        const qID = foundExam._id; // পরীক্ষার ইউনিক আইডি

        // ২. চেক করা হচ্ছে এই স্টুডেন্ট এই নির্দিষ্ট questionID এর পরীক্ষা আগে দিয়েছে কি না
        const checkRes = await fetch(`/api/exams/submit?email=${user.email}`);
        const checkData = await checkRes.json();

        if (checkData.success) {
          const hasAlreadySubmitted = checkData.data.some(
            (r) => r.questionID === qID,
          );

          if (hasAlreadySubmitted) {
            setJoinLoading(false);
            return Swal.fire({
              icon: 'info',
              title: 'Already Participated',
              text: 'You have already submitted this specific assessment.',
              confirmButtonColor: '#0f172a',
            });
          }
        }

        // ৩. যদি আগে পরীক্ষা না দিয়ে থাকে তবে জয়েন করানো
        setExamData(foundExam);
        localStorage.setItem('activeExam', JSON.stringify(foundExam));
        setIsJoinModalOpen(false);
        Toast.fire({ icon: 'success', title: 'Joined Successfully!' });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Access Denied',
          text: data.message,
          confirmButtonColor: '#0f172a',
        });
      }
    } catch (err) {
      Toast.fire({ icon: 'error', title: 'Connection Error' });
    } finally {
      setJoinLoading(false);
    }
  };

  const clearSession = () => {
    localStorage.removeItem('activeExam');
    localStorage.removeItem('examAnswers');
    setExamData(null);
  };

  if (examData || result) {
    return (
      <ExamHall
        examData={examData}
        user={user}
        result={result}
        setResult={setResult}
        clearSession={clearSession}
      />
    );
  }

  return (
    <StudentRoute>
      <main className="bg-white min-h-screen flex flex-col items-center justify-center px-6">
        <div className="relative z-10 max-w-6xl w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-16 py-20">
          <div className="flex-1 max-w-xl">
            <span className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-slate-400 border border-gray-100 rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
              Rooms are live
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
              Test your skills with <br />
              <span className="text-primary italic">precision.</span>
            </h1>
            <p className="text-slate-500 text-lg md:text-xl leading-relaxed mb-10">
              Participate in live exams with real-time ranking and detailed
              analytics. Minimal, fast, and secure.
            </p>
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:bg-black active:scale-95"
            >
              <PlayCircle size={20} />
              Join Now
            </button>
          </div>
          <div className="flex-1 max-w-sm w-full hidden md:flex flex-col items-end justify-center">
            <div className="relative group">
              <Image
                src={'/mainLogo.png'}
                alt="Main Logo"
                width={1080}
                height={1080}
                className="opacity-20"
              />
            </div>
          </div>
        </div>
        <JoinModal
          isOpen={isJoinModalOpen}
          onClose={() => setIsJoinModalOpen(false)}
          roomCode={roomCode}
          setRoomCode={setRoomCode}
          onJoin={() => handleJoin()}
          loading={joinLoading}
        />
      </main>
    </StudentRoute>
  );
};

export default ExamsPage;
