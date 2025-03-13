import { CalendarIcon } from 'lucide-react';
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState, useRef, useEffect } from "react";

const TankDate = ({ mode, filters }) => {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDisplayDate = () => {
    if (mode === "historical" && filters.dateRange) {
      const from = format(filters.dateRange.from, "d MMM yyyy", { locale: es });
      const to = format(filters.dateRange.to, "d MMM yyyy", { locale: es });
      return from === to ? from : `${from} - ${to}`;
    }
    return format(lastUpdate, "d MMM yyyy, HH:mm", { locale: es });
  };

  return (
    <div 
      ref={ref} 
      className="relative p-4 rounded-lg space-y-3 cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-primary" />
          <p className="text-xs font-medium text-gray-500 uppercase">
            {mode === "historical" ? "Rango histórico" : "Actualización"}
          </p>
        </div>
      </div>

      {/* Date Display */}
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 flex items-center justify-center bg-blue-100 p-1.5 rounded-full">
          <CalendarIcon className="text-blue-600 w-4 h-4" />
        </div>
        <p className="text-sm font-semibold text-gray-800">
          {getDisplayDate()}
        </p>
      </div>

      {isExpanded && (
        <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-md p-3 w-[220px] z-20">
          <p className="text-xs font-medium text-gray-600">
            {mode === "historical" ? "Periodo seleccionado:" : "Última actualización:"}
          </p>
          <p className="text-sm font-bold text-gray-900 mt-1">
            {getDisplayDate()}
          </p>
        </div>
      )}
    </div>
  );
};

export default TankDate;