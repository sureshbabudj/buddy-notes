import { Button } from "@/components/ui/button";
import { Notes } from "./Home";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { searchQueryAtom } from "@/lib/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import noteDataSource from "@/orm/datasources/NoteDataSource";
import { NoteEntity } from "@/orm/entities/note/note";
import { Note } from "@/types";

export function SearchPage() {
  const [searchQueryState, setSearchQueryState] = useAtom(searchQueryAtom);
  const [params] = useSearchParams();
  const query = params.get("q");

  const { toast } = useToast();
  const navigate = useNavigate();

  if (!query) {
    toast({
      title: "Error:",
      description: "Enter the keyword to search!",
    });
    setSearchQueryState("");
    navigate("/");
    return null;
  }

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalNotes, setTotalNotes] = useState(0);
  const [notes, setNotes] = useState<Note[]>([]);

  const connection = noteDataSource.dataSource;

  async function searchNotes(searchQuery: string, page: number) {
    return connection.manager
      .createQueryBuilder(NoteEntity, "notes")
      .select(["notes.id", "notes.title", "notes.content"])
      .where("notes.title LIKE :searchQuery", {
        searchQuery: `%${searchQuery}%`,
      })
      .orWhere("notes.content LIKE :searchQuery", {
        searchQuery: `%${searchQuery}%`,
      })
      .skip((page - 1) * 10)
      .take(10)
      .getManyAndCount();
  }

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const [n, c] = await searchNotes(query, page);
      setNotes((prevNotes) => (page === 1 ? n : [...prevNotes, ...n]));
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

  useEffect(() => {
    setNotes([]);
    if (page === 1) {
      // as the fetchNotes will not be called when teh page is same for prev and curr query
      fetchNotes();
    }
    setPage(1);
  }, [query]);

  return (
    <>
      {query && (
        <p className="m-4 text-lg">
          Search results for{" "}
          <span className="italic font-semibold">{query}</span>
        </p>
      )}
      <>
        {totalNotes === 0 ? (
          <p className="m-4">No notes found.</p>
        ) : (
          <Notes notes={notes} />
        )}
        {notes.length < totalNotes && (
          <div className="my-4">
            <Button
              variant="secondary"
              onClick={() => setPage(page + 1)}
              className="w-full"
            >
              {loading ? "Loading" : "Load More"}
            </Button>
          </div>
        )}
      </>
    </>
  );
}
