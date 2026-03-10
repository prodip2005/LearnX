'use client';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const ExamHall = ({ examData, user, result, setResult }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(2700); // 45 Minutes

  useEffect(() => {
    if (timeLeft <= 0 || result) {
      if (timeLeft === 0 && !result) handleAutoSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, result]);

  const handleAutoSubmit = () => {
    submitToDatabase();
  };

  const submitToDatabase = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/exams/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomCode: examData.roomCode,
          studentAnswers: answers,
          studentEmail: user?.email,
          studentName: user?.displayName,
        }),
      });
      const data = await res.json();
      if (data.success) setResult(data);
    } catch (err) {
      Swal.fire('Error', 'Submission failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const questions = examData?.questions || [];
  const currentQ = questions[currentStep];
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / questions.length) * 100);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return { min: m, sec: sec.toString().padStart(2, '0') };
  };

  const time = formatTime(timeLeft);

  if (result) {
    return (
      <div className="min-h-screen bg-[#f6f8f6] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-sm w-full border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Result Published
          </h2>
          <div className="text-5xl font-black text-primary mb-6">
            {result.score ?? 0}
            <span className="text-lg text-slate-300">/{result.total ?? 0}</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors"
          >
            Close & Exit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f6f8f6] min-h-screen font-display text-slate-900">
     
     

      <main className="flex justify-center py-6 px-4 md:px-0">
        <div className="max-w-[800px] flex-1 flex flex-col gap-6">
          {/* Mobile Timer */}
          <div className="flex md:hidden justify-center gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-center">
              <span className="text-xl font-bold text-primary">
                {time.min}
              </span>
              <p className="text-[8px] uppercase text-slate-400">Min</p>
            </div>
            <span className="text-xl font-bold text-slate-200">:</span>
            <div className="text-center">
              <span className="text-xl font-bold text-primary">
                {time.sec}
              </span>
              <p className="text-[8px] uppercase text-slate-400">Sec</p>
            </div>
          </div>

          {/* Progress Section */}
          <div className="flex flex-col gap-3 p-5 bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-slate-900 text-base font-bold">
                  Exam Progress
                </p>
                <p className="text-slate-400 text-xs">
                  {answeredCount} of {questions.length} answered
                </p>
              </div>
              <p className="text-primary text-xs font-bold bg-primary/10 px-3 py-1 rounded-full">
                {progress}% Complete
              </p>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question Box */}
          <div className="flex flex-col gap-6 p-6 md:p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center size-8 rounded-full bg-slate-900 text-white font-bold text-xs">
                {currentStep + 1}
              </span>
              <h2 className="text-slate-900 text-xl font-bold tracking-tight">
                Question {currentStep + 1}
              </h2>
            </div>

            <p className="text-slate-700 text-lg leading-relaxed font-medium">
              {currentQ.description}
            </p>

            <div className="grid grid-cols-1 gap-3 pt-2">
              {Object.entries(currentQ.options).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setAnswers({ ...answers, [currentQ.id]: key })}
                  className={`group flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
                    answers[currentQ.id] === key
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-slate-50 bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`flex items-center justify-center size-8 rounded-lg font-bold text-sm ${
                        answers[currentQ.id] === key
                          ? 'bg-primary text-white'
                          : 'bg-white text-slate-400 border border-slate-200'
                      }`}
                    >
                      {key}
                    </span>
                    <span
                      className={`font-semibold ${answers[currentQ.id] === key ? 'text-slate-900' : 'text-slate-600'}`}
                    >
                      {value}
                    </span>
                  </div>
                 
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center px-2 pb-10">
            <button
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex items-center gap-1 px-5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-500 text-sm font-bold hover:bg-slate-50 disabled:opacity-20 transition-all"
            >
             
              Previous
            </button>

            {currentStep === questions.length - 1 ? (
              <button
                onClick={submitToDatabase}
                disabled={submitting}
                className="bg-slate-900 text-white px-8 py-2.5 rounded-lg text-sm font-bold hover:bg-black transition-all"
              >
                {submitting ? 'Submitting...' : 'Finish Exam'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex items-center gap-1 px-8 py-2.5 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-hover shadow-md shadow-primary/10 transition-all"
              >
                Next{' '}
             
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Sidebar Question Map */}
      <aside className="fixed right-6 top-28 hidden xl:flex flex-col gap-4 w-52">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">
            Question Map
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {questions.map((q, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`size-8 rounded-lg flex items-center justify-center text-[11px] font-bold cursor-pointer transition-all ${
                  currentStep === idx
                    ? 'ring-2 ring-primary bg-primary/10 text-primary'
                    : answers[q.id]
                      ? 'bg-primary text-white'
                      : 'bg-slate-50 text-slate-300 hover:bg-slate-100'
                }`}
              >
                {idx + 1}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ExamHall;
