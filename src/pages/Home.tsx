import { HTMLAttributes, PropsWithChildren, useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Note } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { NoteEntity } from "@/orm/entities/note/note";
import noteDataSource from "@/orm/datasources/NoteDataSource";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export function Notes({ notes }: { notes: Note[] }) {
  return (
    <div className="columns-2 md:columns-4 gap-2 space-y-2 m-2">
      {notes.map(({ id, title, content }) => (
        <Link
          to={`/note/${id}`}
          key={id}
          className="break-words block prose prose-img:border-2 prose-img:max-h-24 prose-img:border-gray-500 prose-img:mx-auto prose-img:rounded-lg break-inside-avoid break-after-page"
        >
          <NoteCard title={title}>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(content),
              }}
            />
          </NoteCard>
        </Link>
      ))}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalNotes, setTotalNotes] = useState(0);
  const [notes, setNotes] = useState<NoteEntity[]>([]);

  const connection = noteDataSource.dataSource;

  async function getNotes(page: number) {
    return connection.manager
      .createQueryBuilder(NoteEntity, "note")
      .skip((page - 1) * 10)
      .take(10)
      .getManyAndCount();
  }

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const [n, c] = await getNotes(page);
      setNotes([...notes, ...n]);
      setTotalNotes(c);
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
  }, [page]);

  return (
    <>
      {totalNotes === 0 ? <p>No notes found.</p> : <Notes notes={notes} />}
      {notes.length < totalNotes && (
        <div className="my-4 mx-1">
          <Button
            variant="secondary"
            onClick={() => setPage(page + 1)}
            className="w-full"
          >
            {loading ? "Loading" : "Load More"}
          </Button>
        </div>
      )}
      <Button
        variant="secondary"
        size="icon"
        onClick={() => navigate("/create")}
        className="fixed bottom-[calc(env(safe-area-inset-bottom)_+_16px)] right-[calc(env(safe-area-inset-right)_+_16px)] rounded-full shadow-md hover:shadow-lg"
      >
        <Plus />
      </Button>
    </>
  );
}
