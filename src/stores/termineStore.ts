import { defineStore } from 'pinia';
import { Termin, Wahlkreis } from '../types/termin';
import { Dropbox } from 'dropbox'; // Dropbox SDK importieren
const DROPBOX_ACCESS_TOKEN = 'sl.u.AF1uYZhLKUb8-XLo7nm7NZrKB9HIx0yDSwS_8s3Lyq33z-4V-zCnD4ZpnTKMRSgawMHZ9L105Z3Az8Mf4uPG53mJRY3MZbZMOuySldazVe3Al-coa4NFBFhI0OQKsXFySxMF1KAsORPvHimtfxKaw6n55BhzCTbcWqiFbO4TXqWbJEhvGNCLEujwmKUB-IElvJNHDnSkPXhL2aoSp7PlY_RHVDn3ohkBH972V_jOxU6XBwZv1uptGMJb7dRRV6HCNSJ3dgE4LiAH6J6lgS2tsMzqYSLIH4Tw4sVSlo5oZteetjKCNNJmzwlFoyAG3OSK-8ru4_kLUn-mi94LKJW0a9EI1apWoWWcdEFcEqB2PcXGAKwRSgsL2DWNS1DWUj8R1OzzcfDNCgOBK5TqG8T-WZ4mRY7CEHFK_WZO1gnh0zTon-SfxEkcLGygiH86InwPJ6k84mFCBgm5f_zPX4wORVSINOf_FKYASpLKJ42K4x5PBMqYla_LqxJSyjTcEqT4OgnHMZt-1VINRopA-sF0hzkGaiScCtnDDF_23oqHz7-kKv3iuwc_Heey3LFMU2qjq_7Sv3--Xpoc3M3W9uf94qRgKkpdvpAD07FHpYS5EpvlZUk6NMzuFlguZTBKXLevenjIC4n2mtoV7O_r9fkSPPK_vtehNeQTZ5pm2g-GrIRmbIArO038uAsV0FZzGN3_LLaFn5HWyZhciy6FCRme4vXs8h5DCDCx0eXVEswchmsrE7xpD1PfGo2Atd9D7kdo0lWf0TqxMkOWyTUyOMGXyOo68MsjnUWTTB762bXb8neeN5gc1MptNcgfn2YjKpeKal53FPIqYCFzvpuMlQSmi_lpg2rk2iudgBJQEZKwN0d5-ghcCiIlX4mxu_RF-_-klgCltByrqAEEsorCT_KqrpWpzT-8ofq_QRVx2He4tmv8_0tTBl49QVjcJSyTXw7q4m9bBTqfu0be5bG9ZGAGv9bWOuN5DJOgdGkDNYan8l6eriKbjAJ1UQcCjpG6bimi2s6Et5F5hGW_-KBhvV0KuzUofp16r5LMpUxc7JOyOenAfqDwdG7lyPv6k1dp1FHbzCpGfnbzFp4UOtDxjNNgPssaXDddDH8rb4bzKgkcxCfPnqz67n5qPSe8mF0nhW5oEkO-5s4DUUwaXQPVpypJOVlzbuye3p7yDXT9p0wfk3rn_wXl53Ehgh3uTR7tCLEjLp2MV-oxz8LTyBiLgEitnkJUGAgBF7XX7CfAcO7cpiG4e8YbSWDCzuLQAjlz0OCca5uh0PreQTonCZYX8Pn1uMJr6Qe30TAFKP_UUdxDOowsqqUjvfBWdotWJUZ7nEm89alHGSN7RMe3Y3pSptyP2lnQescqCWmXIRyQGyyIrT-dbptLLm-ICKreNiTA5ht_xGZXL6QRiUGJjNJQzOZDq5e1CuDu5DMhmV-GQiVqetZnew';
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