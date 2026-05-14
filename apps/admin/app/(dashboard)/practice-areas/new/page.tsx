"use client";

import { useState } from "react";
import { Button, Input, RichTextEditor } from "@lex/ui";
import { useRouter } from "next/navigation";
import { createPracticeArea } from "../../../actions/cms";

export default function CreatePracticeAreaPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent, published: boolean) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      await createPracticeArea({ title, content, published });
      router.push("/practice-areas");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add Practice Area</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={(e) => handleSubmit(e, false)} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button onClick={(e) => handleSubmit(e, true)} disabled={isSubmitting}>
            {isSubmitting ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">{error}</div>}

      <form className="space-y-6 bg-white p-6 rounded-md border shadow-sm">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">Practice Area Title</label>
          <Input id="title" placeholder="e.g. Corporate Law" value={title} onChange={(e) => setTitle(e.target.value)} className="text-lg" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <RichTextEditor value={content} onChange={setContent} placeholder="Describe this practice area..." />
        </div>
      </form>
    </div>
  );
}
