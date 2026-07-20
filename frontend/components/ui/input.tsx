import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full rounded-[10px] border border-input bg-card px-3.5 h-11 text-sm text-foreground",
      "placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
