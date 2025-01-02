import { createRouter, createWebHistory } from 'vue-router';
import TheHome from '../components/TheHome.vue';
import TheConfirm from '../components/TheConfirm.vue';
import TheTicket from '@/components/TheTicket.vue';
import TheTickets from '@/components/TheTickets.vue';
const routes = [
  {
    path: '/',
    name: 'Home',
    component: TheHome,
  },
  {
    path: '/confirm',
    name: 'Confirm',
    component: TheConfirm,
  },
  {
    path: '/ticket/:ticketId',
    name: 'TheTicket',
    component: TheTicket,
    props: true, 
  },
  {
    path: '/tickets',
    name: 'Tickets',
    component: TheTickets
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
