import { useState } from 'react';
import { Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import PropTypes from 'prop-types';
import DataModeSwitch from './DataModeSwitch';
import useDataStore from '@/Stores/useDataStore';

const TankInformation = ({ selectedTank }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mode, setMode } = useDataStore((state) => state);
  const isRealTime = mode === 'realtime';

  const handleDataModeToggle = (isRealTimeMode) => {
    setMode(isRealTimeMode ? 'realtime' : 'historical');
  };

  if (!selectedTank) {
    return (
      <Card className="w-full h-[88px] flex items-center justify-center">
        <span className="text-gray-500">No tank selected</span>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-xl font-semibold">{selectedTank.name}</CardTitle>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Info className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedTank.name} Information</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <InfoItem label="Capacity" value={`${selectedTank.capacity || 2500} liters`} />
                <InfoItem label="Height" value="1.5 m" />
                <InfoItem label="Weight" value="1000 kg" />
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center space-x-4">
          <DataModeSwitch isRealTime={isRealTime} onToggle={handleDataModeToggle} />
        </div>
      </CardHeader>
    </Card>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-base font-medium">{value}</span>
  </div>
);

InfoItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
};

TankInformation.propTypes = {
  selectedTank: PropTypes.object,
};

export default TankInformation;