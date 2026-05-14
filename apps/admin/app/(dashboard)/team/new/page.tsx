"use client";

import { useState } from "react";
import { Button, Input, RichTextEditor } from "@lex/ui";
import { useRouter } from "next/navigation";
import { createTeamMember } from "../../../actions/cms";

export default function CreateTeamMemberPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent, published: boolean) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      await createTeamMember({ name, title, bio, published });
      router.push("/users"); // Temporary redirect since we don't have a team list table yet
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add Team Member</h1>
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
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Full Name</label>
            <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Job Title</label>
            <Input id="title" placeholder="Senior Partner" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Professional Bio</label>
          <RichTextEditor value={bio} onChange={setBio} placeholder="Enter their professional background..." />
        </div>
      </form>
    </div>
  );
}
