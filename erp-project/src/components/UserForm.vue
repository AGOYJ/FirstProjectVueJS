<template>
  <form @submit.prevent="onSubmit">
    <input v-model="form.username" placeholder="Username" required />
    <input v-model="form.password" type="password" placeholder="Password" required />
    <input v-model="form.role" placeholder="Role (user/admin)" required />
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
