import { FileText, Users, Clock, ArrowRight, Sparkles } from 'lucide-react';

const ExamCard = ({ exam, onJoinClick }) => {
  return (
    <div className="group relative bg-white rounded-[2.5rem] border border-slate-100 p-2 pb-8 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
      {/* Decorative background element on hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[5rem] -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10 p-6">
        <div className="flex justify-between items-start mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#f8fafc] text-slate-400 flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:rotate-6 transition-all duration-500 shadow-sm">
            <FileText size={32} />
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-[10px] font-black bg-primary-light text-primary px-4 py-2 rounded-xl uppercase tracking-widest shadow-sm border border-primary/5">
              {exam.category || 'Premium'}
            </span>
            {exam.questions?.length > 10 && (
              <div className="flex items-center gap-1.5 text-[10px] font-black text-orange-500 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100 animate-pulse">
                <Sparkles size={12} fill="currentColor" /> POPULAR
              </div>
            )}
          </div>
        </div>

        <h3 className="text-2xl font-black text-slate-800 mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
          {exam.roomTitle}
        </h3>

        <p className="text-slate-400 text-sm font-medium mb-8 line-clamp-2 leading-relaxed">
          Unlock your potential by testing your skills in {exam.roomTitle}. 
          Curated by industry experts for real-world scenarios.
        </p>

        <div className="flex items-center justify-between py-5 border-t border-slate-50 mb-8">
          <div className="flex items-center gap-2 text-slate-600">
            <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                <Users size={16} />
            </div>
            <span className="text-sm font-bold">
              {exam.questions?.length || 0} Questions
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                <Clock size={16} />
            </div>
            <span className="text-sm font-bold">30 Mins</span>
          </div>
        </div>

        <button
          onClick={() => onJoinClick(exam.roomCode)}
          className="w-full flex items-center justify-center gap-3 py-5 rounded-[2rem] bg-slate-900 text-white text-base font-black group-hover:bg-primary transition-all duration-300 shadow-xl shadow-slate-200 group-hover:shadow-primary/30 active:scale-95"
        >
          Start Assessment
          <ArrowRight
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </div>
  );
};

export default ExamCard;
