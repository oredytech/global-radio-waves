
import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight } from "lucide-react";

interface MenuDrawerProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  onContinentClick: (continent: string) => void;
  continents: string[];
  selectedContinent: string | null;
}

const MenuDrawer: React.FC<MenuDrawerProps> = ({
  open,
  onOpenChange,
  onContinentClick,
  continents,
  selectedContinent,
}) => (
  <Drawer open={open} onOpenChange={onOpenChange}>
    <DrawerContent className="h-[85%]">
      <DrawerHeader className="border-b border-white/10">
        <DrawerTitle className="text-white">Menu supplémentaire</DrawerTitle>
        <DrawerClose className="absolute right-4 top-4" />
      </DrawerHeader>
      <ScrollArea className="h-full p-6">
        <div className="space-y-6">
          <div className="bg-gowera-surface p-4 rounded-lg">
            <h3 className="font-bold text-white mb-4">Découvrez par continent</h3>
            <ul className="space-y-3">
              {continents.map((continent) => (
                <li
                  key={continent}
                  className={`text-gray-300 hover:text-gowera-highlight cursor-pointer transition-colors flex items-center ${continent === selectedContinent ? 'text-gowera-highlight font-medium' : ''}`}
                  onClick={() => onContinentClick(continent)}
                >
                  <ChevronRight size={16} className="mr-2" />
                  {continent}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gowera-surface p-4 rounded-lg">
            <h3 className="font-bold text-white mb-4">Radios tendances</h3>
            <ul className="space-y-3">
              {['Radio Okapi', 'Radio France', 'BBC World Service', 'Voice of America', 'RFI Afrique'].map((station) => (
                <li
                  key={station}
                  className="text-gray-300 hover:text-gowera-highlight cursor-pointer transition-colors flex items-center"
                >
                  <ChevronRight size={16} className="mr-2" />
                  {station}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ScrollArea>
    </DrawerContent>
  </Drawer>
);

export default MenuDrawer;
