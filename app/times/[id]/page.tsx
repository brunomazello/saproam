"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db, doc, getDoc } from "../../../firebase";
import { Users, Trophy, XCircle, BarChart3, SquareEqual } from "lucide-react";
import { Button } from "@/app/components/button";

interface Time {
  Nome: string;
  Vitorias: number;
  Derrotas: number;
  Jogos: number;
  Empates: number;
  Dono: string;
  PontosFeitos: number;
  PontosRecebidos: number;
}

const PaginaTime: React.FC = () => {
  const { id } = useParams();
  const timeId = decodeURIComponent(Array.isArray(id) ? id[0] : id ?? "");

  const [time, setTime] = useState<Time | null>(null);

  useEffect(() => {
    const fetchTime = async () => {
      if (!timeId) return;
      try {
        const timeRef = doc(db, `times_v2/${timeId}`); // Corrigido para 'times_v2'
        const timeSnap = await getDoc(timeRef);

        if (timeSnap.exists()) {
          const timeData = timeSnap.data();
          console.log("🔥 Dados do time encontrados:", timeData);

          setTime({
            Nome: timeData.nome || timeId, // usa o nome do Firestore se existir, senão o ID
            Vitorias: timeData.vitorias ?? 0,
            Derrotas: timeData.derrotas ?? 0,
            Jogos: timeData.jogos ?? 0,
            Empates: timeData.empates ?? 0,
            Dono: timeData.dono ?? "",
            PontosFeitos: timeData.pontosFeitos || 0,
            PontosRecebidos: timeData.pontosRecebidos || 0,
          });
        }
      } catch (error) {
        console.error("❌ Erro ao buscar dados do time:", error);
      }
    };

    fetchTime();
  }, [timeId]);

  if (!time)
    return (
      <p className="text-gray-300 text-center text-xl mt-10">Carregando...</p>
    );

  console.log("📊 Estatísticas do time:", time);

  return (
    <div className="flex justify-center items-center h-screen p-6">
      <div className="bg-gray-800 backdrop-blur-lg border border-gray-700 shadow-xl rounded-xl p-6 text-white text-center relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-blue-500 mb-2 font-heading drop-shadow-md">
            {time.Nome}
          </h1>
          <h1 className="text-lg text-gray-300 mb-4 font-sans flex items-center justify-center">
            GM: {time.Dono}
          </h1>
          <p className="text-lg text-gray-300 mb-4 font-sans flex items-center justify-center">
            <Users className="mr-2 text-purple-400" /> Estatísticas do Time
          </p>
        </div>

        <div className="bg-gray-700 p-4 rounded-xl shadow-lg border border-gray-600 relative z-10">
          <h2 className="text-xl font-semibold text-purple-400 mb-3 flex items-center justify-center font-heading">
            <BarChart3 className="mr-2" /> Estatísticas
          </h2>
          <div className="grid grid-cols-2 gap-3 text-gray-300 font-sans">
            <p className="flex items-center">
              <Users className="mr-2 text-blue-500" /> Jogos:
              <span className="font-bold text-white ml-1">{time.Jogos}</span>
            </p>
            <p className="flex items-center">
              <Trophy className="mr-2 text-yellow-400" /> Vitórias:
              <span className="font-bold text-white ml-1">{time.Vitorias}</span>
            </p>
            <p className="flex items-center">
              <XCircle className="mr-2 text-red-500" /> Derrotas:
              <span className="font-bold text-red-500 ml-1">
                {time.Derrotas}
              </span>
            </p>
            <p className="flex items-center">
              <SquareEqual className="mr-2 text-blue-500" /> Empates:
              <span className="font-bold text-white ml-1">{time.Empates}</span>
            </p>
            <p className="flex items-center">
              <SquareEqual className="mr-2 text-blue-500" /> Pontos Feitos:
              <span className="font-bold text-white ml-1">{time.PontosFeitos}</span>
            </p>
            <p className="flex items-center">
              <SquareEqual className="mr-2 text-blue-500" /> Pontos Recebidos:
              <span className="font-bold text-white ml-1">{time.PontosRecebidos}</span>
            </p>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button
            className=" bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 w-full cursor-pointer"
            onClick={() => (window.location.href = "/ranking")}
          >
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaginaTime;
