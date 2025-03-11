
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Section } from "@/types/litepaper";

interface SidebarProps {
  sections: Section[];
  activeSection: string;
  openSections: string[];
  onSectionClick: (sectionId: string) => void;
  onSubsectionClick: (subsectionId: string) => void;
  onToggleSection: (sectionId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sections,
  activeSection,
  openSections,
  onSectionClick,
  onSubsectionClick,
  onToggleSection,
}) => {
  return (
    <div className="w-64 fixed left-0 top-20 h-[calc(100vh-5rem)] border-r border-white/10 bg-black/50 backdrop-blur-lg">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-2">
          {sections.map((section) => (
            <div key={section.id} className="space-y-2">
              {section.subsections ? (
                <Collapsible
                  open={openSections.includes(section.id)}
                  onOpenChange={() => onToggleSection(section.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-sm font-medium transition-colors text-left",
                        activeSection === section.id 
                          ? "bg-white/10 text-white" 
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      )}
                      onClick={() => onSectionClick(section.id)}
                    >
                      {openSections.includes(section.id) ? (
                        <ChevronDown className="h-4 w-4 mr-2" />
                      ) : (
                        <ChevronRight className="h-4 w-4 mr-2" />
                      )}
                      {section.title}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="ml-4 space-y-1">
                      {section.subsections.map((subsection) => (
                        <Button
                          key={subsection.id}
                          variant="ghost"
                          className={cn(
                            "w-full justify-start text-sm font-medium transition-colors text-left pl-6",
                            activeSection === subsection.id 
                              ? "bg-white/10 text-white" 
                              : "text-white/60 hover:text-white hover:bg-white/5"
                          )}
                          onClick={() => onSubsectionClick(subsection.id)}
                        >
                          {subsection.title}
                        </Button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sm font-medium transition-colors text-left",
                    activeSection === section.id 
                      ? "bg-white/10 text-white" 
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  )}
                  onClick={() => onSectionClick(section.id)}
                >
                  <div className="w-4 mr-2" />
                  {section.title}
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
