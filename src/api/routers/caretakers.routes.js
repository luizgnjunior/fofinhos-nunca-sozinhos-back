const { Router } = require("express");
const db = require("../../libs/firebase/db-connector.js");
const router = Router();

// LIST (filters: ?service=walking &/or ?day=wednesday)
router.get("/", async (req, res) => {
  try {
    const { service, day } = req.query;
    let ref = db.collection("caretakers");

    if (service) ref = ref.where("services", "array-contains", String(service));
    if (day) ref = ref.where("availableDays", "array-contains", String(day));

    const snap = await ref.orderBy("createdAt", "desc").get();
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(data);
  } catch (err) {
    console.error("GET /caretakers", err);
    res.status(500).json({ error: "internal_error" });
  }
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const b = req.body || {};
    if (!b.name) return res.status(400).json({ error: "name is required" });

    const now = new Date();
    const doc = {
      name: b.name,
      address: b.address || "",
      phone: b.phone || "",
      availableDays: Array.isArray(b.availableDays) ? b.availableDays : [],
      services: Array.isArray(b.services) ? b.services : [],
      notes: b.notes || "",
      createdAt: now,
      updatedAt: now,
    };

    const ref = await db.collection("caretakers").add(doc);
    res.status(201).json({ id: ref.id, ...doc });
  } catch (err) {
    console.error("POST /caretakers", err);
    res.status(500).json({ error: "internal_error" });
  }
});

// READ by id
router.get("/:id", async (req, res) => {
  try {
    const doc = await db.collection("caretakers").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: "not_found" });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error("GET /caretakers/:id", err);
    res.status(500).json({ error: "internal_error" });
  }
});

// UPDATE
router.patch("/:id", async (req, res) => {
  try {
    const patch = { ...(req.body || {}), updatedAt: new Date() };
    await db.collection("caretakers").doc(req.params.id).update(patch);
    res.json({ ok: true });
  } catch (err) {
    console.error("PATCH /caretakers/:id", err);
    res.status(500).json({ error: "internal_error" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await db.collection("caretakers").doc(req.params.id).delete();
    res.status(204).end();
  } catch (err) {
    console.error("DELETE /caretakers/:id", err);
    res.status(500).json({ error: "internal_error" });
  }
});

module.exports = router;
