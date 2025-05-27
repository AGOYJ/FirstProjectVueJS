<template>
  <div>
    <router-link to="/dashboard" class="back-dashboard">⬅ Back to Dashboard</router-link>
    <h1>Hostings Management</h1>
    <div v-if="feedbackMessage" :style="{color: feedbackType === 'error' ? 'red' : 'green'}">{{ feedbackMessage }}</div>
    <HostingForm v-if="!editId" v-model="formData" :users="users" submitLabel="Add" @submit="addHosting" /> <!-- affiche le formulaire si aucun hébergement n'est en cours d'édition-->
    <ul>
      <li v-for="hosting in hostings" :key="hosting.id">
        <span v-if="editId !== hosting.id">{{ hosting.name }} (User: {{ hosting.idUser }})</span>
        <div v-else>
          <HostingForm v-model="editData" :users="users" submitLabel="Save" @submit="() => saveEdit(hosting)" />
        </div>
        <button v-if="editId !== hosting.id" @click="startEdit(hosting)">Edit</button>
        <button @click="deleteHosting(hosting.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import HostingForm from '../components/HostingForm.vue'
import { getHostings, addHosting as apiAddHosting, updateHosting, deleteHosting as apiDeleteHosting, getUsers } from '../services/erpService'

const hostings = ref([]) // Stocke les hébergements dans une variable réactive et initialise à un tableau vide
const users = ref([])
const formData = ref({
  name: '',
  idUser: '',
  resellingPricing: '',
  expirationDate: '',
  hasSSL: false,
  comment: ''
})
const editId = ref(null)
const editData = ref({})
const feedbackMessage = ref('')
const feedbackType = ref('')


//---Fonction pour récupérer les hébergements---
const fetchHostings = async () => {
  feedbackMessage.value = ''
  try {
    const res = await getHostings()
    hostings.value = res.data
  } catch (e) {
    feedbackMessage.value = e.response?.data?.message || e.message || 'Error loading hostings.'
    feedbackType.value = 'error'
  }
}


// ---Fonction pour récupérer les utilisateurs---
const fetchUsers = async () => {
  try {
    const res = await getUsers()
    users.value = res.data
  } catch (e) {}
}


// ---Fonction pour ajouter un hébergement---
const addHosting = async () => {
  feedbackMessage.value = ''
  try {
    const res = await apiAddHosting(formData.value)
    hostings.value.push(res.data)
    formData.value = { name: '', idUser: '', resellingPricing: '', expirationDate: '', hasSSL: false, comment: '' }
    feedbackMessage.value = 'Hosting added successfully.'
    feedbackType.value = 'success'
  } catch (e) {
    feedbackMessage.value = e.response?.data?.message || e.message || 'Error adding hosting.'
    feedbackType.value = 'error'
  }
}


// ---Fonction pour démarrer l'édition---
const startEdit = (hosting) => {
  feedbackMessage.value = ''
  editId.value = hosting.id
  editData.value = { ...hosting }
}


//---Fonction pour sauvegarder les modifications---
const saveEdit = async (hosting) => {
  feedbackMessage.value = ''
  try {
    await updateHosting(hosting.id, editData.value)
    Object.assign(hosting, editData.value) // Met à jour l'hébergement dans la liste existante
    editId.value = null
    editData.value = {}
    feedbackMessage.value = 'Hosting updated successfully.'
    feedbackType.value = 'success'
  } catch (e) {
    feedbackMessage.value = e.response?.data?.message || e.message || 'Error updating hosting.'
    feedbackType.value = 'error'
  }
}


// ---Fonction pour supprimer---
const deleteHosting = async (id) => {
  feedbackMessage.value = ''
  try {
    await apiDeleteHosting(id)
    hostings.value = hostings.value.filter(h => h.id !== id)
    feedbackMessage.value = 'Hosting deleted.'
    feedbackType.value = 'success'
  } catch (e) {
    feedbackMessage.value = e.response?.data?.message || e.message || 'Error deleting hosting.'
    feedbackType.value = 'error'
  }
}

// Masquage automatique du feedback après 3 secondes
watch(feedbackMessage, (msg) => {
  if (msg) {
    setTimeout(() => { feedbackMessage.value = '' }, 3000)
  }
})

onMounted(() => { // Appel des fonctions pour charger les données au démarrage
  fetchHostings() // Récupération des hébergements
  fetchUsers() // Récupération des utilisateurs
})
</script>
