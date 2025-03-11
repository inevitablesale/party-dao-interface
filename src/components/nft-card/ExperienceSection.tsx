
import { Briefcase, Calendar, MapPin } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Experience {
  title: string;
  company: string;
  duration: string;
  location: string;
}

interface ExperienceSectionProps {
  experiences: Experience[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExperienceSection = ({ experiences, isOpen, onOpenChange }: ExperienceSectionProps) => {
  const attributeBoxStyle = "bg-black/40 backdrop-blur-xl rounded-xl p-4 flex flex-col h-full transform hover:scale-105 transition-all duration-300 border border-white/5 hover:border-polygon-primary/20";

  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between bg-black/40 backdrop-blur-xl rounded-xl p-4 hover:bg-black/60 transition-colors border border-white/5 hover:border-polygon-primary/20">
          <div className="flex items-center gap-2 text-base text-gray-300">
            <Briefcase className="w-5 h-5 text-polygon-primary" />
            Professional Experience
          </div>
          <div className="text-sm text-polygon-primary">
            {isOpen ? "Hide" : "Show"}
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 space-y-3">
        {experiences.map((exp, index) => (
          <div key={index} className="h-full">
            <div className={attributeBoxStyle}>
              <p className="text-base font-semibold text-white mb-1">{exp.title}</p>
              <p className="text-sm text-polygon-primary">{exp.company}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {exp.duration}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {exp.location}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
