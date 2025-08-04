export interface Termin {
  id: number;
  datum: string;
    uhrzeit?: string;
  bezeichnung: string;
  ort: string;
  wahlkreis: string | string[]; // Unterstützt sowohl Strings als auch Arrays
  nuudelLink?: string;
  ansprechpartner?: string; // Optionaler Ansprechpartner

  
}
  
  export enum Wahlkreis {
    W0 = 'übergreifend',
    W1 = 'Innenstadt 1 - Altstadt - Süd',
    W2 = 'Innenstadt 2 - Neustadt - Süd',
    W3 = 'Innenstadt 3 - Zülicher Platz',
    W4 = 'Innenstadt 4 - Belgisches Viertel',
    W5 = 'Innenstadt 5 - Agenesviertel',
    W6 = 'Innenstadt 6 - Deutz',
  }