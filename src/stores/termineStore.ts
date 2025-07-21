import { defineStore } from 'pinia';
import { Termin, Wahlkreis } from '../types/termin';
import { Dropbox } from 'dropbox'; // Dropbox SDK importieren
let DROPBOX_ACCESS_TOKEN = 'sl.u.AF3cMvPGySqBtsL4tNsrBP3KcAW3P_Zseo6NT0Up_g2OqoeYKJHudeeNm83d7LvbgMxbpWxDgooGwQA5iJcjjuRgOZQbQdU8fcJPaYruiWfyYaLKCIdoNWl6898e7E9G_SjTy9ZaPk3GYA2aqBXfys7GeF6ueTqV5n-14bKDDYJEmRHcs13VGYhvg6JiWMf9sQTIWuwB7-cSaQ4V9i_22kwB5gtrmNkuI2bYDL_FFfcQ91ecnk8gUfSUyMz6b4kIj3Z0GZcCzUt2Cx1EIKMF6zw6mhr3D4DhfcJlas4i973uajyXm-Mu3qWfzfwX5CAX5DLMeUFS8saJjMRL6Mg2YjPIJ3NdhayG1o5IebcRE6w6QZDEEWz16kls4d1YHEUf0F9qnmp0z6mVt5qXIh8JTF8teMOIB0_9IJmO7UJV2qCt_NAbioIGaARt0cdo9l-fE17JlsFJzsD2R-SqrtV5o6pLxqHl76_lt-Jlewq4vJaWjXaXmI6WbBa7K5QO2cBnCtqP7fS20hKwF_BpJQBapxIRLV2ohKGnl10ohuouhfNLIbUdnrvQBX86oODaGPh2zVLavyS5sv-7RMUPEyF3ZZMM4p2Sr2Q1yIfv8E_glCCbsi0ebOEVFoVgmtGCtYspVYF8DdeCk8tP3QmEDWHrB8QLuJB5fUIfYOiejsqsjH9XVuJ5PX6wacE6yXiAqF8DxOdg9ft_M0n6xLvIuMRTgayIV4yumM28eaKsUsHu-w-tk5MuRiuMnefPiV2lGzoMjlMcepxZgIvN30j4xd93WUGuZu_WC_kifss9LGSUuu8uXVKDTfrV0VHXaFkpRU8xUgzv0-TpMaCcNR6T2du9GiBHuEiQDKfDagpgcXgLuExnMmxjdUjkq_BR7OIrndpeEfvfFRJ3CKvDKumKMDVkZBj-L4GMuKfHAtrwAVeFzMslyJPkhQ5dO1RNZVc1LqfugKe069ST9pjpIdydGzZzoe2DCNkNjSZTk43l0w0zlPygRWQ5EeygLI0SAvZkLkg0pCWhtGZ8e0LttMSNON1A0okMIGpRMCWwJVw7ru8dyvNVWxIavDXULqIsKmLig_zkqXWd1PUxZuOaW6HWPLYeA1JPWqQGW7bYbBwA9GmOC22ew7_50P7ZJVQzxCJpPTCcAAEtCSuuw6dYKWkbx0sw06kORhm3vFhaHQ2m8x0q8MJ1mISn0OLrJBm-beI99QjAaWbkt0r0hklaby4Neeztwq0TXvk8HcDe1quhQttgL3-kXVUZgZ5myuc5w8gI8oiE_MLZDNY-6GG0lcecH-pLFA1LBMF3rxjLZIj__NdHCSc1A9o2kweVfwq_TsV28GcX9ZGXbLwFkhKd19k5-R_t7k_4uI0fK1tiX5Zz3mn79tzAbvp6BIZstYbAA_4BNoJBmGNVZmQYhDN82iu5p8b2VqhTUavrtmU_N5ovwglPj8SPi_k6AqopVN0bC7uvija14dI';
const DROPBOX_REFRESH_TOKEN = 'uI9Wd63zMqYAAAAAAAAAAXbfBtz27OaQMh9_EpCFl7Dzza-jb_DLnDY_hAtKaRmC'; // Ersetze durch deinen Dropbox-Access-Token

const DROPBOX_FILE_PATH = '/termine.json'; // Pfad zur Datei in Dropbox

async function createDropboxInstance() {
  await ensureAccessToken(); // Stelle sicher, dass das Access Token gültig ist
  return new Dropbox({
    accessToken: DROPBOX_ACCESS_TOKEN, // Verwende das aktuelle Access Token
    fetch: fetch.bind(window), // Binde fetch an den globalen Kontext
  });
}
async function ensureAccessToken() {
  try {
    const newAccessToken = await refreshAccessToken();
    console.log('Access Token erfolgreich erneuert:', newAccessToken);

    // Aktualisiere das globale Access Token
    DROPBOX_ACCESS_TOKEN = newAccessToken;
  } catch (error) {
    console.error('Fehler beim Erneuern des Access Tokens:', error);
  }
}
async function refreshAccessToken() {
  const response = await fetch('https://api.dropboxapi.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: DROPBOX_REFRESH_TOKEN,
      client_id: 'k5dlergaqi6upps',
      client_secret: '4iey5hk7fytkhro',
    }),
  });

  if (!response.ok) {
    throw new Error('Fehler beim Erneuern des Access Tokens');
  }

  const data = await response.json();
  console.log('Neues Access Token:', data.access_token);

  // Optional: Speichere das neue Access Token, falls erforderlich
  return data.access_token;
}

  
export const useTermineStore = defineStore('termine', {
  state: () => ({
    termine: JSON.parse(localStorage.getItem('termine') || '[]') as Termin[],
  }),
  getters: {
    getTermine: (state) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Setze die Uhrzeit auf Mitternacht
      return state.termine.filter((termin) => {
        const terminDatum = new Date(termin.datum);
        return terminDatum >= today; // Nur Termine ab dem heutigen Datum
      });
    },
    
    getFilteredAndSortedTermine: (state) => (filterText: string, sortKey: keyof Termin, sortAsc: boolean) => {
      return state.termine
        .filter((t) =>
          t.bezeichnung.toLowerCase().includes(filterText.toLowerCase())
        )
        .sort((a, b) => {
          let valA = a[sortKey];
          let valB = b[sortKey];
    
          // Primäre Sortierung
          if (sortKey === 'datum') {
            const dateDiff =
              new Date(valA || '').getTime() - new Date(valB || '').getTime();
            if (dateDiff !== 0) {
              return sortAsc ? dateDiff : -dateDiff;
            }
          } else {
            const primaryDiff = String(valA).localeCompare(String(valB));
            if (primaryDiff !== 0) {
              return sortAsc ? primaryDiff : -primaryDiff;
            }
          }
    
          // Sekundäre Sortierung nach Wahlkreis
          const wahlkreisDiff = a.wahlkreis.localeCompare(b.wahlkreis);
          return sortAsc ? wahlkreisDiff : -wahlkreisDiff;
        });
    }
  },
  actions: {
    deleteTerminById(id: number) {
      const index = this.termine.findIndex((termin) => termin.id === id);
      if (index !== -1) {
        this.termine.splice(index, 1); // Termin aus der Liste entfernen
        this.saveTermineToDropbox(); // Änderungen speichern
      }
    },
    async saveTermineToDropbox() {

      const dbx = await createDropboxInstance(); // Verwende die zentrale Funktion
      try {
        const response = await dbx.filesUpload({
          path: DROPBOX_FILE_PATH,
          mode: { '.tag': 'overwrite' }, // Überschreibt die Datei, falls sie existiert
          contents: JSON.stringify(this.termine),
        });
        console.log('Termine erfolgreich in Dropbox gespeichert:', response);
      } catch (error) {
        console.error('Fehler beim Speichern der Termine in Dropbox:', error);
      }
    },
    async loadTermineFromDropbox() {
      const dbx = await createDropboxInstance(); // Verwende die zentrale Funktion
      try {
        const response = await dbx.filesDownload({ path: DROPBOX_FILE_PATH });
    
        // Überprüfe, ob der Response ein Blob enthält
        const blob = response.result.fileBlob
          const text = await blob.text(); // Konvertiere den Blob in Text
          this.termine = JSON.parse(text); // Parse den Text in ein JSON-Objekt
          console.log('Termine erfolgreich aus Dropbox geladen:', this.termine);

      } catch (error) {
        console.error('Fehler beim Laden der Termine aus Dropbox:', error);
      }
    },
    loadInitialTermine() {
      if (this.termine.length === 0) {
      this.loadTermineFromDropbox();
      }
    },
  },
});
