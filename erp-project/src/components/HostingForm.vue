<template>
  <form @submit.prevent="onSubmit">
    <input v-model="form.name" placeholder="Hosting name" required />
    <input v-model="form.idUser" placeholder="User ID" required />
    <input v-model="form.resellingPricing" type="number" placeholder="Price" required />
    <input v-model="form.expirationDate" type="date" placeholder="Expiration date" required />
    <input v-model="form.hasSSL" type="checkbox" /> SSL
    <input v-model="form.comment" placeholder="Comment" />
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
