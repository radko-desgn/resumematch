"use client";

import * as React from "react";
import { UploadCloud, FileCheck2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function FileDrop({
  accept,
  file,
  onFile,
  hint,
  className,
}: {
  accept: string;
  file: File | null;
  onFile: (f: File | null) => void;
  hint: string;
  className?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [drag, setDrag] = React.useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        if (e.dataTransfer.files?.[0]) onFile(e.dataTransfer.files[0]);
      }}
      className={cn(
        "flex items-center justify-center rounded-[var(--radius-lg)] border-2 border-dashed p-8 text-center transition-colors",
        drag ? "border-foreground bg-muted" : "border-border",
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
      {file ? (
        <div className="flex items-center justify-center gap-3">
          <FileCheck2 className="size-5 text-met" />
          <span className="text-sm font-medium">{file.name}</span>
          <button
            onClick={() => onFile(null)}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Remove file"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center gap-2 cursor-pointer"
        >
          <UploadCloud className="size-8 text-muted-foreground" />
          <span className="text-sm font-medium">Drop a file or click to browse</span>
          <span className="text-xs text-muted-foreground">{hint}</span>
        </button>
      )}
    </div>
  );
}
