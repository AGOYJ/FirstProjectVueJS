<script setup>
</script>

<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/dashboard">Dashboard</router-link> |
    <router-link to="/listes">Lists</router-link> |
    <router-link to="/hostings">Hostings</router-link> |
    <router-link to="/users">Users</router-link> |
    <router-link to="/domains">Domains</router-link>
  </nav>
  <router-view />
</template>

<style scoped>
nav {
  margin-bottom: 2rem;
}
nav a {
  margin: 0 1rem;
  text-decoration: none;
  color: #646cff;
}
nav a.router-link-exact-active {
  font-weight: bold;
  color: #213547;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
