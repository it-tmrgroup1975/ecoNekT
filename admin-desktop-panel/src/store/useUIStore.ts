import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 1. กำหนด Interface ให้ครอบคลุมถึงสถานะการโหลด (Hydration)
interface UIState {
  isSidebarOpen: boolean;
  employeeViewMode: 'list' | 'kanban';
  _hasHydrated: boolean; // สำหรับตรวจสอบว่าโหลดค่าจาก localStorage เสร็จหรือยัง
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setEmployeeViewMode: (mode: 'list' | 'kanban') => void;
  setHasHydrated: (state: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Default States
      isSidebarOpen: true,
      employeeViewMode: 'list',
      _hasHydrated: false,

      // Actions logic
      toggleSidebar: () => 
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      
      setSidebarOpen: (open) => 
        set({ isSidebarOpen: open }),

      setEmployeeViewMode: (mode) => 
        set({ employeeViewMode: mode }),

      setHasHydrated: (state) => 
        set({ _hasHydrated: state }),
    }),
    {
      name: 'econekt-ui-storage', // Key ใน LocalStorage
      storage: createJSONStorage(() => localStorage), // ระบุ Storage Engine ให้ชัดเจน
      
      // เลือกเก็บเฉพาะ State ที่จำเป็น (ไม่เก็บ _hasHydrated ลงเครื่อง)
      partialize: (state) => ({ 
        isSidebarOpen: state.isSidebarOpen, 
        employeeViewMode: state.employeeViewMode 
      }),

      // ทำงานหลังจากดึงข้อมูลจากเครื่องเสร็จ
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);