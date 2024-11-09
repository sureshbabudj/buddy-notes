import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { HTMLAttributes, PropsWithChildren, useEffect, useState } from "react";
import axios from "axios";

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
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          <a
            href="/"
            className="inline-block px-1 py-[2px] shadow-sm bg-red-600 text-xs text-white rounded-sm hover:bg-opacity-75"
          >
            new
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Created at {format(new Date(), "PPP")}
      </CardFooter>
    </Card>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<
    { title: string; id: number; content: string }[]
  >([]);

  const getNotes = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:5671/api/notes");
      setNotes(data.notes);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNotes();
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
              className="break-words block prose prose-img:border-2 prose-img:border-gray-500 prose-img:mx-auto prose-img:rounded-lg break-inside-avoid break-after-page"
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
