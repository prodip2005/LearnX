'use client';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; // SweetAlert2 ইমপোর্ট করা হয়েছে
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  LayoutGrid,
  LogOut,
  Info,
  Star,
  Send,
} from 'lucide-react';

const ExamHall = ({ examData, user, result, setResult }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800);

  useEffect(() => {
    if (timeLeft <= 0 || result) {
      if (timeLeft === 0 && !result) {
        // টাইম শেষ হলে অটো সাবমিট ট্রিগার
        handleAutoSubmit();
      }
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, result]);

  // অটো সাবমিট ফাংশন (টাইমার শেষ হলে)
  const handleAutoSubmit = () => {
    Swal.fire({
      title: 'Time is Up!',
      text: 'Your exam is being submitted automatically.',
      icon: 'warning',
      timer: 2000,
      showConfirmButton: false,
    }).then(() => {
      submitToDatabase();
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ডাটাবেসে পাঠানোর মেইন লজিক
  const submitToDatabase = async () => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/exams/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomCode: examData.roomCode,
          studentAnswers: answers,
          studentEmail: user?.email,
          studentName: user?.displayName || 'Student',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data);
        Swal.fire({
          icon: 'success',
          title: 'Submitted!',
          text: 'Your responses have been recorded.',
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message || 'Something went wrong!',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ইউজার যখন নিজে সাবমিট বাটনে ক্লিক করবে
  const handleSubmitClick = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to change your answers!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#1fbb32',
      cancelButtonColor: '#f8fafc',
      confirmButtonText: 'Yes, Submit Exam',
      cancelButtonText: 'No, Keep Writing',
      customClass: {
        popup: 'rounded-[2rem]',
        confirmButton: 'rounded-xl font-bold px-6 py-3',
        cancelButton: 'rounded-xl font-bold px-6 py-3 text-slate-400',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        submitToDatabase();
      }
    });
  };

  if (result) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 animate-in fade-in duration-700">
        <div className="bg-white max-w-2xl w-full rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200">
          <div className="bg-slate-900 p-12 text-center text-white relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#1fbb32]"></div>
            <div className="w-20 h-20 bg-[#1fbb32] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-12">
              <Star size={40} fill="white" className="-rotate-12" />
            </div>
            <h2 className="text-4xl font-black tracking-tight">
              Result Published!
            </h2>
            <p className="text-slate-400 mt-2 font-medium">
              You have completed the {examData.roomTitle} exam.
            </p>
          </div>

          <div className="p-12 text-center bg-white">
            <div className="flex justify-center items-baseline gap-2 mb-10">
              <span className="text-9xl font-black text-slate-800 tracking-tighter">
                {result.score ?? result.totalMark ?? 0}
              </span>
              <span className="text-3xl font-bold text-slate-200">
                / {result.total ?? result.totalQuestions ?? 0}
              </span>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="bg-[#1fbb32] text-white px-10 py-5 rounded-[1.5rem] font-black hover:bg-[#19a32b] transition-all w-full shadow-xl shadow-[#1fbb32]/20 active:scale-[0.98]"
            >
              Finish & Exit Hall
            </button>
          </div>
        </div>
      </div>
    );
  }

  const questions = examData?.questions || [];
  const currentQ = questions[currentStep];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-lg">
            <LayoutGrid size={22} />
          </div>
          <div>
            <h1 className="font-black text-slate-800 text-sm uppercase tracking-tight">
              {examData.roomTitle}
            </h1>
            <p className="text-[10px] text-[#1fbb32] font-black uppercase tracking-widest">
              Candidate: {user?.displayName || 'Student'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">
                Time Left
              </p>
              <p
                className={`font-mono text-xl font-black leading-none ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-slate-800'}`}
              >
                {formatTime(timeLeft)}
              </p>
            </div>
            <Clock
              size={20}
              className={timeLeft < 300 ? 'text-red-500' : 'text-slate-300'}
            />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-80 bg-white border-r border-slate-200 p-8 hidden xl:flex flex-col">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] mb-8 text-center border-b pb-4">
            Question Map
          </h3>
          <div className="grid grid-cols-4 gap-3 overflow-y-auto pr-2">
            {questions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-12 w-full rounded-xl font-black text-sm transition-all border-2 ${
                  currentStep === idx
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xl scale-105'
                    : answers[q.id]
                      ? 'border-[#1fbb32] bg-[#f0fdf4] text-[#1fbb32]'
                      : 'border-slate-50 bg-slate-50 text-slate-300 hover:border-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <div className="mt-auto bg-slate-900 p-6 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
              <Info size={100} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3 font-black text-xs uppercase tracking-widest text-[#1fbb32]">
                <Info size={14} /> Guidelines
              </div>
              <ul className="text-[11px] text-slate-400 space-y-2 font-bold italic">
                <li>• No negative marking.</li>
                <li>• Results are instant.</li>
                <li>• Auto-submit on timer hits 0.</li>
              </ul>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-8 md:p-16 lg:p-20 bg-[#f8fafc]">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-5 mb-14">
              <span className="bg-white border border-slate-200 text-slate-800 text-[10px] font-black px-5 py-2 rounded-xl shadow-sm uppercase tracking-widest">
                Q. {currentStep + 1} / {questions.length}
              </span>
              <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-[#1fbb32] transition-all duration-700 ease-out shadow-[0_0_15px_rgba(31,187,50,0.3)]"
                  style={{
                    width: `${((currentStep + 1) / questions.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="mb-14">
              <h2 className="text-3xl md:text-5xl font-black text-slate-800 leading-[1.2] tracking-tight mb-6">
                {currentQ.description}
              </h2>
              <div className="w-16 h-1.5 bg-[#1fbb32] rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-24">
              {Object.entries(currentQ.options).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setAnswers({ ...answers, [currentQ.id]: key })}
                  className={`group flex items-center gap-6 p-7 rounded-[2rem] border-2 text-left transition-all duration-300 ${
                    answers[currentQ.id] === key
                      ? 'border-[#1fbb32] bg-white shadow-2xl shadow-[#1fbb32]/10 scale-[1.02]'
                      : 'border-white bg-white hover:border-slate-200 shadow-sm'
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl transition-all ${
                      answers[currentQ.id] === key
                        ? 'bg-[#1fbb32] text-white shadow-lg'
                        : 'bg-slate-50 text-slate-300 group-hover:bg-slate-100 group-hover:text-slate-500'
                    }`}
                  >
                    {key}
                  </div>
                  <span
                    className={`text-xl font-bold ${answers[currentQ.id] === key ? 'text-slate-800' : 'text-slate-500'}`}
                  >
                    {value}
                  </span>
                  {answers[currentQ.id] === key && (
                    <CheckCircle
                      size={28}
                      className="ml-auto text-[#1fbb32] animate-in zoom-in"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center bg-white p-5 rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50">
              <button
                disabled={currentStep === 0}
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-8 py-4 rounded-2xl flex items-center gap-2 font-black text-slate-400 hover:text-slate-800 disabled:opacity-20 transition-all uppercase text-xs tracking-widest"
              >
                <ChevronLeft size={20} /> Previous
              </button>

              <div className="flex gap-4">
                {currentStep === questions.length - 1 ? (
                  <button
                    onClick={handleSubmitClick}
                    disabled={submitting}
                    className="bg-[#1fbb32] text-white px-12 py-5 rounded-[1.5rem] font-black shadow-xl shadow-[#1fbb32]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 uppercase text-sm tracking-widest"
                  >
                    {submitting ? 'Processing...' : 'Submit Exam'}{' '}
                    <Send size={18} />
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="bg-slate-900 text-white px-10 py-5 rounded-[1.5rem] font-black shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 uppercase text-sm tracking-widest"
                  >
                    Next Question <ChevronRight size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExamHall;
