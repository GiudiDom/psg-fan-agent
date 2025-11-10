const express = require("express");
const app = express();
app.use(express.json());

// --- Exemple 1 : prochain match du PSG ---
app.get("/api/next_match", (req, res) => {
  res.json({
    opponent: "Olympique Lyonnais",
    competition: "Ligue 1 Uber Eats",
    date: "2025-11-22T21:00:00Z",
    stadium: "Parc des Princes",
    home: true
  });
});

// --- Exemple 2 : feedback d’un supporter ---
app.post("/api/feedback", (req, res) => {
  console.log("📥 Feedback reçu :", req.body);
  res.json({ message: "Merci pour ton avis, il a bien été enregistré pour analyse !" });
});

// --- Exemple 3 : bilan hebdomadaire ---
app.get("/api/weekly_report", (req, res) => {
  res.json({
    week: "Semaine 45",
    summary: "Le PSG a remporté ses deux matchs à domicile. Bonne performance collective.",
    top_player: "Kylian Mbappé",
    fan_sentiment: "Très positif",
    suggested_improvement: "Améliorer la communication sur les matchs féminins."
  });
});

app.listen(3000, () => console.log("✅ Serveur PSG Fan Intelligence en ligne sur Render"));
