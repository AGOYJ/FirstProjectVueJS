<template>
  <div>
    <router-link to="/dashboard" class="back-dashboard">⬅ Back to Dashboard</router-link>
    <h1>Todo Lists Management</h1>
    <div v-if="feedbackMessage" :style="{color: feedbackType === 'error' ? 'red' : 'green'}" class="feedback">{{ feedbackMessage }}</div>
    <div class="main-content-box">
      <form class="erp-form" @submit.prevent="addTodoList">
        <input id="newTodoListName" v-model="newTodoListName" placeholder="New list name" required />
        <button type="submit" class="erp-form-btn">Add</button>
      </form>
      <ul>
        <li v-for="todoList in todoLists" :key="todoList.id">
          <span v-if="editListId !== todoList.id">{{ todoList.name }}</span>
          <input v-else v-model="editListName" class="erp-input" placeholder="Edit list name" />
          <div>
            <button v-if="editListId !== todoList.id" @click="startEditList(todoList)">Edit</button>
            <button v-if="editListId === todoList.id" @click="saveEditList(todoList)">Save</button>
            <button @click="deleteTodoList(todoList.id)">Delete</button>
            <button @click="showTasks(todoList)">Show tasks</button>
          </div>
        </li>
      </ul>
    </div>
    <div v-if="selectedTodoList" class="main-content-box">
      <h2>Tasks for list: {{ selectedTodoList.name }}</h2>
      <form class="erp-form" @submit.prevent="addTaskToList">
        <input id="newTaskName" v-model="newTaskName" placeholder="New task" required />
        <button type="submit" class="erp-form-btn">Add task</button>
      </form>
      <ul>
        <li v-for="task in tasks" :key="task.id">
          <span v-if="editTaskId !== task.id">{{ task.task }} ({{ task.completed ? 'Done' : 'In progress' }})</span>
          <input v-else v-model="editTaskName" class="erp-input" placeholder="Edit task name" />
          <select v-if="editTaskId === task.id" v-model="editTaskCompleted" class="erp-input">
            <option :value="false">In progress</option>
            <option :value="true">Done</option>
          </select>
          <div>  
            <button v-if="editTaskId !== task.id" @click="startEditTask(task)">Edit</button>
            <button v-if="editTaskId === task.id" @click="saveEditTask(task)">Save</button>
            <button @click="deleteTaskFromList(task.id)">Delete</button>
          </div>
        </li>
      </ul>
      <button @click="closeTasks">Close tasks</button>
    </div>
  </div>
</template>

<script setup> // les variables et fonctions du composant Listes.vue
import { ref } from 'vue' // fonction 'ref' de Vue pour créer des variables réactives
import { onMounted } from 'vue' // fonction 'onMounted' de Vue pour exécuter du code après le montage du composant
import { // Importation des fonctions du service erpService
  getLists,
  addList,
  updateList,
  deleteList,
  getTasks,
  addTask,
  updateTask,
  deleteTask
} from '../services/erpService'

// Déclaration des variables réactives pour le composant et initialisation d'une valeur défaut
const todoLists = ref([])
const newTodoListName = ref('')
const editListId = ref(null)
const editListName = ref('')
const feedbackMessage = ref('')
const feedbackType = ref('')
const selectedTodoList = ref(null)
const tasks = ref([])
const newTaskName = ref('')
const editTaskId = ref(null)
const editTaskName = ref('')
const editTaskCompleted = ref(false)

// ---Fonctions pour gérer les listes de tâches---
const fetchTodoLists = async () => { 
  feedbackMessage.value = '' 
  try { //
    const res = await getLists() // Appel de la fonction getLists pour récupérer les listes de tâches
    todoLists.value = res.data // Stocke les listes de tâches dans la variable réactive todoLists
  } catch (e) { //gestion d'erreur si l'appel échoue
    feedbackMessage.value = e.response?.data?.message || e.message || 'Error loading lists.'
    feedbackType.value = 'error'
  }
}


// ---Fonction pour ajouter une nouvelle liste de tâches---
const addTodoList = async () => { 
  feedbackMessage.value = ''
  try {
    const res = await addList(newTodoListName.value) // Appel de la fonction addList pour ajouter une nouvelle liste avec le nom saisi
    todoLists.value.push(res.data) // Ajoute la nouvelle liste à la liste existante
    newTodoListName.value = '' //éfface le champ de saisie après l'ajout
    feedbackMessage.value = 'List added successfully.' 
    feedbackType.value = 'success'
  } catch (e) {
    feedbackMessage.value = e.response?.data?.message || e.message || 'Error adding list.'
    feedbackType.value = 'error'
  }
}


// ---Fonctions pour gérer les listes de tâches---
const startEditList = (list) => {
  feedbackMessage.value = ''// Efface le message de feedback précédent
  editListId.value = list.id // Définit l'ID de la liste à éditer
  editListName.value = list.name// Définit le nom de la liste à éditer dans le champ d'édition
}


// ---Fonction pour sauvegarder les modifications d'une liste de tâches---
const saveEditList = async (list) => {
  feedbackMessage.value = ''
  try {
    await updateList(list.id, editListName.value) // Appel de la fonction updateList pour mettre à jour le nom de la liste
    list.name = editListName.value // Met à jour le nom de la liste dans la liste existante
    editListId.value = null //Réinitialise l'ID d'édition
    editListName.value = '' //Réinitialise le champ d'édition
    feedbackMessage.value = 'List updated successfully.'
    feedbackType.value = 'success'
  } catch (e) {
    feedbackMessage.value = e.response?.data?.message || e.message || 'Error updating list.'
    feedbackType.value = 'error'
  }
}


// ---Fonction pour supprimer une liste de tâches---
const deleteTodoList = async (id) => {
  feedbackMessage.value = ''
  try {
    await deleteList(id)
    todoLists.value = todoLists.value.filter(l => l.id !== id) // Filtre la liste pour enlever la liste supprimée
    feedbackMessage.value = 'List deleted.'
    feedbackType.value = 'success'
  } catch (e) {
    feedbackMessage.value = e.response?.data?.message || e.message || 'Error deleting list.'
    feedbackType.value = 'error'
  }
}


// ---Fonction pour afficher les tâches d'une liste de tâches---
const showTasks = async (list) => {
  feedbackMessage.value = ''
  selectedTodoList.value = list // Définit la liste sélectionnée
  editTaskId.value = null // Réinitialise l'ID de la tâche en cours d'édition
  newTaskName.value = '' // Réinitialise le champ de saisie de la nouvelle tâche
  await fetchTasks(list.id) // Récupère les tâches de la liste sélectionnée
}


const fetchTasks = async (listId) => { // Fonction asynchrone pour récupérer les tâches d'une liste spécifique
  feedbackMessage.value = ''
  try {
    const res = await getTasks(listId) // Appel de la fonction getTasks pour récupérer les tâches de la liste
    tasks.value = res.data // Stocke les tâches récupérées dans la variable réactive tasks
  } catch (e) {
    feedbackMessage.value = e.response?.data?.message || e.message || 'Error loading tasks.'
    feedbackType.value = 'error'
  }
}


// ---Fonction pour ajouter une nouvelle tâche à une liste de tâches---
const addTaskToList = async () => {
  feedbackMessage.value = ''
  try {
    const res = await addTask(selectedTodoList.value.id, newTaskName.value, false) // Appel de la fonction addTask
    tasks.value.push(res.data) // Ajoute la nouvelle tâche à la liste des tâches
    newTaskName.value = ''
    feedbackMessage.value = 'Task added successfully.'
    feedbackType.value = 'success'
  } catch (e) { 
    feedbackMessage.value = e.response?.data?.message || e.message || 'Error adding task.'
    feedbackType.value = 'error'
  }
}


// ---Fonctions pour gérer les tâches d'une liste de tâches---
const startEditTask = (task) => {
  feedbackMessage.value = ''
  editTaskId.value = task.id
  editTaskName.value = task.task // Définit le nom de la tâche à éditer dans le champ d'édition
  editTaskCompleted.value = task.completed // Définit le statut
}


// ---Fonction pour sauvegarder les modifications d'une tâche---
const saveEditTask = async (task) => {
  feedbackMessage.value = ''
  try {
    await updateTask(selectedTodoList.value.id, task.id, editTaskName.value, editTaskCompleted.value)
    task.task = editTaskName.value // Met à jour le nom de la tâche dans la liste existante
    task.completed = editTaskCompleted.value
    editTaskId.value = null // Réinitialise l'ID d'édition
    editTaskName.value = ''
    feedbackMessage.value = 'Task updated successfully.'
    feedbackType.value = 'success'
  } catch (e) {
    feedbackMessage.value = e.response?.data?.message || e.message || 'Error updating task.'
    feedbackType.value = 'error'
  }
}

const deleteTaskFromList = async (taskId) => {
  feedbackMessage.value = ''
  try {
    await deleteTask(selectedTodoList.value.id, taskId)
    tasks.value = tasks.value.filter(t => t.id !== taskId)
    feedbackMessage.value = 'Task deleted.'
    feedbackType.value = 'success'
  } catch (e) {
    feedbackMessage.value = e.response?.data?.message || e.message || 'Error deleting task.'
    feedbackType.value = 'error'
  }
}

const closeTasks = () => {
  feedbackMessage.value = ''
  selectedTodoList.value = null
  tasks.value = []
  editTaskId.value = null
  newTaskName.value = ''
}

onMounted(fetchTodoLists)
</script>
