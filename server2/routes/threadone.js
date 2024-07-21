import { Router } from "express";
import { ThreadOneControler } from "../controllers/ThreadOne.js";

export const createThreadOneRouter = ({ threadOneModel }) => {
  const threadOneRouter = Router();

  const threadOneControler = new ThreadOneControler({
    threadOneModel,
  });

  threadOneRouter.get("/", threadOneControler.getAll);
  threadOneRouter.post("/", threadOneControler.create);

  threadOneRouter.get("/:id_usuario", threadOneControler.getById);
  threadOneRouter.delete("/:id_usuario", threadOneControler.delete);
  threadOneRouter.put("/:id_usuario", threadOneControler.update);

  return threadOneRouter;
};
