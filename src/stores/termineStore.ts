import { defineStore } from 'pinia';

interface Termin {
  id: number;
  datum: string;
  uhrzeit?: string;
  wahlkreis: string;
  bezeichnung: string;
  ort: string;
  nuudelLink?: string;
}


  
export const useTermineStore = defineStore('termine', {
  state: () => ({
    termine: [
      { id: 6, datum: '2025-07-20', uhrzeit: '16:00', bezeichnung: 'Wahlkampf-Kickoff', ort: 'Aachener Weiher', wahlkreis: 'übergreifend', nuudelLink: 'https://nuudel.digitalcourage.de/wWjBwUaosWuJltSh' },
      { id: 1, datum: '2025-08-01', bezeichnung: 'Plakatieren', ort: 'wird noch bekannt gegeben', wahlkreis: 'Innenstadt 1 - Altstadt - Süd' },
      { id: 10, datum: '2025-08-01', bezeichnung: 'Plakatieren', ort: 'wird noch bekannt gegeben', wahlkreis: 'Innenstadt 2 - Neustadt - Süd' },
      { id: 11, datum: '2025-08-01', bezeichnung: 'Plakatieren', ort: 'wird noch bekannt gegeben', wahlkreis: 'Innenstadt 3 - Zülicher Platz', nuudelLink: 'https://nuudel.digitalcourage.de/wWjBwUaosWuJltSh' },
      { id: 12, datum: '2025-08-01', bezeichnung: 'Plakatieren', ort: 'wird noch bekannt gegeben', wahlkreis: 'Innenstadt 4 - Belgisches Viertel' },
      { id: 13, datum: '2025-08-01', bezeichnung: 'Plakatieren', ort: 'KGS (Ebertplatz 23)', wahlkreis: 'Innenstadt 5 - Agenesviertel' },
      { id: 14, datum: '2025-08-01', bezeichnung: 'Plakatieren', ort: 'wird noch bekannt gegeben', wahlkreis: 'Innenstadt 6 - Deutz' },
      { id: 15, datum: '2025-08-02', uhrzeit: '11:00', bezeichnung: 'Wahlkampfstand', ort: 'Chlodwigplatz', wahlkreis: 'Innenstadt 2 - Neustadt - Süd', nuudelLink: 'https://nuudel.digitalcourage.de/wWjBwUaosWuJltSh' },
      { id: 16, datum: '2025-08-02', bezeichnung: 'Wahlkampfstand', ort: 'Eigelstein', wahlkreis: 'Innenstadt 5 - Agenesviertel', nuudelLink: 'https://nuudel.digitalcourage.de/wWjBwUaosWuJltSh' },
      { id: 20, datum: '2025-08-02', bezeichnung: 'Wahlkampfstand', ort: 'Eigelstein', wahlkreis: 'Innenstadt 5 - Agenesviertel', nuudelLink: 'https://nuudel.digitalcourage.de/wWjBwUaosWuJltSh' },
    ] as Termin[],
  }),
  getters: {
    getTermine: (state) => state.termine,
   
    
  },
  
});