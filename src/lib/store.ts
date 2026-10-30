'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FilterState {
  searchQuery: string;
  selectedCategory: string;
  selectedIpStatus: string;
  selectedDepartment: string;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (cat: string) => void;
  setSelectedIpStatus: (ip: string) => void;
  setSelectedDepartment: (dept: string) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>()((set) => ({
  searchQuery: '',
  selectedCategory: 'ALL',
  selectedIpStatus: 'ALL',
  selectedDepartment: 'ALL',
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
  setSelectedIpStatus: (ip) => set({ selectedIpStatus: ip }),
  setSelectedDepartment: (dept) => set({ selectedDepartment: dept }),
  resetFilters: () =>
    set({
      searchQuery: '',
      selectedCategory: 'ALL',
      selectedIpStatus: 'ALL',
      selectedDepartment: 'ALL',
    }),
}));

interface UIState {
  sidebarOpen: boolean;
  activeRubricTab: string;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveRubricTab: (tab: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      activeRubricTab: 'MID_SEM',
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setActiveRubricTab: (tab) => set({ activeRubricTab: tab }),
    }),
    {
      name: 'capstonehub-ui-preferences',
    }
  )
);

