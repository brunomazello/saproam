"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db, collection, getDocs, doc, getDoc } from "../../../firebase";
import {
  Users,
  BarChart3,
  AlertCircle,
  Shield,
  MoveHorizontal,
  Target,
  MessageCircle,
  UserPlus,
} from "lucide-react";

import { Button } from "@/app/components/button";

interface Jogador {
  Nome: string;
  Posição: string;
  Time?: string;
  Pontuação?: number;
  Assistências?: number;
  Rebotes?: number;
  Erros?: number;
  Faltas?: number;
  Roubos?: number;
  Jogos?: number;
  tpm?: number;

}

const PaginaJogador: React.FC = () => {
  const { id } = useParams();
  const [jogador, setJogador] = useState<Jogador | null>(null);

  useEffect(() => {
    const fetchJogador = async () => {
      if (!id) return;
      try {
        const timesSnap = await getDocs(collection(db, "times_v2"));
        if (timesSnap.empty) return;
  
        for (const timeDoc of timesSnap.docs) {
          const timeNome = timeDoc.id;
  
          // Pegando subcoleção "jogadores"
          const jogadoresSnap = await getDocs(collection(db, `times_v2/${timeNome}/jogadores`));
  
          for (const jogadorDoc of jogadoresSnap.docs) {
            const jogadorInfo = jogadorDoc.data();
  
            if (
              jogadorInfo.Nome === id ||
              jogadorInfo.nome === id // caso o campo esteja em minúsculo
            ) {
              console.log("🔥 Dados do jogador encontrados:", jogadorInfo);
  
              setJogador({
                Nome: jogadorInfo.Nome || jogadorInfo.nome,
                Posição: jogadorInfo.posicao || jogadorInfo["Posição"] || "Desconhecida",
                Time: timeNome,
                Pontuação: jogadorInfo.pontuacao ?? 0,
                Assistências: jogadorInfo.assistencias ?? 0,
                Rebotes: jogadorInfo.rebotes ?? 0,
                Erros: jogadorInfo.erros ?? 0,
                Faltas: jogadorInfo.faltas ?? 0,
                Roubos: jogadorInfo.roubos ?? 0,
                Jogos: jogadorInfo.Jogos ?? 1,
                tpm: jogadorInfo.tpm ?? 0,
              });
  
              return;
            }
          }
        }
      } catch (error) {
        console.error("❌ Erro ao buscar jogador:", error);
      }
    };
    fetchJogador();
  }, [id]);
 

  if (!jogador)
    return (
      <p className="text-gray-300 text-center text-xl mt-10">Carregando...</p>
    );

  // 📌 Logs de depuração para conferir valores
  console.log("📊 Estatísticas do jogador:", jogador);

  // 🔥 Agora garantimos que `Jogos` nunca será zero ou undefined
  const jogos = jogador.Jogos ?? 1;
  const ppg = ((jogador.Pontuação ?? 0) / jogos).toFixed(1);
  const apg = ((jogador.Assistências ?? 0) / jogos).toFixed(1);
  const rpg = ((jogador.Rebotes ?? 0) / jogos).toFixed(1);
  const spg = ((jogador.Roubos ?? 0) / jogos).toFixed(1);
  const tpm = ((jogador.tpm ?? 0) / jogos).toFixed(1);
  const fpg = ((jogador.Faltas ?? 0) / jogos).toFixed(1);

  return (
    <div className="flex justify-center items-center h-screen p-6">
      <div className="bg-gray-800 backdrop-blur-lg border border-gray-700 shadow-xl rounded-xl p-6 w-96 text-white text-center relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-blue-500 mb-2 font-heading drop-shadow-md">
            {jogador.Nome}
          </h1>
          <p className="text-lg text-gray-300 mb-4 font-sans flex items-center justify-center">
            <Users className="mr-2 text-purple-400" /> {jogador.Time}
          </p>
        </div>

        <div className="bg-gray-700 p-4 rounded-xl shadow-lg border border-gray-600 relative z-10">
          <h2 className="text-xl font-semibold text-purple-400 mb-3 flex items-center justify-center font-heading">
            <BarChart3 className="mr-2" /> Estatísticas
          </h2>
          <div className="grid grid-cols-2 gap-3 text-gray-300 font-sans">
            <p className="flex items-center">
              <Target className="mr-2 text-blue-500" /> PPG:{" "}
              <span className="font-bold text-white ml-1">{ppg}</span>
            </p>
            <p className="flex items-center">
              <MoveHorizontal className="mr-2 text-purple-400" /> APG:{" "}
              <span className="font-bold text-white ml-1">{apg}</span>
            </p>
            <p className="flex items-center">
              <Shield className="mr-2 text-gray-200" /> RPG:{" "}
              <span className="font-bold text-white ml-1">{rpg}</span>
            </p>
            <p className="flex items-center">
              <MoveHorizontal className="mr-2 text-purple-400" /> SPG:{" "}
              <span className="font-bold text-white ml-1">{spg}</span>
            </p>
            <p className="flex items-center">
              <AlertCircle className="mr-2 text-red-500" /> 3PG:{" "}
              <span className="font-bold text-red-500 ml-1">{tpm}</span>
            </p>
            <p className="flex items-center">
              <AlertCircle className="mr-2 text-red-500" /> FPG:{" "}
              <span className="font-bold text-red-500 ml-1">{fpg}</span>
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

export default PaginaJogador;
