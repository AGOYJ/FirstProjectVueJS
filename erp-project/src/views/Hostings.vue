<template>
  <div>
    <router-link to="/dashboard" class="back-dashboard">⬅ Back to Dashboard</router-link>
    <h1>Hostings Management</h1>
    <div v-if="feedbackMessage" :style="{color: feedbackType === 'error' ? 'red' : 'green'}">{{ feedbackMessage }}</div>
    <HostingForm v-model="formData" :submitLabel="editId ? 'Save' : 'Add'" @submit="editId ? saveEdit(editingHosting) : addHosting" />
    <ul>
      <li v-for="hosting in hostings" :key="hosting.id">
        <span v-if="editId !== hosting.id">{{ hosting.name }} (User: {{ hosting.idUser }})</span>
        <div v-else>
          <HostingForm v-model="editData" submitLabel="Save" @submit="() => saveEdit(hosting)" />
        </div>
        <button v-if="editId !== hosting.id" @click="startEdit(hosting)">Edit</button>
        <button @click="deleteHosting(hosting.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import HostingForm from '../components/HostingForm.vue'
import { getHostings, addHosting as apiAddHosting, updateHosting, deleteHosting as apiDeleteHosting } from '../services/erpService'

const hostings = ref([])
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
const editingHosting = ref(null)

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

const startEdit = (hosting) => {
  feedbackMessage.value = ''
  editId.value = hosting.id
  editData.value = { ...hosting }
  editingHosting.value = hosting
}

const saveEdit = async (hosting) => {
  feedbackMessage.value = ''
  try {
    await updateHosting(hosting.id, editData.value)
    Object.assign(hosting, editData.value)
    editId.value = null
    editData.value = {}
    editingHosting.value = null
    feedbackMessage.value = 'Hosting updated successfully.'
    feedbackType.value = 'success'
  } catch (e) {
    feedbackMessage.value = e.response?.data?.message || e.message || 'Error updating hosting.'
    feedbackType.value = 'error'
  }
}

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

onMounted(fetchHostings)
</script>
