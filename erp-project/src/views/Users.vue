<template>
  <div>
    <router-link to="/dashboard" class="back-dashboard">⬅ Back to Dashboard</router-link> 
    <h1>Users Management</h1>
    <div v-if="feedbackMessage" :style="{color: feedbackType === 'error' ? 'red' : 'green'}">{{ feedbackMessage }}</div>
    <UserForm v-model="formData" :submitLabel="editId ? 'Save' : 'Add'" @submit="editId ? saveEdit(editingUser) : addUser" />
    <ul>
      <li v-for="user in users" :key="user.id">
        <span v-if="editId !== user.id">{{ user.username }} ({{ user.role }})</span>
        <div v-else>
          <UserForm v-model="editData" submitLabel="Save" @submit="() => saveEdit(user)" />
        </div>
        <button v-if="editId !== user.id" @click="startEdit(user)">Edit</button>
        <button @click="deleteUser(user.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>




<script setup>
import { ref, onMounted } from 'vue'
import UserForm from '../components/UserForm.vue'
import { getUsers, registerUser as apiRegisterUser, updateUser, deleteUser as apiDeleteUser } from '../services/erpService'

const users = ref([])
const formData = ref({ username: '', password: '', role: 'user' })
const editId = ref(null)
const editData = ref({})
const feedbackMessage = ref('')
const feedbackType = ref('')
const editingUser = ref(null)

const fetchUsers = async () => {
  feedbackMessage.value = ''
  try {
    const res = await getUsers()
    users.value = res.data
  } catch (e) {
    feedbackMessage.value = e.response?.data?.message || e.message || 'Error loading users.'
    feedbackType.value = 'error'
  }
}

const addUser = async () => {
  feedbackMessage.value = ''
  try {
    const res = await apiRegisterUser(formData.value)
    users.value.push(res.data)
    formData.value = { username: '', password: '', role: 'user' }
    feedbackMessage.value = 'User added successfully.'
    feedbackType.value = 'success'
  } catch (e) {
    feedbackMessage.value = e.response?.data?.message || e.message || 'Error adding user.'
    feedbackType.value = 'error'
  }
}

const startEdit = (user) => {
  feedbackMessage.value = ''
  editId.value = user.id
  editData.value = { ...user, password: '' }
  editingUser.value = user
}

const saveEdit = async (user) => {
  feedbackMessage.value = ''
  try {
    await updateUser(user.id, editData.value)
    Object.assign(user, editData.value)
    editId.value = null
    editData.value = {}
    editingUser.value = null
    feedbackMessage.value = 'User updated successfully.'
    feedbackType.value = 'success'
  } catch (e) {
    feedbackMessage.value = e.response?.data?.message || e.message || 'Error updating user.'
    feedbackType.value = 'error'
  }
}

const deleteUser = async (id) => {
  feedbackMessage.value = ''
  try {
    await apiDeleteUser(id)
    users.value = users.value.filter(u => u.id !== id)
    feedbackMessage.value = 'User deleted.'
    feedbackType.value = 'success'
  } catch (e) {
    feedbackMessage.value = e.response?.data?.message || e.message || 'Error deleting user.'
    feedbackType.value = 'error'
  }
}

onMounted(fetchUsers)
</script>
