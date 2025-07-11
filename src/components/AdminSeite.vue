<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useTermineStore } from '../stores/termineStore';
import { useRouter } from 'vue-router';

import { Termin, Wahlkreis } from '../types/termin';


export default defineComponent({
  name: 'TermineAnzeige',
  setup() {

    const termineStore = useTermineStore();
    const router = useRouter(); // Router-Instanz verwenden


    const termine = termineStore.getTermine;

    const sortKey = ref<keyof Termin>('datum');
    const sortAsc = ref(true);
    const filterText = ref('');


    // Dialog-Status
    const showDialog = ref(false);

    // Neuer Termin
    const neuerTermin = ref<Termin>({
      id: Date.now(), // Temporäre ID
      datum: '',
      uhrzeit: '',
      bezeichnung: '',
      ort: '',
      wahlkreis: Wahlkreis.W0,
      nuudelLink: '',
    });

    const isAuthenticated = ref(false); // Authentifizierungsstatus
    const password = ref(''); // Passwort-Eingabe
    const correctPassword = 'ov1-admin'; // Statisches Passwort

    const gefilterteUndSortierteTermine = computed(() => {
      return termine
        .filter(t => t.bezeichnung.toLowerCase().includes(filterText.value.toLowerCase()))
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
      termineStore.deleteTerminById(id);
    }
    function speichern() {
      if (!neuerTermin.value.datum || !neuerTermin.value.bezeichnung || !neuerTermin.value.ort) {
        return;
      }

      termineStore.termine.push({ ...neuerTermin.value }); // Termin speichern
      termineStore.saveTermineToLocalStorage(); // Änderungen speichern
      alert('Termin wurde erfolgreich angelegt!');
      showDialog.value = false; // Dialog schließen
    }

    function abbrechen() {
      showDialog.value = false; // Dialog schließen
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
      isAuthenticated,
      password,
      checkPassword,
      deleteTermin,
      speichern,
      showDialog,
      neuerTermin,
      abbrechen,
    };
  },
});
</script>

<template>
  <div class="container">
    <!-- Passwortabfrage -->
    <div v-if="!isAuthenticated" class="password-container">
      <h1 class="text-2xl font-bold mb-4">Admin-Bereich</h1>
      <p>Bitte gebe das Admin-Passwort ein. Wenn du das nicht kennst frage den Wahlkampfmanager, die Veedelspat*innen
        oder den Vorstand, um Termine zu aktualiseren.:</p>
      <input v-model="password" type="password" placeholder="Passwort eingeben" class="filter-input mb-4" />
      <button @click="checkPassword" class="btn-primary">Anmelden</button>
    </div>

    <!-- Admin-Seite -->
    <div v-else>
      <h1>Termin Pflege</h1>

      <!-- Button "Neuen Termin anlegen" -->
      <button @click="showDialog = true" class="btn-primary mb-4">Neuen Termin anlegen</button>

      <!-- Dialog für neuen Termin -->
      <div v-if="showDialog" class="dialog-overlay">
        <div class="dialog">
          <h2 class="text-xl font-bold mb-4">Neuen Termin anlegen</h2>
          <form class="grid-form">
            <div class="form-group">
              <label for="datum" class="block text-sm font-medium mb-1">Datum*:</label>
              <input v-model="neuerTermin.datum" type="date" id="datum" class="filter-input" />
            </div>
            <div class="form-group">
              <label for="uhrzeit" class="block text-sm font-medium mb-1">Uhrzeit*:</label>
              <input v-model="neuerTermin.uhrzeit" type="time" id="uhrzeit" class="filter-input" />
            </div>

            <div class="form-group">
              <label for="wahlkreis" class="block text-sm font-medium mb-1">Wahlkreis*:</label>
              <select v-model="neuerTermin.wahlkreis" id="wahlkreis" class="filter-input">
                <option v-for="(value, key) in Wahlkreis" :key="key" :value="value">
                  {{ value }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="ort" class="block text-sm font-medium mb-1">Ort*:</label>
              <input v-model="neuerTermin.ort" type="text" id="ort" class="filter-input" />
            </div>
            <div class="form-group full-width">
              <label for="bezeichnung" class="block text-sm font-medium mb-1">Beschreibung*:</label>
              <textarea v-model="neuerTermin.bezeichnung" id="bezeichnung" class="filter-input" rows="4"
            ></textarea>
            </div>

            <div class="form-group full-width">
              <label for="nuudelLink" class="block text-sm font-medium mb-1">Nuudel-Link:</label>
              <input v-model="neuerTermin.nuudelLink" type="url" id="nuudelLink" class="filter-input" />
            </div>
          </form>
          <div class="flex justify-end  mt-4">
            <button @click="abbrechen" class="btn-secondary mr-2">Abbrechen</button>
            <button @click="speichern" class="btn-primary">OK</button>
          </div>
        </div>
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