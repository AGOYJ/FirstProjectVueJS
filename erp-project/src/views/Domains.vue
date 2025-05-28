<template>
  <div>
    <router-link to="/dashboard" class="back-dashboard">⬅ Back to Dashboard</router-link>
    <h1>Domains Management</h1>
    <div v-if="feedbackMessage" :style="{color: feedbackType === 'error' ? 'red' : 'green'}" class="feedback">{{ feedbackMessage }}</div>
    <DomainForm v-if="!editId" v-model="formData" :users="users" :hostings="hostings" submitLabel="Add" />
    <div class="main-content-box">
      <ul>
        <li v-for="domain in domains" :key="domain.id">
          <span v-if="editId !== domain.id">{{ domain.domainName }}.{{ domain.tld }} (User: {{ domain.idUser }}, Hosting: {{ domain.idHosting }})</span>
          <div v-else>
            <DomainForm v-model="editData" :users="users" :hostings="hostings" submitLabel="Save" @submit="() => saveEdit(domain)" />
          </div>
          <div>
            <button v-if="editId !== domain.id" @click="startEdit(domain)">Edit</button>
            <button @click="deleteDomain(domain.id)">Delete</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DomainForm from '../components/DomainForm.vue'
import { getDomains, addDomain as apiAddDomain, updateDomain, deleteDomain as apiDeleteDomain, getUsers, getHostings } from '../services/erpService'

const domains = ref([])
const users = ref([])
const hostings = ref([])
const formData = ref({
  domainName: '',
  tld: '',
  idUser: '',
  idHosting: '',
  resellingPricing: '',
  expirationDate: ''
})
const editId = ref(null)
const editData = ref({})
const feedbackMessage = ref('')
const feedbackType = ref('')
const editingDomain = ref(null)

const fetchDomains = async () => {
  feedbackMessage.value = ''
  try {
    const res = await getDomains()
    domains.value = res.data
  } catch (e) {
    feedbackMessage.value = e.response?.data?.message || e.message || 'Error loading domains.'
    feedbackType.value = 'error'
  }
}

const fetchUsers = async () => {
  try {
    const res = await getUsers()
    users.value = res.data
    console.log('Utilisateurs chargés:', users.value)
  } catch (e) {}
}

const fetchHostings = async () => {
  try {
    const res = await getHostings()
    hostings.value = res.data
    console.log('Hébergements chargés:', hostings.value)
  } catch (e) {}
}

const addDomain = async () => {
  feedbackMessage.value = ''
  try {
    const res = await apiAddDomain(formData.value)
    domains.value.push(res.data)
    formData.value = { domainName: '', tld: '', idUser: '', idHosting: '', resellingPricing: '', expirationDate: '' }
    feedbackMessage.value = 'Domain added successfully.'
    feedbackType.value = 'success'
  } catch (e) {
    feedbackMessage.value = e.response?.data?.message || e.message || 'Error adding domain.'
    feedbackType.value = 'error'
  }
}

const startEdit = (domain) => {
  feedbackMessage.value = ''
  editId.value = domain.id
  editData.value = { ...domain }
  editingDomain.value = domain
}

const saveEdit = async (domain) => {
  feedbackMessage.value = ''
  try {
    await updateDomain(domain.id, editData.value)
    Object.assign(domain, editData.value)
    editId.value = null
    editData.value = {}
    editingDomain.value = null
    feedbackMessage.value = 'Domain updated successfully.'
    feedbackType.value = 'success'
  } catch (e) {
    feedbackMessage.value = e.response?.data?.message || e.message || 'Error updating domain.'
    feedbackType.value = 'error'
  }
}

const deleteDomain = async (id) => {
  feedbackMessage.value = ''
  try {
    await apiDeleteDomain(id)
    domains.value = domains.value.filter(d => d.id !== id)
    feedbackMessage.value = 'Domain deleted.'
    feedbackType.value = 'success'
  } catch (e) {
    feedbackMessage.value = e.response?.data?.message || e.message || 'Error deleting domain.'
    feedbackType.value = 'error'
  }
}

onMounted(() => {
  fetchDomains()
  fetchUsers()
  fetchHostings()
})
</script>