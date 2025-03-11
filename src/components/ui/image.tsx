
import { cn } from "@/lib/utils"

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  width?: number
  height?: number
}

const Image = ({ className, width, height, ...props }: ImageProps) => {
  return (
    <img 
      {...props}
      width={width}
      height={height}
      className={cn(
        "max-w-full h-auto",
        className
      )}
    />
  )
}

export default Image
