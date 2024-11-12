import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import type { Note } from "@/types";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  CopyPlus,
  HomeIcon,
  MinusCircleIcon,
  NotebookPen,
  Save,
  Trash2,
  Settings,
  SaveAll,
} from "lucide-react";
import { useAtom } from "jotai";
import { ActionDrawer } from "@/components/ActionDrawer";
import { isDrawerOpenAtom } from "@/lib/store";
import {
  SimpleMenu,
  SimpleMenuGroup,
  SimpleMenuGroupItem,
} from "@/components/SimpleMenu";
import { createNotes } from "@/lib/__mock";
import noteDataSource from "@/orm/datasources/NoteDataSource";
import { NoteEntity } from "@/orm/entities/note/note";
import sqliteParams from "@/orm/sqliteParams";

export function Note() {
  const { id: noteId } = useParams();
  const navigate = useNavigate();
  const id = Number(noteId);

  if (isNaN(id)) {
    navigate("/");
    return null;
  }
  if (!id) {
    navigate("/");
    return null;
  }

  const { toast } = useToast();
  const [isActionDrawerOpen, setIsActionDrawerOpen] = useAtom(isDrawerOpenAtom);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<Note | null>();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  const connection = noteDataSource.dataSource;
  const noteRepository = connection.getRepository(NoteEntity);

  const getNote = async () => {
    setLoading(true);
    try {
      const noteData = await noteRepository.findOne({
        where: {
          id,
        },
      });
      setNote(noteData);
    } catch (error: any) {
      toast({
        title: "Error:",
        description: error.message || "Internal Error",
      });
      navigate("/");
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
      const payload: Omit<Note, "id"> = {
        title: title ?? note?.title ?? "",
        content: content ?? note?.content ?? "",
      };

      if (Object.keys(payload).length === 0) {
        throw new Error("No content has been modifed!");
      }
      const result = await noteDataSource.dataSource
        .createQueryBuilder()
        .update(NoteEntity)
        .set({
          title,
          content,
        })
        .where("id = :id", { id })
        .execute();

      if (result.affected === 0) {
        throw new Error(`Failed to update the Note bearing id ${id}`);
      }
      const updated = await noteRepository.findOne({ where: { id } });
      setNote(updated);
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

  const deleteNote = async () => {
    setLoading(true);
    try {
      const deleted = await noteRepository.delete(id);
      if (deleted.affected === 0) {
        throw new Error(`Failed to delete the Note bearing id ${id}`);
      }
      toast({
        title: "Success:",
        description: "The note has been deleted",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error:",
        variant: "destructive",
        description: error.message || "Something went wrong!",
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
    <div className="m-4 flex flex-col justify-center">
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
            <div className="">
              <h3 onClick={toggleEdit}>{note.title}</h3>
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: note.content }}
              onClick={toggleEdit}
            />
          </>
        )}
      </div>

      <ActionDrawer>
        <SimpleMenu>
          <div className="p-4">
            <SimpleMenuGroup>
              <p className="text-xs py-1">Note...</p>
              <SimpleMenuGroupItem
                onClick={() => {
                  deleteNote();
                  setIsActionDrawerOpen(false);
                }}
              >
                <Trash2 />
                <span>Delete</span>
              </SimpleMenuGroupItem>
              {isEditing ? (
                <SimpleMenuGroupItem
                  onClick={() => {
                    toggleEdit();
                    setIsActionDrawerOpen(false);
                  }}
                >
                  <MinusCircleIcon />
                  <span> Discard changes</span>
                </SimpleMenuGroupItem>
              ) : (
                <SimpleMenuGroupItem
                  onClick={() => {
                    toggleEdit();
                    setIsActionDrawerOpen(false);
                  }}
                >
                  <NotebookPen />
                  <span>Modify Note</span>
                </SimpleMenuGroupItem>
              )}
            </SimpleMenuGroup>
            <hr />
            <SimpleMenuGroup>
              <p className="text-xs py-1">Common...</p>
              <SimpleMenuGroupItem
                onClick={() => {
                  navigate("/");
                  setIsActionDrawerOpen(false);
                }}
              >
                <HomeIcon />
                <span>Back to Home</span>
              </SimpleMenuGroupItem>
              <SimpleMenuGroupItem
                onClick={async () => {
                  try {
                    const notes = createNotes();
                    const result = await noteDataSource.dataSource
                      .createQueryBuilder()
                      .insert()
                      .into(NoteEntity)
                      .values(notes)
                      .execute();
                    console.log({ result });
                    setIsActionDrawerOpen(false);
                    toast({
                      title: "Success:",
                      description: `${notes.length} have been added!`,
                    });
                  } catch (error: any) {
                    toast({
                      title: "Error:",
                      variant: "destructive",
                      description: error.message || "Something went wrong!",
                    });
                    setIsActionDrawerOpen(false);
                  }
                }}
              >
                <CopyPlus />
                <span>Create Multiple Notes</span>
              </SimpleMenuGroupItem>
              <SimpleMenuGroupItem
                onClick={async () => {
                  const database = noteDataSource.dbName;
                  await sqliteParams.connection.saveToStore(database);
                  // write database to local disk for development only
                  await sqliteParams.connection.saveToLocalDisk(database);
                  setIsActionDrawerOpen(false);
                }}
              >
                <SaveAll />
                <span>Save to Local as DB</span>
              </SimpleMenuGroupItem>
            </SimpleMenuGroup>
          </div>
        </SimpleMenu>
      </ActionDrawer>
    </div>
  );
}
