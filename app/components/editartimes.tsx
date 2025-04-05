"use client";

import { useState, useEffect } from "react";
import {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  setDoc,
} from "../../firebase"; // Importando Firestore
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const POSICOES = [
  "Point Guard",
  "Shooting Guard",
  "Small Forward",
  "Power Forward",
  "Center",
];

const EditarTime: React.FC = () => {
  const [times, setTimes] = useState<string[]>([]);
  const [nomeTime, setNomeTime] = useState<string>("");
  const [dono, setDono] = useState<string>("");
  const [jogadores, setJogadores] = useState<any[]>([]);
  const [vitorias, setVitorias] = useState<number>(0);
  const [derrotas, setDerrotas] = useState<number>(0);
  const [empates, setEmpates] = useState<number>(0);
  const [pontosFeitos, setPontosFeitos] = useState<number>(0);
  const [pontosRecebidos, setPontosRecebidos] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [novoNomeTime, setNovoNomeTime] = useState<string>("");

  // Carregar os times do Firebase
  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const timesRef = collection(db, "times");
        const snapshot = await getDocs(timesRef);
        setTimes(snapshot.docs.map((doc) => doc.id));
      } catch (err) {
        toast.error("Erro ao carregar os times.");
      }
    };
    fetchTimes();
  }, []);

  // Carregar os dados de um time específico
  const carregarDadosTime = async (nome: string) => {
    if (!nome) return;
    setLoading(true);
    setError(null);

    try {
      const timeRef = doc(db, "times", nome);
      const timeSnap = await getDoc(timeRef);

      if (timeSnap.exists()) {
        const data = timeSnap.data();
        setDono(data.Dono || "");
        setVitorias(data.Vitorias || 0);
        setDerrotas(data.Derrotas || 0);
        setEmpates(data.Empates || 0);
        setPontosFeitos(data.pontosFeitos || 0);
        setPontosRecebidos(data.pontosRecebidos || 0);

        // 🔥 Garante que Jogadores será um array
        const jogadoresArray =
          data.Jogadores && typeof data.Jogadores === "object"
            ? Object.keys(data.Jogadores).map((id) => ({
                id, // Mantém o ID do jogador
                ...data.Jogadores[id], // Copia os dados do jogador
              }))
            : [];

        setJogadores(jogadoresArray);
        console.log("Jogadores carregados:", jogadoresArray);
      } else {
        toast.error("❌Time não encontrado.");
        setJogadores([]); // Zera a lista caso o time não seja encontrado
      }
    } catch (err) {
      toast.error("❌Erro ao carregar os dados do time.");
    } finally {
      setLoading(false);
    }
  };

  const editarNomeTime = async () => {
    if (!nomeTime || !novoNomeTime) {
      toast.error("❌Preencha os dois nomes.");
      return;
    }

    if (nomeTime === novoNomeTime) {
      toast.error("❌O novo nome deve ser diferente do atual.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const timeAtualRef = doc(db, "times", nomeTime);
      const timeAtualSnap = await getDoc(timeAtualRef);

      if (!timeAtualSnap.exists()) {
        toast.error("❌Time original não encontrado.");
        setLoading(false);
        return;
      }

      const dadosDoTime = timeAtualSnap.data();

      // Cria o novo documento com o novo nome
      const novoTimeRef = doc(db, "times", novoNomeTime.toUpperCase());
      await setDoc(novoTimeRef, dadosDoTime);

      // Deleta o documento antigo
      await deleteDoc(timeAtualRef);

      // Atualiza o estado local
      setNomeTime(novoNomeTime);
      setTimes((prev) =>
        prev.map((time) => (time === nomeTime ? novoNomeTime : time))
      );
      toast.success("✅ Nome do time alterado com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("❌Erro ao renomear o time.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const timeRef = doc(db, "times", nomeTime);
      const timeSnap = await getDoc(timeRef);

      if (!timeSnap.exists()) {
        toast.error("❌Time não encontrado.");
        return;
      }

      const data = timeSnap.data();
      const vitoriasAntigas = data.Vitorias || 0;
      const derrotasAntigas = data.Derrotas || 0;
      const empatesAntigos = data.Empates || 0;
      const jogosAntigos = data.Jogos || 0;

      // 🔹 **Calculando a diferença nos resultados**
      const diferencaVitorias = vitorias - vitoriasAntigas;
      console.log(diferencaVitorias);
      const diferencaDerrotas = derrotas - derrotasAntigas;
      console.log(diferencaDerrotas);
      const diferencaEmpates = empates - empatesAntigos;
      console.log(diferencaEmpates);

      // 🔹 **Cada jogo deve contar como 2**
      const jogosCalculados =
        (diferencaVitorias + diferencaDerrotas + diferencaEmpates) * 2;

      // 🔹 **Somando corretamente os jogos**
      const jogosAtualizados = Math.max(jogosAntigos + jogosCalculados, 0);

      // 🔹 **Calcula os pontos corretamente**
      const pontosCalculados = vitorias * 3 + empates * 1;

      // Atualiza os jogadores mantendo os dados antigos e ajustando os jogos
      const jogadoresExistentes = data.Jogadores || {};
      const jogadoresAtualizados = jogadores.reduce((acc, jogador) => {
        const jogadorAntigo = jogadoresExistentes[jogador.id] || {};

        acc[jogador.id] = {
          ...jogadorAntigo, // mantém tudo o que já existe, inclusive FGA, FGM etc.
          Nome: jogador.Nome,
          Posição: jogador.Posição,
          Jogos: Math.max((jogadorAntigo.Jogos || 0) + jogosCalculados, 0),
        };

        return acc;
      }, {});

      // Atualiza o banco de dados
      await updateDoc(timeRef, {
        Jogadores: jogadoresAtualizados,
        Vitorias: vitorias,
        Derrotas: derrotas,
        Empates: empates,
        Jogos: jogosAtualizados, // ✅ **Agora os jogos são dobrados corretamente**
        pontosFeitos: pontosFeitos,
        pontosRecebidos: pontosRecebidos,
        Pontos: pontosCalculados,
      });

      toast.success("Time atualizado com sucesso!");
    } catch (err) {
      toast.error("❌Erro ao atualizar o time.");
    } finally {
      setLoading(false);
    }
  };

  // Atualiza o estado ao editar um jogador
  const handleJogadorChange = (id: string, campo: string, valor: any) => {
    setJogadores((prevJogadores) =>
      prevJogadores.map((jogador) =>
        jogador.id === id ? { ...jogador, [campo]: valor } : jogador
      )
    );
  };

  // Remove um jogador da lista
  const handleRemoverJogador = (id: string) => {
    setJogadores((prevJogadores) =>
      prevJogadores.filter((jogador) => jogador.id !== id)
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <ToastContainer />
      <h2 className="font-heading font-semibold text-blue text-3xl mb-4 uppercase">
        Editar Time
      </h2>
      {error && <p className="text-danger text-sm mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <div>
          <label className="block text-gray-300">Nome do Time</label>
          <select
            value={nomeTime}
            onChange={(e) => {
              setNomeTime(e.target.value);
              carregarDadosTime(e.target.value);
            }}
            className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
            required
          >
            <option value="">Selecione um time</option>
            {times.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        {/* <div>
          <label className="block text-gray-300">Editar nome do time:</label>
          <input
            type="text"
            value={novoNomeTime}
            onChange={(e) => setNovoNomeTime(e.target.value)}
            placeholder="Novo nome do time"
            className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
          />
          <button onClick={editarNomeTime} disabled={!novoNomeTime}>
            Salvar novo nome
          </button>
        </div> */}

        <div>
          <label className="block text-gray-300">Vitórias</label>
          <input
            type="number"
            value={vitorias}
            onChange={(e) => setVitorias(Number(e.target.value) || 0)}
            className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
          />
        </div>

        <div>
          <label className="block text-gray-300">Derrotas</label>
          <input
            type="number"
            value={derrotas}
            onChange={(e) => setDerrotas(Number(e.target.value) || 0)}
            className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
          />
        </div>

        <div>
          <label className="block text-gray-300">Empates</label>
          <input
            type="number"
            value={empates}
            onChange={(e) => setEmpates(Number(e.target.value) || 0)}
            className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
          />
        </div>

        {/* Lista de jogadores */}
        {jogadores.length > 0 ? (
          jogadores.map((jogador) => (
            <div
              key={jogador.id}
              className="p-3 rounded-lg bg-gray-800 text-white"
            >
              <input
                type="text"
                value={jogador.Nome || ""}
                onChange={(e) =>
                  handleJogadorChange(jogador.id, "Nome", e.target.value)
                }
                className="w-full p-2 rounded border border-gray-600 bg-gray-900 text-white"
              />
              <select
                value={jogador.Posição || ""}
                onChange={(e) =>
                  handleJogadorChange(jogador.id, "Posição", e.target.value)
                }
                className="w-full p-2 mt-2 rounded border border-gray-600 bg-gray-900 text-white"
              >
                {POSICOES.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => handleRemoverJogador(jogador.id)}
                className="mt-8 px-3 py-1 bg-danger w-full rounded text-white"
              >
                Remover
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400">Nenhum jogador encontrado.</p>
        )}

        <button type="submit" disabled={loading} className="btn">
          {loading ? "Carregando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
};

export default EditarTime;
