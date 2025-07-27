import { cn } from "@/utils"

const Skeleton = ({
  className,
  ...props
}) => (
  <div
    className={cn("animate-pulse rounded-md bg-muted", className)}
    {...props}
  />
)

export { Skeleton }


