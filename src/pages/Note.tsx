import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import type { Note } from "@/types";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { MinusCircleIcon, Save } from "lucide-react";

export function Note() {
  const { id } = useParams();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<Note | null>();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  const getNote = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:5671/api/notes/${id}`);
      setNote(data.note);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = (value: string) => {
    setContent(value);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setContent(note!.content);
    setTitle(note!.title);
  };

  const saveContent = async () => {
    setLoading(true);
    try {
      const payload: Partial<Note> = {};
      if (note!.title !== title) {
        payload.title = title;
      }
      if (note!.content !== content) {
        payload.content = content;
      }
      if (Object.keys(payload).length === 0) {
        throw new Error("No content has been modifed!");
      }
      const { data } = await axios.patch(
        `http://localhost:5671/api/notes/${id}`,
        payload
      );
      setNote(data.note);
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error:",
        description: error.message || "",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNote();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!note) {
    return <p>No note found for {id}</p>;
  }

  return (
    <div className="m-4 flex justify-center">
      <div className="pb-[57px] prose prose-img:border-2 prose-img:border-gray-500 prose-img:mx-auto prose-img:rounded-lg">
        {isEditing ? (
          <>
            <Input
              className="mb-4 bg-transparent"
              defaultValue={title}
              type="text"
              onInput={(e) => {
                setTitle(e.currentTarget.value);
              }}
            />
            <ReactQuill
              value={content}
              onChange={handleContentChange}
              className="text-base"
            />
            <div className="fixed left-0 p-2 bottom-0 bg-[#F8EEE2] z-10 border-t w-full">
              <div className="max-w-[65ch] mx-auto flex flex-row space-x-2 justify-end">
                <Button variant="secondary" onClick={toggleEdit}>
                  <MinusCircleIcon /> cancel
                </Button>
                <Button variant="default" onClick={saveContent}>
                  <Save /> Save
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <h3 onClick={toggleEdit}>{note.title}</h3>
            <div
              dangerouslySetInnerHTML={{ __html: note.content }}
              onClick={toggleEdit}
            />
          </>
        )}
      </div>
    </div>
  );
}
