import { getCollection } from '@/lib/mongodb';
import AllExamsClient from './_components/AllExamsClient';
import AdminRoute from '@/components/AdminRoute';

const AllExamsPage = async () => {
  // আপনার API অনুযায়ী কালেকশনের নাম 'questions' হবে
  const examsCollection = await getCollection('questions');
  const resultsCollection = await getCollection('results');

  // ডাটা ফেচ করা
  const exams = await examsCollection
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  const results = await resultsCollection.find({}).toArray();

  // ডাটা সিরিয়ালাইজ করা (ObjectId কে String এ রূপান্তর)
  const serializedExams = exams.map((exam) => ({
    ...exam,
    _id: exam._id.toString(),
  }));

  const serializedResults = results.map((result) => ({
    ...result,
    _id: result._id.toString(),
  }));

  return (
    <AdminRoute>
      <div className="p-6 bg-[#f8fafc] min-h-screen">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            All Examination Records
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Monitor all created exam rooms and student performances across the
            platform.
          </p>
        </div>

        <AllExamsClient
          initialExams={serializedExams}
          allResults={serializedResults}
        />
      </div>
    </AdminRoute>
  );
};

export default AllExamsPage;
