import { create } from 'zustand';

// Global Mobile State Store
export const useProfileStore = create((set) => ({
  parentToken: null,
  parentEmail: null,
  activeChild: null, // Holds child details: id, name, ageGroup, totalXp, streakDays
  activeAvatarStyle: 'fantasy', // Default art style style for gameplay

  // Parent login success action
  loginSuccess: (token, email) => set({
    parentToken: token,
    parentEmail: email
  }),

  // Choose which child is currently playing
  selectChild: (child) => set({
    activeChild: child,
    activeAvatarStyle: 'fantasy' // Reset style to baseline on swap
  }),

  // Dynamically update child XP inside the mobile store
  addXp: (amount) => set((state) => {
    if (!state.activeChild) return {};
    return {
      activeChild: {
        ...state.activeChild,
        totalXp: state.activeChild.totalXp + amount
      }
    };
  }),

  // Increment child's daily streak count
  incrementStreak: () => set((state) => {
    if (!state.activeChild) return {};
    return {
      activeChild: {
        ...state.activeChild,
        streakDays: state.activeChild.streakDays + 1
      }
    };
  }),

  // Choose different DreamBooth visual layouts
  setAvatarStyle: (style) => set({
    activeAvatarStyle: style
  }),

  // Reset store (Logouts)
  logout: () => set({
    parentToken: null,
    parentEmail: null,
    activeChild: null,
    activeAvatarStyle: 'fantasy'
  })
}));
