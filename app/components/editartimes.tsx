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

const EditarTime: React.FC = () => {
  const [times, setTimes] = useState<string[]>([]);
  const [nomeTime, setNomeTime] = useState<string>("");
  const [vitorias, setVitorias] = useState<number>(0);
  const [derrotas, setDerrotas] = useState<number>(0);
  const [pontosFeitos, setPontosFeitos] = useState<number>(0);
  const [pontosRecebidos, setPontosRecebidos] = useState<number>(0);
  const [dono, setDono] = useState<string>("");
  const [jogadores, setJogadores] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const timesRef = collection(db, "times");
        const snapshot = await getDocs(timesRef);
        const timesList = snapshot.docs.map((doc) => doc.id);
        setTimes(timesList);
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
        setVitorias(data.Vitorias);
        setDerrotas(data.Derrotas);
        setPontosFeitos(data.pontosFeitos);
        setPontosRecebidos(data.pontosRecebidos);
        setDono(data.Dono || "");
        const jogadoresArray = data.Jogadores ? Object.values(data.Jogadores) : [];
        setJogadores(jogadoresArray);
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
      await updateDoc(timeRef, {
        Vitorias: vitorias,
        Derrotas: derrotas,
        pontosFeitos: pontosFeitos,
        pontosRecebidos: pontosRecebidos,
        Dono: dono,
        Jogadores: jogadores.reduce((acc, jogador, index) => {
          acc[`Jogador${index + 1}`] = jogador;
          return acc;
        }, {}),
      });

      setError("Time atualizado com sucesso!");
    } catch (err) {
      setError("Erro ao atualizar o time.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJogadorChange = (index: number, field: string, value: string) => {
    const updatedJogadores = [...jogadores];
    updatedJogadores[index] = { ...updatedJogadores[index], [field]: value };
    setJogadores(updatedJogadores);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl text-gray-200 max-w-2xl mx-auto shadow-lg">
      <h2 className="font-heading font-semibold text-blue text-3xl mb-4 uppercase">Editar Time</h2>
      {error && <p className="text-danger text-sm mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nomeTime" className="block text-gray-300">Nome do Time</label>
          <select
            id="nomeTime"
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
              <option key={time} value={time} className="text-white">
                {time}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="dono" className="block text-gray-300">Dono do Time</label>
          <input
            type="text"
            id="dono"
            value={dono}
            onChange={(e) => setDono(e.target.value)}
            className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
            required
          />
        </div>

        {jogadores.map((jogador, index) => (
          <div key={index} className="border border-gray-600 p-3 rounded-lg bg-gray-800 text-white">
            <label className="block text-gray-300">Nome do Jogador</label>
            <input
              type="text"
              value={jogador.Nome}
              onChange={(e) => handleJogadorChange(index, "Nome", e.target.value)}
              className="w-full p-2 rounded border border-gray-600 bg-gray-900 text-white"
            />
            <label className="block text-gray-300">Posição</label>
            <input
              type="text"
              value={jogador.Posição}
              onChange={(e) => handleJogadorChange(index, "Posição", e.target.value)}
              className="w-full p-2 rounded border border-gray-600 bg-gray-900 text-white"
            />
          </div>
        ))}

        <div className="flex items-center justify-center">
          <button
            type="submit"
            disabled={loading}
            className="px-5 h-12 bg-blue text-gray-900 font-semibold rounded-xl w-auto cursor-pointer hover:bg-purple transition-colors duration-300 mt-6"
          >
            {loading ? "Carregando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarTime;
