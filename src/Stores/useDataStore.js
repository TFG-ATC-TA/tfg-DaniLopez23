// sensorStore.js
import create from 'zustand';

const useDataStore = create((set) => ({
  encoderData: null,
  gyroscopeData: null,
  milkQuantityData: null,
  tankTemperaturesData: null,
  switchStatus: null,
  weightData: null,
  airQualityData: null,

  // Métodos para actualizar los datos de cada sensor
  updateEncoderData: (data) => set({ encoderData: data }),
  updateGyroscopeData: (data) => set({ gyroscopeData: data }),
  updateMilkQuantityData: (data) => set({ milkQuantityData: data }),
  updateTankTemperaturesData: (data) => set({ tankTemperaturesData: data }),
  updateSwitchStatus: (data) => set({ switchStatus: data }),
  updateWeightData: (data) => set({ weightData: data }),
  updateAirQualityData: (data) => set({ airQualityData: data }),
}));

export default useDataStore;
