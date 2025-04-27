import { create } from "zustand"

const useTankStore = create((set) => ({
  selectedTank: null,
  boardsByTank: null,
  setSelectedTank: (tank) => set({ selectedTank: tank }),
  setBoardsByTank: (boards) => set({ boardsByTank: boards }),
  setTankState: (state) =>
    set((prevState) => ({
      selectedTank: prevState.selectedTank ? { ...prevState.selectedTank, state } : null,
    })),
}))

export default useTankStore
