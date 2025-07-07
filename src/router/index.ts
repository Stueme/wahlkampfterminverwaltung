import { createRouter, createWebHistory } from 'vue-router';
import TermineAnzeige from '../components/TermineAnzeige.vue';
import ExportTermine from '../components/ExportTermine.vue';

const routes = [
  { path: '/', component: TermineAnzeige },
  { path: '/export', component: ExportTermine },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;