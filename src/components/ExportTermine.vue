<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useTermineStore } from '../stores/termineStore';

export default defineComponent({
  name: 'ExportTermine',
  setup() {
    const termineStore = useTermineStore();
    const termine = computed(() => termineStore.getTermine);

    return {
      termine,
    };
  },
});
</script>
<template>
    <div>
      <h1 class="text-2xl font-bold mb-4">Exportierte Termine</h1>
       <pre>{{ JSON.stringify(termine, null, 2) }}</pre> 
    </div>
  </template>