"use client";

import { useState, useEffect } from "react";
import { db, doc, getDoc, updateDoc } from "../../firebase";

interface Jogador {
  id: string;
  nome: string;
  pontuacao: number;
  rebotes: number;
  assistencias: number;
  roubos: number;
  bloqueios: number;
  faltas: number;
  erros: number;
}

const EditarJogador: React.FC = () => {
  const [times, setTimes] = useState<string[]>([]);
  const [nomeTime, setNomeTime] = useState<string>("");
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [jogadorSelecionado, setJogadorSelecionado] = useState<string>("");
  const [estatisticas, setEstatisticas] = useState<
    Omit<Jogador, "id" | "nome">
  >({
    pontuacao: 0,
    rebotes: 0,
    assistencias: 0,
    roubos: 0,
    bloqueios: 0,
    faltas: 0,
    erros: 0,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTimes([
      "Falcões",
      "4revis",
      "Firewolf",
      "Los Perro Loco",
      "OKC",
      "Super Dogs",
      "Brazilian Delay",
    ]);
  }, []);

  useEffect(() => {
    if (!nomeTime) return;
    const fetchJogadores = async () => {
      setLoading(true);
      setError(null);
      try {
        const timeRef = doc(db, "times", nomeTime);
        const timeSnap = await getDoc(timeRef);

        if (timeSnap.exists()) {
          const timeData = timeSnap.data();
          const jogadoresData = timeData.Jogadores || {};

          const listaJogadores = Object.keys(jogadoresData).map((key) => ({
            id: key,
            nome: jogadoresData[key].Nome,
            pontuacao: jogadoresData[key].pontuacao || 0,
            rebotes: jogadoresData[key].rebotes || 0,
            assistencias: jogadoresData[key].assistencias || 0,
            roubos: jogadoresData[key].roubos || 0,
            bloqueios: jogadoresData[key].bloqueios || 0,
            faltas: jogadoresData[key].faltas || 0,
            erros: jogadoresData[key].erros || 0,
          }));

          setJogadores(listaJogadores);
        } else {
          setJogadores([]);
        }
      } catch (err) {
        setError("Erro ao carregar jogadores.");
      } finally {
        setLoading(false);
      }
    };
    fetchJogadores();
  }, [nomeTime]);

  useEffect(() => {
    if (!jogadorSelecionado) return;
    const jogador = jogadores.find((j) => j.id === jogadorSelecionado);
    if (jogador) {
      setEstatisticas({
        pontuacao: jogador.pontuacao,
        rebotes: jogador.rebotes,
        assistencias: jogador.assistencias,
        roubos: jogador.roubos,
        bloqueios: jogador.bloqueios,
        faltas: jogador.faltas,
        erros: jogador.erros,
      });
    }
  }, [jogadorSelecionado]);

  const atualizarEstatisticas = async () => {
    if (!nomeTime || !jogadorSelecionado) {
      setError("Todos os campos são obrigatórios.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const timeRef = doc(db, "times", nomeTime);
      await updateDoc(timeRef, {
        [`Jogadores.${jogadorSelecionado}`]: estatisticas,
      });
      setError("Estatísticas atualizadas com sucesso!");
    } catch (err) {
      setError("Erro ao atualizar as estatísticas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="font-heading font-semibold text-blue text-3xl mb-4 uppercase text-center md:text-left">
        Atualizar Estatísticas de Jogador
      </h2>
      {error && <p className="text-red-500">{error}</p>}

      <select
        value={nomeTime}
        onChange={(e) => setNomeTime(e.target.value)}
        className="w-56 p-2 rounded border border-gray-600 bg-gray-800 text-white mb-6"
      >
        {times.map((time) => (
          <option key={time} value={time} className="text-gray-300">
            {time}
          </option>
        ))}
      </select>

      {jogadores.length > 0 && (
        <select
          value={jogadorSelecionado}
          onChange={(e) => setJogadorSelecionado(e.target.value)}
          className="w-56 p-2 rounded border border-gray-600 bg-gray-800 text-white mb-6"
        >
          {jogadores.map((jogador) => (
            <option key={jogador.id} value={jogador.id} className="text-gray-300">
              {jogador.nome}
            </option>
          ))}
        </select>
      )}

      {Object.keys(estatisticas).map((stat) => (
        <div key={stat} className="mb-4">
          <label className="block text-gray-300 capitalize">{stat}</label>
          <input
            type="number"
            value={estatisticas[stat as keyof typeof estatisticas]}
            onChange={(e) =>
              setEstatisticas((prev) => ({
                ...prev,
                [stat]: Number(e.target.value),
              }))
            }
            className="w-56 p-2 rounded border border-gray-600 bg-gray-800 text-white"
          />
        </div>
      ))}

      <button
        onClick={atualizarEstatisticas}
        disabled={loading}
        className="flex justify-center items-center px-5 h-12 bg-gray-500 text-blue font-semibold rounded-xl cursor-pointer hover:bg-blue hover:text-gray-900 transition-colors duration-300"
      >
        {loading ? "Carregando..." : "Atualizar Estatísticas"}
      </button>
    </div>
  );
};

export default EditarJogador;
