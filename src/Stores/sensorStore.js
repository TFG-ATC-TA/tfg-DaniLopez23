import create from 'zustand';

export const useSensorStore = create((set) => ({
    sensorData: {},
    selectedTank: null,
    setSelectedTank: (tankId) => set({ selectedTank: tankId }),
    updateSensorData: (sensorId, data) => set((state) => ({
        sensorData: { ...state.sensorData, [sensorId]: data }
    }))
}));
