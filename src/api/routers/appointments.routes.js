const { Router } = require("express");
const db = require("../../libs/firebase/db-connector.js");
const router = Router();

// LIST (filters)
router.get("/", async (req, res) => {
  try {
    const { ownerId, petId, caretakerId, status } = req.query;
    let ref = db.collection("appointments");

    if (ownerId) ref = ref.where("ownerId", "==", ownerId);
    if (petId) ref = ref.where("petId", "==", petId);
    if (caretakerId) ref = ref.where("caretakerId", "==", caretakerId);
    if (status) ref = ref.where("status", "==", status);

    const snap = await ref.orderBy("date", "desc").get();
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(data);
  } catch (err) {
    console.error("GET /appointments", err);
    res.status(500).json({ error: "internal_error" });
  }
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const b = req.body || {};
    for (const f of ["ownerId", "petId", "caretakerId", "date"]) {
      if (!b[f]) return res.status(400).json({ error: `${f} is required` });
    }

    const now = new Date();
    const doc = {
      ownerId: b.ownerId,
      ownerName: b.ownerName || "",
      petId: b.petId,
      petName: b.petName || "",
      caretakerId: b.caretakerId,
      caretakerName: b.caretakerName || "",
      date: b.date, // envie ISO string ou epoch ms; mantenha padrão no seu front
      status: b.status || "scheduled", // scheduled | completed | cancelled
      notes: b.notes || "",
      location: b.location || "",
      price: Number.isFinite(b.price) ? b.price : 0,
      createdAt: now,
      updatedAt: now,
    };

    const ref = await db.collection("appointments").add(doc);
    res.status(201).json({ id: ref.id, ...doc });
  } catch (err) {
    console.error("POST /appointments", err);
    res.status(500).json({ error: "internal_error" });
  }
});

// READ by id
router.get("/:id", async (req, res) => {
  try {
    const doc = await db.collection("appointments").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: "not_found" });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error("GET /appointments/:id", err);
    res.status(500).json({ error: "internal_error" });
  }
});

// UPDATE
router.patch("/:id", async (req, res) => {
  try {
    const patch = { ...(req.body || {}), updatedAt: new Date() };
    await db.collection("appointments").doc(req.params.id).update(patch);
    res.json({ ok: true });
  } catch (err) {
    console.error("PATCH /appointments/:id", err);
    res.status(500).json({ error: "internal_error" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await db.collection("appointments").doc(req.params.id).delete();
    res.status(204).end();
  } catch (err) {
    console.error("DELETE /appointments/:id", err);
    res.status(500).json({ error: "internal_error" });
  }
});

module.exports = router;
