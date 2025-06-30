// utils/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, query, where, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';

// As variáveis globais __firebase_config e __initial_auth_token são fornecidas pelo ambiente Canvas.
// Em um projeto Next.js real, você usaria variáveis de ambiente (process.env.NEXT_PUBLIC_FIREBASE_API_KEY, etc.)
// e obteria o token de autenticação de alguma forma segura (por exemplo, um backend customizado).
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Inicializa o Firebase
let app;
if (Object.keys(firebaseConfig).length > 0) {
    app = initializeApp(firebaseConfig);
} else {
    console.error("Firebase config not found. Firebase will not be initialized.");
}

const db = app ? getFirestore(app) : null;
const auth = app ? getAuth(app) : null;

// Função para autenticar o usuário (anônima ou com token customizado)
async function authenticateUser() {
    if (!auth) {
        console.error("Firebase Auth not initialized.");
        return null;
    }

    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log("Usuário autenticado:", user.uid);
                unsubscribe(); // Para de escutar após a autenticação inicial
                resolve(user);
            } else {
                console.log("Nenhum usuário autenticado. Tentando autenticação...");
                try {
                    if (initialAuthToken) {
                        const userCredential = await signInWithCustomToken(auth, initialAuthToken);
                        console.log("Autenticado com token customizado:", userCredential.user.uid);
                        resolve(userCredential.user);
                    } else {
                        const userCredential = await signInAnonymously(auth);
                        console.log("Autenticado anonimamente:", userCredential.user.uid);
                        resolve(userCredential.user);
                    }
                } catch (error) {
                    console.error("Erro na autenticação Firebase:", error);
                    resolve(null);
                } finally {
                    unsubscribe(); // Para de escutar mesmo em caso de erro
                }
            }
        });
    });
}

// Autentica o usuário no carregamento do módulo
let currentUser = null;
if (auth) {
    authenticateUser().then(user => {
        currentUser = user;
    });
}

// Exporta as instâncias e funções necessárias
export { db, auth, collection, addDoc, getDocs, doc, getDoc, query, where, updateDoc, deleteDoc, onAuthStateChanged, authenticateUser };
