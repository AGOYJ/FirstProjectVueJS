<template>
  <form @submit.prevent="onSubmit">
    <input v-model="form.domainName" placeholder="Domain name" required />
    <input v-model="form.tld" placeholder="TLD (e.g. com, be)" required />
    <select v-model="form.idUser" required>
      <option value="" disabled>Select user</option>
      <option v-for="user in users" :key="user.id" :value="user.id">{{ user.username }} ({{ user.id }})</option>
    </select>
    <select v-model="form.idHosting" required>
      <option value="" disabled>Select hosting</option>
      <option v-for="hosting in hostings" :key="hosting.id" :value="hosting.id">{{ hosting.name }} ({{ hosting.id }})</option>
    </select>
    <input v-model="form.resellingPricing" type="number" placeholder="Price" required />
    <input v-model="form.expirationDate" type="date" placeholder="Expiration date" required />
    <button type="submit">{{ submitLabel }}</button>
  </form>
</template>

<script setup>
import { defineProps, defineEmits, reactive, watch } from 'vue'

const props = defineProps({ //déclaration des propriétés du composant
  modelValue: {type: Object, required: true},
  submitLabel: {type: String, default: 'Submit'},
  users: {type: Array, default: () => []},
  hostings: {type: Array, default: () => []}
})

const emit = defineEmits(['update:modelValue', 'submit']) //syncro des événements pour la mise à jour du modèle et la soumission du formulaire

const form = reactive({ ...props.modelValue }) //création d'un objet réactif pour le formulaire en utilisant les valeurs du modèle

watch( //écouteur pour mettre à jour le formulaire lorsque le modèle change
  () => props.modelValue,
  (newVal) => {
    Object.assign(form, newVal)
  },
  { deep: true }
)

const onSubmit = () => {
  emit('update:modelValue', { ...form }) //émet l'événement pour mettre à jour le modèle avec les valeurs du formulaire
  emit('submit', { ...form }) //émet l'événement de soumission du formulaire avec les valeurs du formulaire
}
</script>
