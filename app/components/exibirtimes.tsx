"use client";

import { useEffect, useState } from "react";
import { db, collection, getDocs } from "../../firebase"; // Importando Firestore
import { User } from "lucide-react";

interface Jogador {
  nome: string;
  pontuacao: number;
  rebotes: number;
  assistencias: number;
  roubos: number;
  bloqueios: number;
  faltas: number;
  erros: number;
  posicao: string;
}

interface Time {
  id: string;
  Nome: string;
  Jogadores: Jogador[];
}

const POSICOES_ORDEM = [
  "Point Guard",  // PG
  "Shooting Guard", // SG
  "Small Forward",  // SF
  "Power Forward",  // PF
  "Center"          // C
];

const ExibirTimes: React.FC = () => {
  const [times, setTimes] = useState<Time[]>([]);

  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "times"));
        const timesData = querySnapshot.docs.map((doc) => {
          const timeData = doc.data();

          // Verifica se 'Jogadores' existe e é um objeto
          const jogadores = timeData.Jogadores
            ? Object.keys(timeData.Jogadores).map((key) => ({
                nome: timeData.Jogadores[key].Nome || "Desconhecido",
                pontuacao: timeData.Jogadores[key].pontuacao || 0,
                rebotes: timeData.Jogadores[key].rebotes || 0,
                assistencias: timeData.Jogadores[key].assistencias || 0,
                roubos: timeData.Jogadores[key].roubos || 0,
                bloqueios: timeData.Jogadores[key].bloqueios || 0,
                faltas: timeData.Jogadores[key].faltas || 0,
                erros: timeData.Jogadores[key].erros || 0,
                posicao: timeData.Jogadores[key].posicao || "N/A", // Posição do jogador
              }))
            // Ordena os jogadores pela posição definida em POSICOES_ORDEM
            .sort((a, b) => POSICOES_ORDEM.indexOf(a.posicao) - POSICOES_ORDEM.indexOf(b.posicao))
            : [];

          return { id: doc.id, Nome: timeData.Nome, Jogadores: jogadores };
        });

        setTimes(timesData);
      } catch (error) {
        console.error("Erro ao carregar os times:", error);
      }
    };

    fetchTimes();
  }, []);

  return (
    <div className=" bg-gray-700 border border-gray-600 rounded-2xl p-8 space-y-6 h-auto mt-6 w-full">
      <div className="flex items-center">
        <User size={35} />
        <h2 className="font-heading font-semibold text-gray-200 text-md ml-2.5 text-3xl uppercase">
          Times e Jogadores
        </h2>
      </div>
      {times.length === 0 ? (
        <p className="text-gray-500">Nenhum time registrado.</p>
      ) : (
        <div className="space-y-4">
          {times.map((time) => (
            <div key={time.id}>
              <h3 className="text-xl font-bold text-gray-200">{time.Nome}</h3>
              <ul className="text-gray-200 mt-6">
                {time.Jogadores.length > 0 ? (
                  time.Jogadores.map((jogador, index) => (
                    <li key={index} className="text-gray-400">
                      <span className="text-gray-200 font-semibold">
                        {jogador.nome}
                      </span>{" "}
                      - PTS: {jogador.pontuacao} | REB: {jogador.rebotes} | ASS:{" "}
                      {jogador.assistencias} | ROUBO: {jogador.roubos} |
                      BLOQUEIO: {jogador.bloqueios} | FALTA: {jogador.faltas} |
                      ERRO: {jogador.erros}
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">Nenhum jogador registrado.</p>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExibirTimes;
