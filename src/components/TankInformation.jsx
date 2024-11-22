import { Badge } from "@/components/ui/badge";
import useTankStore from "@/Stores/useTankStore";
import PropTypes from 'prop-types';

const TankInformation = ({ className }) => {

  const selectedTank = useTankStore((state) => state.selectedTank);
  return (
    <div className={`bg-white shadow-sm p-4 rounded-lg ${className}`}>
      {selectedTank ? (
        <div className="flex flex-wrap justify-between items-center">
          <InfoItem  label="Tank Name" value={selectedTank.name} />
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
      <div className="text-sm">{value}</div>
    </div>
  </div>
);

InfoItem.propTypes = {
  icon: PropTypes.element,
  label: PropTypes.string,
  value: PropTypes.node,
};

TankInformation.propTypes = {
  selectedTank: PropTypes.shape({
    name: PropTypes.string,
    capacity: PropTypes.number,
  }),
  className: PropTypes.string,
};

export default TankInformation;