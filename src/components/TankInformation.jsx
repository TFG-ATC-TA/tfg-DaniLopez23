import { Badge } from "@/components/ui/badge";
import { Droplet, Scale, Ruler, Thermometer, Activity } from "lucide-react";

const TankInformation = ({ selectedTank, className }) => {
  return (
    <div className={`bg-white shadow-sm p-4 rounded-lg ${className}`}>
      {selectedTank ? (
        <div className="flex flex-wrap justify-between items-center">
          <InfoItem  label="Tank Name" value={selectedTank.tankName} />
          <InfoItem  label="Capacity" value={`${selectedTank.capacity || 2500} liters`} />
          <InfoItem  label="Height" value="1.5 m" />
          <InfoItem  label="Weight" value="1000 kg" />
          <InfoItem
            label="Status"
            value={<Badge variant="success">Working</Badge>}
          />
        </div>
      ) : (
        <p className="text-center text-gray-500">No tank selected</p>
      )}
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-2 mb-2 mr-4">
    <div className="text-primary">{icon}</div>
    <div>
      <p className="text-md font-semibold">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  </div>
);

export default TankInformation;