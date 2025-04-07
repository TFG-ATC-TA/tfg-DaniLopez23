import FarmSelector from "./FarmSelector"
import TankSelector from "./TankSelector"
import ServerStatus from "./ServerStatus"
import useSocketStore from "@/stores/useSocketStore"
import useAppDataStore from "@/stores/useAppDataStore"

const Header = () => {
  const { webSocketServerStatus, mqttStatus } = useSocketStore((state) => state)
  const { serverStatus } = useAppDataStore((state) => state)

  return (
    <div className="bg-white p-4 md:p-6 shadow-sm border-b">
      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-10">
          <FarmSelector />
          <TankSelector />
        </div>
        <ServerStatus
          serverStatus={serverStatus}
          webSocketServerStatus={webSocketServerStatus}
          mqttStatus={mqttStatus}
        />
      </div>
    </div>
  )
}

export default Header

