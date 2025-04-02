import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  DocumentReference,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  orderBy,
  query,
  deleteDoc
} from "firebase/firestore";

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDpe7rDqFFYUBAi_rupqO9mgNsCziZYdLc",
  authDomain: "samproam-3eac4.firebaseapp.com",
  projectId: "samproam-3eac4",
  storageBucket: "samproam-3eac4.firebasestorage.app",
  messagingSenderId: "679606827513",
  appId: "1:679606827513:web:ebf9193360470ea0f9e528",
  measurementId: "G-R55QV9TT1C",
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Funções exportadas
export { collection, addDoc, getDocs, db, doc, setDoc, updateDoc, getDoc, orderBy, query, deleteDoc };

// Se você quiser exportar funções customizadas para manipular dados
export async function adicionarTime(nome: string, pontos: number) {
  const docRef: DocumentReference = await addDoc(collection(db, "times"), {
    nome,
    pontos,
  });
  console.log("Documento adicionado com ID: ", docRef.id);
}

// Função para obter todos os times
export async function obterTimes() {
  const querySnapshot = await getDocs(collection(db, "times"));
  querySnapshot.forEach((doc) => {
    const time = doc.data();
    console.log(time.nome, time.pontos);
  });
}
