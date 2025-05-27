<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <input v-model="username" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
      <p v-if="error" style="color: red">{{ error }}</p>  
      <p v-if="success" style="color: green">{{ success }}</p>
      <p>Don't have an account?</p>
      <router-link to="/register">Register</router-link> 
    </form>
  </div>
</template>

<script>
import { login, setToken } from '../services/erpService' // importation du service de connexion et stocke le token

export default {
  data() {  // données réactives pour le composant
    return {
      username: '',
      password: '',
      error: '',
      success: '',
    }
  }, 
  methods: {
    async handleLogin() { //fontion asynchrone
      this.error = ''
      this.success = ''
      try {
        const res = await login(this.username, this.password) // appel de la fonction login du service erpService avec les données du formulaire
        console.log('Réponse de l\'API:', res)
        if (res && res.token) { // vérification de la présence du token
          setToken(res.token)// stocke le token
          sessionStorage.setItem('role', res.role) // stocke le rôle de l'utilisateur dans sessionStorage
          this.success = "Login successful! Redirecting..."
          setTimeout(() => { // redirection après 1 seconde vers dashboard
            this.$router.replace('/dashboard')
          }, 1000)
        } else {
          this.error = "The API response does not contain a token."
        }
      } catch (err) {
        console.error('Erreur lors de la connexion:', err)
        this.error = "Incorrect credentials or server error."
      }
    }
  }
}
</script>