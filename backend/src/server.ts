import express, { NextFunction, Request, Response } from "express";
import noteRoutes from "@/controllers/notes.controller";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200, // For legacy browser support
  })
);

app.use("/api/notes", noteRoutes);

const PORT = process.env.PORT ?? 5671;

app.use(
  "/",
  function (req: Request, _res: Response, next: NextFunction) {
    (swaggerDocument as any).host = req.get("host");
    (req as any).swaggerDoc = swaggerDocument;
    next();
  },
  swaggerUi.serveFiles(swaggerDocument, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  }),
  swaggerUi.setup()
);

app
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
