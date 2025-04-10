"use client"

import { Maximize, Minimize, ArrowUpCircle, ArrowRightCircle, ArrowLeftCircle } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import useAppDataStore from "@/stores/useAppDataStore"

const CameraControlButtons = ({ handleViewChange }) => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const {mode, filters} = useAppDataStore((state) => state)
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true)
        })
        .catch((err) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`)
        })
    } else {
      if (document.exitFullscreen) {
        document
          .exitFullscreen()
          .then(() => {
            setIsFullscreen(false)
          })
          .catch((err) => {
            console.error(`Error attempting to exit fullscreen: ${err.message}`)
          })
      }
    }
  }

  if(mode === "historical" && filters.dateRange === null) {
    return null
  }

  return (
    <div className="absolute bottom-3 right-3 z-50 flex flex-col gap-2 sm:flex-row">
      <TooltipProvider>
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-1.5 flex flex-row sm:flex-row gap-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-white hover:bg-gray-100"
                onClick={() => handleViewChange("lateral")}
              >
                <ArrowLeftCircle className="h-4 w-4" />
                <span className="sr-only">Vista Lateral</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Vista Lateral</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-white hover:bg-gray-100"
                onClick={() => handleViewChange("front")}
              >
                <ArrowRightCircle className="h-4 w-4" />
                <span className="sr-only">Vista Frontal</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Vista Frontal</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-white hover:bg-gray-100"
                onClick={() => handleViewChange("top")}
              >
                <ArrowUpCircle className="h-4 w-4" />
                <span className="sr-only">Vista Zenital</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Vista Zenital</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-white hover:bg-gray-100"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                <span className="sr-only">{isFullscreen ? "Salir de Pantalla Completa" : "Pantalla Completa"}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{isFullscreen ? "Salir de Pantalla Completa" : "Pantalla Completa"}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  )
}

export default CameraControlButtons
