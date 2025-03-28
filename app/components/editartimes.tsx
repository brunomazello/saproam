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
  const [times, setTimes] = useState<string[]>([]); // Lista de nomes de times
  const [nomeTime, setNomeTime] = useState<string>(""); // Nome do time selecionado
  const [vitorias, setVitorias] = useState<number>(0);
  const [derrotas, setDerrotas] = useState<number>(0);
  const [jogador1, setJogador1] = useState<string>("");
  const [jogador2, setJogador2] = useState<string>("");
  const [jogador3, setJogador3] = useState<string>("");
  const [jogador4, setJogador4] = useState<string>("");
  const [jogador5, setJogador5] = useState<string>("");
  const [pontosFeitos, setPontosFeitos] = useState<number>(0);
  const [pontosRecebidos, setPontosRecebidos] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar os times no Firestore
  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const timesRef = collection(db, "times");
        const snapshot = await getDocs(timesRef); // Usando getDocs para buscar os documentos da coleção
        const timesList = snapshot.docs.map((doc) => doc.id); // Pega os IDs (nomes dos times)
        setTimes(timesList);
      } catch (err) {
        setError("Erro ao carregar os times.");
      }
    };

    fetchTimes();
  }, []);

  // Função para carregar as informações do time selecionado
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
      } else {
        setError("Time não encontrado.");
      }
    } catch (err) {
      setError("Erro ao carregar os dados do time.");
    } finally {
      setLoading(false);
    }
  };

  // Função para salvar as alterações do time
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
      });

      setError("Time atualizado com sucesso!");
    } catch (err) {
      setError("Erro ao atualizar o time.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="font-heading font-semibold text-gray-200 text-md ml-2.5 text-3xl mb-3 uppercase">
        Editar Time
      </h2>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="nomeTime"
            className="block text-gray-300 text-center mb-6"
          ></label>
          <select
            id="nomeTime"
            value={nomeTime}
            onChange={(e) => {
              setNomeTime(e.target.value);
              carregarDadosTime(e.target.value); // Carregar os dados ao selecionar o time
            }}
            className="w-full p-2 rounded border border-gray-300"
            required
          >
            <option value="">Selecione um time</option>
            {times.map((time) => (
              <option key={time} value={time} className="text-black">
                {time}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="vitorias" className="block text-gray-300">
            Vitórias
          </label>
          <input
            type="number"
            id="vitorias"
            value={vitorias}
            onChange={(e) => setVitorias(Number(e.target.value))}
            className="w-full p-2 rounded border border-gray-300"
            required
          />
        </div>
        <div>
          <label htmlFor="derrotas" className="block text-gray-300">
            Derrotas
          </label>
          <input
            type="number"
            id="derrotas"
            value={derrotas}
            onChange={(e) => setDerrotas(Number(e.target.value))}
            className="w-full p-2 rounded border border-gray-300"
            required
          />
        </div>
        <div>
          <label htmlFor="pontosFeitos" className="block text-gray-300">
            PTS
          </label>
          <input
            type="number"
            id="pontosFeitos"
            value={pontosFeitos}
            onChange={(e) => setPontosFeitos(Number(e.target.value))}
            className="w-full p-2 rounded border border-gray-300"
            required
          />
        </div>
        <div>
          <label htmlFor="pontosRecebidos" className="block text-gray-300">
            PTSC
          </label>
          <input
            type="number"
            id="pontosRecebidos"
            value={pontosRecebidos}
            onChange={(e) => setPontosRecebidos(Number(e.target.value))}
            className="w-full p-2 rounded border border-gray-300"
            required
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            disabled={loading}
            className="flex justify-between items-center px-5 h-12 bg-gray-500 text-blue font-semibold rounded-xl w-auto cursor-pointer hover:bg-blue hover:text-gray-900 transition-colors duration-300 "
          >
            {loading ? "Carregando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarTime;
