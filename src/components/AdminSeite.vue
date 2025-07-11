<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useTermineStore } from '../stores/termineStore';
import { useRouter } from 'vue-router';

interface Termin {
  id: number;
  datum: string;
  uhrzeit?: string;
  bezeichnung: string;
  ort: string;
  wahlkreis: Wahlkreis;
  nuudelLink?: string;
}

enum Wahlkreis {
  W0 = 'übergreifend',
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

    const termineStore = useTermineStore();
    const router = useRouter(); // Router-Instanz verwenden


    const termine = termineStore.getTermine;

    const sortKey = ref<keyof Termin>('datum');
    const sortAsc = ref(true);
    const filterText = ref('');
    const selectedWahlkreis = ref<Wahlkreis | null>(null);

    const isAuthenticated = ref(false); // Authentifizierungsstatus
    const password = ref(''); // Passwort-Eingabe
    const correctPassword = 'ov1-admin'; // Statisches Passwort

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
    function checkPassword() {
      if (password.value === correctPassword) {
        isAuthenticated.value = true;
      } else {
        alert('Falsches Passwort!');
      }
    }

    function deleteTermin(id: number) {
      const index = termine.findIndex((termin) => termin.id === id);
      if (index !== -1) {
        termine.splice(index, 1); // Termin aus der Liste entfernen
       // alert('Termin wurde gelöscht.');
      }
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

      isAuthenticated,
      password,
      checkPassword,
      deleteTermin
    };
  },
});
</script>

<template>
  <div class="container">
    <!-- Passwortabfrage -->
    <div v-if="!isAuthenticated" class="password-container">
      <h1 class="text-2xl font-bold mb-4">Admin-Bereich</h1>
      <p>Bitte gebe das Admin-Passwort ein. Wenn du das nicht kennst frage den Wahlkampfmanager, die Veedelspat*innen oder den Vorstand, um Termine zu aktualiseren.:</p>
      <input v-model="password" type="password" placeholder="Passwort eingeben" class="filter-input mb-4" />
      <button @click="checkPassword" class="btn-primary">Anmelden</button>
    </div>

    <!-- Admin-Seite -->
    <div v-else>
      <h1>Admin Ansicht</h1>

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
            <th>Aktion</th>
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
            <td>
              <button @click="deleteTermin(termin.id)" class="btn-danger">Löschen</button>
            </td>
            <td>{{ formatDatum(termin.datum) }}</td>
            <td>{{ termin.wahlkreis }}</td>
            <td>{{ termin.bezeichnung }}</td>
            <td>{{ termin.ort }}</td>
            <td>
              <a v-if="termin.nuudelLink" :href="termin.nuudelLink" target="_blank"
                class="text-blue-500 hover:underline">
                nuddel
              </a>
              <span v-else>-</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>