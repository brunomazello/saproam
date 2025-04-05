"use client";

import { useState, useEffect } from "react";
import { db, doc, getDoc, updateDoc } from "../../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  fgm: number;
  fga: number;
  tpm: number;
  tpa: number;
  ftm: number;
  fta: number;
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
    fgm: 0,
    fga: 0,
    tpm: 0,
    tpa: 0,
    ftm: 0,
    fta: 0,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [modoEdicao, setModoEdicao] = useState<"adicionar" | "remover">(
    "adicionar"
  );
  const [textoBotao, setTextoBotao] = useState(
    modoEdicao === "adicionar" ? "Modo: Adicionar" : "Modo: Remover"
  );

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

  const [novasEstatisticas, setNovasEstatisticas] = useState<
    Partial<Omit<Jogador, "id" | "nome">>
  >({});

  const fetchJogadores = async () => {
    setLoading(true);
    setError(null);

    // 🔹 Salvar o jogador atual antes da atualização
    const jogadorAtual = jogadorSelecionado;

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
          fgm: jogadoresData[key].fgm || 0,
          fga: jogadoresData[key].fga || 0,
          tpm: jogadoresData[key].tpm || 0,
          tpa: jogadoresData[key].tpa || 0,
          ftm: jogadoresData[key].ftm || 0,
          fta: jogadoresData[key].fta || 0,
        }));

        setJogadores(listaJogadores);

        // 🔹 Restaurar o jogador selecionado se ainda existir na lista
        const jogadorAindaExiste = listaJogadores.find(
          (j) => j.id === jogadorAtual
        );
        if (jogadorAindaExiste) {
          setJogadorSelecionado(jogadorAtual);
        }
      } else {
        setJogadores([]);
      }
    } catch (err) {
      setError("Erro ao carregar jogadores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!nomeTime) return;
    fetchJogadores();
  }, [nomeTime]);

  useEffect(() => {
    if (!jogadorSelecionado) {
      setEstatisticas({
        // Reseta estatísticas ao mudar de jogador
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
      return;
    }

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
        fgm: jogador.fgm,
        fga: jogador.fga,
        tpm: jogador.tpm,
        tpa: jogador.tpa,
        ftm: jogador.ftm,
        fta: jogador.fta,
      });
    }
  }, [jogadorSelecionado, jogadores]);

  const atualizarEstatisticas = async (
    estatisticas: Omit<Jogador, "id" | "nome">
  ) => {
    if (!nomeTime || !jogadorSelecionado) {
      toast.error("Todos os campos são obrigatórios.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const timeRef = doc(db, "times", nomeTime);
      const timeSnap = await getDoc(timeRef);

      if (!timeSnap.exists()) {
        setError("Time não encontrado.");
        return;
      }

      const timeData = timeSnap.data();
      const jogadoresData = timeData.Jogadores || {};

      const jogadorAtual = jogadoresData[jogadorSelecionado] || {};

      const jogadorAtualizado = (
        Object.keys(novasEstatisticas) as Array<keyof typeof novasEstatisticas>
      ).reduce(
        (acc, key) => ({
          ...acc,
          [key]:
            modoEdicao === "adicionar"
              ? (jogadorAtual[key] || 0) + (novasEstatisticas[key] || 0) // 🔹 Soma no modo "adicionar"
              : Math.max(
                  0,
                  (jogadorAtual[key] || 0) - (novasEstatisticas[key] || 0)
                ), // 🔹 Subtrai no modo "remover", sem valores negativos
        }),
        jogadorAtual
      );
      await updateDoc(timeRef, {
        [`Jogadores.${jogadorSelecionado}`]: jogadorAtualizado,
      });

      toast.success("Estatísticas salvas com sucesso!");
      setNovasEstatisticas({}); // Reseta os valores digitados após salvar
    } catch (err) {
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
      <div className="flex align-middle items-center justify-between w-full mb-10"></div>
      <select
        value={nomeTime}
        onChange={(e) => setNomeTime(e.target.value)}
        className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white mb-6"
      >
        <option value="">Selecione um time</option>
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
          className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white mb-6"
        >
          <option value="">Selecione um jogador</option>
          {jogadores.map((jogador) => (
            <option
              key={jogador.id}
              value={jogador.id}
              className="text-gray-300"
            >
              {jogador.nome}
            </option>
          ))}
        </select>
      )}
      {Object.keys(estatisticas).map((stat) => {
        const statKey = stat as keyof typeof estatisticas; // 🔹 Converte para uma chave válida

        return (
          <div key={stat} className="mb-4 w-full">
            <label className="block text-gray-300 capitalize">
              {stat} (Atual: {estatisticas[statKey]})
            </label>
            <input
              type="number"
              placeholder="Adicionar valor"
              value={novasEstatisticas[statKey] ?? ""} // 🔹 Evita `undefined`
              onChange={(e) =>
                setNovasEstatisticas((prev) => ({
                  ...prev,
                  [statKey]: Number(e.target.value), // 🔹 Mantém o tipo correto
                }))
              }
              className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
            />
          </div>
        );
      })}
      <button
        onClick={async () => {
          await atualizarEstatisticas(estatisticas); // Atualiza as estatísticas
          fetchJogadores(); // Atualiza os dados do jogador após a atualização
        }}
        disabled={loading}
        className="mt-6 w-full flex justify-center items-center px-5 h-12 bg-gray-500 text-blue font-semibold rounded-xl cursor-pointer hover:bg-blue hover:text-gray-900 transition-colors duration-300"
      >
        {loading ? "Carregando..." : "Atualizar Estatísticas"}
      </button>
    </div>
  );
};

export default EditarJogador;
