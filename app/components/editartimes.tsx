"use client";

import { useEffect, useState } from "react";

import { db } from "../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp,
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
    const vitorias =
      (dataAtual.vitorias || 0) + (dados.resultado === "vitoria" ? 1 : 0);
    const derrotas =
      (dataAtual.derrotas || 0) + (dados.resultado === "derrota" ? 1 : 0);
    const empates =
      (dataAtual.empates || 0) + (dados.resultado === "empate" ? 1 : 0);
    const jogosAtualizados = (dataAtual.jogos || 0) + 2;
    const pontos = vitorias * 3 + empates;

    const pontosFeitos = (dataAtual.pontosFeitos || 0) + dados.pontosFeitos;
    const pontosRecebidos =
      (dataAtual.pontosRecebidos || 0) + dados.pontosRecebidos;

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
    resultado: "vitoria" | "derrota" | "empate",
    timeAdversario: string,
    idJogo: string,
    dataJogo: Date,
    horario: string
  ) => {
    const jogadoresRef = collection(db, "times_v2", nomeTime, "jogadores");
    const snapshot = await getDocs(jogadoresRef);

    snapshot.forEach(async (docJogador) => {
      const jogadorRef = doc(
        db,
        "times_v2",
        nomeTime,
        "jogadores",
        docJogador.id
      );
      const dataJogador = docJogador.data();

      const jogosAtualizados = (dataJogador.jogos || 0) + 2;
      const vitorias =
        (dataJogador.vitorias || 0) + (resultado === "vitoria" ? 1 : 0);
      const derrotas =
        (dataJogador.derrotas || 0) + (resultado === "derrota" ? 1 : 0);
      const empates =
        (dataJogador.empates || 0) + (resultado === "empate" ? 1 : 0);

      await updateDoc(jogadorRef, {
        jogos: jogosAtualizados,
        vitorias,
        derrotas,
        empates,
      });

      // Histórico
      const dataFormatada = dataJogo
        .toISOString()
        .split("T")[0]
        .replace(/-/g, ""); // YYYYMMDD

      const historicoId = `${nomeTime
        .toLowerCase()
        .replace(/\s+/g, "-")}_vs_${timeAdversario
        .toLowerCase()
        .replace(/\s+/g, "-")}_${dataFormatada}`;

      const historicoRef = doc(
        db,
        "times_v2",
        nomeTime,
        "jogadores",
        docJogador.id,
        "historico",
        historicoId
      );
      const dataSP = new Date(dataJogo.getTime() - 3 * 60 * 60 * 1000);
      await setDoc(historicoRef, {
        data: Timestamp.fromDate(dataSP),
        horario,
        time: nomeTime,
        adversario: timeAdversario,
        placar: {
          [nomeTime]: pontosFeitos,
          [timeAdversario]: pontosRecebidos,
        },
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

    const { time1, time2, horario } = jogo;

    // Soma total dos pontos
    const totalTime1Jogo1 = pontuacaoTime1Jogo1;
    const totalTime2Jogo1 = pontuacaoTime2Jogo1;
    const totalTime1Jogo2 = pontuacaoTime1Jogo2;
    const totalTime2Jogo2 = pontuacaoTime2Jogo2;

    const isEmpateJogo1 = totalTime1Jogo1 === totalTime2Jogo1;
    const vencedorJogo1 =
      totalTime1Jogo1 > totalTime2Jogo1 ? time1 : isEmpateJogo1 ? null : time2;
    const perdedorJogo1 = vencedorJogo1 === time1 ? time2 : time1;

    const isEmpateJogo2 = totalTime1Jogo2 === totalTime2Jogo2;
    const vencedorJogo2 =
      totalTime1Jogo2 > totalTime2Jogo2 ? time1 : isEmpateJogo2 ? null : time2;
    const perdedorJogo2 = vencedorJogo2 === time1 ? time2 : time1;

    try {
      const jogoRef = doc(db, "calendario_v2", jogoSelecionado);
      await updateDoc(jogoRef, {
        placar: {
          jogo1: {
            [time1]: totalTime1Jogo1,

            [time2]: totalTime2Jogo1,
          },
          jogo2: {
            [time1]: totalTime1Jogo2,
            [time2]: totalTime2Jogo2,
          },
        },
      });

      // Atualizando os times
      await atualizarTime(time1, {
        pontosFeitos: totalTime1Jogo1 + totalTime1Jogo2,
        pontosRecebidos: totalTime2Jogo1 + totalTime2Jogo2,
        resultado:
          isEmpateJogo1 && isEmpateJogo2
            ? "empate"
            : vencedorJogo1 === time1 || vencedorJogo2 === time1
            ? "vitoria"
            : "derrota",
      });

      await atualizarTime(time2, {
        pontosFeitos: totalTime2Jogo1 + totalTime2Jogo2,
        pontosRecebidos: totalTime1Jogo1 + totalTime1Jogo2,
        resultado:
          isEmpateJogo1 && isEmpateJogo2
            ? "empate"
            : vencedorJogo2 === time2 || vencedorJogo1 === time2
            ? "vitoria"
            : "derrota",
      });

      const placarTime1 = totalTime1Jogo1 + totalTime1Jogo2;
      const placarTime2 = totalTime2Jogo1 + totalTime2Jogo2;

      let resultadoTime1: "vitoria" | "derrota" | "empate";
      let resultadoTime2: "vitoria" | "derrota" | "empate";

      if (placarTime1 > placarTime2) {
        resultadoTime1 = "vitoria";
        resultadoTime2 = "derrota";
      } else if (placarTime1 < placarTime2) {
        resultadoTime1 = "derrota";
        resultadoTime2 = "vitoria";
      } else {
        resultadoTime1 = "empate";
        resultadoTime2 = "empate";
      }

      await atualizarJogadores(
        time1,
        totalTime1Jogo1 + totalTime1Jogo2,
        totalTime2Jogo1 + totalTime2Jogo2,
        resultadoTime1,
        time2,
        jogoSelecionado,
        new Date(),
        horario // <- Aqui ele vai puxar "13:00" do banco
      );
      
      await atualizarJogadores(
        time2,
        totalTime2Jogo1 + totalTime2Jogo2,
        totalTime1Jogo1 + totalTime1Jogo2,
        resultadoTime2,
        time1,
        jogoSelecionado,
        new Date(),
        horario
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
    <div className="p-6 max-w-3xl mx-auto bg-gray-900 rounded-xl shadow-2xl">
      <ToastContainer />
      <h2 className="text-3xl font-semibold text-blue-400 mb-8 uppercase tracking-wider text-center">
        Registrar Resultado
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="mb-6">
          <label className="block text-gray-200 text-lg mb-2">
            Selecione o jogo:
          </label>
          <select
            value={jogoSelecionado}
            onChange={(e) => setJogoSelecionado(e.target.value)}
            className="w-full p-4 rounded-xl bg-gray-800 text-white text-lg focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300 hover:ring-2"
          >
            <option value="">Escolha um jogo</option>
            {jogos.map((jogo) => (
              <option key={jogo.id} value={jogo.id}>
                {jogo.time1} vs {jogo.time2} - {jogo.data}
              </option>
            ))}
          </select>
        </div>

        {jogoSelecionado && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <label className="block text-gray-200 text-lg mb-2">
                {jogos.find((jogo) => jogo.id === jogoSelecionado)?.time1} -
                Jogo 1:
              </label>
              <input
                type="number"
                onChange={(e) => setPontuacaoTime1Jogo1(Number(e.target.value))}
                className="w-full p-4 rounded-xl bg-gray-800 text-white text-lg focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300 hover:ring-2"
              />
              <label className="block text-gray-200 text-lg mt-4 mb-2">
                {jogos.find((jogo) => jogo.id === jogoSelecionado)?.time1} -
                Jogo 2:
              </label>
              <input
                type="number"
                onChange={(e) => setPontuacaoTime1Jogo2(Number(e.target.value))}
                className="w-full p-4 rounded-xl bg-gray-800 text-white text-lg focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300 hover:ring-2"
              />
            </div>

            <div>
              <label className="block text-gray-200 text-lg mb-2">
                {jogos.find((jogo) => jogo.id === jogoSelecionado)?.time2} -
                Jogo 1:
              </label>
              <input
                type="number"
                onChange={(e) => setPontuacaoTime2Jogo1(Number(e.target.value))}
                className="w-full p-4 rounded-xl bg-gray-800 text-white text-lg focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300 hover:ring-2"
              />
              <label className="block text-gray-200 text-lg mt-4 mb-2">
                {jogos.find((jogo) => jogo.id === jogoSelecionado)?.time2} -
                Jogo 2:
              </label>
              <input
                type="number"
                onChange={(e) => setPontuacaoTime2Jogo2(Number(e.target.value))}
                className="w-full p-4 rounded-xl bg-gray-800 text-white text-lg focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300 hover:ring-2"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gray-600 cursor-pointer hover:bg-blue text-white text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105"
        >
          {loading ? "Registrando..." : "Salvar Resultado"}
        </button>
      </form>
    </div>
  );
};

export default RegistrarResultado;
