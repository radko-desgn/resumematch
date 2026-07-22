"use client";

import { FileText, Type, Image as ImageIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FileDrop } from "../wizard/FileDrop";
import { TextMeta } from "../wizard/TextMeta";
import { useWizard } from "@/lib/store";
import { CvKind } from "@/lib/types";
import { SAMPLE_CV } from "@/lib/samples";

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

        {/* fixed height so switching tabs never resizes the panel */}
        <div className="mt-4 h-[232px]">
          <TabsContent value="text" className="mt-0 h-full">
            <Textarea
              className="h-[192px] resize-none"
              placeholder="Paste your CV / resume here…"
              value={cv.text}
              onChange={(e) => setCv({ text: e.target.value })}
            />
            <TextMeta value={cv.text} min={30} onFill={() => setCv({ kind: "text", text: SAMPLE_CV })} />
          </TabsContent>
          <TabsContent value="file" className="mt-0 h-full">
            <FileDrop className="h-full" accept=".pdf,.docx" file={cv.file} onFile={(f) => setCv({ file: f })} hint="PDF or DOCX" />
          </TabsContent>
          <TabsContent value="image" className="mt-0 h-full">
            <FileDrop className="h-full" accept="image/*" file={cv.file} onFile={(f) => setCv({ file: f })} hint="PNG or JPG — read via OCR" />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
