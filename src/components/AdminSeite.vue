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
    const isEditing = ref(false); // Status: Bearbeiten oder Hinzufügen
    const editTerminId = ref<number | null>(null); // ID des zu bearbeitenden Termins


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

    function openDialog(termin?: Termin) {
      if (termin) {
        // Bearbeiten-Modus
        isEditing.value = true;
        editTerminId.value = termin.id;
        neuerTermin.value = { ...termin }; // Termin-Daten in den Dialog laden
      } else {
        // Hinzufügen-Modus
        isEditing.value = false;
        editTerminId.value = null;
        neuerTermin.value = {
          id: Date.now(), // Temporäre ID
          datum: '',
          uhrzeit: '',
          bezeichnung: '',
          ort: '',
          wahlkreis: Wahlkreis.W0,
          nuudelLink: '',
        };
      }
      showDialog.value = true;
    }

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
        alert('Es sind nicht alle Pflichtfelder gefüllt!');
        return;
      }

      if (isEditing.value && editTerminId.value !== null) {
        // Bearbeiten: Termin aktualisieren
        const index = termineStore.termine.findIndex((t) => t.id === editTerminId.value);
        if (index !== -1) {
          termineStore.termine[index] = { ...neuerTermin.value };
        }
      } else {
        // Hinzufügen: Neuen Termin speichern
        termineStore.termine.push({ ...neuerTermin.value });
      }
      termineStore.saveTermineToLocalStorage(); // Änderungen speichern

      showDialog.value = false; // Dialog schließen
    }

    function abbrechen() {
      showDialog.value = false; // Dialog schließen
    }
    function navigateToExport() {
      router.push('/export'); // Navigiere zur Export-Seite
    }
    function navigateToUebersicht() {
      router.push('/'); //Zurück zur Übersicht
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
      openDialog,
      navigateToExport,
      navigateToUebersicht
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
      <h1>Termine verwalten</h1>

      <!-- Button "Neuen Termin anlegen" -->
      <button @click= "openDialog()" class="btn-primary mb-4">Neuen Termin anlegen</button>

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
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="termin in gefilterteUndSortierteTermine" :key="termin.id">
     
            <td data-label="Datum">{{ formatDatum(termin.datum) }}</td>
            <td data-label="Wahlkreis">{{ termin.wahlkreis }}</td>
            <td data-label="Beschreibung">{{ termin.bezeichnung }}</td>
            <td data-label="Ort">{{ termin.ort }}</td>
            <td data-label="Teilnahme-Umfrage">
              <a v-if="termin.nuudelLink" :href="termin.nuudelLink" target="_blank"
                class="text-blue-500 hover:underline">
                nuddel
              </a>
              <span v-else>-</span>
            </td>
            <td>
              <button @click="openDialog(termin)" class="btn-primary mr-2">Bearbeiten</button>
           
              <button @click="deleteTermin(termin.id)" class="btn-danger">Löschen</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="mt-4">
      <button @click="navigateToUebersicht" class="btn-primary">zur Übericht</button>
      <button @click="navigateToExport" class="btn-secondary">JSON Export</button>

    </div>
    </div>

  </div>
</template>