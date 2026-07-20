"use client";

import { Link2, Type, FileText, Image as ImageIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FileDrop } from "../wizard/FileDrop";
import { useWizard } from "@/lib/store";
import { JobKind } from "@/lib/types";

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

        <TabsContent value="url">
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
        <TabsContent value="text">
          <Textarea
            rows={12}
            placeholder="Paste the job description here…"
            value={job.text}
            onChange={(e) => setJob({ text: e.target.value })}
          />
        </TabsContent>
        <TabsContent value="file">
          <FileDrop accept=".pdf" file={job.file} onFile={(f) => setJob({ file: f })} hint="PDF" />
        </TabsContent>
        <TabsContent value="image">
          <FileDrop accept="image/*" file={job.file} onFile={(f) => setJob({ file: f })} hint="PNG or JPG — read via OCR" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
