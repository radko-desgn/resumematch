"use client";

import { FileText, Type, Image as ImageIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FileDrop } from "../wizard/FileDrop";
import { useWizard } from "@/lib/store";
import { CvKind } from "@/lib/types";

export function Step1Cv() {
  const { cv, setCv } = useWizard();
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold mb-1">Add your CV</h2>
      <p className="text-muted-foreground mb-6">Paste the text, upload a PDF/DOCX, or drop a screenshot.</p>

      <Tabs value={cv.kind} onValueChange={(v) => setCv({ kind: v as CvKind })}>
        <TabsList>
          <TabsTrigger value="text"><Type className="size-4" /> Paste text</TabsTrigger>
          <TabsTrigger value="file"><FileText className="size-4" /> Upload file</TabsTrigger>
          <TabsTrigger value="image"><ImageIcon className="size-4" /> Screenshot</TabsTrigger>
        </TabsList>

        <TabsContent value="text">
          <Textarea
            rows={12}
            placeholder="Paste your CV / resume here…"
            value={cv.text}
            onChange={(e) => setCv({ text: e.target.value })}
          />
        </TabsContent>
        <TabsContent value="file">
          <FileDrop accept=".pdf,.docx" file={cv.file} onFile={(f) => setCv({ file: f })} hint="PDF or DOCX" />
        </TabsContent>
        <TabsContent value="image">
          <FileDrop accept="image/*" file={cv.file} onFile={(f) => setCv({ file: f })} hint="PNG or JPG — read via OCR" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
