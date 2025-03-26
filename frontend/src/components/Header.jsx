import { useTank } from "@/hooks/useTank";
import useTankStore from "@/stores/useTankStore";
import FarmSelector from "./FarmSelector";
import TankSelector from "./TankSelector";
import ServerStatus from "./ServerStatus";
import useSocketStore from "@/stores/useSocketStore";
import useAppDataStore from "@/stores/useAppDataStore";

const Header = () => {

  const { webSocketServerStatus, mqttStatus } = useSocketStore((state) => state);

  const { serverStatus} = useAppDataStore((state) => state);
  
  return (
    <div className="bg-white p-6 shadow-sm border-b flex justify-between items-center">
      <FarmSelector />
      <div className="flex-1 px-8">
        <TankSelector />
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
