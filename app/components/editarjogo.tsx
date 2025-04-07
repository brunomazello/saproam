import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Tipo Jogo
interface Jogo {
  id: string;
  data: string;
  horario: string;
  time1: string;
  time2: string;
  twitchUser?: string; // <- novo campo
}

const EditarJogo = () => {
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [idParaDeletar, setIdParaDeletar] = useState<string | null>(null);
  const [jogoEmEdicao, setJogoEmEdicao] = useState<Jogo | null>(null);

  const fetchJogos = async () => {
    try {
      const docRef = doc(db, "calendario", "jogos");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const partidas = docSnap.data().partidas || {};
        const jogosList = Object.keys(partidas).map((key) => ({
          id: key,
          ...partidas[key],
        }));

        jogosList.sort(
          (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
        );
        setJogos(jogosList);
      } else {
        setError("Documento 'jogos' não encontrado!");
      }
    } catch (error) {
      setError("Erro ao buscar jogos.");
    }
  };

  useEffect(() => {
    fetchJogos();
  }, []);

  const handleSalvarEdicao = async () => {
    if (!jogoEmEdicao) return;

    try {
      const docRef = doc(db, "calendario", "jogos");
      const docSnap = await getDoc(docRef);
      const partidas = docSnap.exists() ? docSnap.data().partidas || {} : {};

      partidas[jogoEmEdicao.id] = {
        data: jogoEmEdicao.data,
        horario: jogoEmEdicao.horario,
        time1: jogoEmEdicao.time1,
        time2: jogoEmEdicao.time2,
        twitchUser: jogoEmEdicao.twitchUser || "",
      };

      await updateDoc(docRef, { partidas });

      toast.success("Jogo atualizado com sucesso!");
      setJogoEmEdicao(null);
      fetchJogos();
    } catch (error) {
      console.error("Erro ao atualizar jogo:", error);
      toast.error("Erro ao atualizar jogo.");
    }
  };

  const handleDeletar = async (id: string) => {
    setLoading(true);
    try {
      const docRef = doc(db, "calendario", "jogos");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const partidas = docSnap.data().partidas || {};

        if (partidas[id]) {
          delete partidas[id];
          await updateDoc(docRef, { partidas: { ...partidas } });

          toast.success("Jogo deletado com sucesso!");
          fetchJogos(); // Atualiza a lista completa
        } else {
          setError("Jogo não encontrado para remoção!");
        }
      } else {
        setError("Documento 'jogos' não encontrado para remoção!");
      }
    } catch (error) {
      console.error("Erro ao deletar jogo:", error);
      toast.error("Erro ao deletar jogo.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdicionarJogoFirestore = async (novoJogo: Jogo) => {
    try {
      const docRef = doc(db, "calendario", "jogos");
      const docSnap = await getDoc(docRef);
      const partidas = docSnap.exists() ? docSnap.data().partidas || {} : {};

      // Cria um novo ID único (pode usar timestamp ou UUID)
      const novoId = `jogo_${Date.now()}`;

      const partidasAtualizadas = {
        ...partidas,
        [novoId]: {
          data: novoJogo.data,
          horario: novoJogo.horario,
          time1: novoJogo.time1,
          time2: novoJogo.time2,
        },
      };

      // Atualiza no Firestore
      await updateDoc(docRef, { partidas: partidasAtualizadas });

      toast.success("Jogo adicionado com sucesso!");

      // Atualiza a lista após adicionar
      fetchJogos();
    } catch (error) {
      console.error("Erro ao adicionar jogo:", error);
      toast.error("Erro ao adicionar jogo.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <ToastContainer />
      <h2 className="font-heading font-semibold text-[--color-blue] text-3xl mb-10 uppercase text-center">
        Gerenciar Calendário
      </h2>

      {error && <p className="text-red-500">{error}</p>}

      {jogos.length > 0 ? (
        <div className="space-y-4">
          {jogos.map((jogo) => (
            <div
              key={jogo.id}
              className="bg-gray-800 text-white p-4 rounded-md shadow hover:shadow-lg transition duration-300 flex flex-col gap-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
                  <div className="text-lg font-semibold text-gray-200 whitespace-nowrap">
                    {jogo.time1} <span className="text-gray-400">vs</span>{" "}
                    {jogo.time2}
                  </div>
                  <div className="text-sm text-gray-300 md:ml-auto flex flex-col md:flex-row gap-2 md:items-center">
                    <span className="bg-gray-700 px-3 py-1 rounded-full">
                      {jogo.data}
                    </span>
                    <span className="bg-gray-700 px-3 py-1 rounded-full">
                      {jogo.horario}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setJogoEmEdicao(
                        jogoEmEdicao?.id === jogo.id ? null : jogo // Toggle
                      )
                    }
                    className="text-sm bg-gray-400 cursor-pointer text-white hover:bg-blue transition px-4 py-2 rounded-md"
                  >
                    {jogoEmEdicao?.id === jogo.id ? "Cancelar" : "Editar"}
                  </button>
                  <button
                    onClick={() => setIdParaDeletar(jogo.id)}
                    className="text-sm bg-danger text-white hover:bg-red-700  cursor-pointer transition px-4 py-2 rounded-md"
                  >
                    Deletar
                  </button>
                </div>
              </div>

              {/* Formulário de edição embutido */}
              {jogoEmEdicao?.id === jogo.id && (
                <div className="mt-4 bg-gray-900 p-4 rounded-md border border-gray-700 space-y-3">
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 text-white"
                    value={jogoEmEdicao.time1}
                    onChange={(e) =>
                      setJogoEmEdicao({
                        ...jogoEmEdicao,
                        time1: e.target.value,
                      })
                    }
                    placeholder="Time 1"
                  />
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 text-white"
                    value={jogoEmEdicao.time2}
                    onChange={(e) =>
                      setJogoEmEdicao({
                        ...jogoEmEdicao,
                        time2: e.target.value,
                      })
                    }
                    placeholder="Time 2"
                  />
                  <input
                    type="date"
                    className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 text-white"
                    value={jogoEmEdicao.data}
                    onChange={(e) =>
                      setJogoEmEdicao({ ...jogoEmEdicao, data: e.target.value })
                    }
                  />
                  <input
                    type="time"
                    className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 text-white"
                    value={jogoEmEdicao.horario}
                    onChange={(e) =>
                      setJogoEmEdicao({
                        ...jogoEmEdicao,
                        horario: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-600 text-white"
                    value={jogoEmEdicao.twitchUser || ""}
                    onChange={(e) =>
                      setJogoEmEdicao({
                        ...jogoEmEdicao,
                        twitchUser: e.target.value,
                      })
                    }
                    placeholder="Usuário da Twitch (opcional)"
                  />

                  <div className="flex justify-end gap-4 mt-3">
                    <button
                      onClick={() => setJogoEmEdicao(null)}
                      className="px-4 py-2 rounded-md border border-gray-500 text-gray-300 transition hover:bg-gray-100 hover:text-black"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSalvarEdicao}
                      className="px-4 py-2 rounded-md bg-green hover:bg-blue cursor-pointer text-white font-semibold transition"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              )}

              {/* Modal de deletar, mantido fora da condicional */}
              {idParaDeletar === jogo.id && (
                <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
                  <div className="bg-gray-900 text-white p-6 rounded-lg shadow-xl w-[90%] max-w-md border border-gray-700">
                    <h3 className="text-xl font-bold mb-4 text-danger">
                      Confirmar Exclusão
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Tem certeza que deseja{" "}
                      <span className="text-danger font-semibold">deletar</span>{" "}
                      este jogo? Essa ação não pode ser desfeita.
                    </p>

                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => setIdParaDeletar(null)}
                        className="px-4 py-2 rounded-md border border-gray-500 text-gray-300 transition hover:cursor-pointer hover:bg-gray-100 hover:text-black"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => {
                          handleDeletar(jogo.id);
                          setIdParaDeletar(null);
                        }}
                        className="px-4 py-2 rounded-md bg-danger hover:bg-red-700 text-white font-semibold transition hover:cursor-pointer"
                      >
                        Confirmar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center">
          Nenhum jogo cadastrado ainda.
        </p>
      )}
    </div>
  );
};

export default EditarJogo;
