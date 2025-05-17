<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="registerUser">
      <input v-model="formData.username" placeholder="Username" required />
      <input v-model="formData.password" type="password" placeholder="Password" required />
      <input v-model="formData.role" placeholder="Role (user/admin)" required />
      <button type="submit">Register</button>
      <p v-if="feedbackMessage" :style="{color: feedbackType === 'error' ? 'red' : 'green'}">{{ feedbackMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { registerUser as apiRegisterUser } from '../services/erpService'

const formData = ref({
  username: '',
  password: '',
  role: 'user'
})
const feedbackMessage = ref('')
const feedbackType = ref('')

const registerUser = async () => {
  feedbackMessage.value = ''
  try {
    await apiRegisterUser(formData.value)
    feedbackMessage.value = 'Registration successful! You can now log in.'
    feedbackType.value = 'success'
    formData.value = { username: '', password: '', role: 'user' }
  } catch (e) {
    feedbackMessage.value = e.response?.data?.message || e.message || 'Error during registration.'
    feedbackType.value = 'error'
  }
}
</script>
