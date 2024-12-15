import React from 'react';
import { useDrag } from 'react-dnd';
import { DollarSign, Pencil, Calendar } from 'lucide-react';
import { Entry } from '../../types/index';
import { formatCurrency } from '../../lib/utils';
import EditEntryForm from './EditEntryForm';
import { useEntries } from '../../context/EntriesContext';
import { COLUMN_CONFIG } from '../../lib/constants';

interface Props {
  entry: Entry;
  status: Entry['status'];
}

export default function KanbanCard({ entry, status }: Props) {
  const { updateEntry, deleteEntry } = useEntries();
  const [isEditing, setIsEditing] = React.useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    item: { id: entry.id, type: 'card', status: entry.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const valueColor = status === 'dropped' ? 'text-red-600' : 'text-green-600';
  const statusConfig = COLUMN_CONFIG.find(config => config.status === status);

  return (
    <>
      <div
        ref={drag}
        className={`bg-white p-4 rounded-lg shadow-sm cursor-move ${
          isDragging ? 'opacity-50' : ''
        }`}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-900">{entry.name}</h3>
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Pencil size={16} />
          </button>
        </div>
        
        {entry.products && (
          <p className="text-sm text-gray-600 mb-2">{entry.products}</p>
        )}
        
        <div className="flex items-center justify-between mt-3">
          <div className={`flex items-center text-sm font-medium ${valueColor}`}>
            <DollarSign size={16} className="mr-1" />
            {formatCurrency(entry.value)}
          </div>
          
          <div className="flex items-center gap-4">
            <span className={`text-xs px-2 py-1 rounded-full ${statusConfig?.bgColor} ${statusConfig?.headerColor} border ${statusConfig?.borderColor}`}>
              {status}
            </span>
            
            <div className="flex items-center text-xs text-gray-500">
              <Calendar size={14} className="mr-1" />
              {new Date(entry.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <EditEntryForm
          entry={entry}
          onClose={() => setIsEditing(false)}
          onSubmit={(updates) => {
            updateEntry(entry.id, updates);
            setIsEditing(false);
          }}
          onDelete={() => {
            deleteEntry(entry.id);
            setIsEditing(false);
          }}
        />
      )}
    </>
  );
}