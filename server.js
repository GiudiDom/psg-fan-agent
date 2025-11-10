const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// Clé API depuis Render
const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY;

// ID PSG dans API-FOOTBALL
const PSG_TEAM_ID = 85;

// --------- ENDPOINT : PROCHAIN MATCH DU PSG ----------
app.get("/api/next_match", async (req, res) => {
  try {
    if (!API_FOOTBALL_KEY) {
      return res.status(500).json({
        error: "Clé API_FOOTBALL_KEY manquante côté serveur."
      });
    }

    // Dates from/to pour contourner l'interdiction de "next"
    const today = new Date();
    const in60Days = new Date();
    in60Days.setDate(in60Days.getDate() + 60);

    const from = today.toISOString().slice(0, 10);      // YYYY-MM-DD
    const to = in60Days.toISOString().slice(0, 10);     // YYYY-MM-DD

    const response = await axios.get(
      "https://v3.football.api-sports.io/fixtures",
      {
        params: {
          team: PSG_TEAM_ID,
          from,       // date de début
          to          // date de fin
          // tu peux ajouter "timezone: 'Europe/Paris'" si besoin
        },
        headers: {
          "x-apisports-key": API_FOOTBALL_KEY
        }
      }
    );

    const fixtures = (response.data && response.data.response)
      ? response.data.response
      : [];

    if (!fixtures.length) {
      console.log(
        "⚠️ Aucun match retourné par l'API (from/to):",
        JSON.stringify(response.data, null, 2)
      );
      return res.status(404).json({
        error: "Aucun match à venir trouvé pour le PSG dans la plage de dates."
      });
    }

    // On garde uniquement les matchs dans le futur
    const now = new Date();
    const futureFixtures = fixtures.filter(f =>
      new Date(f.fixture.date) >= now
    );

    if (!futureFixtures.length) {
      return res.status(404).json({
        error: "Aucun match futur trouvé pour le PSG."
      });
    }

    // Trie par date et prend le plus proche
    futureFixtures.sort(
      (a, b) => new Date(a.fixture.date) - new Date(b.fixture.date)
    );
    const match = futureFixtures[0];

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
    console.error(
      "❌ Erreur API-Football:",
      err.response?.data || err.message
    );
    return res.status(500).json({
      error: "Erreur lors de la récupération du prochain match."
    });
  }
});

// --------- ENDPOINT : FEEDBACK SUPPORTER ----------
app.post("/api/feedback", (req, res) => {
  console.log("📥 Feedback reçu :", req.body);
  return res.json({
    message:
      "Merci pour ton avis, il a bien été enregistré pour analyse par le PSG Fan Intelligence Assistant."
  });
});

// --------- ENDPOINT : BILAN HEBDOMADAIRE (EXEMPLE) ----------
app.get("/api/weekly_report", (req, res) => {
  return res.json({
    week: "Semaine en cours",
    summary:
      "Bilan automatique à personnaliser avec les données réelles des matchs et des supporters.",
    fan_sentiment:
      "À compléter en fonction des feedbacks collectés.",
    suggested_improvement:
      "Renforcer l'expérience fan au Parc et la visibilité des équipes féminines."
  });
});

// --------- LANCEMENT DU SERVEUR ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur PSG Fan Intelligence en ligne sur le port ${PORT}`);
});
