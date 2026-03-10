'use client';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { auth } from '@/lib/firebase.init'; // আপনার পাথ অনুযায়ী ঠিক করে নিন
import { onAuthStateChanged } from 'firebase/auth';
import {
  RefreshCw,
  Trash2,
  PlusCircle,
  ChevronDown,
  CheckCircle2,
  Layers,
} from 'lucide-react';

const CreateNewRoom = () => {
  const [roomTitle, setRoomTitle] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [duration, setDuration] = useState('90 Minutes');
  const [category, setCategory] = useState('Science');
  const [teacherEmail, setTeacherEmail] = useState('');

  // MCQ Questions State
  const [questions, setQuestions] = useState([
    {
      id: Date.now(),
      description: '',
      options: { A: '', B: '', C: '', D: '' },
      correctAnswer: '',
      required: false,
    },
  ]);

  // লগইন থাকা ইউজারের ইমেইল গেট করা
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setTeacherEmail(user.email);
      }
    });
    generateRandomCode();
    return () => unsubscribe();
  }, []);

  const generateRandomCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setRoomCode(code);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        description: '',
        options: { A: '', B: '', C: '', D: '' },
        correctAnswer: '',
        required: false,
      },
    ]);
  };

  const removeQuestion = (id) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const handleQuestionChange = (id, field, value) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)),
    );
  };

  const handleOptionChange = (qId, label, value) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === qId) {
          return { ...q, options: { ...q.options, [label]: value } };
        }
        return q;
      }),
    );
  };

  const handleCreateRoom = async () => {
    if (!roomTitle) {
      return Swal.fire({
        icon: 'warning',
        title: 'Title Required',
        text: 'Please enter a room title!',
      });
    }

    if (!teacherEmail) {
      return Swal.fire({
        icon: 'error',
        title: 'Auth Error',
        text: 'Login required to create a room.',
      });
    }

    const hasIncomplete = questions.some(
      (q) => !q.correctAnswer || !q.description,
    );
    if (hasIncomplete) {
      return Swal.fire({
        icon: 'error',
        title: 'Wait!',
        text: 'Please fill all questions and select correct answers.',
      });
    }

    const roomData = {
      roomTitle,
      roomCode,
      duration,
      category,
      questions,
      teacherEmail, // লগইন করা টিচারের ইমেইল
      createdAt: new Date(),
    };

    try {
      const res = await fetch('/api/exams/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomData),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Room Created!',
          text: `Room Code: ${roomCode}`,
          confirmButtonColor: 'var(--color-primary)',
        });

        // ফর্ম রিসেট
        setRoomTitle('');
        setQuestions([
          {
            id: Date.now(),
            description: '',
            options: { A: '', B: '', C: '', D: '' },
            correctAnswer: '',
            required: false,
          },
        ]);
        generateRandomCode();
      } else {
        Swal.fire({ icon: 'error', title: 'Failed', text: data.error });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong!',
      });
    }
  };

  return (
    <div className="p-6 md:p-10 w-full bg-[#f9fafb] min-h-screen space-y-8 font-sans text-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Create New Exam Room
          </h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider italic">
            Creating as: {teacherEmail || 'Loading user...'}
          </p>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">
              Room Title
            </label>
            <input
              value={roomTitle}
              onChange={(e) => setRoomTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-[#f8fafc] focus:border-primary outline-none transition-all"
              placeholder="e.g. Mathematics - Final Exam 2026"
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">
                Duration
              </label>
              <div className="relative">
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-100 bg-[#f8fafc] outline-none appearance-none font-medium"
                >
                  <option>45 Minutes</option>
                  <option>60 Minutes</option>
                  <option>90 Minutes</option>
                  <option>120 Minutes</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={16}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">
                Category
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-100 bg-[#f8fafc] outline-none appearance-none font-medium"
                >
                  <option>Science</option>
                  <option>Mathematics</option>
                  <option>General Knowledge</option>
                  <option>Programming</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={16}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Room Code Card */}
        <div className="bg-primary text-white p-8 rounded-[2rem] flex flex-col justify-center items-center relative overflow-hidden shadow-xl shadow-primary/20">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Layers size={100} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-80">
            Access Code
          </p>
          <div className="flex items-center gap-4 relative z-10">
            <input
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.slice(0, 6))}
              className="bg-transparent text-3xl font-black tracking-widest font-mono outline-none w-48 text-center border-b-2 border-white/20 focus:border-white transition-all"
              maxLength={6}
            />
            <RefreshCw
              onClick={generateRandomCode}
              className="cursor-pointer hover:rotate-180 transition-all duration-700 bg-white/10 p-2 rounded-full"
              size={36}
            />
          </div>
          <p className="text-[10px] mt-6 opacity-70 font-bold italic text-center uppercase tracking-widest">
            Click icon to refresh
          </p>
        </div>
      </div>

      {/* Questions Section */}
      <div className="space-y-6">
        <h2 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
          <CheckCircle2 className="text-primary" size={22} /> Exam
          Questionnaire
        </h2>

        {questions.map((q, index) => (
          <div
            key={q.id}
            className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden group hover:border-primary/30 transition-all"
          >
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-[11px] font-black text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-lg">
                  Question {index + 1}
                </p>
                <Trash2
                  onClick={() => removeQuestion(q.id)}
                  className="text-slate-200 hover:text-red-500 cursor-pointer transition-colors"
                  size={18}
                />
              </div>

              <textarea
                value={q.description}
                onChange={(e) =>
                  handleQuestionChange(q.id, 'description', e.target.value)
                }
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-[#f8fafc] focus:border-primary outline-none resize-none font-medium placeholder:text-slate-300"
                placeholder="Type your question here..."
                rows="2"
              ></textarea>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['A', 'B', 'C', 'D'].map((label) => (
                  <div
                    key={label}
                    className={`flex items-center border-2 rounded-2xl px-5 py-4 transition-all duration-300 ${
                      q.correctAnswer === label
                        ? 'border-primary bg-primary-light shadow-sm'
                        : 'border-slate-50 bg-[#f8fafc] hover:border-slate-200'
                    }`}
                  >
                    <button
                      onClick={() =>
                        handleQuestionChange(q.id, 'correctAnswer', label)
                      }
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black mr-4 shadow-sm transition-all ${
                        q.correctAnswer === label
                          ? 'bg-primary text-white scale-110'
                          : 'bg-white text-slate-400 border border-slate-100 hover:border-primary'
                      }`}
                    >
                      {label}
                    </button>
                    <input
                      value={q.options[label]}
                      onChange={(e) =>
                        handleOptionChange(q.id, label, e.target.value)
                      }
                      type="text"
                      placeholder={`Option ${label}`}
                      className="bg-transparent outline-none text-sm w-full font-bold text-slate-600 placeholder:font-normal placeholder:text-slate-300"
                    />
                    {q.correctAnswer === label && (
                      <CheckCircle2 size={18} className="text-primary ml-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#fcfdfe] px-8 py-4 flex items-center border-t border-slate-50">
              <label className="flex items-center gap-3 cursor-pointer text-[10px] font-black text-slate-400 uppercase tracking-widest group">
                <input
                  type="checkbox"
                  checked={q.required}
                  onChange={(e) =>
                    handleQuestionChange(q.id, 'required', e.target.checked)
                  }
                  className="accent-primary w-5 h-5 rounded-md"
                />
                Required Question
              </label>
            </div>
          </div>
        ))}

        <button
          onClick={addQuestion}
          className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[2rem] flex items-center justify-center gap-3 text-primary font-black text-sm uppercase tracking-widest hover:bg-primary-light hover:border-primary/20 transition-all active:scale-[0.99]"
        >
          <PlusCircle size={20} /> Add Next Question
        </button>
      </div>

      {/* Footer Actions */}
      <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Total Items
            </p>
            <p className="text-xl font-black text-primary">
              {questions.length}
            </p>
          </div>
        </div>
        <button
          onClick={handleCreateRoom}
          className="px-12 py-4 bg-primary text-white rounded-[1.5rem] font-black text-sm uppercase tracking-[0.1em] shadow-xl shadow-primary/20 hover:bg-primary-hover hover:-translate-y-1 active:translate-y-0 transition-all w-full md:w-auto"
        >
          Publish Exam Room
        </button>
      </div>
    </div>
  );
};

export default CreateNewRoom;
