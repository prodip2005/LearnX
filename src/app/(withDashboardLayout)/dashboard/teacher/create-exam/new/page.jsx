'use client';
import React, { useState } from 'react';
import Swal from 'sweetalert2'; // SweetAlert ইমপোর্ট
import {
  RefreshCw,
  Trash2,
  PlusCircle,
  ChevronDown,
  Upload,
  CheckCircle2,
} from 'lucide-react';

const CreateNewRoom = () => {
  const [roomTitle, setRoomTitle] = useState('');
  const [roomCode, setRoomCode] = useState('882104');
  const [duration, setDuration] = useState('90 Minutes');
  const [category, setCategory] = useState('Science');

  // MCQ Questions State (correctAnswer ফিল্ড যোগ করা হয়েছে)
  const [questions, setQuestions] = useState([
    {
      id: Date.now(),
      description: '',
      options: { A: '', B: '', C: '', D: '' },
      correctAnswer: '', // সঠিক উত্তরের জন্য
      required: false,
    },
  ]);

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
        title: 'Oops...',
        text: 'Please enter a room title!',
      });
    }

    // সঠিক উত্তর সিলেক্ট করা হয়েছে কি না চেক করা
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
      teacherEmail: 'teacher@example.com',
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
          title: 'Success!',
          text: `Exam Room "${roomTitle}" Created. Code: ${roomCode}`,
          confirmButtonColor: '#1fbb32',
        });

        // সফল হওয়ার পর রিসেট লজিক
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
        generateRandomCode(); // কোড অটো জেনারেট হয়ে যাবে
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
    <div className="p-6 md:p-10 w-full bg-[#f9fafb] min-h-screen space-y-8 font-sans">
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <h1 className="text-xl font-bold text-slate-800">
          Create New Exam Room
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
              Room Title
            </label>
            <input
              value={roomTitle}
              onChange={(e) => setRoomTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-[#f8fafc] focus:border-[#1fbb32] outline-none transition-all"
              placeholder="e.g. Advanced Physics - Midterm 2024"
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                Duration
              </label>
              <div className="relative">
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-100 bg-[#f8fafc] outline-none appearance-none"
                >
                  <option>45 Minutes</option>
                  <option>60 Minutes</option>
                  <option>90 Minutes</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                Category
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-100 bg-[#f8fafc] outline-none appearance-none"
                >
                  <option>Science</option>
                  <option>Mathematics</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Room Code Card (ইন্ডিপেন্ডেন্টলি এডিট করা যাবে) */}
        <div className="bg-[#1fbb32] text-white p-8 rounded-2xl flex flex-col justify-center items-center relative overflow-hidden shadow-lg shadow-[#1fbb32]/20">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-4 opacity-80">
            Entry Code
          </p>
          <div className="flex items-center gap-4">
            <input
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.slice(0, 6))}
              className="bg-transparent text-5xl font-bold tracking-widest font-mono outline-none w-48 text-center border-b border-white/30 focus:border-white"
              maxLength={6}
            />
            <RefreshCw
              onClick={generateRandomCode}
              className="cursor-pointer hover:rotate-180 transition-all duration-500"
              size={24}
            />
          </div>
          <p className="text-[10px] mt-6 opacity-70 italic text-center">
            Type manually or click icon to auto-generate
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="font-bold text-slate-800 flex items-center gap-2">
          <CheckCircle2 className="text-[#1fbb32]" size={20} /> Questions &
          Answers
        </h2>

        {questions.map((q, index) => (
          <div
            key={q.id}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all"
          >
            <div className="p-8 space-y-6">
              <div>
                <p className="text-xs font-bold text-slate-400 mb-2 uppercase">
                  Question {index + 1}
                </p>
                <textarea
                  value={q.description}
                  onChange={(e) =>
                    handleQuestionChange(q.id, 'description', e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-[#f8fafc] focus:border-[#1fbb32] outline-none resize-none"
                  placeholder="What is the capital of France?"
                  rows="2"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['A', 'B', 'C', 'D'].map((label) => (
                  <div
                    key={label}
                    className={`flex items-center border rounded-xl px-4 py-3 transition-all ${q.correctAnswer === label ? 'border-[#1fbb32] bg-[#f0fdf4]' : 'border-slate-100 bg-[#f8fafc]'}`}
                  >
                    <button
                      onClick={() =>
                        handleQuestionChange(q.id, 'correctAnswer', label)
                      }
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mr-3 shadow-sm transition-all ${q.correctAnswer === label ? 'bg-[#1fbb32] text-white' : 'bg-white text-slate-400 border border-slate-200'}`}
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
                      className="bg-transparent outline-none text-sm w-full font-medium"
                    />
                    {q.correctAnswer === label && (
                      <CheckCircle2 size={16} className="text-[#1fbb32]" />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 font-bold italic">
                * Click the A, B, C, D circle to set the correct answer
              </p>
            </div>
            <div className="bg-[#f9fafb] px-8 py-3 flex justify-between items-center border-t border-slate-50">
              <label className="flex items-center gap-2 cursor-pointer text-[11px] font-bold text-slate-400 uppercase">
                <input
                  type="checkbox"
                  checked={q.required}
                  onChange={(e) =>
                    handleQuestionChange(q.id, 'required', e.target.checked)
                  }
                  className="accent-[#1fbb32] w-4 h-4"
                />{' '}
                Required
              </label>
              <Trash2
                onClick={() => removeQuestion(q.id)}
                className="text-slate-300 hover:text-red-500 cursor-pointer transition-colors"
                size={18}
              />
            </div>
          </div>
        ))}

        <button
          onClick={addQuestion}
          className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-[#1fbb32] font-bold hover:bg-[#f0fdf4] transition-all"
        >
          <PlusCircle size={20} /> Add New Question
        </button>
      </div>

      <div className="mt-12 pt-6 border-t border-slate-100 flex items-center justify-between">
        <p className="text-xs text-slate-400 font-bold uppercase">
          Total Questions: {questions.length}
        </p>
        <div className="flex gap-4">
          <button
            onClick={handleCreateRoom}
            className="px-10 py-3 bg-[#1fbb32] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#1fbb32]/20 hover:scale-105 active:scale-95 transition-all w-full md:w-auto"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNewRoom;
