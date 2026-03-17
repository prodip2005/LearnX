import { getCollection } from '@/lib/mongodb';
import ResultsClient from './_components/ResultsClient';
import AdminRoute from '@/components/AdminRoute';

const AllExamsResultsPage = async () => {
  const resultsCollection = await getCollection('results');
  const results = await resultsCollection
    .find({})
    .sort({ submittedAt: -1 })
    .toArray();

  const serializedResults = results.map((r) => ({
    ...r,
    _id: r._id.toString(),
  }));

  return (
    <AdminRoute>
      <div className="p-6 bg-[#f8fafc] min-h-screen">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Students Performance Records
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Manage and monitor all student exam submissions.
          </p>
        </div>

        <ResultsClient initialResults={serializedResults} />
      </div>
    </AdminRoute>
  );
};

export default AllExamsResultsPage;
