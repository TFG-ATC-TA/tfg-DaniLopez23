import { Button } from "./ui/button";
import { Sliders } from "lucide-react";
import FilterComponent from "./HistoricalDataFilter";
import { useState } from "react";

const FilterTab = ({ filters, setFilters, mode }) => {
  const [isFiltersVisible, setIsFiltersVisible] = useState(true);

  return (
    <>
      {mode === "historical" && isFiltersVisible ? (
        <div className="w-80 overflow-hidden flex flex-col">
          <FilterComponent
            filters={filters}
            setFilters={setFilters}
            onToggle={() => setIsFiltersVisible(false)}
          />
        </div>
      ) : mode === "historical" ? (
        <div className="p-2 flex items-start justify-center h-full">
          <Button
            variant="ghost"
            onClick={() => setIsFiltersVisible(true)}
            className="h-auto p-3 flex flex-col gap-2 text-primary hover:bg-primary/10"
          >
            <Sliders className="h-5 w-5 rotate-90" />
            <span className="text-xs font-medium">Filtros</span>
          </Button>
        </div>
      ) : null}
    </>
  );
};

export default FilterTab;
