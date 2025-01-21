import useDataStore from "@/Stores/useDataStore"

const FARM_ID = "synthetic-farm-1";

const {
    updateEncoderData,
    updateGyroscopeData,
    updateMilkQuantityData,
    updateTankTemperaturesData,
    updateSwitchStatus,
    updateWeightData,
    updateAirQualityData,
 } = useDataStore((state) => (state))

export const events = {
    [ `${FARM_ID}/encoder` ]: updateEncoderData,
    [ `${FARM_ID}/6_dof_imu` ]: updateGyroscopeData,
    [ `${FARM_ID}/tank_distances` ]: updateMilkQuantityData,
    [ `${FARM_ID}/tank_temperature_probes` ]: updateTankTemperaturesData,
    [ `${FARM_ID}/magentic_switch` ]: updateSwitchStatus,
    [ `${FARM_ID}/weight` ]: updateWeightData,
    [ `${FARM_ID}/air_quality` ]: updateAirQualityData,
}

console.log(events)