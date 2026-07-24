"use client";

import { Link2, Type, FileText, Image as ImageIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FileDrop } from "../wizard/FileDrop";
import { TextMeta } from "../wizard/TextMeta";
import { useWizard, MIN_TEXT_CHARS } from "@/lib/store";
import { JobKind } from "@/lib/types";
import { SAMPLE_JOB } from "@/lib/samples";

export function Step2Job() {
  const { job, setJob } = useWizard();
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold mb-1">Add the job offer</h2>
      <p className="text-muted-foreground mb-6">Paste a link, drop a PDF, paste the text, or upload a screenshot.</p>

      <Tabs value={job.kind} onValueChange={(v) => setJob({ kind: v as JobKind })}>
        <TabsList>
          <TabsTrigger value="url"><Link2 className="size-4" /> URL</TabsTrigger>
          <TabsTrigger value="text"><Type className="size-4" /> Paste text</TabsTrigger>
          <TabsTrigger value="file"><FileText className="size-4" /> PDF</TabsTrigger>
          <TabsTrigger value="image"><ImageIcon className="size-4" /> Screenshot</TabsTrigger>
        </TabsList>

        {/* fixed height so switching tabs never resizes the panel */}
        <div className="mt-4 h-[232px]">
          <TabsContent value="url" className="mt-0 h-full">
            <Input
              type="url"
              placeholder="https://company.com/careers/role"
              value={job.url}
              onChange={(e) => setJob({ url: e.target.value })}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              We fetch the page and extract the description. Some sites block bots — paste the text if it fails.
            </p>
          </TabsContent>
          <TabsContent value="text" className="mt-0 h-full">
            <Textarea
              className="h-[192px] resize-none"
              placeholder="Paste the job description here…"
              value={job.text}
              onChange={(e) => setJob({ text: e.target.value })}
            />
            <TextMeta value={job.text} min={MIN_TEXT_CHARS} onFill={() => setJob({ kind: "text", text: SAMPLE_JOB })} />
          </TabsContent>
          <TabsContent value="file" className="mt-0 h-full">
            <FileDrop className="h-full" accept=".pdf" file={job.file} onFile={(f) => setJob({ file: f })} hint="PDF" />
          </TabsContent>
          <TabsContent value="image" className="mt-0 h-full">
            <FileDrop className="h-full" accept="image/*" file={job.file} onFile={(f) => setJob({ file: f })} hint="PNG or JPG — read via OCR" />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
