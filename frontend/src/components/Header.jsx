// Header.jsx
import { useTank } from "@/hooks/useTank";
import useTankStore from "@/stores/useTankStore";
import FarmSelector from "./FarmSelector";
import TankSelector from "./TankSelector";
import ServerStatus from "./ServerStatus";
import useSocketStore from "@/stores/useSocketStore";
import useAppDataStore from "@/stores/useAppDataStore";
import { set } from "date-fns";

const Header = ({ farmData }) => {
  const { changeSelectedTank } = useTank();
  const { selectedTank } = useTankStore((state) => state);
  const { webSocketServerStatus, mqttStatus } = useSocketStore(
    (state) => state
  );
  const { serverStatus, filters, setFilters, setMode } = useAppDataStore(
    (state) => state
  );
  const handleTankChange = (tankId) => {
    const tank = farmData.equipments.find((tank) => tank._id === tankId);
    setFilters({
      ...filters,
      dateRange: null,
      selectedStatus: "all",
      selectedSensor: "all",
    });
    setMode("realtime");
    if (tank) changeSelectedTank(tank, farmData._id);
  };

  return (
    <div className="bg-white p-6 shadow-sm border-b flex justify-between items-center">
      <FarmSelector />

      <div className="flex-1 px-8">
        <TankSelector
          selectedTank={selectedTank}
          handleTankChange={handleTankChange}
          farmData={farmData}
        />
      </div>

      <ServerStatus
        serverStatus={serverStatus}
        webSocketServerStatus={webSocketServerStatus}
        mqttStatus={mqttStatus}
      />
    </div>
  );
};

export default Header;
