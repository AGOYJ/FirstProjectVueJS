<template>
  <form class="erp-form" @submit.prevent="onSubmit">
    <input v-model="form.username" placeholder="Username" required />
    <input v-model="form.password" type="password" placeholder="Password" required />
    <select v-model="form.role" required>
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>
    <button type="submit">{{ submitLabel }}</button>
  </form>
</template>

<script setup>
import { defineProps, defineEmits, reactive, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  submitLabel: {
    type: String,
    default: 'Submit'
  }
})
const emit = defineEmits(['update:modelValue', 'submit'])

const form = reactive({ ...props.modelValue })

watch(
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
