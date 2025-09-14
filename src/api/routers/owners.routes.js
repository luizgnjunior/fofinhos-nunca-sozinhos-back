const { Router } = require("express");

const db = require("../../libs/firebase/db-connector.js");
const router = Router();

// LIST
router.get("/", async (_req, res) => {
  try {
    const snap = await db
      .collection("owners")
      .orderBy("createdAt", "desc")
      .get();
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(data);
  } catch (err) {
    console.error("GET /owners", err);
    res.status(500).json({ error: "internal_error" });
  }
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const body = req.body || {};
    if (!body.name) return res.status(400).json({ error: "name is required" });

    const now = new Date();
    const doc = {
      name: body.name,
      address: body.address || "",
      notes: body.notes || "",
      createdAt: now,
      updatedAt: now,
    };

    const ref = await db.collection("owners").add(doc);
    res.status(201).json({ id: ref.id, ...doc });
  } catch (err) {
    console.error("POST /owners", err);
    res.status(500).json({ error: "internal_error" });
  }
});

// READ by id
router.get("/:id", async (req, res) => {
  try {
    const doc = await db.collection("owners").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: "not_found" });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error("GET /owners/:id", err);
    res.status(500).json({ error: "internal_error" });
  }
});

// UPDATE (partial)
router.patch("/:id", async (req, res) => {
  try {
    const patch = { ...(req.body || {}), updatedAt: new Date() };
    await db.collection("owners").doc(req.params.id).update(patch);
    res.json({ ok: true });
  } catch (err) {
    console.error("PATCH /owners/:id", err);
    res.status(500).json({ error: "internal_error" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await db.collection("owners").doc(req.params.id).delete();
    res.status(204).end();
  } catch (err) {
    console.error("DELETE /owners/:id", err);
    res.status(500).json({ error: "internal_error" });
  }
});

module.exports = router;
