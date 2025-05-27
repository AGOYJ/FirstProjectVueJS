<template>
  <nav>
    <router-link to="/dashboard">Dashboard</router-link> |
    <router-link to="/listes">Lists</router-link> |
    <router-link to="/hostings">Hostings</router-link> |
    <router-link to="/domains">Domains</router-link>
    <template v-if="role === 'admin'"> <!-- n'affiche pas le lien "user" si on n'est pas admin -->
      | <router-link to="/users">Users</router-link>
    </template>
  </nav>
  <router-view /> <!-- c'est ici que sera affiche la route active -->
</template>
<!-- le scoped signifie que ce style n'affectera que ce composant -->
<style scoped> 
nav {
  margin-bottom: 2rem;
}
nav a {
  margin: 0 1rem;
  text-decoration: none;
  color: #646cff;
}
nav a.router-link-exact-active { /*Rend le lien utilisé différent des autres*/
  font-weight: bold;
  color: #213547;
}
</style>

<script setup>
import { ref } from 'vue'
const role = ref(sessionStorage.getItem('role'))
</script>