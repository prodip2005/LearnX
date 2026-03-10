import { X } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-8 relative border">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-center text-slate-800 mb-2">
          Access Exam Room
        </h2>

        <p className="text-sm text-slate-500 text-center mb-6">
          Enter the 6-digit room code
        </p>

        <div className="flex justify-center gap-2 mb-6">
          {[...Array(6)].map((_, index) => (
            <React.Fragment key={index}>
              <input
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={roomCode[index] || ''}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-11 h-12 text-center border rounded text-lg font-semibold outline-none 
                focus:border-primary"
              />

              {index === 2 && (
                <span className="text-gray-400 font-bold">-</span>
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          onClick={onJoin}
          disabled={loading || roomCode.length < 6}
          className="w-full bg-primary text-white py-3 rounded font-semibold
          hover:bg-primary-hover disabled:opacity-40"
        >
          {loading ? 'Verifying...' : 'Join Exam'}
        </button>
      </div>
    </div>
  );
};

export default JoinModal;
