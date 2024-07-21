import express, { json, query } from "express";
import { createThreadOneRouter } from "../routes/threadone.js";

export const createApp = ({ threadOneModel }) => {
  const server = express();
  server.use(json());
  server.disable("x-powered-by");

  server.use("/threadone", createThreadOneRouter({ threadOneModel }));

  const PORT = process.env.PORT ?? 3000;

  server.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
  });
};
