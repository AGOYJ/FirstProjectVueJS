// fichier qui initialise l'application Vue
import { createApp } from 'vue' //crée une instance
import App from './App.vue'//composant racine (contient toute l'application)
import router from './router' //importation du routeur (gestion des routes)

createApp(App).use(router).mount('#app') //montage de l'application sur l'élément HTML avec l'id "app"