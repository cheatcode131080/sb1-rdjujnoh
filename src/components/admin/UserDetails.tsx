import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import KanbanBoard from '../KanbanBoard';
import Analytics from '../Analytics';
import { useAdminAuth } from '../../context/AuthContext';

export default function UserDetails() {
  const { userId } = useParams();
  const { getUsers } = useAdminAuth();
  const [activeTab, setActiveTab] = React.useState<'board' | 'analytics'>('board');
  const [username, setUsername] = React.useState<string>('');

  React.useEffect(() => {
    if (userId) {
      try {
        const user = getUsers().find(u => u.id === userId);
        setUsername(user?.username || '');
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    }
  }, [userId, getUsers]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('board')}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'board'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Kanban Board
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Analytics
              </button>
            </div>
            <Link
              to="/admin/analytics"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 py-4"
            >
              <ArrowLeft size={16} />
              Back to Overview
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-[1600px] mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {username}'s {activeTab === 'board' ? 'Kanban Board' : 'Analytics'}
        </h1>
        
        {activeTab === 'board' ? (
          <KanbanBoard userId={userId} />
        ) : (
          <Analytics userId={userId} />
        )}
      </div>
    </div>
  );
}