import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplet, Scale, Activity, ChevronDown, ChevronUp } from "lucide-react";

const Sidebar = ({ farmData, selectedTank, setSelectedTank, className }) => {
  const [openItems, setOpenItems] = useState(["tanks", "sensors"]);

  const sensors = [
    { name: "Temperature", icon: Thermometer, description: "Measures tank temperature" },
    { name: "Milk Level", icon: Droplet, description: "Monitors milk quantity" },
    { name: "Weight", icon: Scale, description: "Measures tank weight" },
    { name: "Status", icon: Activity, description: "Monitors tank operational status" },
  ];

  const toggleItem = (item) => {
    setOpenItems((prevItems) =>
      prevItems.includes(item)
        ? prevItems.filter((i) => i !== item)
        : [...prevItems, item]
    );
  };

  const expandAll = () => setOpenItems(["tanks", "sensors"]);
  const collapseAll = () => setOpenItems([]);

  return (
    <div className={`p-4 ${className}`}>
      <h2 className="text-xl font-bold mb-4">3D Tank info</h2>
      <ScrollArea className="h-[calc(100vh-10rem)]">
        <Accordion type="multiple" value={openItems} onValueChange={setOpenItems}>
          <AccordionItem value="tanks">
            <AccordionTrigger onClick={() => toggleItem("tanks")}>Tanks</AccordionTrigger>
            <AccordionContent>
              {farmData.tanks &&
                farmData.tanks.map((tank) => (
                  <Button
                    key={tank.id}
                    className={`w-full mb-2 ${
                      selectedTank && selectedTank.id === tank.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}
                    onClick={() => setSelectedTank(tank)}
                  >
                    {tank.tankName}
                  </Button>
                ))}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="sensors">
            <AccordionTrigger onClick={() => toggleItem("sensors")}>Sensors</AccordionTrigger>
            <AccordionContent>
              {sensors.map((sensor) => (
                <Card key={sensor.name} className="mb-2">
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <sensor.icon className="w-4 h-4 mr-2" />
                      {sensor.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <p className="text-xs text-muted-foreground">{sensor.description}</p>
                  </CardContent>
                </Card>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;