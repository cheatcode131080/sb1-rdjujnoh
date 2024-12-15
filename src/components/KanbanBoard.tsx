import React from 'react';
import { Plus } from 'lucide-react';
import KanbanColumn from './kanban/KanbanColumn';
import EntryForm from './kanban/EntryForm';
import { useEntries, useAdminEntries } from '../context/EntriesContext';
import { useAuth } from '../context/AuthContext';
import { COLUMN_CONFIG } from '../lib/constants';
import { Entry } from '../types';

interface Props {
  userId?: string;
}

export default function KanbanBoard({ userId }: Props) {
  const { user } = useAuth();
  const { entries, moveEntry, addEntry } = useEntries();
  const { getUserEntries } = useAdminEntries();
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  // If userId is provided (admin view), use admin entries
  const displayEntries: Entry[] = userId ? getUserEntries(userId) : entries;
  
  // Only show add button if viewing own board
  const showAddButton = !userId || userId === user?.id;

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        {showAddButton && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            New Entry
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {COLUMN_CONFIG.map(({ title, status, bgColor, borderColor, headerColor }) => (
          <KanbanColumn
            key={status}
            title={title}
            status={status}
            bgColor={bgColor}
            borderColor={borderColor}
            headerColor={headerColor}
            entries={displayEntries.filter((entry) => entry.status === status)}
            onMove={moveEntry}
            readOnly={!!userId && userId !== user?.id}
          />
        ))}
      </div>

      {isFormOpen && (
        <EntryForm
          onClose={() => setIsFormOpen(false)}
          onSubmit={(entry) => {
            addEntry(entry);
            setIsFormOpen(false);
          }}
        />
      )}
    </div>
  );
}