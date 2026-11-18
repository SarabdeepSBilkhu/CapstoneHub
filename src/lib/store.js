'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFilterStore = create()((set) => ({
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

export const useUIStore = create()(
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
