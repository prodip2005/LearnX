'use client';
import React, { useState, useEffect } from 'react';
import {
  PlayCircle,
  Sparkles,
  LayoutGrid,
  Search,
  Users,
  Trophy,
  BookOpen,
} from 'lucide-react';
import { auth } from '@/lib/firebase.init';
import { onAuthStateChanged } from 'firebase/auth';
import ExamCard from './_components/ExamCard';
import JoinModal from './_components/JoinModal';
import ExamHall from './_components/ExamHall';

const ExamsPage = () => {
  const [user, setUser] = useState(null);
  const [exams, setExams] = useState([]);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [examData, setExamData] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    fetch('/api/exams/create')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setExams(data.data);
      });
    return () => unsubscribe();
  }, []);

  const handleJoin = async (targetCode = roomCode) => {
    if (!user) return alert('Login required!');
    setLoading(true);
    try {
      const res = await fetch(`/api/exams/create?code=${targetCode}`);
      const data = await res.json();
      if (data.success) {
        setExamData(data.exam);
        setIsJoinModalOpen(false);
      } else {
        alert('Invalid Room Code');
      }
    } catch (err) {
      alert('Connection Error');
    } finally {
      setLoading(false);
    }
  };

  if (examData || result) {
    return (
      <ExamHall
        examData={examData}
        user={user}
        result={result}
        setResult={setResult}
      />
    );
  }

  return (
    <div className="min-h-screen max-w-310 mx-auto bg-[#fafbfc] pb-20">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[#1fbb32] text-[10px] font-black tracking-widest uppercase">
              <Sparkles size={12} /> Best Online Assessment Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-800 leading-[1.1]">
              The smartest way to <br />
              <span className="text-[#1fbb32]">test your skills.</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium max-w-lg">
              Participate in live exams with real-time ranking and detailed
              analytics. Secure, fast, and simple.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => setIsJoinModalOpen(true)}
                className="group flex items-center gap-3 bg-[#1fbb32] text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-[#1fbb32]/20 hover:bg-[#19a32b] hover:-translate-y-1 transition-all"
              >
                <PlayCircle
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
                Join Private Hall
              </button>
            </div>
          </div>

          {/* স্ট্যাটাস ওভারভিউ কার্ডস - পেজ ভরা ভরাট দেখাবে */}
          <div className="flex-1 grid grid-cols-2 gap-4 w-full">
            <div className="bg-[#f0fdf4] p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
              <Users className="text-[#1fbb32] mb-3" size={32} />
              <h4 className="text-2xl font-black text-slate-800">50K+</h4>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-tighter">
                Active Students
              </p>
            </div>
            <div className="bg-slate-50 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center mt-8">
              <Trophy className="text-orange-500 mb-3" size={32} />
              <h4 className="text-2xl font-black text-slate-800">1200+</h4>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-tighter">
                Daily Exams
              </p>
            </div>
          </div>
        </div>
      </div>

      <JoinModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        roomCode={roomCode}
        setRoomCode={setRoomCode}
        onJoin={() => handleJoin()}
        loading={loading}
      />
    </div>
  );
};

export default ExamsPage;
