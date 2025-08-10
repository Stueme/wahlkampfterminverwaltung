import { Termin } from '../types/termin';

export function formatDatum(termin: Termin): string {

  const date = new Date(termin.datum);
  const time = termin.uhrzeit ? termin.uhrzeit : date.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const wochentage = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const tag = wochentage[date.getDay()];

  return tag + ', ' + date.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) + ' ' + time + ' Uhr';
}
