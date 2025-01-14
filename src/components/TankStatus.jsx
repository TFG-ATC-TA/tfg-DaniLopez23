import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import useTankStore from '@/Stores/useTankStore';

const statusConfig = {
  operational: {
    color: 'bg-green-500',
    icon: CheckCircle,
    text: 'Operational'
  },
  warning: {
    color: 'bg-yellow-500',
    icon: AlertTriangle,
    text: 'Warning'
  },
  error: {
    color: 'bg-red-500',
    icon: XCircle,
    text: 'Error'
  }
};

const TankStatus = () => {
  const { selectedTank } = useTankStore();
  
  if (!selectedTank) {
    return null;
  }

  const status = selectedTank.status || 'operational';
  const { color, icon: Icon, text } = statusConfig[status];

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Tank Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${color}`}></div>
            <span className="font-medium">{selectedTank.name}</span>
          </div>
          <Badge variant="outline" className="font-semibold">
            <Icon className="w-4 h-4 mr-1" />
            {text}
          </Badge>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Last updated: {new Date().toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default TankStatus;