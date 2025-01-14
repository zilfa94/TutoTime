# 🎓 Tuto Time

Une plateforme moderne de gestion de tutoriels interactifs développée avec React et TypeScript.

## 🌟 Fonctionnalités

### Pour les Utilisateurs
- 🎯 Parcourir les tutoriels par catégories
- 📚 Accès à des tutoriels interactifs étape par étape
- 🎨 Interface utilisateur moderne et responsive
- 🔍 Recherche et filtrage des tutoriels

### Pour les Administrateurs
- 🔐 Interface d'administration sécurisée
- ✨ Création et édition de tutoriels
- 📸 Gestion des médias avec Cloudinary
- 📊 Tableau de bord intuitif

## 🚀 Démarrage Rapide

### Prérequis
- Node.js (v14 ou supérieur)
- npm ou yarn
- Compte Firebase
- Compte Cloudinary

### Installation

1. Clonez le dépôt :
```bash
git clone [URL_DU_REPO]
cd tuto-time
```

2. Installez les dépendances :
```bash
npm install
# ou
yarn install
```

3. Créez un fichier `.env` à la racine du projet :
```env
REACT_APP_FIREBASE_API_KEY=votre_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=votre_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=votre_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=votre_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=votre_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=votre_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=votre_measurement_id

REACT_APP_CLOUDINARY_CLOUD_NAME=votre_cloud_name
REACT_APP_CLOUDINARY_API_KEY=votre_api_key
REACT_APP_CLOUDINARY_API_SECRET=votre_api_secret
```

4. Lancez l'application en mode développement :
```bash
npm start
# ou
yarn start
```

## 🛠️ Technologies Utilisées

- **Frontend** :
  - React 18
  - TypeScript
  - React Router v6
  - CSS Modules

- **Backend & Services** :
  - Firebase (Authentication, Firestore)
  - Cloudinary (Gestion des médias)

- **Outils de Développement** :
  - Create React App
  - ESLint
  - Prettier

## 📱 Structure de l'Application

```
src/
├── components/
│   ├── admin/          # Composants d'administration
│   ├── auth/           # Composants d'authentification
│   └── home/           # Composants de la page d'accueil
├── config/             # Configuration Firebase et Cloudinary
├── styles/             # Fichiers CSS globaux et par composant
└── types/              # Types TypeScript
```

## 🔐 Accès Administrateur

Pour accéder à l'interface d'administration :
1. Naviguez vers `/login`
2. Utilisez les identifiants administrateur fournis
3. Accédez au tableau de bord à `/admin/dashboard`

## 🤝 Contribution

1. Fork le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Auteurs

- **Votre Nom** - *Développement Initial* - [VotreProfil](lien_github)

## 🙏 Remerciements

- L'équipe Firebase pour leur excellente documentation
- La communauté React pour leur support continu
- Cloudinary pour leur service de gestion des médias
#   T u t o T i m e  
 