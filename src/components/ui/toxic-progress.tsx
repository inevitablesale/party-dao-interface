
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

interface ToxicProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  variant?: 'radiation' | 'reputation' | 'governance' | 'staking';
}

const ToxicProgress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ToxicProgressProps
>(({ className, value, variant = 'radiation', ...props }, ref) => {
  // Calculate the gradient color based on progress percentage and variant
  const getProgressColor = (percentage: number, variant: string) => {
    switch(variant) {
      case 'radiation':
        if (percentage <= 25) return 'from-toxic-neon to-toxic-neon/50';
        if (percentage <= 50) return 'from-yellow-400 to-yellow-400/50';
        if (percentage <= 75) return 'from-orange-500 to-orange-500/50';
        return 'from-apocalypse-red to-apocalypse-red/50';
      
      case 'reputation':
        if (percentage <= 25) return 'from-apocalypse-red to-apocalypse-red/50';
        if (percentage <= 50) return 'from-yellow-400 to-yellow-400/50';
        if (percentage <= 75) return 'from-blue-400 to-blue-400/50';
        return 'from-toxic-neon to-toxic-neon/50';
      
      case 'governance':
        return 'from-purple-600 to-purple-600/50';
      
      case 'staking':
        return 'from-amber-500 to-amber-500/50';
      
      default:
        return 'from-toxic-neon to-toxic-muted';
    }
  };

  const getGlowColor = (variant: string) => {
    switch(variant) {
      case 'radiation': return 'shadow-[0_0_10px_rgba(57,255,20,0.5)]';
      case 'reputation': return 'shadow-[0_0_10px_rgba(57,255,20,0.5)]';
      case 'governance': return 'shadow-[0_0_10px_rgba(139,92,246,0.5)]';
      case 'staking': return 'shadow-[0_0_10px_rgba(245,158,11,0.5)]';
      default: return 'shadow-[0_0_10px_rgba(57,255,20,0.5)]';
    }
  };

  const percentage = value || 0;
  const gradientClass = getProgressColor(percentage, variant);
  const glowClass = getGlowColor(variant);

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-black border border-toxic-muted/30",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 transition-all bg-gradient-to-r",
          gradientClass,
          glowClass,
          "relative overflow-hidden animate-toxic-pulse"
        )}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      >
        <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full animate-[shine_2s_ease-in-out_infinite]"></div>
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  );
})
ToxicProgress.displayName = ProgressPrimitive.Root.displayName

export { ToxicProgress }
