"use client";

import { useState, useEffect } from "react";
import {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "../../firebase"; // Importando Firestore

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

// Carregar os times do Firebase
useEffect(() => {
  const fetchTimes = async () => {
    try {
      const timesRef = collection(db, "times");
      const snapshot = await getDocs(timesRef);
      setTimes(snapshot.docs.map((doc) => doc.id));
    } catch (err) {
      setError("Erro ao carregar os times.");
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
      setError("Time não encontrado.");
      setJogadores([]); // Zera a lista caso o time não seja encontrado
    }
  } catch (err) {
    setError("Erro ao carregar os dados do time.");
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
      setError("Time não encontrado.");
      return;
    }

    const data = timeSnap.data();
    const vitoriasAntigas = data.Vitorias || 0;
    const derrotasAntigas = data.Derrotas || 0;
    const empatesAntigos = data.Empates || 0;
    const jogosAntigos = data.Jogos || 0;

    // 🔹 **Calculando a diferença nos resultados**
    const diferencaVitorias = vitorias - vitoriasAntigas;
    console.log(diferencaVitorias)
    const diferencaDerrotas = derrotas - derrotasAntigas;
    console.log(diferencaDerrotas)
    const diferencaEmpates = empates - empatesAntigos;
    console.log(diferencaEmpates)

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
      acc[jogador.id] = {
        Nome: jogador.Nome,
        Posição: jogador.Posição,
        Jogos: Math.max(
          (jogadoresExistentes[jogador.id]?.Jogos || 0) + jogosCalculados,
          0
        ),
        assistencias: jogadoresExistentes[jogador.id]?.assistencias || 0,
        bloqueios: jogadoresExistentes[jogador.id]?.bloqueios || 0,
        erros: jogadoresExistentes[jogador.id]?.erros || 0,
        faltas: jogadoresExistentes[jogador.id]?.faltas || 0,
        pontuacao: jogadoresExistentes[jogador.id]?.pontuacao || 0,
        rebotes: jogadoresExistentes[jogador.id]?.rebotes || 0,
        roubos: jogadoresExistentes[jogador.id]?.roubos || 0,
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

    setError("Time atualizado com sucesso!");
  } catch (err) {
    setError("Erro ao atualizar o time.");
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
    <div className="flex flex-col items-center rounded-xl text-gray-200 w-full mx-auto shadow-lg mt-20">
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
