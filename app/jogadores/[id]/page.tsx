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
}

const PaginaJogador: React.FC = () => {
  const { id } = useParams();
  const [jogador, setJogador] = useState<Jogador | null>(null);

  useEffect(() => {
    const fetchJogador = async () => {
      if (!id) return;
      try {
        const timesRef = collection(db, "times");
        const timesSnap = await getDocs(timesRef);
        if (timesSnap.empty) return;

        for (const timeDoc of timesSnap.docs) {
          const timeNome = timeDoc.id;
          const jogadoresRef = doc(db, `times/${timeNome}`);
          const jogadoresSnap = await getDoc(jogadoresRef);
          if (jogadoresSnap.exists()) {
            const jogadoresData = jogadoresSnap.data().Jogadores;
            for (const jogadorKey in jogadoresData) {
              const jogadorInfo = jogadoresData[jogadorKey];
              if (jogadorInfo.Nome === id) {
                setJogador({ ...jogadorInfo, Time: timeNome });
                return;
              }
            }
          }
        }
      } catch (error) {
        console.error("Erro ao buscar jogador:", error);
      }
    };
    fetchJogador();
  }, [id]);

  if (!jogador)
    return (
      <p className="text-gray-300 text-center text-xl mt-10">Carregando...</p>
    );

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 p-6">
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
              <Target className="mr-2 text-blue-500" /> Pontos:{" "}
              <span className="font-bold text-white ml-1">
                {jogador.Pontuação ?? 0}
              </span>
            </p>
            <p className="flex items-center">
              <MoveHorizontal className="mr-2 text-purple-400" /> Assistências:{" "}
              <span className="font-bold text-white ml-1">
                {jogador.Assistências ?? 0}
              </span>
            </p>
            <p className="flex items-center">
              <Shield className="mr-2 text-gray-200" /> Rebotes:{" "}
              <span className="font-bold text-white ml-1">
                {jogador.Rebotes ?? 0}
              </span>
            </p>
            <p className="flex items-center">
              <AlertCircle className="mr-2 text-red-500" /> Erros:{" "}
              <span className="font-bold text-red-500 ml-1">
                {jogador.Erros ?? 0}
              </span>
            </p>
            <p className="flex items-center">
              <AlertCircle className="mr-2 text-red-500" /> Faltas:{" "}
              <span className="font-bold text-red-500 ml-1">
                {jogador.Faltas ?? 0}
              </span>
            </p>
            <p className="flex items-center">
              <MoveHorizontal className="mr-2 text-purple-400" /> Roubos:{" "}
              <span className="font-bold text-white ml-1">
                {jogador.Roubos ?? 0}
              </span>
            </p>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button className="flex items-center bg-blue-500 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-full transition duration-300">
            <UserPlus className="mr-2" /> Seguir
          </button>
          <button className="flex items-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full transition duration-300">
            <MessageCircle className="mr-2" /> Mensagem
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginaJogador;
