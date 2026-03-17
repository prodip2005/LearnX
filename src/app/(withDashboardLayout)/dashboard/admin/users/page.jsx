import { getCollection } from '@/lib/mongodb';
import UserManagementClient from './_components/UserManagementClient';
import AdminRoute from '@/components/AdminRoute';

const UserManagementPage = async () => {
  const usersCollection = await getCollection('users');
  const users = await usersCollection.find({}).toArray();

  // MongoDB ObjectId-কে স্ট্রিং-এ রূপান্তর (Serialization)
  const serializedUsers = users.map((user) => ({
    ...user,
    _id: user._id.toString(),
  }));

  return (
    <AdminRoute>
      <div className="p-6 bg-[#f8fafc] min-h-screen">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-800">
            User Control Center
          </h1>
          <p className="text-slate-500 text-sm">
            Manage permissions and view detailed profiles
          </p>
        </div>

        <UserManagementClient initialUsers={serializedUsers} />
      </div>
    </AdminRoute>
  );
};

export default UserManagementPage;
