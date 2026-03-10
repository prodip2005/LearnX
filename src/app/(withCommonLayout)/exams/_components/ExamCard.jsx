import { FileText, Users, Clock, ArrowRight, Sparkles } from 'lucide-react';

const ExamCard = ({ exam, onJoinClick }) => {
  return (
    <div className="group relative bg-white rounded-[2rem] border border-slate-100 p-2 pb-6 shadow-sm hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
      {/* কার্ডের উপরের ডেকোরেটিভ ব্যাকগ্রাউন্ড */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary-light rounded-bl-[4rem] -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* কন্টেন্ট সেকশন */}
      <div className="relative z-10 p-4">
        <div className="flex justify-between items-start mb-6">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:rotate-6 transition-all duration-500 shadow-sm">
            <FileText size={28} />
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-[10px] font-black bg-primary-light text-primary px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-sm">
              {exam.category || 'Premium'}
            </span>
            {exam.questions?.length > 10 && (
              <div className="flex items-center gap-1 text-[9px] font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-lg animate-pulse">
                <Sparkles size={10} /> POPULAR
              </div>
            )}
          </div>
        </div>

        <h3 className="text-xl font-black text-slate-800 mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
          {exam.roomTitle}
        </h3>

        <p className="text-slate-400 text-xs font-medium mb-6 line-clamp-2">
          Test your knowledge on {exam.roomTitle} with our expert curated
          questions.
        </p>

        <div className="flex items-center justify-between py-4 border-t border-slate-50 mb-6">
          <div className="flex items-center gap-1 text-slate-500">
            <Users size={16} className="text-primary" />
            <span className="text-xs font-bold">
              {exam.questions?.length || 0} Qs
            </span>
          </div>
          <div className="h-4 w-[1px] bg-slate-100"></div>
          <div className="flex items-center gap-1 text-slate-500">
            <Clock size={16} className="text-primary" />
            <span className="text-xs font-bold">30 Mins</span>
          </div>
        </div>

        <button
          onClick={() => onJoinClick(exam.roomCode)}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-slate-900 text-white text-sm font-black group-hover:bg-primary transition-all duration-300 shadow-xl shadow-slate-200 group-hover:shadow-primary/30 active:scale-95"
        >
          Start Assessment{' '}
          <ArrowRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </div>
  );
};

export default ExamCard;
