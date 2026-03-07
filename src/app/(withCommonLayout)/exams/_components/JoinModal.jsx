import { X, ShieldCheck } from 'lucide-react';
import React, { useRef, useEffect } from 'react';
const JoinModal = ({
  isOpen,
  onClose,
  roomCode,
  setRoomCode,
  onJoin,
  loading,
}) => {
  const inputRefs = useRef([]);

  // কোড পরিবর্তন হ্যান্ডেল করা
  const handleChange = (index, value) => {
    const newVal = value.toUpperCase();
    if (newVal.length > 1) return; // শুধু একটি ক্যারেক্টার নেবে

    let currentCode = roomCode.split('');
    currentCode[index] = newVal;
    const finalCode = currentCode.join('');
    setRoomCode(finalCode);

    // অটোমেটিক পরের বক্সে যাওয়া
    if (newVal && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // ব্যাকস্পেস হ্যান্ডেল করা (আগের বক্সে ফিরে আসা)
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !roomCode[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // যখনই মোডাল খুলবে প্রথম বক্সে ফোকাস হবে
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
      setRoomCode(''); // ক্লিয়ার কোড
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all">
      <div className="bg-white rounded-[3rem] p-8 md:p-12 max-w-lg w-full relative shadow-2xl animate-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-slate-300 hover:text-slate-600 transition-colors"
        >
          <X size={28} />
        </button>

        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-[#f0fdf4] text-[#1fbb32] rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            Access Exam Room
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            Enter the 6-digit invitation code to proceed.
          </p>
        </div>

        {/* ৬টি আলাদা বক্সের গ্রিড */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {[...Array(6)].map((_, index) => (
            <React.Fragment key={index}>
              <input
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={roomCode[index] || ''}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-16 md:w-14 md:h-20 text-center text-3xl font-black bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#1fbb32] focus:bg-white focus:ring-4 ring-[#1fbb32]/5 transition-all text-slate-700 shadow-sm"
              />
              {/* ৩ নাম্বার বক্সের পর হাইফেন */}
              {index === 2 && (
                <span className="text-slate-300 font-bold text-2xl">-</span>
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          onClick={onJoin}
          disabled={loading || roomCode.length < 6}
          className="w-full bg-[#1fbb32] text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-[#1fbb32]/20 hover:bg-[#19a32b] hover:-translate-y-1 active:scale-[0.98] transition-all disabled:opacity-40 disabled:hover:translate-y-0"
        >
          {loading ? 'Verifying...' : 'Unlock & Enter Hall'}
        </button>

        <p className="text-center mt-6 text-xs text-slate-400 font-medium tracking-wide">
          By entering, you agree to LearnX exam regulations.
        </p>
      </div>
    </div>
  );
};

export default JoinModal;
