
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface AttributeBoxProps {
  icon: LucideIcon;
  label: string;
  value: string;
  className?: string;
}

export const AttributeBox = ({ icon: Icon, label, value, className }: AttributeBoxProps) => {
  const attributeBoxStyle = cn(
    "relative group",
    "bg-black/40 backdrop-blur-xl rounded-lg p-6",
    "border border-[#00ff87]/20",
    "before:absolute before:inset-0",
    "before:border before:border-[#00ff87]/20 before:rounded-lg",
    "before:transition-all before:duration-300",
    "hover:before:scale-105 hover:before:border-[#00ff87]/40",
    "after:absolute after:inset-0",
    "after:bg-gradient-to-br after:from-[#00ff87]/10 after:to-transparent",
    "after:opacity-0 hover:after:opacity-100",
    "after:transition-opacity after:duration-300",
    className
  );

  return (
    <motion.div
      className={attributeBoxStyle}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative z-10">
        {/* Label Section */}
        <div className="flex items-center gap-2 mb-3">
          <Icon className="w-5 h-5 text-[#00ff87]" />
          <span className="text-[#00ff87] font-mono uppercase tracking-wider text-sm">
            {label}
          </span>
        </div>
        
        {/* Value Section */}
        <div className="font-semibold text-white/90 break-words">
          {value}
        </div>

        {/* Decorative Corner Elements */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00ff87]/40" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00ff87]/40" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#00ff87]/40" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00ff87]/40" />
      </div>
    </motion.div>
  );
};
