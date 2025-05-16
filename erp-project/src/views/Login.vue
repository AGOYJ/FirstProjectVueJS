<template>
  <div>
    <h2>Connexion</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="username" placeholder="Nom d'utilisateur" required />
      <input v-model="password" type="password" placeholder="Mot de passe" required />
      <button type="submit">Se connecter</button>
      <p v-if="error" style="color: red">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import { login } from '../services/erpService'

export default {
  data() {
    return {
      username: '',
      password: '',
      error: ''
    }
  },
  methods: {
    async handleLogin() {
      this.error = ''
      try {
        const res = await login(this.username, this.password)
        console.log('Réponse de l\'API:', res)
        if (res && res.token) {
          localStorage.setItem('token', res.token)
          this.$router.push('/dashboard')
        } else {
          this.error = "La réponse de l'API ne contient pas de token."
        }
      } catch (err) {
        console.error('Erreur lors de la connexion:', err)
        this.error = "Identifiants incorrects ou erreur serveur."
      }
    }
  }
}
</script>
