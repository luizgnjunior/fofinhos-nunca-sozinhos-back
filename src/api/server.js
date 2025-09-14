const express = require("express");

const ownersRoutes = require("./routers/owners.routes.js");
const petsRoutes = require("./routers/pets.routes.js");
const caretakersRoutes = require("./routers/caretakers.routes.js");
const appointmentsRoutes = require("./routers/appointments.routes.js");

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  res.json({ ok: true });
});

app.use("/owners", ownersRoutes);
app.use("/pets", petsRoutes);
app.use("/caretakers", caretakersRoutes);
app.use("/appointments", appointmentsRoutes);

app.listen(port, () => {
  console.log(`Fofinhos API running on http://localhost:${port}`);
});
