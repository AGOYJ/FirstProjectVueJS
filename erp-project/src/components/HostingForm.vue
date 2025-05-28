<template>
  <form class="erp-form" @submit.prevent="onSubmit">
    <input v-model="form.name" placeholder="Hosting name" required />
    <select v-model="form.idUser" required>
      <option value="" disabled>Select user</option>
      <option v-for="user in users" :key="user.id" :value="user.id">{{ user.username }} ({{ user.id }})</option>
    </select>
    <input v-model="form.resellingPricing" type="number" placeholder="Price" required />
    <input v-model="form.expirationDate" type="date" placeholder="Expiration date" required />
    <label><input v-model="form.hasSSL" type="checkbox" /> SSL</label>
    <input v-model="form.comment" placeholder="Comment" />
    <button type="submit">{{ submitLabel }}</button>
  </form>
</template>

<script setup>
import { defineProps, defineEmits, reactive, watch } from 'vue' 

// ---component pour la gestion des hébergements---
const props = defineProps({ 
  modelValue: {
    type: Object,
    required: true
  },
  submitLabel: {
    type: String,
    default: 'Submit'
  },
  users: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['update:modelValue', 'submit'])

const form = reactive({ ...props.modelValue })

watch( //met à jour le formulaire lorsque le modèle change
  () => props.modelValue,
  (newVal) => {
    Object.assign(form, newVal)
  },
  { deep: true }
)

const onSubmit = () => {
  emit('update:modelValue', { ...form })
  emit('submit', { ...form })
}
</script>
