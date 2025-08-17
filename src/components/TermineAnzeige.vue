<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useTermineStore } from '../stores/termineStore';
import { useRouter } from 'vue-router';
import { Termin, Wahlkreis } from '../types/termin';

import { formatDatum } from '../util/formatting'; // Importiere die zentrale Funktion

export default defineComponent({
  name: 'TermineAnzeige',
  setup() {

    const termineStore = useTermineStore();
    const termine = computed(() => termineStore.termine);

    const router = useRouter(); // Router-Instanz verwenden


    const sortKey = ref<keyof Termin>('datum');
    const sortAsc = ref(true);
    const filterText = ref('');
    const selectedWahlkreis = ref<Wahlkreis | null>(null);


    const gefilterteUndSortierteTermine = computed(() => {
      return termineStore.getFilteredAndSortedTermine(
        filterText.value,
        sortKey.value,
        sortAsc.value
      ).filter((termin) => {
        // Filtere nach Wahlkreis, wenn einer ausgewählt ist
        return selectedWahlkreis.value === null || termin.wahlkreis.includes(selectedWahlkreis.value);
      });
    })

    function sortBy(key: keyof Termin) {
      if (sortKey.value === key) {
        sortAsc.value = !sortAsc.value;
      } else {
        sortKey.value = key;
        sortAsc.value = true;
      }
    }


    function navigateToAdmin() {
      router.push('/admin'); // Navigiere zur Export-Seite
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
      navigateToAdmin
      ,
    };
  },
});
</script>

<template>
  <div class="container">
    <h1>OV1 Wahlkampftermine</h1>
    <div class="info-box">
      Bei Fragen wende dich an unseren Wahlkampfmanager über joerg.eichenauer@gruenekoeln.de oder schreibe an
      innenstadt@gruenekoeln.de
    </div>

    <!-- Dropdown für Wahlkreis -->
    <div class="filter-container mb-4">
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
            Beschreibung
            <span class="sort-indicator">{{ sortKey === 'bezeichnung' ? (sortAsc ? '▲' : '▼') : '' }}</span>
          </th>
          <th @click="sortBy('ort')">
            Ort
            <span class="sort-indicator">{{ sortKey === 'ort' ? (sortAsc ? '▲' : '▼') : '' }}</span>
          </th>
          <th @click="sortBy('ansprechpartner')">
            Ansprechpartner*in
            <span class="sort-indicator">{{ sortKey === 'ansprechpartner' ? (sortAsc ? '▲' : '▼') : '' }}</span>
          </th>
          <th>Teilnahmeumfrage</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="termin in gefilterteUndSortierteTermine" :key="termin.id" :class="{ 'highlighted': termin.highlighted }">
          <td data-label="Datum">{{ formatDatum(termin) }}</td>
          <td data-label="Wahlkreis">
            <template v-if="Array.isArray(termin.wahlkreis)">
              <span v-for="(wahlkreis, index) in [...termin.wahlkreis].sort()" :key="index">
                {{ wahlkreis }}<br />
              </span>
            </template>
            <template v-else>
              {{ termin.wahlkreis }}
            </template>
          </td>
          <td data-label="Beschreibung">{{ termin.bezeichnung }}</td>
          <td data-label="Ort">{{ termin.ort }}</td>
          <td data-label="Ansprechpartner*in">
            <span v-if="termin.ansprechpartner">{{ termin.ansprechpartner }}</span>
            <span v-else>-</span>
          </td>
          <td data-label="Teilnahmeumfrage">
            <a v-if="termin.nuudelLink" :href="termin.nuudelLink" target="_blank" class="text-blue-500 hover:underline">
              nuudel
            </a>
            <span v-else>-</span>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="mt-4">
      <button @click="navigateToAdmin" class="btn-primary">Termine verwalten</button>
    </div>
  </div>
</template>