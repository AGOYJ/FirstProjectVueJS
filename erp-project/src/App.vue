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

<script setup>
import { ref } from 'vue'
const role = ref(sessionStorage.getItem('role'))
</script>