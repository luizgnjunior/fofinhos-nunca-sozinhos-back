const { Router } = require("express");
const db = require("../../libs/firebase/db-connector.js");
const router = Router();

// LIST (optional filter by ownerId)
router.get("/", async (req, res) => {
  try {
    const { ownerId } = req.query;
    let ref = db.collection("pets");
    if (ownerId) ref = ref.where("ownerId", "==", ownerId);

    const snap = await ref.orderBy("createdAt", "desc").get();
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(data);
  } catch (err) {
    console.error("GET /pets", err);
    res.status(500).json({ error: "internal_error" });
  }
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const b = req.body || {};
    if (!b.name) return res.status(400).json({ error: "name is required" });
    if (!b.ownerId)
      return res.status(400).json({ error: "ownerId is required" });

    const now = new Date();
    const doc = {
      name: b.name,
      age: Number.isFinite(b.age) ? b.age : 0,
      size: b.size || "Unknown",
      notes: b.notes || "",
      ownerId: b.ownerId,
      ownerName: b.ownerName || "", // opcional (desnormalização)
      createdAt: now,
      updatedAt: now,
    };
    const ref = await db.collection("pets").add(doc);
    res.status(201).json({ id: ref.id, ...doc });
  } catch (err) {
    console.error("POST /pets", err);
    res.status(500).json({ error: "internal_error" });
  }
});

// READ by id
router.get("/:id", async (req, res) => {
  try {
    const doc = await db.collection("pets").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: "not_found" });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error("GET /pets/:id", err);
    res.status(500).json({ error: "internal_error" });
  }
});

// UPDATE
router.patch("/:id", async (req, res) => {
  try {
    const patch = { ...(req.body || {}), updatedAt: new Date() };
    await db.collection("pets").doc(req.params.id).update(patch);
    res.json({ ok: true });
  } catch (err) {
    console.error("PATCH /pets/:id", err);
    res.status(500).json({ error: "internal_error" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await db.collection("pets").doc(req.params.id).delete();
    res.status(204).end();
  } catch (err) {
    console.error("DELETE /pets/:id", err);
    res.status(500).json({ error: "internal_error" });
  }
});

module.exports = router;
