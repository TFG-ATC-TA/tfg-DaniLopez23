import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import PropTypes from 'prop-types';

const TankStatus = ({ status = "Working" }) => {
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <div className="space-y-1.5">
          <h3 className="font-semibold">Tank Status</h3>
          <Badge 
            variant="outline" 
            className={status === "Working" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
          >
            {status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

TankStatus.propTypes = {
  status: PropTypes.string
};

export default TankStatus;