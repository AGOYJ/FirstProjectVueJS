// importation des fonctions nécessaires pour créer un routeur Vue.js
import { createRouter, createWebHistory } from 'vue-router' 

//on import les différentes pages
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import Listes from '../views/Listes.vue'
import Hostings from '../views/Hostings.vue'
import Users from '../views/Users.vue'
import Domains from '../views/Domains.vue'

//déclaration des routes
const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/listes', name: 'Listes', component: Listes },
  { path: '/hostings', name: 'Hostings', component: Hostings },
  { path: '/users', name: 'Users', component: Users, meta: { requiresAdmin: true } },
  { path: '/domains', name: 'Domains', component: Domains },
]

//création du routeur avec l'historique de navigation
const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
  const publicPages = ['Login', 'Register'] //pages accessibles sans être connecté
  const authRequired = !publicPages.includes(to.name)
  const token = sessionStorage.getItem('token') //récupération du token de session
  const role = sessionStorage.getItem('role')

  if (authRequired && !token) { //redirection vers la page de connexion si l'utilisateur n'est pas connecté
    return next({ name: 'Login' })
  }
  if (to.meta.requiresAdmin && role !== 'admin') { //vérification du rôle de l'utilisateur pour les pages nécessitant un rôle admin (pages "users")
    return next({ name: 'Dashboard' })
  }
  next() //poursuite de la navigation
})

export default router
//exportation du routeur pour l'utiliser dans l'application