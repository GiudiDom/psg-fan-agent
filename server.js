const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// Récupération de la clé API depuis les variables d'environnement Render
const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY;

// ID officiel du PSG dans API-FOOTBALL (vérifié dans leur doc)
const PSG_TEAM_ID = 85;

// --------- ENDPOINT : PROCHAIN MATCH DU PSG ----------
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
          next: 10
        },
        headers: {
          "x-apisports-key": API_FOOTBALL_KEY
        }
      }
    );

    const fixtures = response.data && response.data.response
      ? response.data.response
      : [];

    if (!fixtures.length) {
      console.log("⚠️ Aucun match retourné par l'API:", JSON.stringify(response.data, null, 2));
      return res.status(404).json({
        error: "Aucun match à venir trouvé pour le PSG. Vérifie ton plan API ou les paramètres."
      });
    }

    // On trie les matchs par date et on prend le plus proche
    fixtures.sort(
      (a, b) => new Date(a.fixture.date) - new Date(b.fixture.date)
    );
    const match = fixtures[0];

    const isHome = match.teams.home.id === PSG_TEAM_ID;
    const opponent = isHome
      ? match.teams.away.name
      : match.teams.home.name;

    return res.json({
      opponent,
      competition: match.league.name,
      date: match.fixture.date,
      stadium: match.fixture.venue.name,
      home: isHome
    });
  } catch (err) {
    console.error("❌ Erreur API-Football:", err.response?.data || err.message);
    return res.status(500).json({
      error: "Erreur lors de la récupération du prochain match."
    });
  }
});

// --------- ENDPOINT : FEEDBACK SUPPORTER ----------
app.post("/api/feedback", (req, res) => {
  console.log("📥 Feedback reçu :", req.body);
  return res.json({
    message: "Merci pour ton avis, il a bien été enregistré pour analyse par le PSG Fan Intelligence Assistant."
  });
});

// --------- ENDPOINT : BILAN HEBDOMADAIRE (EXEMPLE) ----------
app.get("/api/weekly_report", (req, res) => {
  return res.json({
    week: "Semaine en cours",
    summary: "Bilan automatique à personnaliser avec les données réelles des matchs et des supporters.",
    fan_sentiment: "À compléter en fonction des feedbacks collectés.",
    suggested_improvement: "Renforcer l'expérience fan au Parc et la visibilité des équipes féminines."
  });
});

// --------- LANCEMENT DU SERVEUR ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur PSG Fan Intelligence en ligne sur le port ${PORT}`);
});
