import { useState, useCallback } from 'react';
import { Entry } from '../types';
import { INITIAL_ENTRIES } from '../lib/constants';
import { generateId } from '../lib/utils';

export function useEntries() {
  const [entries, setEntries] = useState<Entry[]>(INITIAL_ENTRIES);

  const moveEntry = useCallback((id: string, newStatus: Entry['status']) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, status: newStatus } : entry
      )
    );
  }, []);

  const addEntry = useCallback(
    (newEntry: Omit<Entry, 'id' | 'createdAt' | 'status'>) => {
      const entry: Entry = {
        ...newEntry,
        id: generateId(),
        status: 'new',
        createdAt: new Date().toISOString(),
      };
      setEntries((prev) => [...prev, entry]);
    },
    []
  );

  return { entries, moveEntry, addEntry };
}