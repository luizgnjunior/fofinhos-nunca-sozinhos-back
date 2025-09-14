const admin = require("firebase-admin");

const serviceAccount = require("../../../env/never-alone.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id || "SEU_PROJECT_ID_AQUI",
});

const db = admin.firestore();
module.exports = db;
