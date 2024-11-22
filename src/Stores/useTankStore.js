import { create } from "zustand";

const useTankStore = create((set) => ({
    selectedTank: null,
    boardsByTank: null,
    setSelectedTank: (tank) => set({ selectedTank: tank }),
    setBoardsByTank: (boards) => set({ boardsByTank: boards }),
}));

export default useTankStore;