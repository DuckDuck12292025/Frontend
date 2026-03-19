import { create } from 'zustand';

interface MuteState {
  mutedIds: Set<number>;
  toggleMute: (userId: number) => void;
  isMuted: (userId: number) => boolean;
  setMutedIds: (ids: number[]) => void;
}

export const useMuteStore = create<MuteState>()((set, get) => ({
  mutedIds: new Set(),
  toggleMute: (userId) => set((state) => {
    const next = new Set(state.mutedIds);
    next.has(userId) ? next.delete(userId) : next.add(userId);
    return { mutedIds: next };
  }),
  isMuted: (userId) => get().mutedIds.has(userId),
  setMutedIds: (ids) => set({ mutedIds: new Set(ids) }),
}));
