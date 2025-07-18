import { defineStore } from 'pinia';
import { Termin, Wahlkreis } from '../types/termin';
import { Dropbox } from 'dropbox'; // Dropbox SDK importieren
const DROPBOX_ACCESS_TOKEN = 'sl.u.AF2KRGtUh8vsia4cewLvF6Zed-oDaHaHIGvZYjVGKtK_lQk6ftH5ejdXGPSdwuYaBS3gGI7dGG5hRwuS47f20dxxMFNfXSuGPapWemVLLYO9GUmXDUo-vId2ItAWiUrAv_suNGh6KQGPFxLdhk3f9B2UHmYPjz_gYvfxWLEYgHuy4jaNOtlTXsTDPKT0sALfhN8u0MpVzj0dPP03Z0PDmbDRxznI96SBFC3JwuDHfNmpcBwtbmBY06_TTl5-yubG3hXgRalM9uvdycWVp7dorWhNs47lgQEtkpynbZP69-GyDuVk9ZFfKLLf1V6glE-pbuvyFK1MGWwJZgER3OAuKAIe_OzWvqqRFI5566LN7ry-GnBC1jGwukabFsenTXIVyfL4lqTvbTGTNrdcbRNawhuVDGaUmJBDnebYPN4iXY2Bnxnj0NMaIIw-jfLkdYMHUP9QfiyKQI2cel7B-D6-4Qxauod1JBwl1P6A3VUKHAlCDMdZP13tx4RSz6Tc8MftABRoEb-fGRpqUSA1MNSwECfnfm6qjZ0F1f1FO0R6omPS3EJ9fxBxzlK7xazFYMEltF3juJBHFWhCeqkBdJmbtQSih56aw2DJFaszHbARNccGJmLJUYUql2OphX3DxXinbLaCZirgLw9EwTqkmyHNtcgqSqtxrnXqvR7kPQQOrdN7Rsobi2TM8lL3aTPg0ERq6XAQJe_37XEQPxL5KF1I7DOUv-4qdRy0Oclsf2B6JvGEuAProwYpeP13inuByZA6inRAygFn5IbfuyJDIM-OIGjUzgdQnn9AH-9inwI6CSgC06-M65yqOUbupB3K9pXWxDqNvoA0Q9JqOfIcStsO4Mi69LltG7E7qDHfen6yXDRJOnT58vr12A_FeqiKrdO0-SfcbrKqYEOLhOoJPWahxo7RAQTbC7Yqk-isq5pCDCiZFL5sbZRRzfRdVo6Ld5K2x5vrJz-fFmlvlRbXRnrmvq6TTaHW31x-rZ1ZVS-ZvNmjr6HK995sycXsSjTYhBDr5-FOS2BIhrvI_g3rxU3ee_iwoB139PDpvGunZXhtyzgL2nfSmeHMhiW7eeIsFJC5H1KIXctwCNdn1nxSQVH9erKeYGju3_xlD2LuQsZv50U25Wcd4PxfNraJFjJNGfWbqLeHmBerlP1uw-k37CIbwT4BDhZ5Ek7A84nCd13SStQIFytSm-3rfkbXgE9lNVWJpKGoMVZI_4t5PjhtKRnolI-mH1ZXNiz2_4rqn-ZdzB2OCS8Xwhn9OxGk9d5DVLt2qnNYoqVdMsFLUAfOSTA7RX6Ij3SoZZC-dND4HmJQ2aNYBSdVbduM7pohyLghDuLVDIcLyZ2L1zZlqc_-P1kx4nxUhQIwqqTZ0RM2RUbkeBbkV5Zflq4SwILljDWTPQS2ffk1xrtvsvif7QuYR_JiWAZ2Qq1KUKnjPH3uXhf98fkO-szKioMFZuxgVjP3UZDvVsw'; // Ersetze durch deinen Dropbox-Access-Token
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