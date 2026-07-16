'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import type { Property } from '@/data/properties';

const MAX = 3;

interface CompareCtx {
  list: Property[];
  add: (p: Property) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
  isFull: boolean;
}

const Ctx = createContext<CompareCtx>({
  list: [], add: () => {}, remove: () => {}, clear: () => {}, has: () => false, isFull: false,
});

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [list, setList] = useState<Property[]>([]);
  const add = useCallback((p: Property) => {
    setList(prev => prev.length >= MAX || prev.find(x => x.id === p.id) ? prev : [...prev, p]);
  }, []);
  const remove = useCallback((id: string) => setList(prev => prev.filter(p => p.id !== id)), []);
  const clear = useCallback(() => setList([]), []);
  const has = useCallback((id: string) => list.some(p => p.id === id), [list]);
  return (
    <Ctx.Provider value={{ list, add, remove, clear, has, isFull: list.length >= MAX }}>
      {children}
    </Ctx.Provider>
  );
}

export const useCompare = () => useContext(Ctx);
