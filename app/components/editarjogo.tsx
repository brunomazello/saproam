import { useState, useEffect } from "react";
import { db } from "../../firebase"; // Supondo que o Firestore esteja configurado corretamente
import { doc, getDoc, updateDoc } from "firebase/firestore";

// Definindo o tipo Jogo
interface Jogo {
  id: string; // ID único do jogo
  data: string; // A data como string (formatada para ordenação)
  horario: string;
  time1: string;
  time2: string;
}

const EditarJogo = () => {
  const [jogos, setJogos] = useState<Jogo[]>([]); // Lista de jogos
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const [error, setError] = useState(""); // Para armazenar possíveis erros

  // Função para buscar todos os jogos no Firestore
  const fetchJogos = async () => {
    try {
      const docRef = doc(db, "calendario", "jogos");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const partidas = docSnap.data().partidas || {}; // Agora 'partidas' é um objeto
        const jogosList = Object.keys(partidas).map(key => ({
          id: key,
          ...partidas[key]
        }));

        // Ordena os jogos pela data (convertida para Date para ordenação precisa)
        jogosList.sort((a, b) => {
          const dataA = new Date(a.data); // Converter para objeto Date
          const dataB = new Date(b.data);
          return dataA.getTime() - dataB.getTime(); // Ordena de forma crescente
        });

        setJogos(jogosList); // Armazena todos os jogos ordenados
      } else {
        setError("Documento 'jogos' não encontrado!");
      }
    } catch (error) {
      setError("Erro ao buscar jogos.");
    }
  };

  // Carregar os dados dos jogos ao montar o componente
  useEffect(() => {
    fetchJogos();
  }, []);

  // Função para deletar um jogo
  const handleDeletar = async (id: string) => {
    setLoading(true);
    try {
      // Atualiza o Firestore removendo o jogo da lista
      const docRef = doc(db, "calendario", "jogos");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const partidas = docSnap.data().partidas || {}; // Obtem as partidas

        // Verifica se o jogo existe antes de tentar deletá-lo
        if (partidas[id]) {
          delete partidas[id]; // Remove a partida específica com o ID passado

          // Verifica se a estrutura do 'partidas' está correta antes de atualizar
          const partidasAtualizadas = { ...partidas };

          // Atualiza o Firestore com as partidas atualizadas (sem o jogo removido)
          await updateDoc(docRef, { partidas: partidasAtualizadas });

          // Atualiza o estado local para refletir a remoção
          const updatedJogosList = Object.keys(partidasAtualizadas).map(key => ({
            id: key,
            ...partidasAtualizadas[key]
          }));

          // Ordena novamente após a remoção
          updatedJogosList.sort((a, b) => {
            const dataA = new Date(a.data);
            const dataB = new Date(b.data);
            return dataA.getTime() - dataB.getTime();
          });

          setJogos(updatedJogosList);

          alert("Jogo deletado com sucesso!");
        } else {
          setError("Jogo não encontrado para remoção!");
        }
      } else {
        setError("Documento 'jogos' não encontrado para remoção!");
      }
    } catch (error) {
      console.error("Erro ao deletar jogo:", error);
      setError("Erro ao deletar jogo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Função para adicionar um novo jogo (por exemplo, chamada após a criação de um novo jogo)
  const handleAdicionarJogo = (novoJogo: Jogo) => {
    setJogos(prevJogos => {
      // Adiciona o novo jogo à lista existente
      const jogosAtualizados = [...prevJogos, novoJogo];

      // Ordena os jogos pela data
      jogosAtualizados.sort((a, b) => {
        const dataA = new Date(a.data);
        const dataB = new Date(b.data);
        return dataA.getTime() - dataB.getTime();
      });

      return jogosAtualizados;
    });
  };

  return (
    <div className="p-6 max-w-full mx-auto">
      <h2 className="font-heading font-semibold text-blue text-3xl mb-4 uppercase text-center">
        Gerenciar Jogos
      </h2>

      {/* Exibe erro caso haja algum */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Lista de jogos para o usuário selecionar */}
      <div className="mb-4">
        <h3 className="text-gray-200">Jogos:</h3>
        {jogos.length > 0 ? (
          <ul className="space-y-2">
            {jogos.map((jogo) => (
              <li key={jogo.id} className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
                <span className="text-white">
                  {`${jogo.time1} vs ${jogo.time2} - ${jogo.data} ${jogo.horario}`}
                </span>
                <button
                  onClick={() => handleDeletar(jogo.id)}
                  className="ml-4 text-red-500 hover:text-red-700"
                  disabled={loading}
                >
                  {loading ? "Deletando..." : "Deletar"}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">Não há jogos para exibir.</p>
        )}
      </div>
    </div>
  );
};

export default EditarJogo;
