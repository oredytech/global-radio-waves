
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface SeeAllButtonProps {
  to: string;
  label?: string;
}

const SeeAllButton: React.FC<SeeAllButtonProps> = ({ to, label = "Voir tout" }) => {
  return (
    <Button
      variant="link"
      asChild
      className="text-gowera-highlight py-1 h-auto flex items-center"
    >
      <Link to={to}>
        {label}
        <ChevronRight size={16} />
      </Link>
    </Button>
  );
};

export default SeeAllButton;
