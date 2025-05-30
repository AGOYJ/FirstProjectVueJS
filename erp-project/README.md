# Mini ERP - Vue.js & API REST

Ce projet est une interface de gestion d’un mini ERP permettant de gérer :
- des utilisateurs
- des listes de tâches (todo lists) et leurs tâches
- des hébergements
- des noms de domaines

Le projet utilise l’API disponible à l’adresse : [https://erp.stuapi.teclab.be](https://erp.stuapi.teclab.be)

## 🚀 Fonctionnalités principales

- Authentification (admin ou user)
- CRUD complet pour :
  - Utilisateurs
  - Listes de tâches
  - Tâches
  - Hébergements
  - Noms de domaines
- Affichage de messages d’erreur clairs (pas d'alertes JS)
- Utilisation de Vue Router
- Components pour les formulaires

## 🛠 Installation

### Prérequis

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Installation rapide

1. Clonez ce dépôt ou extrayez le .zip :

   ```bash
   git clone https://github.com/AGOYJ/FirstProjectVueJS.git
   cd chemin/du/projet
   npm install
   npm run dev
   ```

   Le site sera accessible via [http://localhost:5173](http://localhost:5173) (ou autre port affiché).

2. **Authentification**

   Pour tester les fonctionnalités, utilisez les identifiants fournis dans le fichier Postman (`ERP-HEPL.postman_collection.json`) :

   - **Admin** (gestion des utilisateurs)
     - Nom d'utilisateur : `staff`
     - Mot de passe : `test`
   - **Utilisateur classique**
     - Nom d'utilisateur : `student`
     - Mot de passe : `test`