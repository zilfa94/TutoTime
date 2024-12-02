# Documentation Technique - Tuto Time

## Architecture

### Frontend
- **Framework** : React 18 avec TypeScript
- **Routing** : React Router v6
- **State Management** : React Hooks (useState, useContext)
- **Styling** : CSS Modules avec variables CSS personnalisées

### Backend Services
- **Authentication** : Firebase Auth
- **Database** : Firebase Firestore
- **Media Storage** : Cloudinary
- **API Integration** : Firebase SDK, Cloudinary SDK

## Configuration Technique

### Firebase Setup
```typescript
// config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### Cloudinary Setup
```typescript
// config/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
  api_secret: process.env.REACT_APP_CLOUDINARY_API_SECRET
});

export default cloudinary;
```

## Modèles de Données

### Tutorial
```typescript
interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  thumbnailUrl: string;
  steps: TutorialStep[];
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  published: boolean;
  category: string;
  tags: string[];
}
```

### TutorialStep
```typescript
interface TutorialStep {
  id: string;
  title: string;
  description: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  order: number;
  duration?: number;
}
```

## Sécurité

### Authentication
- Utilisation de Firebase Auth pour la gestion des utilisateurs
- Routes protégées avec PrivateRoute component
- Gestion des sessions avec onAuthStateChanged

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Tutoriels publics accessibles par tous
    match /tutorials/{tutorialId} {
      allow read: if resource.data.published == true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Données administratives
    match /admin/{document=**} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

### Cloudinary Security
- Signatures de upload pour sécuriser les uploads
- Transformations d'images restreintes
- Gestion des assets par dossiers

## Workflow

### Création de Tutoriel
1. Admin se connecte via `/login`
2. Accède au dashboard admin
3. Crée nouveau tutoriel avec métadonnées
4. Ajoute les étapes du tutoriel
5. Upload des médias via Cloudinary
6. Preview et publication

### Consultation de Tutoriel
1. Utilisateur accède à la page d'accueil
2. Parcourt ou recherche les tutoriels
3. Sélectionne un tutoriel
4. Navigation entre les étapes
5. Interaction avec les médias

## Thème et Styles

### Variables CSS Globales
```css
:root {
  --background-color: #111;
  --primary-color: #1488fc;
  --text-color: #ffffff;
  --border-radius: 8px;
  --transition-speed: 0.3s;
}
```

### Breakpoints Responsive
```css
/* Mobile */
@media (max-width: 768px) {
  /* Styles mobiles */
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  /* Styles tablettes */
}

/* Desktop */
@media (min-width: 1025px) {
  /* Styles desktop */
}
```

## Performance

### Optimisations
- Code splitting avec React.lazy()
- Optimisation des images via Cloudinary
- Mise en cache Firebase
- Lazy loading des médias

### Métriques Clés
- First Contentful Paint (FCP) < 2s
- Time to Interactive (TTI) < 3.5s
- Cumulative Layout Shift (CLS) < 0.1

## Progressive Web App (PWA)

### Fonctionnalités
- Service Worker pour le cache
- Manifest pour l'installation
- Offline support
- Push notifications (à venir)

## Tests

### Configuration Jest
```javascript
// jest.config.js
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};
```

### Exemples de Tests
```typescript
// TutorialForm.test.tsx
describe('TutorialForm', () => {
  it('should create new tutorial', async () => {
    // Test implementation
  });
});
```

## Analytics

### Firebase Analytics
- Suivi des pages vues
- Engagement utilisateur
- Conversion des tutoriels
- Temps passé par étape

### Métriques Personnalisées
- Taux de complétion des tutoriels
- Engagement par catégorie
- Performance des médias

## CI/CD

### GitHub Actions
```yaml
name: CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16.x'
      - run: npm ci
      - run: npm test
      - run: npm run build
```

## Ressources

### Documentation Officielle
- [React Documentation](https://reactjs.org/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

### Outils de Développement
- VS Code avec extensions recommandées
- Chrome DevTools pour React
- Firebase Emulator Suite
