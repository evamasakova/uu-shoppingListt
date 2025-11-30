# UU Shopping List (Frontend)

Krátký frontend pro domácí úkol — přehled a správa nákupních seznamů.
## Rychlý start (macOS)
1. Nainstalovat závislosti:
   - npm: `npm install`

2. Spustit lokální fake API (json-server)
   - Spusťte json-server v prvním terminálu:
     - s npx: `npx json-server --watch db.json --port 3000`

3. Spustit frontend (druhý terminál):
   - npm: `npm run dev`

4. Otevřít v prohlížeči:
   - http://localhost:5173 (nebo port, který Vite vypíše)

Poznámka: pokud json-server poběží na jiném portu než 3000, nastavte v kořeni projektu soubor `.env` s proměnnou:


