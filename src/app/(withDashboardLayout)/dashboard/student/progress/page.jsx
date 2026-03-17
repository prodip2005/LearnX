import StudentRoute from '@/components/StudentRoute';
import StudentProgressClient from './_components/StudentProgressClient';

const ProgressPage = () => {
  return (
    <StudentRoute>
      <main className="min-h-screen py-12 px-4 md:px-10">
        <div className="max-w-3xl mx-auto">
          <header className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
              Dashboard
            </p>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Learning <span className="text-primary italic">Progress</span>
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              Detailed analysis of your exam performances.
            </p>
          </header>
          <StudentProgressClient />
        </div>
      </main>
    </StudentRoute>
  );
};

export default ProgressPage;
