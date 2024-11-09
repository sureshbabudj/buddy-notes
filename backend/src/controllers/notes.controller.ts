import { ApiError } from "@/lib/error";
import { prisma } from "@/lib/prisma";
import { Note } from "@prisma/client";
import { Request, Response, Router } from "express";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const notes = await prisma.note.findMany();
    res.json({ notes });
  } catch (error: any) {
    res.status(500).json({ error: error.message ?? "Internal Server Error" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { content, title } = req.body;
    if (!content || !title) {
      throw new ApiError(
        "Payload should be valid strings: content and title",
        403
      );
    }
    const note = await prisma.note.create({
      data: {
        content,
        title,
      },
    });
    res.status(201).json({ note });
  } catch (error: any) {
    res
      .status(error.status ?? 500)
      .json({ error: error.message ?? "Internal Server Error" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params["id"]);
    if (isNaN(id as any)) {
      throw new ApiError("id should be a valid number", 403);
    }
    const note = await prisma.note.findUnique({
      where: { id },
    });
    res.json({ note });
  } catch (error: any) {
    res
      .status(error.status ?? 500)
      .json({ error: error.message ?? "Internal Server Error" });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params["id"]);
    if (isNaN(id as any)) {
      throw new ApiError("id should be a valid number", 403);
    }

    const { content, title } = req.body as Omit<Note, "id">;
    if (!content && !title) {
      throw new ApiError(
        "Payload should be valid strings: content or title",
        403
      );
    }
    const note = await prisma.note.update({
      where: { id },
      data: { content, title },
    });
    res.json({ note });
  } catch (error: any) {
    res
      .status(error.status ?? 500)
      .json({ error: error.message ?? "Internal Server Error" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params["id"]);
    if (isNaN(id as any)) {
      throw new ApiError("id should be a valid number", 403);
    }
    await prisma.note.delete({
      where: { id },
    });
    res.json({ message: "Note deleted" });
  } catch (error: any) {
    res
      .status(error.status ?? 500)
      .json({ error: error.message ?? "Internal Server Error" });
  }
});

export default router;
