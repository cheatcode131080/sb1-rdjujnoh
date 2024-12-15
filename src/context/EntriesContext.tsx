import React, { createContext, useContext, useState, useCallback } from 'react';
import { Entry } from '../types';
import { useAuth } from './AuthContext';
import { generateId } from '../lib/utils';

interface EntriesContextType {
  entries: Entry[];
  addEntry: (entry: Omit<Entry, 'id' | 'createdAt' | 'status' | 'userId'>) => void;
  updateEntry: (id: string, updates: Partial<Omit<Entry, 'id' | 'userId'>>) => void;
  moveEntry: (id: string, status: Entry['status']) => void;
  deleteEntry: (id: string) => void;
}

const EntriesContext = createContext<EntriesContextType | null>(null);

// In a real app, this would be in a database
let entriesData: (Entry & { userId: string })[] = [];

export function EntriesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [entries, setEntries] = useState<Entry[]>(() => 
    user ? entriesData.filter(e => e.userId === user.id) : []
  );

  // Update entries when user changes
  React.useEffect(() => {
    if (user) {
      setEntries(entriesData.filter(e => e.userId === user.id));
    } else {
      setEntries([]);
    }
  }, [user]);

  const addEntry = useCallback((newEntry: Omit<Entry, 'id' | 'createdAt' | 'status' | 'userId'>) => {
    if (!user) return;

    const entry: Entry & { userId: string } = {
      ...newEntry,
      id: generateId(),
      status: 'new',
      createdAt: new Date().toISOString(),
      userId: user.id,
    };

    entriesData = [...entriesData, entry];
    setEntries(entriesData.filter(e => e.userId === user.id));
  }, [user]);

  const updateEntry = useCallback((id: string, updates: Partial<Omit<Entry, 'id' | 'userId'>>) => {
    if (!user) return;

    entriesData = entriesData.map(entry => {
      if (entry.id === id && entry.userId === user.id) {
        return { ...entry, ...updates };
      }
      return entry;
    });

    setEntries(entriesData.filter(e => e.userId === user.id));
  }, [user]);

  const moveEntry = useCallback((id: string, newStatus: Entry['status']) => {
    if (!user) return;

    entriesData = entriesData.map(entry => {
      if (entry.id === id && entry.userId === user.id) {
        return { ...entry, status: newStatus };
      }
      return entry;
    });

    setEntries(entriesData.filter(e => e.userId === user.id));
  }, [user]);

  const deleteEntry = useCallback((id: string) => {
    if (!user) return;

    entriesData = entriesData.filter(entry => 
      !(entry.id === id && entry.userId === user.id)
    );

    setEntries(entriesData.filter(e => e.userId === user.id));
  }, [user]);

  return (
    <EntriesContext.Provider
      value={{
        entries,
        addEntry,
        updateEntry,
        moveEntry,
        deleteEntry,
      }}
    >
      {children}
    </EntriesContext.Provider>
  );
}

export function useEntries() {
  const context = useContext(EntriesContext);
  if (!context) {
    throw new Error('useEntries must be used within an EntriesProvider');
  }
  return context;
}

// Admin-only functions
export function useAdminEntries() {
  const { user } = useAuth();
  
  const getUserEntries = useCallback((userId: string): Entry[] => {
    if (user?.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    return entriesData.filter(entry => entry.userId === userId);
  }, [user]);

  return { getUserEntries };
}