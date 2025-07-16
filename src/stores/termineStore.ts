import { defineStore } from 'pinia';
import { Termin, Wahlkreis } from '../types/termin';
import { Dropbox } from 'dropbox'; // Dropbox SDK importieren
const DROPBOX_ACCESS_TOKEN = 'sl.u.AF1_1y0v4cWBlXv-OvKDZ8g8ZF7gfdxtrmBnHZza4wpr20R_6IMmXTcjgWubH2DN9rk41nsUu1bsUryyV6xRPjy4DhVlmmwc7KNwQ8h01Ctjy7_R399kgh_3jh0pcngMtRae2KC2umCLqRBJFAq79Bbj_RPxV6mHT_qKVnGXzV6COhpOiTjKE1-dpaFA5dIQ8M3DSjT-4ajsXu8EKDV-1yJ3j6v4s5wlTESvvK0S2FJgq5v-rUkoY6JVm01acbm0dC82f1Sn0wdHTj1ZOQi2ZrkuIGQHJ-YuEaJ8S9kp3JwdjzgXeQPjaZp-MUp_iLOS3deKZ7YNcVXg3vxMcU5fhc1UGZwh6RKtNTDV3f-D_C9Jbm4UU7asrniYDR6zkp_KaWYBPmndS-Rn95ywnZ7SuV2nkmbc27XvquzuDVjoXRAv9bcff8TlbUeFfh57zIT87c569KjzAkD6Ju9E93FGn1yvEuYihVM83vZloZTKzEMUDSeoO6ZfTfJlzhxYvGZy4ppsxqxgSLA4-HEeH3HaTFCfg7mn0iCMxDSgqWelpp53-5J03mD4T6vKRdFqrQe8Un-Xk2BoBRUthL89PRVwAqAQP8p6OmNIw9ira8gd9Zv8ad8d6LelSF79hnyhhag6xAIMSUN9mjf_5uhCqJSnXEjlz7zqeMoamcfikbWIfRNTsaO1vIoH9qc2M--vPr-C0bilIJSEmVe8JEoxMTtxkunzQs9bzvE_4aixcwNvImVxhyZ1SmGnntMFz-QkNH_1OsiZST788K0ci3EFyd4Fd4dAlTCodKroXVNUos6xbfPci-eej1WLiP3fWSSXhR02TQbCE_rPh3ld_SiqgUeNF7EGNMtm6uJ_-A7dLsHflcTKKCCJ3HHUYQk-GC1buzH3NSofVJbMIg9P-irtzrxxjRwSeylYbY5DTUwdBvG9t2m_KagQheS2cPVOdCx9PdLTBsBoz6iOj61rwj0NhBCnYpYQx4aCKd3ZHwa8qZ56qWCkYyJ4PcG61X0All7_PG5bbVrA4q8pQLRW8f8j6JOa7Ui5k1mdyJbWr8xEAlsusWXIOR2K7ubyVPtWh61ngFBsr22aQn8aHIW19XQO3SyyJVXtVhWFpzIksu4sEB-bAqE2EvBjEMtLwtuf8_C_DCT1G8SPhzGQ8Ao0-9eIi8LPaBlF_ucPmObyRR3HELfj_ks-UUt1NDPKYYxVJ5VJtfh2bN4JReMsnBH4F6IUbYYY93g_4kjAwAt5rmVGPegbFt6jFZN0xNZ900Hy31FQ0sAA7329cbOX2rEbMaFlUoFEmiGhBfzpCTlWjYzyTejKpkUYdjVmTW1D0stt691HwAEoGRBz_xkvyzyNPhXWrIU6OppOjwIyq-a8dK7rH7kb_K0UoPs0ulZLN43UEGmxSsm46bbakZRLoFCWsPA9Ah2Q_PGb8UmZgwwE8L8UwFzMQEnU8g'; // Ersetze durch deinen Dropbox-Access-Token
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