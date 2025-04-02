import { db } from "../../firebase"; // Supondo que você já tenha configurado o Firebase
import { collection, doc, setDoc } from "firebase/firestore";
import { partidas } from "./jogos";  // Importe os jogos do arquivo acima

// Função para enviar os jogos para o Firestore
export const enviarJogosParaFirestore = async () => {
  try {
    const docRef = doc(db, 'calendario', 'jogos'); // Criando um documento com o id "jogos" na coleção "calendario"
    await setDoc(docRef, { partidas }); // Envia todos os jogos
    console.log("Jogos enviados com sucesso!");
  } catch (error) {
    console.error("Erro ao enviar os jogos: ", error);
  }
};
