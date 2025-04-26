
import React from "react";

const StationWaveform: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-6 w-12">
      <div className="w-1 h-3 bg-gowera-highlight mx-0.5 rounded-full animate-[soundwave_0.8s_infinite_ease-in-out_alternate]"></div>
      <div className="w-1 h-5 bg-gowera-highlight mx-0.5 rounded-full animate-[soundwave_0.5s_infinite_ease-in-out_alternate]"></div>
      <div className="w-1 h-7 bg-gowera-highlight mx-0.5 rounded-full animate-[soundwave_0.7s_infinite_ease-in-out_alternate]"></div>
      <div className="w-1 h-4 bg-gowera-highlight mx-0.5 rounded-full animate-[soundwave_0.6s_infinite_ease-in-out_alternate]"></div>
    </div>
  );
};

export default StationWaveform;
