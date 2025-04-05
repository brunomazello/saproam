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
  jogos:number;
  vitorias: number;
  derrotas: number;
  empates: number;
}

const EditarJogadorCombine: React.FC = () => {
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
    jogos: 0,
    vitorias: 0,
    empates: 0,
    derrotas: 0,
  });

  const [novasEstatisticas, setNovasEstatisticas] = useState<
    Partial<Omit<Jogador, "id" | "nome">>
  >({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [modoEdicao, setModoEdicao] = useState<"adicionar" | "remover">(
    "adicionar"
  );

  const fetchJogadores = async () => {
    setLoading(true);
    setError(null);

    try {
      const jogadoresRef = doc(db, "combine", "jogadores");
      const snapshot = await getDoc(jogadoresRef);

      if (!snapshot.exists()) {
        setJogadores([]);
        return;
      }

      const data = snapshot.data();
      const lista = Object.keys(data).map((nome) => ({
        id: nome,
        nome,
        ...data[nome],
      }));

      setJogadores(lista);
    } catch (err) {
      setError("Erro ao carregar jogadores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJogadores();
  }, []);

  useEffect(() => {
    if (!jogadorSelecionado) {
      setEstatisticas({
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
        jogos: 0,
        vitorias: 0,
        empates: 0,
        derrotas: 0,
      });
      return;
    }

    const jogador = jogadores.find((j) => j.id === jogadorSelecionado);
    if (jogador) {
      setEstatisticas({
        jogos: jogador.jogos,
        vitorias: jogador.vitorias,
        derrotas: jogador.derrotas,
        empates:jogador.empates,
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

  const atualizarEstatisticas = async () => {
    if (!jogadorSelecionado) {
      toast.error("Selecione um jogador.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const jogadoresRef = doc(db, "combine", "jogadores");
      const snapshot = await getDoc(jogadoresRef);

      if (!snapshot.exists()) {
        setError("Documento de jogadores não encontrado.");
        return;
      }

      const data = snapshot.data();
      const jogadorAtual = data[jogadorSelecionado] || {};

      const jogadorAtualizado = (
        Object.keys(novasEstatisticas) as Array<keyof typeof novasEstatisticas>
      ).reduce((acc, key) => {
        const valorAtual = jogadorAtual[key] || 0;
        const valorNovo = novasEstatisticas[key] || 0;
      
        // Lógica de incremento ou decremento
        const valorFinal =
          modoEdicao === "adicionar"
            ? valorAtual + valorNovo
            : Math.max(0, valorAtual - valorNovo);
      
        return {
          ...acc,
          [key]: valorFinal,
        };
      }, jogadorAtual);
      
      // 👇 Adiciona à contagem de jogos
      if (modoEdicao === "adicionar") {
        const vitorias = novasEstatisticas.vitorias || 0;
        const derrotas = novasEstatisticas.derrotas || 0;
        const empates = novasEstatisticas.empates || 0; // se você tiver esse campo
      
        const totalJogosAdicionados = vitorias + derrotas + empates;
      
        jogadorAtualizado.jogos =
          (jogadorAtual.jogos || 0) + totalJogosAdicionados;
      } else {
        const vitorias = novasEstatisticas.vitorias || 0;
        const derrotas = novasEstatisticas.derrotas || 0;
        const empates = novasEstatisticas.empates || 0;
      
        const totalJogosRemovidos = vitorias + derrotas + empates;
      
        jogadorAtualizado.jogos = Math.max(
          0,
          (jogadorAtual.jogos || 0) - totalJogosRemovidos
        );
      }

      await updateDoc(jogadoresRef, {
        [jogadorSelecionado]: jogadorAtualizado,
      });

      toast.success("Estatísticas atualizadas com sucesso!");
      setNovasEstatisticas({});
      fetchJogadores();
    } catch (err) {
      setError("Erro ao atualizar estatísticas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <ToastContainer />
      <h2 className="font-heading font-semibold text-blue text-3xl mb-6 uppercase text-center md:text-left">
        Atualizar Estatísticas (Combine)
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {jogadores.length > 0 && (
        <select
          value={jogadorSelecionado}
          onChange={(e) => setJogadorSelecionado(e.target.value)}
          className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white mb-6"
        >
          <option value="">Selecione um jogador</option>
          {jogadores.map((j) => (
            <option key={j.id} value={j.id}>
              {j.nome}
            </option>
          ))}
        </select>
      )}

      {Object.keys(estatisticas).map((stat) => {
        const statKey = stat as keyof typeof estatisticas;

        return (
          <div key={stat} className="mb-4 w-full">
            <label className="block text-gray-300 capitalize">
              {stat} (Atual: {estatisticas[statKey]})
            </label>
            <input
              type="number"
              value={novasEstatisticas[statKey] ?? ""}
              onChange={(e) =>
                setNovasEstatisticas((prev) => ({
                  ...prev,
                  [statKey]: Number(e.target.value),
                }))
              }
              className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
              placeholder="Adicionar valor"
            />
          </div>
        );
      })}

      <button
        onClick={atualizarEstatisticas}
        disabled={loading}
        className="mt-6 w-full flex justify-center items-center px-5 h-12 bg-gray-500 text-blue font-semibold rounded-xl cursor-pointer hover:bg-blue hover:text-gray-900 transition-colors duration-300"
      >
        {loading ? "Carregando..." : "Atualizar Estatísticas"}
      </button>
    </div>
  );
};

export default EditarJogadorCombine;
