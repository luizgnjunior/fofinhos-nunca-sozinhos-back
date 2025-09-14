import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`Fofinhos API running on http://localhost:${port}`);
});
