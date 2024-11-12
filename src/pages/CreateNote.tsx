import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { MinusCircleIcon, Save } from "lucide-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { NoteEntity } from "@/orm/entities/note/note";
import noteDataSource from "@/orm/datasources/NoteDataSource";

export function CreateNote() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  const saveContent = async () => {
    try {
      if (!title || !content) {
        throw new Error("Title and content needed");
      }
      const note = new NoteEntity();
      note.title = title;
      note.content = content;
      await noteDataSource.dataSource
        .createQueryBuilder()
        .insert()
        .into(NoteEntity)
        .values([{ content, title }])
        .execute();
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error:",
        variant: "destructive",
        description: error.message || "Internal Error",
      });
    }
  };

  return (
    <div className="m-4 flex flex-col spac-y-4">
      <Input
        className="mb-4 bg-transparent border-gray-400"
        defaultValue={title}
        placeholder="Enter the Note Title..."
        type="text"
        onInput={(e) => {
          setTitle(e.currentTarget.value);
        }}
      />
      <ReactQuill
        placeholder="Enter Note content here..."
        value={content}
        onChange={(value) => setContent(value)}
        className="text-base"
      />
      <div className="fixed left-0 p-2 bottom-[env(safe-area-inset-bottom)] bg-[#F8EEE2] z-10 border-t w-full">
        <div className="max-w-[65ch] mx-auto flex flex-row space-x-2 justify-end">
          <Button variant="secondary" onClick={() => navigate("/")}>
            <MinusCircleIcon /> cancel
          </Button>
          <Button variant="default" onClick={saveContent}>
            <Save /> Save
          </Button>
        </div>
      </div>
    </div>
  );
}
