const express = require("express");
const cors = require("cors");

const ownersRoutes = require("./routers/owners.routes.js");
const petsRoutes = require("./routers/pets.routes.js");
const caretakersRoutes = require("./routers/caretakers.routes.js");
const appointmentsRoutes = require("./routers/appointments.routes.js");

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  res.json({ ok: true });
});

// app.get("/pets", async (_req, res) => {
//   try {
//     const snap = await db.collection("pets").get();
//     const dc = snap.docs.map((d) => ({
//       id: d.id,
//       ...d.data(),
//     }));
//     res.json(dc);
//   } catch (err) {
//     console.error("GET ", err);
//     res.status(500).json({ error: "foda" });
//   }
// });

app.use(cors());
app.use(express.json());

app.use("/owners", ownersRoutes);
app.use("/pets", petsRoutes);
// app.use("/caretakers", caretakersRoutes);
// app.use("/appointments", appointmentsRoutes);

app.listen(port, () => {
  console.log(`Fofinhos API running on http://localhost:${port}`);
});
