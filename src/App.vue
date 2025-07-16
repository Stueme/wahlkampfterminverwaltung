<template>
  <div class="container">
    <div v-if="isLoading">Lade Termine...</div>
    <div v-else>
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue';
import { useTermineStore } from './stores/termineStore';

export default {
  name: 'App',
  setup() {
    const termineStore = useTermineStore();
    const isLoading = ref(true);

    onMounted(async () => {
      await termineStore.loadTermineFromDropbox();
      isLoading.value = false;
    });

    return { isLoading };
  },
};
</script>