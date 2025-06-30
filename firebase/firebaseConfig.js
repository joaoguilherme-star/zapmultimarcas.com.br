// firebase/firebaseConfig.js
import { initializeApp } from 'firebase/app'; // Função para inicializar o Firebase
import { getFirestore } from 'firebase/firestore'; // Função para obter o serviço Firestore

// Sua configuração Firebase (substitua pelos seus próprios valores da Consola Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyAeaTRXbbayVvFugUxIGWmr68k8DdHjwXo",
  authDomain: "zap-multimarcas.firebaseapp.com",
  projectId: "zap-multimarcas",
  storageBucket: "zap-multimarcas.firebasestorage.app",
  messagingSenderId: "807091515930",
  appId: "1:807091515930:web:80293647ba944a338c97a3",
  measurementId: "G-DK5VGE8NSZ"
};

// Inicializa o Firebase com a configuração fornecida
const app = initializeApp(firebaseConfig);

// Obtém uma instância do Firestore Database
const db = getFirestore(app);

// Exporta a instância da base de dados para que possa ser usada noutros ficheiros
export { db };
