
<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

interface Termin {
  id: number;
  datum: string;
  uhrzeit?: string; // Optional, falls Uhrzeit benötigt wird
  wahlkreis: Wahlkreis;
  bezeichnung: string;
  ort: string;
  nuudelLink?: string;
}
enum Wahlkreis {
  W0= 'übergreifend',
  W1 = 'Innenstadt 1 - Altstadt - Süd',
  W2 = 'Innenstadt 2 - Neustadt - Süd',
  W3 = 'Innenstadt 3 - Zülicher Platz',
  W4 = 'Innenstadt 4 - Belgisches Viertel',
  W5 = 'Innenstadt 5 - Agenesviertel',
  W6 = 'Innenstadt 6 - Deutz',

}

export default defineComponent({
  name: 'TermineAnzeige',
  setup() {
    const termine = ref<Termin[]>([
      { id: 6, datum: '2025-07-20', uhrzeit: '16:00', bezeichnung: 'Wahlkampf-Kickoff', ort: 'Aachener Weiher', wahlkreis: Wahlkreis.W0, nuudelLink: 'https://nuudel.digitalcourage.de/wWjBwUaosWuJltSh'},
  
    { id: 1, datum: '2025-08-01', bezeichnung: 'Plakatieren', ort: 'wird noch bekannt gegeben', wahlkreis: Wahlkreis.W1 },
      { id: 10, datum: '2025-08-01', bezeichnung: 'Plakatieren', ort: 'wird noch bekannt gegeben', wahlkreis: Wahlkreis.W2 },
      { id: 11, datum: '2025-08-01', bezeichnung: 'Plakatieren', ort: 'wird noch bekannt gegeben', wahlkreis: Wahlkreis.W3 , nuudelLink: 'https://nuudel.digitalcourage.de/wWjBwUaosWuJltSh'},
      { id: 12, datum: '2025-08-01', bezeichnung: 'Plakatieren', ort: 'wird noch bekannt gegeben', wahlkreis: Wahlkreis.W4 },
      { id: 13, datum: '2025-08-01', bezeichnung: 'Plakatieren', ort: 'KGS (Ebertplatz 23)', wahlkreis: Wahlkreis.W5 },
      { id: 14, datum: '2025-08-01', bezeichnung: 'Plakatieren', ort: 'wird noch bekannt gegeben', wahlkreis: Wahlkreis.W6 },
      { id: 15, datum: '2025-08-02', uhrzeit: '11:00',bezeichnung: 'Wahlkampfstand', ort: 'Chlodwigplatz', wahlkreis: Wahlkreis.W2, nuudelLink: 'https://nuudel.digitalcourage.de/wWjBwUaosWuJltSh'},
      { id: 16, datum: '2025-08-02', bezeichnung: 'Wahlkampfstand', ort: 'Eigelstein', wahlkreis: Wahlkreis.W5 , nuudelLink: 'https://nuudel.digitalcourage.de/wWjBwUaosWuJltSh'},
    ]);

    const sortKey = ref<keyof Termin>('datum');
    const sortAsc = ref(true);
    const filterText = ref('');
    const selectedWahlkreis = ref<Wahlkreis | null>(null);


    const gefilterteUndSortierteTermine = computed(() => {
      return termine.value
        .filter(t => t.bezeichnung.toLowerCase().includes(filterText.value.toLowerCase()))
        .filter(t => !selectedWahlkreis.value || t.wahlkreis === selectedWahlkreis.value)
        .sort((a, b) => {
          let valA = a[sortKey.value];
          let valB = b[sortKey.value];

          if (sortKey.value === 'datum') {
            return sortAsc.value
              ? new Date(valA || '').getTime() - new Date(valB || '').getTime()
              : new Date(valB || '').getTime() - new Date(valA || '').getTime();
          }

          return sortAsc.value
            ? String(valA).localeCompare(String(valB))
            : String(valB).localeCompare(String(valA));
        });
    });

    function sortBy(key: keyof Termin) {
      if (sortKey.value === key) {
        sortAsc.value = !sortAsc.value;
      } else {
        sortKey.value = key;
        sortAsc.value = true;
      }
    }

    function formatDatum(datum: string): string {
      return new Date(datum).toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }

    return {
      termine,
      sortKey,
      sortAsc,
      filterText,
      gefilterteUndSortierteTermine,
      sortBy,
      formatDatum,
      Wahlkreis,
      selectedWahlkreis,
    };
  },
});
</script>

<template>
  <div class="container">
    <h1>OV1 Wahlkampftermine</h1>

    <!-- Dropdown für Wahlkreis -->
    <div class="filter-container mb-4">
      <label for="wahlkreis" class="block text-lg font-medium mb-2">Wahlkreis auswählen:</label>
      <select v-model="selectedWahlkreis" id="wahlkreis" class="filter-input">
        <option :value="null">Alle Wahlkreise</option>
        <option v-for="(value, key) in Wahlkreis" :key="key" :value="value">
          {{ value }}
        </option>
      </select>
    </div>

    <table>
      <thead>
        <tr>
          <th @click="sortBy('datum')">
            Datum
            <span class="sort-indicator">{{ sortKey === 'datum' ? (sortAsc ? '▲' : '▼') : '' }}</span>
          </th>
          <th @click="sortBy('wahlkreis')">
            Wahlkreis
            <span class="sort-indicator">{{ sortKey === 'wahlkreis' ? (sortAsc ? '▲' : '▼') : '' }}</span>
          </th>
          <th @click="sortBy('bezeichnung')">
            Bezeichnung
            <span class="sort-indicator">{{ sortKey === 'bezeichnung' ? (sortAsc ? '▲' : '▼') : '' }}</span>
          </th>
          <th @click="sortBy('ort')">
            Ort
            <span class="sort-indicator">{{ sortKey === 'ort' ? (sortAsc ? '▲' : '▼') : '' }}</span>
          </th>
          <th>Teilnahme-Umfrage</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="termin in gefilterteUndSortierteTermine" :key="termin.id">
          <td>{{ formatDatum(termin.datum) }}</td>
          <td>{{ termin.wahlkreis }}</td>
          <td>{{ termin.bezeichnung }}</td>
          <td>{{ termin.ort }}</td>
          <td>
            <a v-if="termin.nuudelLink" :href="termin.nuudelLink" target="_blank" class="text-blue-500 hover:underline">
              nuddel
            </a>
            <span v-else>-</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>