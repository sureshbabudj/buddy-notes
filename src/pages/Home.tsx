import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { HTMLAttributes, PropsWithChildren, useEffect, useState } from "react";
import { Note } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { NoteEntity } from "@/orm/entities/note/note";
import noteDataSource from "@/orm/datasources/NoteDataSource";

interface NoteCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
}

function NoteCard({
  title,
  children,
  ...props
}: PropsWithChildren<NoteCardProps>) {
  return (
    <Card {...props}>
      <CardHeader className="py-2">
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Created at {format(new Date(), "PPP")}
      </CardFooter>
    </Card>
  );
}

export default function Home() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);

  const connection = noteDataSource.dataSource;

  const fetchNotes = async () => {
    setLoading(true);
    try {
      setNotes(await connection.manager.find(NoteEntity));
    } catch (error: any) {
      toast({
        title: "Error:",
        description: error.message || "Internal Error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="columns-2 md:columns-4 gap-2 space-y-2 m-2">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {notes.map(({ id, title, content }) => (
            <Link
              to={`/note/${id}`}
              key={id}
              className="break-words block prose prose-img:border-2 prose-img:max-h-24 prose-img:border-gray-500 prose-img:mx-auto prose-img:rounded-lg break-inside-avoid break-after-page"
            >
              <NoteCard title={title}>
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </NoteCard>
            </Link>
          ))}
        </>
      )}
    </div>
  );
}
