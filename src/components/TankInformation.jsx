import { useState } from 'react';
import { Info } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useTankStore from "@/Stores/useTankStore";
import PropTypes from 'prop-types';

const TankInformation = ({ className }) => {
  const selectedTank = useTankStore((state) => state.selectedTank);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!selectedTank) {
    return (
      <div className={`text-center text-gray-500 ${className}`}>
        No tank selected
      </div>
    );
  }

  return (
    <div className={`flex justify-between items-center p-4 ${className}`}>
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold">{selectedTank.name}</h2>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Info className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
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
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="font-medium text-gray-700">{label}:</span>
    <span className="text-gray-900">{value}</span>
  </div>
);

InfoItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
};

TankInformation.propTypes = {
  className: PropTypes.string,
};

export default TankInformation;