<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useTermineStore } from '../stores/termineStore';
import { useRouter } from 'vue-router';
import { formatDatum } from '../util/formatting'; // Importiere die zentrale Funktion

import { Termin, Wahlkreis } from '../types/termin';


export default defineComponent({
  name: 'TermineAnzeige',
  setup() {

    const termineStore = useTermineStore();
    const router = useRouter(); // Router-Instanz verwenden


    const termine = ref(termineStore.getTermine);

    const sortKey = ref<keyof Termin>('datum');
    const sortAsc = ref(true);
    const filterText = ref('');


    // Dialog-Status
    const showDialog = ref(false);
    const isEditing = ref(false); // Status: Bearbeiten oder Hinzufügen
    const editTerminId = ref<number | null>(null); // ID des zu bearbeitenden Termins


    const showDeleteDialog = ref(false); // Status des Löschdialogs
    const terminToDelete = ref<number | null>(null); // ID des zu löschenden Termins

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


    // Prüfe den Authentifizierungsstatus beim Laden der Seite
    onMounted(() => {
      const storedAuth = localStorage.getItem('isAuthenticated');
      isAuthenticated.value = storedAuth === 'true'; // Konvertiere den gespeicherten Wert in einen Boolean
    });
    function login() {
      if (password.value === correctPassword) {
        isAuthenticated.value = true;
        localStorage.setItem('isAuthenticated', 'true'); // Speichere den Status im LocalStorage
        password.value = ''; // Passwort-Feld zurücksetzen
      } else {
        alert('Falsches Passwort!');
      }
    }

    const gefilterteUndSortierteTermine = computed(() => {
      return termineStore.getFilteredAndSortedTermine(
        filterText.value,
        sortKey.value,
        sortAsc.value
      );
    })

    function sortBy(key: keyof Termin) {
      if (sortKey.value === key) {
        sortAsc.value = !sortAsc.value;
      } else {
        sortKey.value = key;
        sortAsc.value = true;
      }
    }



    function deleteTermin(id: number) {
      termineStore.deleteTerminById(id);
      termineStore.saveTermineToDropbox();
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
      termineStore.saveTermineToDropbox(); // Änderungen speichern
      termine.value = termineStore.getTermine;

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
    function openDeleteDialog(id: number) {
      terminToDelete.value = id; // Speichere die ID des zu löschenden Termins
      showDeleteDialog.value = true; // Zeige den Dialog an
    }

    function cancelDelete() {
      terminToDelete.value = null; // Zurücksetzen
      showDeleteDialog.value = false; // Dialog schließen
    }

    function confirmDelete() {
      if (terminToDelete.value !== null) {
        deleteTermin(terminToDelete.value); // Termin löschen
        termine.value = termineStore.getTermine; // Lokale Referenz aktualisieren

      }
      cancelDelete(); // Dialog schließen
    }


    return {
      termine,
      confirmDelete,
      cancelDelete,
      openDeleteDialog,
      showDeleteDialog,
      sortKey,
      sortAsc,
      filterText,
      gefilterteUndSortierteTermine,
      sortBy,
      formatDatum,
      Wahlkreis,
      isAuthenticated,
      password,
      login,
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
      <button @click="login" class="btn-primary">Anmelden</button>
    </div>

    <!-- Admin-Seite -->
    <div v-else>
      <h1>Termine verwalten</h1>

      <!-- Button "Neuen Termin anlegen" -->
      <button @click="openDialog()" class="btn-primary mb-4">Neuen Termin anlegen</button>

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
              <textarea v-model="neuerTermin.bezeichnung" id="bezeichnung" class="filter-input" rows="4"></textarea>
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

            <td data-label="Datum">{{ formatDatum(termin) }}</td>
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

              <button @click="openDeleteDialog(termin.id)" class="btn-danger">Löschen</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="mt-4">
        <button @click="navigateToUebersicht" class="btn-primary">zur Übericht</button>
        <button @click="navigateToExport" class="btn-secondary">JSON Export</button>

      </div>
    </div>
    <div v-if="showDeleteDialog" class="dialog-overlay">
      <div class="dialog">
        <h2 class="text-xl font-bold mb-4">Termin löschen</h2>
        <p>Möchtest du diesen Termin wirklich löschen?</p>
        <div class="flex justify-end mt-4">
          <button @click="cancelDelete" class="btn-secondary mr-2">Abbrechen</button>
          <button @click="confirmDelete" class="btn-danger">OK</button>
        </div>
      </div>
    </div>

  </div>
</template>