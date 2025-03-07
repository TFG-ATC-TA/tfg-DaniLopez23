// Header.jsx
import { useTank } from "@/hooks/useTank";
import useTankStore from '@/stores/useTankStore';
import useFarmStore from '@/stores/useFarmStore';
import FarmSelector from './FarmSelector';
import TankSelector from './TankSelector';
import ServerStatus from './ServerStatus';

const Header = ({ serverStatus, mqttStatus, webSocketServerStatus, farmData }) => {
  const { changeSelectedTank } = useTank();
  const { selectedTank } = useTankStore((state) => state);
  const handleTankChange = (tankId) => {
    const tank = farmData.equipments.find((tank) => tank._id === tankId);
    if (tank) changeSelectedTank(tank, farmData._id);
  };

  return (
    <div className="bg-white p-6 shadow-sm border-b flex justify-between items-center">
      <FarmSelector/>
      
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