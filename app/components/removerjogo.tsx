import { useState, useEffect } from "react";
import { db, collection, getDocs, updateDoc, doc, getDoc, deleteDoc } from "../../firebase"; // Importando Firestore

interface Jogo {
  id: string;
  data: string;
  horario: string;
  time1: string;
  time2: string;
}

const RemoverJogo: React.FC = () => {
  const [jogos, setJogos] = useState<Jogo[]>([]);  // Lista de jogos
  const [jogoSelecionado, setJogoSelecionado] = useState<string>(""); // ID do jogo selecionado
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Função para carregar os jogos do Firebase
  const fetchJogos = async () => {
    try {
      const jogosRef = collection(db, "calendario", "seuIdDoCalendario", "jogos");  // Ajuste o "seuIdDoCalendario"
      const snapshot = await getDocs(jogosRef);
      const jogosData: Jogo[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log("Jogo encontrado:", data);  // Verifica o conteúdo de cada jogo

        jogosData.push({
          id: doc.id, // ID do documento do jogo
          data: data.data,
          horario: data.horario,
          time1: data.time1,
          time2: data.time2,
        });
      });

      setJogos(jogosData); // Atualiza o estado com os jogos
      console.log("Jogos carregados:", jogosData);  // Verifica se os jogos foram carregados corretamente
    } catch (err) {
      setError("Erro ao carregar os jogos.");
      console.error("Erro ao carregar jogos:", err);
    }
  };

  // Carregar os jogos ao montar o componente
  useEffect(() => {
    fetchJogos();
  }, []);

  // Função para remover um jogo
  const handleRemoverJogo = async (jogoId: string) => {
    if (!jogoId) return;
    setLoading(true);
    setError(null);
    try {
      // Referência para o jogo específico dentro da sub-coleção "jogos"
      const jogoRef = doc(db, "calendario", "seuIdDoCalendario", "jogos", jogoId); // Ajuste o "seuIdDoCalendario"

      // Verifica se o jogo existe
      const jogoSnapshot = await getDoc(jogoRef);
      if (!jogoSnapshot.exists()) {
        setError("Jogo não encontrado.");
        return;
      }

      console.log("Jogo a ser removido:", jogoSnapshot.data());  // Verifica os dados do jogo

      // Excluir o jogo (completely remove)
      await deleteDoc(jogoRef);

      setError("Jogo removido com sucesso!");
      setJogoSelecionado("");  // Limpar seleção após remoção
      fetchJogos();  // Recarregar a lista de jogos
    } catch (err) {
      setError("Erro ao remover o jogo.");
      console.error("Erro ao remover jogo:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 rounded-xl text-gray-200 w-full mx-auto shadow-lg">
      <h2 className="font-heading font-semibold text-blue text-3xl mb-4 uppercase">
        Remover Jogo
      </h2>
      {error && <p className="text-danger text-sm mb-3">{error}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRemoverJogo(jogoSelecionado);
        }}
        className="space-y-4 w-full"
      >
        <div>
          <label className="block text-gray-300">Selecione o Jogo</label>
          <select
            value={jogoSelecionado}
            onChange={(e) => setJogoSelecionado(e.target.value)}
            className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
            required
          >
            <option value="">Selecione um jogo</option>
            {jogos.map((jogo) => (
              <option key={jogo.id} value={jogo.id}>
                {jogo.data} - {jogo.horario} | {jogo.time1} 🆚 {jogo.time2}
              </option>
            ))}
          </select>
        </div>

        <div className="flex w-full gap-4 md:flex-row flex-col">
          <button
            type="submit"
            disabled={loading}
            className="px-5 h-12 bg-gray-500 text-blue font-semibold rounded-xl w-auto cursor-pointer hover:bg-blue hover:text-gray-900 transition-colors duration-300"
          >
            {loading ? "Carregando..." : "Remover Jogo"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RemoverJogo;
