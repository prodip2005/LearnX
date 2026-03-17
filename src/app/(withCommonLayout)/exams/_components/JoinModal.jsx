import { X, Lock, Sparkles, Loader2 } from 'lucide-react';
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

  const handleChange = (index, value) => {
    const newVal = value.toUpperCase();
    if (newVal.length > 1) return;

    let code = roomCode.split('');
    code[index] = newVal;
    const finalCode = code.join('');
    setRoomCode(finalCode);

    if (newVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !roomCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
      setRoomCode('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 z-[100] transition-all duration-300">
      <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 relative border border-white/20 shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Decorative elements */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-50"></div>

        <button
          onClick={onClose}
          className="absolute right-6 top-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center mb-10">
            <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-sm">
                <Lock size={32} strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-2">
                Join Private Exam
            </h2>
            <p className="text-slate-500 font-medium">
                Please enter the <span className="text-primary font-bold">6-digit room code</span> provided by your teacher.
            </p>
        </div>

        <div className="flex justify-center gap-3 mb-10">
          {[...Array(6)].map((_, index) => (
            <React.Fragment key={index}>
              <input
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={roomCode[index] || ''}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-14 h-16 text-center border-2 border-slate-100 rounded-2xl text-2xl font-black text-slate-800 outline-none 
                focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all bg-slate-50/50"
              />

              {index === 2 && (
                <div className="flex items-center">
                    <span className="text-slate-200 font-black text-xl">—</span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          onClick={onJoin}
          disabled={loading || roomCode.length < 6}
          className="w-full h-16 group relative flex items-center justify-center gap-3 bg-primary text-white py-4 rounded-[2rem] font-black text-lg
          shadow-xl shadow-primary/20 hover:bg-primary-hover hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all"
        >
          {loading ? (
             <Loader2 className="animate-spin" size={24} />
          ) : (
            <>
                Join Hall
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default JoinModal;
