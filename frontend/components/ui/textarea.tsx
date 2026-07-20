import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-[10px] border border-input bg-card px-3.5 py-3 text-sm font-mono text-foreground",
      "placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring resize-y",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
