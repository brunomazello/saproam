"use client";

import { useState, useEffect } from "react";
import { db, doc, getDoc, updateDoc } from "../../firebase"; // Importando Firestore

const EditarJogador: React.FC = () => {
  const [times, setTimes] = useState<string[]>([]);
  const [nomeTime, setNomeTime] = useState<string>("");
  const [jogadores, setJogadores] = useState<{ id: string; nome: string }[]>(
    []
  );
  const [jogadorSelecionado, setJogadorSelecionado] = useState<string>("");

  // Estados para armazenar as estatísticas do jogador
  const [pontuacao, setPontuacao] = useState<number>(0);
  const [rebotes, setRebotes] = useState<number>(0);
  const [assistencias, setAssistencias] = useState<number>(0);
  const [roubos, setRoubos] = useState<number>(0);
  const [bloqueios, setBloqueios] = useState<number>(0);
  const [faltas, setFaltas] = useState<number>(0);
  const [erros, setErros] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar lista de times no Firestore (simulação, você pode adaptar)
  useEffect(() => {
    setTimes(["Time 1", "Time 2"]); // Exemplo estático, substitua pela busca no Firestore
  }, []);

  // Buscar jogadores do time selecionado
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
          const jogadoresData = timeData.Jogadores || {}; // Pega o mapa de jogadores

          const listaJogadores = Object.keys(jogadoresData).map((key) => ({
            id: key,
            nome: jogadoresData[key].Nome,
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

  // Buscar os dados do jogador selecionado e preencher os campos
  useEffect(() => {
    if (!nomeTime || !jogadorSelecionado) return;

    const fetchEstatisticas = async () => {
      try {
        const timeRef = doc(db, "times", nomeTime);
        const timeSnap = await getDoc(timeRef);

        if (timeSnap.exists()) {
          const timeData = timeSnap.data();
          const jogadorData = timeData.Jogadores?.[jogadorSelecionado];

          if (jogadorData) {
            setPontuacao(jogadorData.pontuacao || 0);
            setRebotes(jogadorData.rebotes || 0);
            setAssistencias(jogadorData.assistencias || 0);
            setRoubos(jogadorData.roubos || 0);
            setBloqueios(jogadorData.bloqueios || 0);
            setFaltas(jogadorData.faltas || 0);
            setErros(jogadorData.erros || 0);
          }
        }
      } catch (err) {
        setError("Erro ao carregar estatísticas do jogador.");
        console.log(err);
      }
    };

    fetchEstatisticas();
  }, [jogadorSelecionado]);

  // Função para atualizar as estatísticas do jogador
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
        [`Jogadores.${jogadorSelecionado}.pontuacao`]: pontuacao,
        [`Jogadores.${jogadorSelecionado}.rebotes`]: rebotes,
        [`Jogadores.${jogadorSelecionado}.assistencias`]: assistencias,
        [`Jogadores.${jogadorSelecionado}.roubos`]: roubos,
        [`Jogadores.${jogadorSelecionado}.bloqueios`]: bloqueios,
        [`Jogadores.${jogadorSelecionado}.faltas`]: faltas,
        [`Jogadores.${jogadorSelecionado}.erros`]: erros,
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
      <h2 className="font-heading font-semibold text-gray-200 text-md ml-2.5 text-3xl mb-3 uppercase">
        Atualizar Estatísticas de Jogador
      </h2>
      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-6">
        <label className="block text-gray-300 text-center">
          Nome do Time
        </label>
        <select
          value={nomeTime}
          onChange={(e) => setNomeTime(e.target.value)}
          className="w-full p-2 rounded border border-gray-300"
        >
          {times.map((time) => (
            <option key={time} value={time} className="text-black">
              {time}
            </option>
          ))}
        </select>
      </div>

      {jogadores.length > 0 && (
        <div className="mb-6">
          <label className="block text-gray-300">Jogador</label>
          <select
            className="p-2 rounded border border-gray-300"
            value={jogadorSelecionado}
            onChange={(e) => setJogadorSelecionado(e.target.value)}
          >
            {jogadores.map((jogador) => (
              <option
                key={jogador.id}
                value={jogador.id}
                className="text-black"
              >
                {jogador.nome}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-gray-300">Pontuação</label>
        <input
          type="number"
          value={pontuacao}
          onChange={(e) => setPontuacao(Number(e.target.value))}
          className="p-2 rounded border border-gray-300"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-300">Rebotes</label>
        <input
          type="number"
          value={rebotes}
          onChange={(e) => setRebotes(Number(e.target.value))}
          className="p-2 rounded border border-gray-300"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-300">Assistências</label>
        <input
          type="number"
          value={assistencias}
          onChange={(e) => setAssistencias(Number(e.target.value))}
          className="p-2 rounded border border-gray-300"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-300">Roubos</label>
        <input
          type="number"
          value={roubos}
          onChange={(e) => setRoubos(Number(e.target.value))}
          className="p-2 rounded border border-gray-300"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-300">Bloqueios</label>
        <input
          type="number"
          value={bloqueios}
          onChange={(e) => setBloqueios(Number(e.target.value))}
          className="p-2 rounded border border-gray-300"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-300">Faltas</label>
        <input
          type="number"
          value={faltas}
          onChange={(e) => setFaltas(Number(e.target.value))}
          className="p-2 rounded border border-gray-300"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-300">Erros</label>
        <input
          type="number"
          value={erros}
          onChange={(e) => setErros(Number(e.target.value))}
          className="p-2 rounded border border-gray-300 mb-6"
        />
      </div>

      <button
        onClick={atualizarEstatisticas}
        disabled={loading}
        className="flex justify-between items-center px-5 h-12 bg-gray-500 text-blue font-semibold rounded-xl w-auto cursor-pointer hover:bg-blue hover:text-gray-900 transition-colors duration-300"
      >
        {loading ? "Carregando..." : "Atualizar Estatísticas"}
      </button>
    </div>
  );
};

export default EditarJogador;
