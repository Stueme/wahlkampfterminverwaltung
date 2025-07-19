import { defineStore } from 'pinia';
import { Termin, Wahlkreis } from '../types/termin';
import { Dropbox } from 'dropbox'; // Dropbox SDK importieren
const DROPBOX_ACCESS_TOKEN = 'sl.u.AF0Z5adWgOoP1omSAHd0SRdJkDE7UxvysS9o1J4oKi2v64wB8pRE82Ma5ZBAhuSg6tJH9f_O2iKyRcKjK8VILB1xNuXJYIxwhGiWh1VsoIYQ7J5cRsGgWhZh2HSbZkeEYQY9uFX_qihiTxZpqFu7JWmzEwMUEU4wi4_lQbdfffN_HE_7vjR8hqFvX3RXfaghrwuqwBMbsAVhi9Q-QE0F986ClXWP8VP4GRA7zcaep7YUcBGVxm4957TuDQ5kblXlpS6f24Mwr4Vlgl0CMulQ8tXrMliITSJYCSdUzgJMnl-nlsgZxdpLG1FWnhCSt8OYcdEdxrDoP4Gu3NoDSw8nm1NeeKdaJ0ItkNVQdN36r9wmjeZNptPFv_6KeWaHEcJFkhpI7qGmRlNA_aJTG-ka9zypHJ-S8FhgF5dHsJv_8dFqTKQ2Fiu0i86prj9djue2U8ojBPVZ50YuaqQ2bMe7OsjFE52SCsS687t8frzwODYhdl5c8Xqoi3QFQVL7IoVWu94VMKKYP2fUJbrl0hO_T7BlCgYAlyOYkQaR-AdlqnCsEn0UzKTcIvjz23Sk59MzjRM3PXCHSh349dvGF_uxNlTcxJPsbUMDyWCCbMfNJl7zZU8rETSa3B7V5gl468JR3u9u9o8d0jMafURIJtXCEc9_ioyhcZmzbGPv9JMnpZdHQBeOI8dFTKkI9yDDDK63eGxe4Qws-ETyYW-qpIDNcEUoxVJgm0nJFuhpHsHc71L8XK3AQqenU2fj8pe0zvLw3KTOXN2YkJyFsA_KlOqbwz3MHF0j80viGbUQUJjXpEFgyb4lv7ZtK85clCb3_o8De2VwR-N39YaCNxl_ITlB5MLPxDRSWCWZscUvga-T5c9_eML-tPrIU6dH02RLv2x25Xr66Eiy_m_zhR2VHh0gmMiIX_SnktQK0kAvERNOIoInU504_2FAvOK9llf9EB-nAMv4N8tjs_sPcNRqNUFR7aJvYGadz41ppUl8iMzfUF0v5zOPY1mmX-pVYkift8selgUrx2btHL8a3E_6uUZBZmnu3ozAmYpgXPLqs_Q08MkBbpIw4uU3rfsFIYNy0UVMyqpe4jiVOOG1V-2-3lPT4O1gM0214dzZViB4oTb1Tp-kvDaSD_J0NayupNCYVm4j_vEBZeyoUcTEMkNdvuWvxa9z2reWE1pY9YM-WxAKIL0NCcqL46klIMbgXndnbAquRWax209m1SHYb_prx4YnHsCXN16HuwPNurk_V_bYoFLnVNg2RvxPChd6LVd1E-6f5GqGz1vGyHqKfpZqu3WbhI1V__JLPWvniXhnah0yLmgAh2yvhkxLqF9IxGqNqNWsQ5zwirKj938myKiVdJx9D5TcbqPPkkt2lECfGFXHJ7tcfnrIc4ZUYFOk03NVpv3Z49A0cArIve-UcEm-pRKMPeozMKWZSxKF2w3g2n4OcFtSpQ'; // Ersetze durch deinen Dropbox-Access-Token
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