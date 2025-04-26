
import React from "react";
import { Loader2 } from "lucide-react";

const StationsLoading: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <Loader2 className="animate-spin text-gowera-highlight" size={30} />
    </div>
  );
};

export default StationsLoading;
