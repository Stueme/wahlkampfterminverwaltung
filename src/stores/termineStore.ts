import { defineStore } from 'pinia';
import { Termin, Wahlkreis } from '../types/termin';
import { Dropbox } from 'dropbox'; // Dropbox SDK importieren
const DROPBOX_ACCESS_TOKEN = 'sl.u.AF2IeeHcDnTSLf6L5a7VjwgOBFfZhgtjTg3CUi6MAOAjJWctmU9Ro6jTmLMR2KuDwRvtWviRY7VqBZ1OEcNW1XbVfqpv_qh5D2mujLOEHF7oNNXg3vFw9wIpZDSxfPPoKDPXxgAXFJEDUg1BQScPyNo9lrIdNC1oXstqW1Jp1gkX4qwiq_XIeNTz3PZd3PxOajqsnWt-cDahBMN8v-Q1mrNpWTwdyDCCN3aEbDBPymjHBR1cOeP4uJQ8t8_isLAc5_U06PkHEeIVs5WXDi1icjpOML7nU_FVYTR8yI-Sfi03FYZ06BGEZR2NfFMdS41V7d5h5aBilHje8fY-cnQCcYuFQu7AxYWZaogT32CxiVl1vUbT8j3sqB8YF8Yy6XejzW4kYYrhgBl6Im9MS0W0bjlyKtJsmMSWsBTNIVmZvka_bEqrS8rvQeP0sOa90nVJBdHA3xmECZtbvvuL_swfx_Zgg-PkvRfXhOK6yqgOLI-nmouv0o1OydsS7kuTWAMMC0UJD1I6v9mvgiMOyeNbGZew5Pep16WXilSXVI230RHNbnNf8EiwUZxO8z1FfkAgFRJsBweUAhSknJnAd_tANG6bDInH8TajOZYtjdcenhVDPIeI0F_K4RKNwd_N7Jp3ez1d1dDvdiWnTMw0fwBTIUjhQxBm4gBwYidWYvsWaQLRgxQV8R88LaJad8ErkhXa25c_lvEEBB0k3KesPkJd0WFRaf27QrGFxYTU8S6npnXiigozeLcwsRPt0IAa0xw7r-vHJBbwlaNVWsfBCqmnzsohf5ok7gvVyKNpJKVzgbhl9XUW8_zTHbC8ESFnj8InnlMtstMyfXCyOYsmc_Ik9a4wTNS0fTmuXLq3oHKngQCumXrzT1_GV0Atbxv5L9AIckqo7398CUrujHKtBVrOVg1x1L4ltSFseoOxXK90DcwfwWzmTEqeWwOY-t10SnibT0zM0mLEUtAR9dMPzMPiBwkv3chYF69UDiPNxsOHEmYfSkecOckA94FrdUYvRB9tfikwEoIfA0k9WZyoALo9b42sRBZD6j5mprz6F88lXicwxGBx5LifNkVVu5SkKim6dQF9ZYnI4mm0D1yNB2XC_qBwqDPXptV-JV-u8GPBCHOOrwjelVV13O0aVouY9hPZtwCPSKFFzHhIwrS06TWUpP9l1gvpdl8TZDi_mXSMCYsb0hij9ceIr5bMV7-NDQbdjMzPljNHT_DE4Ay9bOxw8qNnCgsDA5fSOB5xlj17JWmHSMycq8MTyVE3T7tC7T_1ep2N83czKxIm5caOC4YhTegaykszNhhtg2_UpPzQXw_uFaZZF6yHK2l7ulOzMbBAjvr4Lg_t-5hjmNfhMyfjYCcPqWkvYH3z_WbYcDECkdXt-_BkvIY5jU5LirvNUhWWLxk_l85qWITJ8TxTkPoHZnl94zcXyi0GwQV_NkScdt6pRUZ_cc74t5ZHNgwFo_M-x9U';
const DROPBOX_REFRESH_TOKEN = 'sl.u.AF2yw0DlffVdkDaCnpZPDyVnSuR_oi3nEbOoUY4pdtekFl39Do6Rf1wMHwr06rqd7ADkK4-5YkUYOIqvfF5uTJkeIPMijT5ogaSLx6YiDJMXhEoaHGnCMeIpw6TMD7VwAL_AtQW5vrUHBgvYGG4FYVb4gDClYVjbS7IGlOxv7b2UXWCPzEHU1E964N8IxHqSPCjdeOW1WDLUEaHqEJT8qMw4ygvX6CpM_-iYxPqzmWdYe2y1FDo8vhjrVFRYAFPw7qdtNrDT6L8kYF_NXGWFlaqiLOBqmjVgrfQxjgy_gaKWnhXDK6xzyy7M2VG50SJw0qHHntQ6S1DkYDXQs5SaNFrqN4kBxEf16c18xiHL0TwH6nDZ_tkQR-j7EyfGyML__eN0c92QuCa8vtrpdU8ywfLOZzODFGk8IKR23DQetBdA2_Fein5OjQA4PYn2yX596MWGCPlWKRmN6dht24hg-Xcz-knljHDut3PhVMgu88jHOJZsP8TJbdH5ZW_Wk7nGCaG2wGyIvCu5s9jwVoGelh3LQ0yTAuBB-7INlZ05BSBuKFoyvd7fIiPDpsqZXtkkCYBSXIvhCarG97ypqK2JkLQkkNv5Wo_44WKI8w5exR0dw_5zn4meAN25sUrgnGB0reP1ByqjfoJwKH0-hTdvHriJbxvYY082Jx1c-4Q0L61K1NVm8qanLQk8i2MdN8XEa9wVIc6j8ESbp0pbY1QtnrJ76-gDponl6LWChn0LQnJyqFPgDG6xonc0qSyFjOOTtMlcVOsYyLQQYP1ETEfzyhNP3yBhd9g6o52-2gM_JSSANFGbMUF3fnMjl4m1waEE4RkIyOcH3V7IYgJuFtwQkND1jDxhpcFZpgMdF_2ys4mpOEG1hdIFccPXxyCWxrQhF767gmbUJBRb4IXSHwF0OKpAZzJD8M4mMFFmSM5SKWKdV6qePXlw9-kCvZPrwEh0nvW5cEx8QzPLy2ZiWNsIUzqXqry_kUMOCpgouE_finPd7GQBFD_FCQJaOJUy0LboZe9xtXM2EnUmNqq7tR9F-AQzsbJhttsuz7WVJZf3pgF-fBIgDvv7bHiApTdxnMXOHm-G10_8CbpHIqLB7HyKmU7rt4GVE5St78K_EYfb7blK9oGlj3lPr01VCmutsTThySVHiHF9Mi9DJX0M6Twg-rfHkmTaooL6iB2wIvoe5NM-VPgrDYxbxunTIyPeOWLlQhUKmWHS0b7BoPFuSaboJP6ZX-5l-Kobp5mzRQEz8cPd3TuVaPJuK_DbAQkdnsnWB77QBtFtA5VJYp4G138iByDIg5hEcWew4tISiFIg5pRJ8kYTq7WseXq9qNCkF5FH67RH2Fl14sxvF_ntZ88UDuD5I3WAqIdvEmTvJRlD6TW1ueaCUTCz2uictVwkIx_G5nQX9w398rABF8nEqCqRofTuV_lLfXUn8wlllYZ7-hcdTF1UL4eFlRqTXrU7uUFCnBs'; // Ersetze durch deinen Dropbox-Access-Token

const DROPBOX_FILE_PATH = '/termine_neu.json'; // Pfad zur Datei in Dropbox


  
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

      const dbx = new Dropbox({ refreshToken: DROPBOX_ACCESS_TOKEN });
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
      const dbx = new Dropbox({
        clientId: 'qo2g4xx2vvgi7z7',
        clientSecret: '3144gx0vnd1k9eb',
        refreshToken: DROPBOX_ACCESS_TOKEN });
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
