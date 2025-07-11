import { createRouter, createWebHistory } from 'vue-router';
import TermineAnzeige from '../components/TermineAnzeige.vue';
import ExportTermine from '../components/ExportTermine.vue';
import AdminSeite from '../components/AdminSeite.vue';

const routes = [

  { path: '/', component: TermineAnzeige },
  { path: '/export', component: ExportTermine },
  { path: '/admin', component: AdminSeite },


];

const router = createRouter({
  history: createWebHistory('/'), // Basis-Pfad für das Deployment
  routes,
});

export default router;