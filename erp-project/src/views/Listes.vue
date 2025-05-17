<template>
  <div>
    <router-link to="/dashboard" class="back-dashboard">⬅ Back to Dashboard</router-link>
    <h1>Todo Lists Management</h1>
    <div v-if="feedbackMessage" :style="{color: feedbackType === 'error' ? 'red' : 'green'}">{{ feedbackMessage }}</div>
    <form @submit.prevent="addTodoList">
      <input v-model="newTodoListName" placeholder="New list name" required />
      <button type="submit">Add</button>
    </form>
    <ul>
      <li v-for="todoList in todoLists" :key="todoList.id">
        <span v-if="editListId !== todoList.id">{{ todoList.name }}</span>
        <input v-else v-model="editListName" />
        <button v-if="editListId !== todoList.id" @click="startEditList(todoList)">Edit</button>
        <button v-if="editListId === todoList.id" @click="saveEditList(todoList)">Save</button>
        <button @click="deleteTodoList(todoList.id)">Delete</button>
        <button @click="showTasks(todoList)">Show tasks</button>
      </li>
    </ul>

    <div v-if="selectedTodoList">
      <h2>Tasks for list: {{ selectedTodoList.name }}</h2>
      <form @submit.prevent="addTaskToList">
        <input v-model="newTaskName" placeholder="New task" required />
        <button type="submit">Add task</button>
      </form>
      <ul>
        <li v-for="task in tasks" :key="task.id">
          <span v-if="editTaskId !== task.id">{{ task.task }} ({{ task.completed ? 'Done' : 'In progress' }})</span>
          <input v-else v-model="editTaskName" />
          <select v-if="editTaskId === task.id" v-model="editTaskCompleted">
            <option :value="false">In progress</option>
            <option :value="true">Done</option>
          </select>
          <button v-if="editTaskId !== task.id" @click="startEditTask(task)">Edit</button>
          <button v-if="editTaskId === task.id" @click="saveEditTask(task)">Save</button>
          <button @click="deleteTaskFromList(task.id)">Delete</button>
        </li>
      </ul>
      <button @click="closeTasks">Close tasks</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue'
import {
  getLists,
  addList,
  updateList,
  deleteList,
  getTasks,
  addTask,
  updateTask,
  deleteTask
} from '../services/erpService'

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

const fetchTodoLists = async () => {
  feedbackMessage.value = ''
  try {
    const res = await getLists()
    todoLists.value = res.data
  } catch (e) {
    feedbackMessage.value = e.response?.data?.message || e.message || 'Error loading lists.'
    feedbackType.value = 'error'
  }
}

const addTodoList = async () => {
  feedbackMessage.value = ''
  try {
    const res = await addList(newTodoListName.value)
    todoLists.value.push(res.data)
    newTodoListName.value = ''
    feedbackMessage.value = 'List added successfully.'
    feedbackType.value = 'success'
  } catch (e) {
    feedbackMessage.value = e.response?.data?.message || e.message || 'Error adding list.'
    feedbackType.value = 'error'
  }
}

const startEditList = (list) => {
  feedbackMessage.value = ''
  editListId.value = list.id
  editListName.value = list.name
}

const saveEditList = async (list) => {
  feedbackMessage.value = ''
  try {
    await updateList(list.id, editListName.value)
    list.name = editListName.value
    editListId.value = null
    editListName.value = ''
    feedbackMessage.value = 'List updated successfully.'
    feedbackType.value = 'success'
  } catch (e) {
    feedbackMessage.value = e.response?.data?.message || e.message || 'Error updating list.'
    feedbackType.value = 'error'
  }
}

const deleteTodoList = async (id) => {
  feedbackMessage.value = ''
  try {
    await deleteList(id)
    todoLists.value = todoLists.value.filter(l => l.id !== id)
    feedbackMessage.value = 'List deleted.'
    feedbackType.value = 'success'
  } catch (e) {
    feedbackMessage.value = e.response?.data?.message || e.message || 'Error deleting list.'
    feedbackType.value = 'error'
  }
}

const showTasks = async (list) => {
  feedbackMessage.value = ''
  selectedTodoList.value = list
  editTaskId.value = null
  newTaskName.value = ''
  await fetchTasks(list.id)
}

const fetchTasks = async (listId) => {
  feedbackMessage.value = ''
  try {
    const res = await getTasks(listId)
    tasks.value = res.data
  } catch (e) {
    feedbackMessage.value = e.response?.data?.message || e.message || 'Error loading tasks.'
    feedbackType.value = 'error'
  }
}

const addTaskToList = async () => {
  feedbackMessage.value = ''
  try {
    const res = await addTask(selectedTodoList.value.id, newTaskName.value, false)
    tasks.value.push(res.data)
    newTaskName.value = ''
    feedbackMessage.value = 'Task added successfully.'
    feedbackType.value = 'success'
  } catch (e) {
    feedbackMessage.value = e.response?.data?.message || e.message || 'Error adding task.'
    feedbackType.value = 'error'
  }
}

const startEditTask = (task) => {
  feedbackMessage.value = ''
  editTaskId.value = task.id
  editTaskName.value = task.task
  editTaskCompleted.value = task.completed
}

const saveEditTask = async (task) => {
  feedbackMessage.value = ''
  try {
    await updateTask(selectedTodoList.value.id, task.id, editTaskName.value, editTaskCompleted.value)
    task.task = editTaskName.value
    task.completed = editTaskCompleted.value
    editTaskId.value = null
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
