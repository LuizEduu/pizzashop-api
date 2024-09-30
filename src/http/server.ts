import { Elysia } from "elysia";

const app = new Elysia().get("/", () => {
  console.log("hello world");
});
app.listen(3333, () => {
  console.log("HTTP server running!");
});
