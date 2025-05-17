import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import Listes from '../views/Listes.vue'
import Hostings from '../views/Hostings.vue'
import Register from '../views/Register.vue'
import Users from '../views/Users.vue'
import Domains from '../views/Domains.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/listes', name: 'Listes', component: Listes },
  { path: '/hostings', name: 'Hostings', component: Hostings },
  { path: '/register', name: 'Register', component: Register },
  { path: '/users', name: 'Users', component: Users },
  { path: '/domains', name: 'Domains', component: Domains },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router  

router.beforeEach((to, from, next) => {
  const publicPages = ['Login']
  const authRequired = !publicPages.includes(to.name)
  const token = localStorage.getItem('token')

  if (authRequired && !token) {
    return next({ name: 'Login' })
  }

  next()
})
