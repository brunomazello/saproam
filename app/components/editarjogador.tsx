"use client";

import { useState, useEffect } from "react";
import { db, doc, getDoc, updateDoc } from "../../firebase"; // Importando Firestore

const AtualizarPontuacao: React.FC = () => {
  const [times, setTimes] = useState<string[]>([]);
  const [nomeTime, setNomeTime] = useState<string>("");
  const [jogadores, setJogadores] = useState<{ id: string; nome: string }[]>([]);
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
    setTimes(["Time Dos Amigos", "Outro Time"]); // Exemplo estático, substitua pela busca no Firestore
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
    <div>
      <h2>Atualizar Estatísticas de Jogador</h2>
      {error && <p className="text-red-500">{error}</p>}

      <div>
        <label>Nome do Time</label>
        <select value={nomeTime} onChange={(e) => setNomeTime(e.target.value)}>
          <option value="">Selecione um time</option>
          {times.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>

      {jogadores.length > 0 && (
        <div>
          <label>Jogador</label>
          <select
            value={jogadorSelecionado}
            onChange={(e) => setJogadorSelecionado(e.target.value)}
          >
            <option value="">Selecione um jogador</option>
            {jogadores.map((jogador) => (
              <option key={jogador.id} value={jogador.id}>
                {jogador.nome}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label>Pontuação</label>
        <input type="number" value={pontuacao} onChange={(e) => setPontuacao(Number(e.target.value))} />
      </div>

      <div>
        <label>Rebotes</label>
        <input type="number" value={rebotes} onChange={(e) => setRebotes(Number(e.target.value))} />
      </div>

      <div>
        <label>Assistências</label>
        <input type="number" value={assistencias} onChange={(e) => setAssistencias(Number(e.target.value))} />
      </div>

      <div>
        <label>Roubos</label>
        <input type="number" value={roubos} onChange={(e) => setRoubos(Number(e.target.value))} />
      </div>

      <div>
        <label>Bloqueios</label>
        <input type="number" value={bloqueios} onChange={(e) => setBloqueios(Number(e.target.value))} />
      </div>

      <div>
        <label>Faltas</label>
        <input type="number" value={faltas} onChange={(e) => setFaltas(Number(e.target.value))} />
      </div>

      <div>
        <label>Erros</label>
        <input type="number" value={erros} onChange={(e) => setErros(Number(e.target.value))} />
      </div>

      <button onClick={atualizarEstatisticas} disabled={loading}>
        {loading ? "Carregando..." : "Atualizar Estatísticas"}
      </button>
    </div>
  );
};

export default AtualizarPontuacao;
