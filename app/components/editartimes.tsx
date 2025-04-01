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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
        setJogadores(
          Object.entries(data.Jogadores || {}).map(([key, value]: any) => ({
            id: key,
            ...value,
          }))
        );
      } else {
        setError("Time não encontrado.");
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
      const jogadoresAtualizados = jogadores.reduce((acc, jogador) => {
        acc[jogador.id] = { Nome: jogador.Nome, Posição: jogador.Posição };
        return acc;
      }, {});
      await updateDoc(timeRef, { Jogadores: jogadoresAtualizados });
      setError("Time atualizado com sucesso!");
    } catch (err) {
      setError("Erro ao atualizar o time.");
    } finally {
      setLoading(false);
    }
  };

  const handleJogadorChange = (id: string, field: string, value: string) => {
    setJogadores(
      jogadores.map((j) => (j.id === id ? { ...j, [field]: value } : j))
    );
  };

  const handleAdicionarJogador = (nome: string, posicao: string) => {
    if (!nome || !posicao) return;
    const slot = `Jogador${POSICOES.indexOf(posicao) + 1}`;
    setJogadores([...jogadores, { id: slot, Nome: nome, Posição: posicao }]);
  };

  const handleRemoverJogador = (id: string) => {
    setJogadores(jogadores.filter((j) => j.id !== id));
  };

  return (
    <div className="flex flex-col items-center p-6 rounded-xl text-gray-200 w-full mx-auto shadow-lg">
      <h2 className="font-heading font-semibold text-blue text-3xl mb-4 uppercase">
        Editar Time
      </h2>
      {error && <p className="text-danger text-sm mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <label className="block text-gray-300">Dono do Time</label>
          <input
            type="text"
            value={dono}
            onChange={(e) => setDono(e.target.value)}
            className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
            required
          />
        </div>
        {jogadores.map((jogador) => (
          <div
            key={jogador.id}
            className="p-3 rounded-lg bg-gray-800 text-white"
          >
            <input
              type="text"
              value={jogador.Nome}
              onChange={(e) =>
                handleJogadorChange(jogador.id, "Nome", e.target.value)
              }
              className="w-full p-2 rounded border border-gray-600 bg-gray-900 text-white"
            />
            <select
              value={jogador.Posição}
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
              className="mt-2 px-3 py-1 bg-danger rounded text-white"
            >
              Remover
            </button>
          </div>
        ))}
        <div className="flex w-full gap-4 md:flex-row flex-col">
          <button
            type="button"
            onClick={() =>
              handleAdicionarJogador("Novo Jogador", "Point Guard")
            }
            className="px-5 h-12 bg-gray-500 text-blue font-semibold rounded-xl w-auto cursor-pointer hover:bg-blue hover:text-gray-900 transition-colors duration-300"
          >
            Adicionar Jogador
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 h-12 bg-gray-500 text-blue font-semibold rounded-xl w-auto cursor-pointer hover:bg-blue hover:text-gray-900 transition-colors duration-300"
          >
            {loading ? "Carregando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarTime;
