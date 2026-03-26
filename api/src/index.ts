import { Hono } from "hono";
import { readdir } from "fs/promises";

const app = new Hono();

app.use("*", async (c, next) => {
  c.header("Access-Control-Allow-Origin", "*");
  await next();
});

app.get("/files", async (c) => {
  try {
    const files = await readdir("/data", { withFileTypes: true });
    console.log(files);
    const result = files
      .filter((f) => f.isFile())
      .map((f) => ({
        name: f.name,
        slug: f.name.replace(/\.[^/.]+$/, ""),
      }));

    return c.json(result);
  } catch (err) {
    return c.json({ error: "Failed to read directory" }, 500);
  }
});

export default app;
