"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegistrarResultado = () => {
  const [jogos, setJogos] = useState<any[]>([]);
  const [jogoSelecionado, setJogoSelecionado] = useState<string>("");

  // Novos estados para dois jogos
  const [pontuacaoTime1Jogo1, setPontuacaoTime1Jogo1] = useState<number>(0);
  const [pontuacaoTime1Jogo2, setPontuacaoTime1Jogo2] = useState<number>(0);
  const [pontuacaoTime2Jogo1, setPontuacaoTime2Jogo1] = useState<number>(0);
  const [pontuacaoTime2Jogo2, setPontuacaoTime2Jogo2] = useState<number>(0);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJogos = async () => {
      const snapshot = await getDocs(collection(db, "calendario_v2"));
      const listaJogos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJogos(listaJogos);
    };
    fetchJogos();
  }, []);

  const atualizarTime = async (nomeTime: string, dados: any) => {
    const timeRef = doc(db, "times_v2", nomeTime);
    const snap = await getDoc(timeRef);

    if (!snap.exists()) {
      toast.error(`❌ Time ${nomeTime} não encontrado.`);
      return;
    }

    const dataAtual = snap.data();
    const vitorias = (dataAtual.vitorias || 0) + (dados.resultado === "vitoria" ? 1 : 0);
    const derrotas = (dataAtual.derrotas || 0) + (dados.resultado === "derrota" ? 1 : 0);
    const empates = (dataAtual.empates || 0) + (dados.resultado === "empate" ? 1 : 0);
    const jogosAtualizados = (dataAtual.jogos || 0) + 2;
    const pontos = vitorias * 3 + empates;

    const pontosFeitos = (dataAtual.pontosFeitos || 0) + dados.pontosFeitos;
    const pontosRecebidos = (dataAtual.pontosRecebidos || 0) + dados.pontosRecebidos;

    await updateDoc(timeRef, {
      vitorias,
      derrotas,
      empates,
      jogos: jogosAtualizados,
      pontos,
      pontosFeitos,
      pontosRecebidos,
    });
  };

  const atualizarJogadores = async (
    nomeTime: string,
    pontosFeitos: number,
    pontosRecebidos: number,
    resultado: "vitoria" | "derrota" | "empate"
  ) => {
    const jogadoresRef = collection(db, "times_v2", nomeTime, "jogadores");
    const snapshot = await getDocs(jogadoresRef);

    snapshot.forEach(async (docJogador) => {
      const jogadorRef = doc(db, "times_v2", nomeTime, "jogadores", docJogador.id);
      const dataJogador = docJogador.data();

      const jogosAtualizados = (dataJogador.jogos || 0) + 2;
      const vitorias = (dataJogador.vitorias || 0) + (resultado === "vitoria" ? 1 : 0);
      const derrotas = (dataJogador.derrotas || 0) + (resultado === "derrota" ? 1 : 0);
      const empates = (dataJogador.empates || 0) + (resultado === "empate" ? 1 : 0);
      const feitos = (dataJogador.pontosFeitos || 0) + pontosFeitos;
      const recebidos = (dataJogador.pontosRecebidos || 0) + pontosRecebidos;

      await updateDoc(jogadorRef, {
        jogos: jogosAtualizados,
        vitorias,
        derrotas,
        empates,
        pontosFeitos: feitos,
        pontosRecebidos: recebidos,
      });
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jogoSelecionado) return;
    setLoading(true);

    const jogo = jogos.find((j) => j.id === jogoSelecionado);
    if (!jogo) {
      toast.error("Jogo não encontrado.");
      setLoading(false);
      return;
    }

    const { time1, time2 } = jogo;

    // Soma total dos pontos
    const totalTime1 = pontuacaoTime1Jogo1 + pontuacaoTime1Jogo2;
    const totalTime2 = pontuacaoTime2Jogo1 + pontuacaoTime2Jogo2;

    const isEmpate = totalTime1 === totalTime2;
    const vencedor = totalTime1 > totalTime2 ? time1 : isEmpate ? null : time2;
    const perdedor = vencedor === time1 ? time2 : time1;

    try {
      const jogoRef = doc(db, "calendario_v2", jogoSelecionado);
      await updateDoc(jogoRef, {
        placar: {
          [time1]: totalTime1,
          [time2]: totalTime2,
        },
      });

      await atualizarTime(time1, {
        pontosFeitos: totalTime1,
        pontosRecebidos: totalTime2,
        resultado: isEmpate ? "empate" : vencedor === time1 ? "vitoria" : "derrota",
      });

      await atualizarTime(time2, {
        pontosFeitos: totalTime2,
        pontosRecebidos: totalTime1,
        resultado: isEmpate ? "empate" : vencedor === time2 ? "vitoria" : "derrota",
      });

      await atualizarJogadores(
        time1,
        totalTime1,
        totalTime2,
        isEmpate ? "empate" : vencedor === time1 ? "vitoria" : "derrota"
      );

      await atualizarJogadores(
        time2,
        totalTime2,
        totalTime1,
        isEmpate ? "empate" : vencedor === time2 ? "vitoria" : "derrota"
      );

      toast.success("✅ Resultado registrado com sucesso!");
    } catch (err) {
      toast.error("❌ Erro ao registrar resultado.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-900 rounded-lg shadow-lg">
      <ToastContainer />
      <h2 className="text-2xl font-bold text-blue-400 mb-6 uppercase tracking-wider">
        Registrar Resultado
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-200 mb-1">Selecione o jogo:</label>
          <select
            value={jogoSelecionado}
            onChange={(e) => setJogoSelecionado(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 text-white"
          >
            <option value="">Escolha um jogo</option>
            {jogos.map((jogo) => (
              <option key={jogo.id} value={jogo.id}>
                {jogo.time1} vs {jogo.time2} - {jogo.data}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-200 mb-1">Jogo 1 - Time 1:</label>
            <input
              type="number"
              onChange={(e) => setPontuacaoTime1Jogo1(Number(e.target.value))}
              className="w-full p-3 rounded bg-gray-800 text-white"
            />
            <label className="block text-gray-200 mt-2 mb-1">Jogo 2 - Time 1:</label>
            <input
              type="number"
              onChange={(e) => setPontuacaoTime1Jogo2(Number(e.target.value))}
              className="w-full p-3 rounded bg-gray-800 text-white"
            />
          </div>

          <div>
            <label className="block text-gray-200 mb-1">Jogo 1 - Time 2:</label>
            <input
              type="number"
              onChange={(e) => setPontuacaoTime2Jogo1(Number(e.target.value))}
              className="w-full p-3 rounded bg-gray-800 text-white"
            />
            <label className="block text-gray-200 mt-2 mb-1">Jogo 2 - Time 2:</label>
            <input
              type="number"
              onChange={(e) => setPontuacaoTime2Jogo2(Number(e.target.value))}
              className="w-full p-3 rounded bg-gray-800 text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded transition duration-200"
        >
          {loading ? "Registrando..." : "Salvar Resultado"}
        </button>
      </form>
    </div>
  );
};

export default RegistrarResultado;
