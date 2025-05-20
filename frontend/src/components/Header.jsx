import FarmSelector from "./FarmSelector"
import TankSelector from "./TankSelector"
import ServerStatus from "./ServerStatus"
import useSocketStore from "@/stores/useSocketStore"
import useAppDataStore from "@/stores/useAppDataStore"

const Header = () => {
  const { webSocketServerStatus, mqttStatus } = useSocketStore((state) => state)
  const { serverStatus } = useAppDataStore((state) => state)

  return (
    <div className="bg-white shadow-sm border-b sticky top-0 z-50">
      {/* Header principal - siempre visible */}
      <div className="p-3 md:p-4">
        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6 w-full md:w-auto">
            <FarmSelector />
            <TankSelector />
          </div>

          {/* En desktop: siempre visible */}
          <div>
            <ServerStatus
              serverStatus={serverStatus}
              webSocketServerStatus={webSocketServerStatus}
              mqttStatus={mqttStatus}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
