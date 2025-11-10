const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

// 🔐 Clé API-Football dans les variables d'environnement Render
const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY;

// 🆔 ID équipe PSG dans API-Football (à adapter si besoin depuis leur doc/dashboard)
const PSG_TEAM_ID = 85; // Vérifie dans ton compte API-Football que c'est bien l'ID du PSG

// --- NEXT MATCH DYNAMIQUE ---
app.get("/api/next_match", async (req, res) => {
  try {
    if (!API_FOOTBALL_KEY) {
      return res.status(500).json({
        error: "Clé API_FOOTBALL_KEY manquante côté serveur."
      });
    }

    const response = await axios.get(
      "https://v3.football.api-sports.io/fixtures",
      {
        params: {
          team: PSG_TEAM_ID,
          next: 1
        },
        headers: {
          "x-apisports-key": API_FOOTBALL_KEY
        }
      }
    );

    const fixtures = response.data.response;

    if (!fixtures || fixtures.length === 0) {
      return res.status(404).json({
        error: "Aucun match à venir trouvé pour le PSG."
      });
    }

    const match = fixtures[0];

    const isHome = match.teams.home.id === PSG_TEAM_ID;
    const opponent = isHome
      ? match.teams.away.name
      : match.teams.home.name;

    res.json({
      opponent,
      competition: match.league.name,
      date: match.fixture.date,
      stadium: match.fixture.venue.name,
      home: isHome
    });
  } catch (err) {
    console.error("Erreur API-Football:", err.response?.data || err.message);
    res.status(500).json({
      error: "Erreur lors de la récupération du prochain match."
    });
  }
});

// --- FEEDBACK SUPPORTER (inchangé, pour plus tard) ---
app.post("/api/feedback", (req, res) => {
  console.log("📥 Feedback reçu :", req.body);
  res.json({
    message:
      "Merci pour ton avis, il a bien été enregistré pour analyse par le PSG Fan Intelligence Assistant."
  });
});

// --- BILAN HEBDOMADAIRE D'EXEMPLE (tu pourras le rendre dynamique plus tard) ---
app.get("/api/weekly_report", (req, res) => {
  res.json({
    week: "Semaine en cours",
    summary:
      "Bilan automatique à personnaliser avec les données réelles des matchs et des supporters.",
    fan_sentiment:
      "À compléter en fonction des feedbacks collectés.",
    suggested_improvement:
      "Renforcer l'expérience fan au Parc et la visibilité des équipes féminines."
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Serveur PSG Fan Intelligence en ligne sur le port ${PORT}`)
);

