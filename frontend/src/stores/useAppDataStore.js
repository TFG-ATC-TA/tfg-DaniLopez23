import { create } from "zustand";

const useAppDataStore = create((set) => ({
  filters: {
    dateRange: null,
    selectedStatus: "all",
    selectedSensor: "all",
  },
  mode: "realtime",
  serverStatus: { status: 'connecting', error: null },
  setFilters: (filters) => set({ filters: filters }),
  setMode: (mode) => set({ mode: mode }),
  setServerStatus: (status) => set({ serverStatus: status }),
}));
export default useAppDataStore;
