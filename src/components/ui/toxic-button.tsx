
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toxicButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-toxic-dark text-toxic-neon border border-toxic-neon/60 shadow-[0_0_10px_rgba(57,255,20,0.3)]",
        outline: "border border-toxic-neon/40 bg-transparent text-toxic-neon/80 shadow-[0_0_10px_rgba(57,255,20,0.15)] hover:border-toxic-neon/60 hover:text-toxic-neon hover:shadow-[0_0_12px_rgba(57,255,20,0.25)]",
        ghost: "bg-transparent text-toxic-neon hover:bg-toxic-neon/10",
        glowing: "bg-toxic-dark/80 text-toxic-neon border border-toxic-neon/70 shadow-[0_0_15px_rgba(57,255,20,0.4)] hover:shadow-[0_0_20px_rgba(57,255,20,0.5)] hover:border-toxic-neon/80",
        marketplace: "bg-toxic-dark/60 text-toxic-neon border-2 border-toxic-neon/90 shadow-[0_0_18px_rgba(57,255,20,0.6)] hover:bg-toxic-dark/40 hover:shadow-[0_0_25px_rgba(57,255,20,0.7)]",
        primary: "bg-toxic-dark/70 text-toxic-neon border-2 border-toxic-neon font-bold shadow-[0_0_20px_rgba(57,255,20,0.7)] hover:bg-toxic-dark/50 hover:shadow-[0_0_30px_rgba(57,255,20,0.8)] relative",
        secondary: "bg-toxic-dark/80 text-toxic-neon/90 border border-toxic-neon/80 shadow-[0_0_15px_rgba(57,255,20,0.5)] hover:bg-toxic-dark/60 hover:shadow-[0_0_20px_rgba(57,255,20,0.6)] hover:text-toxic-neon",
        tertiary: "border border-toxic-neon/30 bg-transparent text-toxic-neon/70 shadow-[0_0_8px_rgba(57,255,20,0.1)] hover:bg-toxic-neon/5 hover:border-toxic-neon/50 hover:text-toxic-neon/90 hover:shadow-[0_0_12px_rgba(57,255,20,0.2)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ToxicButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof toxicButtonVariants> {
  asChild?: boolean
}

const ToxicButton = React.forwardRef<HTMLButtonElement, ToxicButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(toxicButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {props.children}
        <span className="absolute inset-0 opacity-20 bg-gradient-to-r from-transparent via-toxic-neon/30 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_forwards]"></span>
        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-toxic-neon/10 transition-opacity duration-300"></span>
        {(variant === 'glowing' || variant === 'secondary') && (
          <>
            <span className="absolute inset-0 bg-toxic-neon/5 animate-pulse"></span>
            <span className="absolute -inset-[1px] border border-toxic-neon/50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </>
        )}
        {(variant === 'marketplace' || variant === 'primary') && (
          <>
            <span className="absolute inset-0 bg-toxic-neon/8 animate-pulse"></span>
            <span className="absolute -inset-[1px] border border-toxic-neon/70 rounded-md opacity-50 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-toxic-neon/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[gradient_3s_ease-in-out_infinite]"></span>
          </>
        )}
      </Comp>
    )
  }
)
ToxicButton.displayName = "ToxicButton"

export { ToxicButton, toxicButtonVariants }
