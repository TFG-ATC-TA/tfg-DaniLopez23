import { create } from "zustand";

const useTankStore = create((set) => ({
    selectedTank: null,
    setSelectedTank: (tank) => set({ selectedTank: tank }),
}));

export default useTankStore;