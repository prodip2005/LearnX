'use client';
import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  LayoutGrid,
  AlertCircle,
} from 'lucide-react';

const ExamHall = ({ examData, user, result, setResult, clearSession }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  const answersRef = useRef({});
  const userRef = useRef(user);
  const isAutoSubmitting = useRef(false);

  // ১. এন্সার লোড করা (LocalStorage থেকে)
  const [answers, setAnswers] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('examAnswers');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  useEffect(() => {
    answersRef.current = answers;
    localStorage.setItem('examAnswers', JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // ২. টাইমার লজিক (সংশোধিত রিকভারি সিস্টেম)
  useEffect(() => {
    if (!examData || result) return;

    const durationStr = examData?.duration || '60 Minutes';
    const durationInSeconds = (parseInt(durationStr.split(' ')[0]) || 60) * 60;
    let examEndTime = localStorage.getItem(`examEndTime_${examData.roomCode}`);

    if (!examEndTime) {
      const now = Math.floor(Date.now() / 1000);
      examEndTime = now + durationInSeconds;
      localStorage.setItem(`examEndTime_${examData.roomCode}`, examEndTime);
    }

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = parseInt(examEndTime) - now;

      if (remaining <= 0) {
        setTimeLeft(0);
        if (!result && !submitting && !isAutoSubmitting.current) {
          isAutoSubmitting.current = true;
          handleAutoSubmit();
        }
      } else {
        setTimeLeft(remaining);
      }
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval);
  }, [examData?.roomCode, result]);

  // ৩. সাবমিশন লজিক
  const submitToDatabase = async (finalAnswers = answersRef.current) => {
    if (submitting) return;
    setSubmitting(true);

    Swal.fire({
      title: 'Submitting Answers...',
      text: 'Please wait while we secure your response.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const currentUser = userRef.current;
    const qID = examData?._id || examData?.id;

    try {
      const res = await fetch('/api/exams/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionID: qID,
          roomCode: examData.roomCode,
          studentAnswers: finalAnswers,
          studentEmail: currentUser?.email,
          studentName:
            currentUser?.displayName || currentUser?.email?.split('@')[0],
          examSubject: examData.roomTitle,
          teacherEmail: examData.teacherEmail,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data);
        localStorage.removeItem('activeExam');
        localStorage.removeItem('examAnswers');
        localStorage.removeItem(`examEndTime_${examData.roomCode}`);
        Swal.close();
      }
    } catch (err) {
      Swal.fire('Error', 'Submission failed! Check connection.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleManualSubmit = () => {
    Swal.fire({
      title: 'Finish Exam?',
      text: `You have answered ${Object.keys(answers).length} out of ${examData.questions.length} questions.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0f172a',
      confirmButtonText: 'Yes, Submit Now',
    }).then((res) => {
      if (res.isConfirmed) submitToDatabase();
    });
  };

  const handleAutoSubmit = () => {
    Swal.fire({
      title: 'Time is up!',
      text: 'Your assessment is being submitted automatically.',
      icon: 'warning',
      timer: 3000,
      showConfirmButton: false,
    }).then(() => submitToDatabase());
  };

  if (timeLeft === null) return null;

  const questions = examData?.questions || [];
  const currentQ = questions[currentStep];
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / questions.length) * 100);

  const formatTime = (s) => {
    const m = Math.max(0, Math.floor(s / 60));
    const sec = Math.max(0, s % 60);
    return { min: m, sec: sec.toString().padStart(2, '0') };
  };
  const time = formatTime(timeLeft);

  // রেজাল্ট ভিউ (আইকনিক ডিজাইন)
  if (result) {
    return (
      <div className="min-h-screen bg-[#f6f8f6] flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl text-center max-w-sm w-full border border-slate-100 animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-primary" size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">
            Assessment Finished
          </h2>
          <div className="text-6xl font-black text-primary mb-10">
            {result.score ?? 0}
            <span className="text-xl text-slate-300">/{result.total ?? 0}</span>
          </div>
          <button
            onClick={() => {
              clearSession();
              window.location.href = '/dashboard/student/my-exams';
            }}
            className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f6f8f6] min-h-screen font-display text-slate-900 pb-20">
      <main className="flex justify-center py-10 px-4">
        <div className="max-w-[850px] flex-1 flex flex-col gap-6">
          {/* Header with Timer & Title */}
          <div className="flex flex-wrap justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm gap-4">
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black transition-all ${timeLeft < 300 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-primary/10 text-primary'}`}
              >
                <Clock size={20} />
                <span className="text-lg">
                  {time.min}:{time.sec}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Current Session
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {examData.roomTitle}
                </p>
              </div>
            </div>
            <div className="px-5 py-2 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest border border-slate-200">
              {examData.roomCode}
            </div>
          </div>

          {/* Progress Section */}
          <div className="flex flex-col gap-4 p-6 bg-white rounded-[2rem] shadow-sm border border-slate-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-900 font-black uppercase text-xs tracking-wider">
                  Exam Progress
                </p>
                <p className="text-slate-400 text-xs font-bold">
                  {answeredCount} of {questions.length} Questions Answered
                </p>
              </div>
              <div className="text-right">
                <span className="text-primary font-black text-lg">
                  {progress}%
                </span>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="p-8 md:p-12 bg-white rounded-[3rem] shadow-sm border border-slate-200 relative overflow-hidden min-h-[400px]">
            <div className="flex items-center gap-3 mb-8">
              <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-900 text-white font-black text-sm shadow-lg shadow-slate-200">
                {currentStep + 1}
              </span>
              <span className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em]">
                Question Details
              </span>
            </div>

            <h2 className="text-slate-800 text-2xl font-black mb-10 leading-tight">
              {currentQ?.description}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {currentQ &&
                Object.entries(currentQ.options).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() =>
                      setAnswers({ ...answers, [currentQ.id]: key })
                    }
                    className={`group flex items-center gap-5 p-6 rounded-[1.8rem] border-2 transition-all text-left ${
                      answers[currentQ.id] === key
                        ? 'border-primary bg-primary/5 shadow-inner'
                        : 'border-slate-50 bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <span
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all ${
                        answers[currentQ.id] === key
                          ? 'bg-primary text-white scale-110 shadow-lg'
                          : 'bg-white text-slate-400 border border-slate-100 group-hover:text-primary'
                      }`}
                    >
                      {key}
                    </span>
                    <span
                      className={`font-bold text-lg ${answers[currentQ.id] === key ? 'text-slate-900' : 'text-slate-600'}`}
                    >
                      {value}
                    </span>
                  </button>
                ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-slate-200 bg-white text-slate-500 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 disabled:opacity-30 transition-all active:scale-95"
            >
              <ChevronLeft size={16} /> Previous
            </button>

            {currentStep === questions.length - 1 ? (
              <button
                onClick={handleManualSubmit}
                disabled={submitting}
                className="flex items-center gap-2 bg-slate-900 text-white px-12 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all shadow-xl active:scale-95"
              >
                Complete Exam <CheckCircle2 size={16} />
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex items-center gap-2 bg-primary text-white px-12 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-primary-hover shadow-xl active:scale-95"
              >
                Next Question <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Iconic Question Map Sidebar */}
      <aside className="fixed right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-6 w-64 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <LayoutGrid size={18} className="text-primary" />
          <h3 className="text-slate-800 text-xs font-black uppercase tracking-widest">
            Question Map
          </h3>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {questions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all transform hover:scale-110 ${
                currentStep === idx
                  ? 'bg-primary text-white shadow-lg ring-4 ring-primary/20'
                  : answers[q.id]
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
            <div className="w-2 h-2 rounded-full bg-slate-900"></div> Answered
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
            <div className="w-2 h-2 rounded-full bg-primary"></div> Current
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
            <div className="w-2 h-2 rounded-full bg-slate-100"></div> Pending
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ExamHall;
