import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { Button } from "@/components/ui/button";

export function Note() {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<{
    title: string;
    id: number;
    content: string;
  } | null>();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");

  const getNote = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:5671/api/notes/${id}`);
      setNote(data.note);
      setContent(data.note.content);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNote();
  }, []);

  const handleContentChange = (value: string) => {
    setContent(value);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const saveContent = async () => {
    setLoading(true);
    try {
      await axios.patch(`http://localhost:5671/api/notes/${id}`, { content });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-4 flex justify-center">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {note ? (
            <div className="prose prose-img:border-2 prose-img:border-gray-500 prose-img:mx-auto prose-img:rounded-lg">
              <h3>{note.title}</h3>
              {isEditing ? (
                <>
                  <ReactQuill
                    value={content}
                    onChange={handleContentChange}
                    className="text-base"
                  />
                  <div className="flex flex-row justify-between">
                    <Button
                      variant="default"
                      onClick={saveContent}
                      className="mt-5"
                    >
                      Save
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={toggleEdit}
                      className="mt-5"
                    >
                      cancel
                    </Button>
                  </div>
                </>
              ) : (
                <div
                  dangerouslySetInnerHTML={{ __html: content }}
                  onClick={toggleEdit}
                />
              )}
            </div>
          ) : (
            <p>No note found for {id}</p>
          )}
        </>
      )}
    </div>
  );
}
