"use client";

import { useState, useEffect } from "react";
import {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "../../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Jogador = {
  id: string;
  nome: string;
  pontuacao?: number;
  rebotes?: number;
  assistencias?: number;
  roubos?: number;
  bloqueios?: number;
  faltas?: number;
  erros?: number;
  fgm?: number;
  fga?: number;
  tpm?: number;
  tpa?: number;
  ftm?: number;
  fta?: number;
  [key: string]: any; // <- adiciona isso pra aceitar os extras
};

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
    fgm: 0,
    fga: 0,
    tpm: 0,
    tpa: 0,
    ftm: 0,
    fta: 0,
  });

  const [novasEstatisticas, setNovasEstatisticas] = useState<
    Partial<Omit<Jogador, "id" | "nome">>
  >({});
  const [jogosDoTime, setJogosDoTime] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [jogoSelecionado, setJogoSelecionado] = useState<any | null>(null);
  const [modoEdicao, setModoEdicao] = useState<"adicionar" | "remover">(
    "adicionar"
  );
  useEffect(() => {
    const fetchTimes = async () => {
      try {
        // Refere-se à coleção de times no Firestore
        const timesRef = collection(db, "times_v2");
        const snapshot = await getDocs(timesRef);
        const timesList = snapshot.docs.map((doc) => doc.id); // Você pode pegar o ID dos times ou os dados completos, dependendo do seu banco

        setTimes(timesList); // Atualiza o estado com os times
      } catch (error) {
        console.error("Erro ao carregar os times:", error);
        setError("Erro ao carregar os times.");
      }
    };

    fetchTimes();
  }, []); // Chama a função uma vez quando o componente for montado
  useEffect(() => {
    if (jogosDoTime.length > 0) {
      setJogoSelecionado(jogosDoTime[0]); // Seleciona o primeiro jogo por padrão
    }
  }, [jogosDoTime]);

  const fetchJogadores = async () => {
    if (!nomeTime) return;

    setLoading(true);
    setError(null);

    try {
      const jogadoresRef = collection(db, "times_v2", nomeTime, "jogadores");
      const snapshot = await getDocs(jogadoresRef);

      const listaJogadores: Jogador[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          nome: data.nome || "Sem nome",
          pontuacao: data.pontuacao || 0,
          rebotes: data.rebotes || 0,
          assistencias: data.assistencias || 0,
          roubos: data.roubos || 0,
          bloqueios: data.bloqueios || 0,
          faltas: data.faltas || 0,
          erros: data.erros || 0,
          fgm: data.fgm || 0,
          fga: data.fga || 0,
          tpm: data.tpm || 0,
          tpa: data.tpa || 0,
          ftm: data.ftm || 0,
          fta: data.fta || 0,
        };
      });

      setJogadores(listaJogadores);
    } catch (err) {
      setError("Erro ao carregar jogadores.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJogosDoTime = async (timeId: string) => {
    try {
      const calendarioRef = collection(db, "calendario_v2");
      const snapshot = await getDocs(calendarioRef);

      const jogosDoTime = snapshot.docs
        .filter((doc) => {
          const data = doc.data();
          // Normaliza para minúsculas e remove espaços extras para comparar
          const time1Normalized = data.time1.toLowerCase().trim();
          const time2Normalized = data.time2.toLowerCase().trim();
          const nomeTimeNormalized = timeId.toLowerCase().trim();

          return (
            time1Normalized === nomeTimeNormalized ||
            time2Normalized === nomeTimeNormalized
          );
        })
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

      console.log(jogosDoTime); // Verifique os jogos filtrados
      return jogosDoTime;
    } catch (error) {
      console.error("Erro ao buscar jogos do time:", error);
      return [];
    }
  };

  useEffect(() => {
    const buscarDados = async () => {
      if (!nomeTime) return;

      await fetchJogadores();

      const jogos = await fetchJogosDoTime(nomeTime);
      setJogosDoTime(jogos);
    };

    buscarDados();
  }, [nomeTime]);

  useEffect(() => {
    const jogador = jogadores.find((j) => j.id === jogadorSelecionado);
    setEstatisticas(
      jogador
        ? { ...jogador }
        : {
            pontuacao: 0,
            rebotes: 0,
            assistencias: 0,
            roubos: 0,
            bloqueios: 0,
            faltas: 0,
            erros: 0,
            fgm: 0,
            fga: 0,
            tpm: 0,
            tpa: 0,
            ftm: 0,
            fta: 0,
          }
    );
  }, [jogadorSelecionado, jogadores]);

  const atualizarEstatisticas = async () => {
    if (!nomeTime || !jogadorSelecionado || !jogoSelecionado) {
      toast.error("Todos os campos são obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      // Atualiza as estatísticas do jogador no time
      const jogadorRef = doc(
        db,
        "times_v2",
        nomeTime,
        "jogadores",
        jogadorSelecionado
      );
      const jogadorSnap = await getDoc(jogadorRef);

      if (!jogadorSnap.exists()) {
        toast.error("Jogador não encontrado.");
        return;
      }

      const dadosAtuais = jogadorSnap.data();

      const estatisticasAtualizadas = Object.keys(novasEstatisticas).reduce(
        (acc, key) => {
          const valorAtual = dadosAtuais[key] || 0;
          const valorNovo =
            novasEstatisticas[key as keyof typeof novasEstatisticas] || 0;
          acc[key] =
            modoEdicao === "adicionar"
              ? valorAtual + valorNovo
              : Math.max(0, valorAtual - valorNovo);
          return acc;
        },
        {} as Record<string, number>
      );

      // Atualiza as estatísticas do jogador dentro do time no Firestore
      await updateDoc(jogadorRef, estatisticasAtualizadas);

      // Agora, atualiza as estatísticas dentro do jogo no calendário (já feito anteriormente)
      const jogoRef = doc(
        db,
        "calendario_v2", // Coleção de jogos
        jogoSelecionado.id // Documento do jogo (como okc_vs_firewolf_20250407)
      );

      const jogoSnap = await getDoc(jogoRef);
      if (jogoSnap.exists()) {
        const dadosJogo = jogoSnap.data();

        const jogadoresNoJogo = dadosJogo.jogadores || {};
        if (jogadoresNoJogo[nomeTime]) {
          const jogadoresTime = jogadoresNoJogo[nomeTime];

          // Atualiza as estatísticas do jogador dentro do time
          jogadoresTime[jogadorSelecionado] = {
            ...jogadoresTime[jogadorSelecionado], // Mantém as estatísticas existentes
            ...estatisticasAtualizadas, // Atualiza com as novas estatísticas
          };

          // Atualiza as estatísticas no jogo
          await updateDoc(jogoRef, {
            [`jogadores.${nomeTime}`]: jogadoresTime, // Atualiza o time específico
          });

          toast.success("Estatísticas atualizadas com sucesso!");
        } else {
          toast.error("Time não encontrado no jogo.");
        }
      } else {
        toast.error("Jogo não encontrado no calendário.");
      }

      setNovasEstatisticas({}); // Limpa as novas estatísticas
      fetchJogadores(); // Recarrega os jogadores
    } catch (err) {
      console.error("Erro ao salvar as estatísticas:", err);
      setError("Erro ao salvar as estatísticas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <ToastContainer />
      <h2 className="font-heading font-semibold text-blue text-3xl mb-4 uppercase text-center md:text-left">
        Atualizar Estatísticas de Jogador
      </h2>

      {error && <p className="text-red-500">{error}</p>}

      {/* Passo 1: Selecionar Time */}
      <select
        value={nomeTime}
        onChange={(e) => {
          setNomeTime(e.target.value);
          setJogadorSelecionado(""); // reseta jogador ao mudar time
          setJogoSelecionado(null); // reseta jogo ao mudar time
        }}
        className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white mb-6"
      >
        <option value="">Selecione um time</option>
        {times.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>

      {/* Passo 2: Selecionar Data do Jogo */}
      {nomeTime && jogosDoTime.length > 0 && (
        <>
          <label className="text-gray-300">Selecione a data do jogo:</label>
          <select
            value={jogoSelecionado?.id || ""}
            onChange={(e) => {
              const jogo = jogosDoTime.find((j) => j.id === e.target.value);
              setJogoSelecionado(jogo || null);
            }}
            className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white mb-6"
          >
            {jogosDoTime.map((jogo) => (
              <option key={jogo.id} value={jogo.id}>
                {new Date(jogo.data).toLocaleDateString("pt-BR")} -{" "}
                {jogo.horario}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Passo 3: Detalhes do jogo selecionado */}
      {jogoSelecionado && (
        <div className="bg-gray-700 p-4 rounded mb-6 text-white">
          <p>
            <strong>Jogo Selecionado:</strong>
          </p>
          <p>Time 1: {jogoSelecionado.time1}</p>
          <p>Time 2: {jogoSelecionado.time2}</p>
          <p>
            Data: {new Date(jogoSelecionado.data).toLocaleDateString("pt-BR")}{" "}
            às {jogoSelecionado.horario}
          </p>
        </div>
      )}

      {/* Passo 4: Selecionar Jogador */}
      {jogoSelecionado && jogadores.length > 0 && (
        <select
          value={jogadorSelecionado}
          onChange={(e) => setJogadorSelecionado(e.target.value)}
          className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white mb-6"
        >
          <option value="">Selecione um jogador</option>
          {jogadores.map((jogador) => (
            <option key={jogador.id} value={jogador.id}>
              {jogador.nome}
            </option>
          ))}
        </select>
      )}

      {/* Passo 5: Campos de Estatísticas */}
      {jogoSelecionado && jogadorSelecionado && (
        <>
          {Object.keys(estatisticas).map((stat) => {
            const statKey = stat as keyof typeof estatisticas;
            return (
              <div key={stat} className="mb-4 w-full">
                <label className="block text-gray-300 capitalize">
                  {stat} (Atual: {estatisticas[statKey]})
                </label>
                <input
                  type="number"
                  placeholder={`Valor a ${
                    modoEdicao === "adicionar" ? "adicionar" : "remover"
                  }`}
                  value={novasEstatisticas[statKey] ?? ""}
                  onChange={(e) =>
                    setNovasEstatisticas((prev) => ({
                      ...prev,
                      [statKey]: Number(e.target.value),
                    }))
                  }
                  className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
                />
              </div>
            );
          })}
        </>
      )}
      {/* Passo 6: Botão para enviar as estatísticas */}
      {jogoSelecionado && jogadorSelecionado && (
        <div className="mt-6">
          <button
            onClick={atualizarEstatisticas}
            className="w-full p-3 bg-blue text-white rounded hover:bg-blue"
            disabled={loading} // Desabilita o botão enquanto está carregando
          >
            {loading ? "Atualizando..." : "Salvar Estatísticas"}
          </button>
        </div>
      )}
      {/* Caso nenhum jogo seja encontrado */}
      {nomeTime && jogosDoTime.length === 0 && (
        <p className="text-yellow-500">
          Nenhum jogo encontrado para esse time.
        </p>
      )}
    </div>
  );
};

export default EditarJogador;
