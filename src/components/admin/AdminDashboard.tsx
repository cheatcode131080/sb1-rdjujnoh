import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AuthContext';
import { UserWithoutPassword } from '../../types/auth';
import UserAnalytics from './UserAnalytics';
import { Eye } from 'lucide-react';

export default function AdminDashboard() {
  const { getUsers } = useAdminAuth();
  const [users, setUsers] = React.useState<UserWithoutPassword[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      setUsers(getUsers());
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  }, [getUsers]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sales Analytics Overview</h1>
        <select
          value={selectedUser || ''}
          onChange={(e) => setSelectedUser(e.target.value || null)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Users</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-8">
        {selectedUser ? (
          <UserAnalytics userId={selectedUser} />
        ) : (
          users.map((user) => (
            <div key={user.id} className="relative">
              <UserAnalytics 
                userId={user.id} 
                username={user.username}
              />
              <div className="absolute top-4 right-4">
                <Link
                  to={`/admin/users/${user.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Eye size={16} />
                  View Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}