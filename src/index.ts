import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors"
import v1 from "./api/v1";

const app = new Elysia()
  .use(cors({
    origin: "http://localhost:5173",
  }))
  .group("/v1", v1)
  .get("/", () => "Hello Elysia").listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
