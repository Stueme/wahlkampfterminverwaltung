
<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useTermineStore } from '../stores/termineStore';
import { useRouter } from 'vue-router';
import { Termin, Wahlkreis } from '../types/termin';


export default defineComponent({
  name: 'TermineAnzeige',
  setup() {

    const termineStore = useTermineStore();
        // Lade die initialen Termine beim Mounten der Komponente
        onMounted(() => {
      termineStore.loadInitialTermine();
    });
    const router = useRouter(); // Router-Instanz verwenden

    const termine = termineStore.getTermine;

    const sortKey = ref<keyof Termin>('datum');
    const sortAsc = ref(true);
    const filterText = ref('');
    const selectedWahlkreis = ref<Wahlkreis | null>(null);


    const gefilterteUndSortierteTermine = computed(() => {
      return termine
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

    <!-- Dropdown für Wahlkreis -->
    <div class="filter-container mb-4">
      <label for="wahlkreis" class="block text-lg font-medium mb-2">Wahlkreis filtern:</label>
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
    <div class="mt-4">
      <button @click="navigateToAdmin" class="btn-primary">Admin</button>
    </div>
  </div>
</template>