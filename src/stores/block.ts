import { create } from 'zustand';

interface BlockState {
  blockedIds: Set<number>;
  toggleBlock: (userId: number) => void;
  isBlocked: (userId: number) => boolean;
  setBlockedIds: (ids: number[]) => void;
}

export const useBlockStore = create<BlockState>()((set, get) => ({
  blockedIds: new Set(),
  toggleBlock: (userId) => set((state) => {
    const next = new Set(state.blockedIds);
    next.has(userId) ? next.delete(userId) : next.add(userId);
    return { blockedIds: next };
  }),
  isBlocked: (userId) => get().blockedIds.has(userId),
  setBlockedIds: (ids) => set({ blockedIds: new Set(ids) }),
}));
