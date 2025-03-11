
import * as React from "react"
import { cn } from "@/lib/utils"

const ToxicCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "toxic-card p-6 animate-toxic-pulse",
      className
    )}
    {...props}
  />
))
ToxicCard.displayName = "ToxicCard"

const ToxicCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
))
ToxicCardHeader.displayName = "ToxicCardHeader"

const ToxicCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight text-toxic-neon toxic-glow",
      className
    )}
    {...props}
  />
))
ToxicCardTitle.displayName = "ToxicCardTitle"

const ToxicCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-toxic-muted", className)}
    {...props}
  />
))
ToxicCardDescription.displayName = "ToxicCardDescription"

const ToxicCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("relative", className)} 
    {...props} 
  >
    <div className="scanline"></div>
    {props.children}
  </div>
))
ToxicCardContent.displayName = "ToxicCardContent"

const ToxicCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4 mt-4 border-t border-toxic-neon/20", className)}
    {...props}
  />
))
ToxicCardFooter.displayName = "ToxicCardFooter"

export { 
  ToxicCard, 
  ToxicCardHeader, 
  ToxicCardFooter, 
  ToxicCardTitle, 
  ToxicCardDescription, 
  ToxicCardContent 
}
