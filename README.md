# PSG Fan Agent Server

Petit serveur Node.js (Express) pour héberger les webhooks du projet "PSG Fan Intelligence".

## Endpoints disponibles :
- **GET /api/next_match** → renvoie le prochain match du PSG
- **POST /api/feedback** → enregistre un avis ou un commentaire d’un supporter
- **GET /api/weekly_report** → renvoie un exemple de bilan hebdomadaire

## Déploiement sur Render :
1. Crée un repo GitHub et ajoute ces fichiers.
2. Sur [https://render.com](https://render.com), clique sur "New Web Service".
3. Connecte ton repo GitHub.
4. Build command : `npm install`
5. Start command : `npm start`
6. Attends la fin du déploiement → ton serveur est prêt !

Exemple d’URL : https://psg-fan-agent.onrender.com/api/next_match
