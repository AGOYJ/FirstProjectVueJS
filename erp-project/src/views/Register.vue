<template>
  <div>
    <h1>Register</h1>
    <form class="erp-form" @submit.prevent="registerUser"> <!-- Ajout de la classe .erp-form pour unifier le design avec les autres formulaires-->
      <input class="erp-input" v-model="formData.username" placeholder="Username" required /> <!-- v-model = la valeur du champ est synchronisée avec FormData...-->
      <input class="erp-input" v-model="formData.password" type="password" placeholder="Password" required /> <!-- requires signifie que le champ est obligateur-->
      <select v-model="formData.role" required style="display:none">
        <option value="user">User</option>
      </select>
      <button type="submit">Register</button>
      <p v-if="feedbackMessage" :style="{color: feedbackType === 'error' ? 'red' : 'green'}">{{ feedbackMessage }}</p> <!--envoie un message si feedbackMessage contient qqch-->
      <p>Already have an account?</p>
      <router-link to="/">Login</router-link>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue' // ref = permet de créer une référence réactive dans Vue, utilisée pour stocker des variables réactives
import { registerUser as apiRegisterUser } from '../services/erpService' // importation de la fonction registerUser et renommage en apiRegisterUser, ca évite les conflits de noms

const formData = ref({
  username: '',
  password: '',
  role: 'user' // toujours user
})
const feedbackMessage = ref('') // message de feedback pour l'utilisateur
const feedbackType = ref('')

const registerUser = async () => { // fonction asynchrone pour enregistrer l'utilisateur
  feedbackMessage.value = '' //cela efface le message précédent
  try {
    await apiRegisterUser(formData.value) // appel de la fonction apiRegisterUser avec les données du formulaire
    feedbackMessage.value = 'Registration successful! You can now log in.'
    feedbackType.value = 'success'
    formData.value = { username: '', password: '', role: 'user' } // réinitialisation des données du formulaire après l'enregistrement
  } catch (e) {
    feedbackMessage.value = e.response?.data?.message || e.message || 'Error during registration.' //permet de récupérer le message d'erreur renvoyé par l'API ou un simple message d'erreur
    feedbackType.value = 'error'
  }
}
</script>


<!--
    await = permet d'attendre la réponse de l'API avant de continuer
    v-model = lier champ du formulaire <-> données formData
    @submit.prevent = intercepter la soumission et appeler un méthode js
    ref() = Créer des variables réactives (qui mettent à jour l'UI)
    registerUser() = Fontion pour envoyer les données à l'API
    try / catch = gère les succès et erreurs d'inscription
-->