"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, doc, getDocs, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AlterarJogador = () => {
  const [times, setTimes] = useState<string[]>([]);
  const [timeSelecionado, setTimeSelecionado] = useState<string>("");
  const [jogadores, setJogadores] = useState<any[]>([]);
  const [jogadorSelecionado, setJogadorSelecionado] = useState<string>("");

  const [novoNome, setNovoNome] = useState<string>("");
  const [novaPosicao, setNovaPosicao] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Carregar nomes dos times
  const carregarTimes = async () => {
    const snapshot = await getDocs(collection(db, "times_v2"));
    const nomes = snapshot.docs.map((doc) => doc.id);
    setTimes(nomes);
  };

  // Carregar jogadores do time
  const carregarJogadores = async (time: string) => {
    const snapshot = await getDocs(collection(db, "times_v2", time, "jogadores"));
    const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setJogadores(lista);
  };

  useEffect(() => {
    carregarTimes();
  }, []);

  useEffect(() => {
    if (timeSelecionado) {
      carregarJogadores(timeSelecionado);
    } else {
      setJogadores([]);
    }
    setJogadorSelecionado("");
    setNovoNome("");
    setNovaPosicao("");
  }, [timeSelecionado]);

  useEffect(() => {
    const jogador = jogadores.find((j) => j.id === jogadorSelecionado);
    if (jogador) {
      setNovoNome(jogador.nome || "");
      setNovaPosicao(jogador.posicao || "");
    }
  }, [jogadorSelecionado]);

  const salvarAlteracoes = async () => {
    if (!timeSelecionado || !jogadorSelecionado) {
      toast.error("Selecione um time e um jogador.");
      return;
    }
  
    setLoading(true);
    try {
      const novoId = novoNome.toLowerCase().replace(/\s+/g, "");
      const jogadorAntigoRef = doc(db, "times_v2", timeSelecionado, "jogadores", jogadorSelecionado);
      const jogadorNovoRef = doc(db, "times_v2", timeSelecionado, "jogadores", novoId);
  
      // Cria novo documento com novo nome
      await setDoc(jogadorNovoRef, {
        nome: novoNome,
        posicao: novaPosicao,
      });
  
      // Deleta o documento antigo se o ID mudou
      if (jogadorSelecionado !== novoId) {
        await deleteDoc(jogadorAntigoRef);
      }
  
      toast.success("✅ Jogador atualizado com sucesso!");
      setJogadorSelecionado("");
      carregarJogadores(timeSelecionado);
    } catch (error) {
      toast.error("Erro ao atualizar jogador.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg mt-10">
      <ToastContainer />
      <h2 className="font-heading font-semibold text-blue text-3xl mb-8 uppercase text-center">
        Alterar Jogador
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          salvarAlteracoes();
        }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Time</label>
            <select
              value={timeSelecionado}
              onChange={(e) => setTimeSelecionado(e.target.value)}
              className="mt-1 w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600"
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
            <label className="block text-sm font-medium text-gray-300">Jogador</label>
            <select
              value={jogadorSelecionado}
              onChange={(e) => setJogadorSelecionado(e.target.value)}
              disabled={!timeSelecionado}
              className="mt-1 w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 disabled:opacity-50"
            >
              <option value="">Selecione um jogador</option>
              {jogadores.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-300">
              Nome do Jogador
            </label>
            <input
              type="text"
              id="nome"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              className="mt-1 w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600"
              disabled={!jogadorSelecionado}
            />
          </div>

          <div>
            <label htmlFor="posicao" className="block text-sm font-medium text-gray-300">
              Posição
            </label>
            <input
              type="text"
              id="posicao"
              value={novaPosicao}
              onChange={(e) => setNovaPosicao(e.target.value)}
              className="mt-1 w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600"
              placeholder="Ex: Atacante"
              disabled={!jogadorSelecionado}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !jogadorSelecionado}
          className="w-full h-12 bg-blue text-white cursor-pointer font-semibold rounded-md hover:bg-blue/90 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Salvando..." : "Salvar Alterações"}
        </button>
      </form>
    </div>
  );
};

export default AlterarJogador;
