import { defineStore } from 'pinia';
import { Termin, Wahlkreis } from '../types/termin';
import { Dropbox } from 'dropbox'; // Dropbox SDK importieren
const DROPBOX_ACCESS_TOKEN = 'sl.u.AF3An-XpFXYXYJ5PfgN21yNl8YeECRlB32skXwi70uV-0HLbO29l3FfkyQG2Ic1YVHIgvntRKeneiNqlyi25j-9rtXIX0JpWKfCjowJSdbIp_4w7nnZE-XAwEgsZ3bK_GLkFnsXP72a1ecwpjnqo38sIii8wcTSCMWJQ8mZNjGAY6Lb-4WF7TrO2H6NH4r-UbY7ULZcTiRkT2I5q4EJF82_F_LOF0E3ulPCZqSzWW_o_Zdd_x1GZxefrn47UTD7eJFko6QOaPD3IEcsuS7H6nuMlixY_jRSp4D79WMVlq53M9bdu_6GQEIhHciL5av7xT6s_izoS08EIhqdSxBYoMyI_YhIpXhokkw3-OxTHIaBG6bCzeo76j0D-e-fYDH9TYf08y3kedYynjzZmZYI4Ezko8rF4LuOwRmFCmjnrdDw8mX2qKf2BpjnfMmIm-a113RkHDIpcx4j3ojCwvK-KLrCP5QOoF0O2Xf8N9gTVtumkK0uoZNq1joOhNgVAJivixk5Uuh1f70i_elDjmT1IcC5sWcTPtMDT_j-CwVb5b-GXp0DKApJbInq2yOj8lTVcLZFBM8Hrniq5_FEzl3nNLgGRR71nUVsG8v6i_hT0Etyyza4Cvqyz6n3eWoPaLx_5F0MXbolaN_K7YpaEVZCujx9GuvJj1WFldveeGJjeqqa_ZisCXywJWoYI2uSBM1912hUL83yb0_XP4em6SC-cZ3NfeXBYyWrbjBqdCegDUuzG0IjDmyEBQIUqqtOuc7jz_ahR1R6w4zJzISjbn19vdf8sPHpM8RfGtmfE0DWXJGv_NafBVL1Cun1QbAItj_3ugrvQxTHDa2eVEQN91eHoxvVlEplsIYo7rv605jJ752sfuIJ5SK9XMvfr8UvRyPD7_sX2Zu0uuYo1Jf2lnItxDrfr5kXZUIksxQvVd14QVa5YXM4789E-ZdlJ5E-R0rrG57DWUa5JBrabf3FIA5QsOwpr86hG6C95TIe3H4uVmlrlwW3YvtroK6_hpClC02MDkW64Uciv2QRCngF6iXrDrTwkX-v3yv-UuriIZX3qgTnIzUsbOain-ofHv7B0C7w_0sVl_w5Q0-zLaVR5hoBSghvp6z6gRm3YUbeVfYHP8sEE6vLim1c2blEWmggvHD_fGBxCCgpSzZLtcZMJ4mJEpKxxZpxRIg51X37vVNrT4XpOukrpvX4AgriRMnrg0V6ZiF3S1ZqGrwPk2A34QeuyChxNNUvaPqCC1UDpPx3oiRpyAzLyXJIopRk7-K6ArkzPuUE8sZ9JTR7R9bMr-JQXVoiGyvCX7ByxDmMovWQXMiy9sH_QTupcc92zYae7wS9w7tWfyCQ6OKlKQxevDB5BhSweCwR4IiRjUr8XmzInTihGmcmj70CjWicE1xEO5BCDyzZhs4hRU0VVING7WNoz8tALrIjuYBc4_C_0LWXu3LZABHSQ50TcAqxpthdmOqloi00'; // Ersetze durch deinen Dropbox-Access-Token
const DROPBOX_REFRESH_TOKEN = 'sl.u.AF2yw0DlffVdkDaCnpZPDyVnSuR_oi3nEbOoUY4pdtekFl39Do6Rf1wMHwr06rqd7ADkK4-5YkUYOIqvfF5uTJkeIPMijT5ogaSLx6YiDJMXhEoaHGnCMeIpw6TMD7VwAL_AtQW5vrUHBgvYGG4FYVb4gDClYVjbS7IGlOxv7b2UXWCPzEHU1E964N8IxHqSPCjdeOW1WDLUEaHqEJT8qMw4ygvX6CpM_-iYxPqzmWdYe2y1FDo8vhjrVFRYAFPw7qdtNrDT6L8kYF_NXGWFlaqiLOBqmjVgrfQxjgy_gaKWnhXDK6xzyy7M2VG50SJw0qHHntQ6S1DkYDXQs5SaNFrqN4kBxEf16c18xiHL0TwH6nDZ_tkQR-j7EyfGyML__eN0c92QuCa8vtrpdU8ywfLOZzODFGk8IKR23DQetBdA2_Fein5OjQA4PYn2yX596MWGCPlWKRmN6dht24hg-Xcz-knljHDut3PhVMgu88jHOJZsP8TJbdH5ZW_Wk7nGCaG2wGyIvCu5s9jwVoGelh3LQ0yTAuBB-7INlZ05BSBuKFoyvd7fIiPDpsqZXtkkCYBSXIvhCarG97ypqK2JkLQkkNv5Wo_44WKI8w5exR0dw_5zn4meAN25sUrgnGB0reP1ByqjfoJwKH0-hTdvHriJbxvYY082Jx1c-4Q0L61K1NVm8qanLQk8i2MdN8XEa9wVIc6j8ESbp0pbY1QtnrJ76-gDponl6LWChn0LQnJyqFPgDG6xonc0qSyFjOOTtMlcVOsYyLQQYP1ETEfzyhNP3yBhd9g6o52-2gM_JSSANFGbMUF3fnMjl4m1waEE4RkIyOcH3V7IYgJuFtwQkND1jDxhpcFZpgMdF_2ys4mpOEG1hdIFccPXxyCWxrQhF767gmbUJBRb4IXSHwF0OKpAZzJD8M4mMFFmSM5SKWKdV6qePXlw9-kCvZPrwEh0nvW5cEx8QzPLy2ZiWNsIUzqXqry_kUMOCpgouE_finPd7GQBFD_FCQJaOJUy0LboZe9xtXM2EnUmNqq7tR9F-AQzsbJhttsuz7WVJZf3pgF-fBIgDvv7bHiApTdxnMXOHm-G10_8CbpHIqLB7HyKmU7rt4GVE5St78K_EYfb7blK9oGlj3lPr01VCmutsTThySVHiHF9Mi9DJX0M6Twg-rfHkmTaooL6iB2wIvoe5NM-VPgrDYxbxunTIyPeOWLlQhUKmWHS0b7BoPFuSaboJP6ZX-5l-Kobp5mzRQEz8cPd3TuVaPJuK_DbAQkdnsnWB77QBtFtA5VJYp4G138iByDIg5hEcWew4tISiFIg5pRJ8kYTq7WseXq9qNCkF5FH67RH2Fl14sxvF_ntZ88UDuD5I3WAqIdvEmTvJRlD6TW1ueaCUTCz2uictVwkIx_G5nQX9w398rABF8nEqCqRofTuV_lLfXUn8wlllYZ7-hcdTF1UL4eFlRqTXrU7uUFCnBs'; // Ersetze durch deinen Dropbox-Access-Token

const DROPBOX_FILE_PATH = '/termine.json'; // Pfad zur Datei in Dropbox


  
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

      const dbx = new Dropbox({ accessToken: DROPBOX_ACCESS_TOKEN });
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
      const dbx = new Dropbox({ accessToken: DROPBOX_ACCESS_TOKEN });
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