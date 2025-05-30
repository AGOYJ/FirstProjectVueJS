<template>
  <div>
    <h1>Dashboard</h1>
    <p>Welcome {{ username }} ({{ role }})!</p>
    <div class="dashboard-links">
      <router-link to="/listes">📝 Lists</router-link>
      <router-link to="/hostings">💾 Hostings</router-link>
      <router-link to="/domains">🌐 Domains</router-link>
      <router-link to="/users">👤 Users</router-link>
    </div>
    <div v-if="statsLoaded" class="dashboard-stats">
      <div>Total lists: <b>{{ stats.lists }}</b></div>
      <div>Total tasks: <b>{{ stats.tasks }}</b></div>
      <div>Total hostings: <b>{{ stats.hostings }}</b></div>
      <div>Total domains: <b>{{ stats.domains }}</b></div>
      <div>Total users: <b>{{ stats.users }}</b></div>
    </div>
    <button @click="handleLogout">Logout</button> <!-- supprime le token et redirige vers /login -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue' //les fonctions vue
import { logout, getLists, getTasks, getHostings, getDomains, getUsers } from '../services/erpService' //les fonctions du service erpService
import { useRouter } from 'vue-router' //et le router

const router = useRouter()
const username = sessionStorage.getItem('username') || 'User'
const role = sessionStorage.getItem('role') || 'user'
const stats = ref({ lists: 0, tasks: 0, hostings: 0, domains: 0, users: 0 }) // Stocke les statistiques du tableau de bord
const statsLoaded = ref(false) // Indique si les statistiques sont chargées

const fetchStats = async () => { // Fonction pour récupérer les statistiques
  try {
    const [listsRes, hostingsRes, domainsRes, usersRes] = await Promise.all([
      getLists(),
      getHostings(),
      getDomains(),
      getUsers()
    ])
    stats.value.lists = listsRes.data.length
    stats.value.hostings = hostingsRes.data.length
    stats.value.domains = domainsRes.data.length
    stats.value.users = usersRes.data.length
    // Compter tout les éléments de toutes les listes
    let totalTasks = 0
    for (const list of listsRes.data) { // pour chaque liste
      // Récupérer les tâches de chaque liste
      const tasksRes = await getTasks(list.id) 
      // Ajouter le nombre de tâches à totalTasks
      totalTasks += tasksRes.data.length 
    }
    stats.value.tasks = totalTasks
    statsLoaded.value = true // active le chargement des statistiques
  } catch (e) {
    statsLoaded.value = false // déssactive le chargement s'il y a une erreur
  }
}

const handleLogout = () => { // Fonction qui supprime le token et redirige vers /login
  logout()
  router.push('/login')
}

onMounted(fetchStats) // Appelle fetchStats lorsque le composant est monté
</script>
