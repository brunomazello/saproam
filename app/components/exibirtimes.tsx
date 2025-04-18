"use client";

import { useEffect, useState } from "react";
import { db, collection, getDocs } from "../../firebase";
import { QueryDocumentSnapshot } from "firebase/firestore";
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
  Dono: string; // Adicionando a propriedade "Dono"
  Jogadores: Jogador[];
  Vitorias: number; // Campo para vitórias
  Derrotas: number; // Campo para derrotas
  Jogos: number;
  Empates: number;
}

const ordemPosicoes: { [key: string]: number } = {
  "Point Guard": 1, // PG
  "Shooting Guard": 2, // SG
  "Small Forward": 3, // SF
  "Power Forward": 4, // PF
  Center: 5, // C
};

const abreviacoesPosicoes: { [key: string]: string } = {
  "Point Guard": "PG",
  "Shooting Guard": "SG",
  "Small Forward": "SF",
  "Power Forward": "PF",
  Center: "C",
};

const ExibirTimes: React.FC = () => {
  const [times, setTimes] = useState<Time[]>([]);
  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const timesCollection = collection(db, "times_v2");
        const timesSnapshot = await getDocs(timesCollection);

        const timesData = await Promise.all(
          timesSnapshot.docs.map(async (doc) => {
            const timeId = doc.id;
            const timeData = doc.data();

            const jogadoresRef = collection(
              db,
              "times_v2",
              timeId,
              "jogadores"
            );
            const snapshot = await getDocs(jogadoresRef);

            const jogadores: Jogador[] = snapshot.docs
              .map((jogadorDoc) => {
                const jogador = jogadorDoc.data();

                console.log("Jogador nome:", jogador.nome);
                console.log("Jogador posição:", jogador.posicao);

                return {
                  nome: jogador.nome || "Desconhecido",
                  posicao: jogador.posicao || "Desconhecida",
                  pontuacao: jogador.pontuacao || 0,
                  rebotes: jogador.rebotes || 0,
                  assistencias: jogador.assistencias || 0,
                  roubos: jogador.roubos || 0,
                  bloqueios: jogador.bloqueios || 0,
                  faltas: jogador.faltas || 0,
                  erros: jogador.erros || 0,
                };
              })
              .sort(
                (a, b) =>
                  (ordemPosicoes[a.posicao] || 99) -
                  (ordemPosicoes[b.posicao] || 99)
              );

            return {
              id: timeId,
              Nome: timeData.nome || "Sem Nome",
              Dono: timeData.dono || "Desconhecido",
              Jogadores: jogadores,
              Vitorias: timeData.vitorias || 0,
              Derrotas: timeData.derrotas || 0,
              Jogos: timeData.jogos || 0,
              Empates: timeData.empates || 0,
              Pontos: timeData.pontos || 0,
              PontosFeitos: timeData.pontosFeitos || 0,
              PontosRecebidos: timeData.pontosRecebidos || 0,
            };
          })
        );

        setTimes(timesData);
      } catch (error) {
        console.error("Erro ao carregar os times:", error);
      }
    };

    fetchTimes();
  }, []);

  return (
    <div className="bg-gray-700 border border-gray-600 rounded-2xl p-8 space-y-6 h-auto mt-6 w-auto mt-12 md:mt-24">
      <div className="flex items-center md:flex-row flex-col justify-center">
        <User size={35} />
        <h2 className="font-heading font-semibold text-gray-200 text-md ml-2.5 md:text-3xl text-2xl md:mt-0 mt-6 uppercase">
          Times e Jogadores
        </h2>
      </div>
      {times.length === 0 ? (
        <p className="text-gray-500">Nenhum time registrado.</p>
      ) : (
        <div className="space-y-6">
          {times.map((time) => (
            <div key={time.id}>
              <div className="flex md:justify-between mb-2 flex-col md:flex-row">
                <h3 className="md:text-xl text-4xl mb-2 font-bold text-gray-200 md:text-left text-center mt-6">
                  {time.Nome}
                </h3>
                <h3 className="text-xl font-bold text-gray-200 md:text-left text-center md:mt-6">
                  {/* Exibindo Vitorias e Derrotas */}
                  <span className="inline-block bg-gray-900 text-white text-sm font-bold py-1 px-3 rounded-full">
                    J: {time.Jogos} - V: {time.Vitorias} - E: {time.Empates} -
                    D: {time.Derrotas}
                  </span>
                  {/* Badge do GM (Dono) */}
                  <span className="inline-block bg-gray-900 text-white text-sm font-bold py-1 px-3 rounded-full ml-2">
                    GM: {time.Dono}
                  </span>
                </h3>
              </div>
              {/* Versão Desktop */}
              <div className="hidden sm:block">
                <div className="overflow-x-auto">
                  <table className="w-full text-gray-200 border-collapse border border-gray-500">
                    <thead>
                      <tr className="bg-gray-600">
                        <th className="p-2 border border-gray-500 text-left">
                          Jogador
                        </th>
                        <th className="p-2 border border-gray-500">PTS</th>
                        <th className="p-2 border border-gray-500">REB</th>
                        <th className="p-2 border border-gray-500">ASS</th>
                        <th className="p-2 border border-gray-500">STL</th>
                        <th className="p-2 border border-gray-500">BLK</th>
                        <th className="p-2 border border-gray-500">FLT</th>
                        <th className="p-2 border border-gray-500">TO</th>
                      </tr>
                    </thead>
                    <tbody>
                      {time.Jogadores.length > 0 ? (
                        time.Jogadores.map((jogador, index) => (
                          <tr
                            key={index}
                            className="text-center bg-gray-800 hover:bg-gray-700"
                          >
                            <td className="p-2 border border-gray-500 text-left font-semibold">
                              {abreviacoesPosicoes[jogador.posicao] || "?"} -{" "}
                              {jogador.nome}
                            </td>
                            <td className="p-2 border border-gray-500">
                              {jogador.pontuacao}
                            </td>
                            <td className="p-2 border border-gray-500">
                              {jogador.rebotes}
                            </td>
                            <td className="p-2 border border-gray-500">
                              {jogador.assistencias}
                            </td>
                            <td className="p-2 border border-gray-500">
                              {jogador.roubos}
                            </td>
                            <td className="p-2 border border-gray-500">
                              {jogador.bloqueios}
                            </td>
                            <td className="p-2 border border-gray-500">
                              {jogador.faltas}
                            </td>
                            <td className="p-2 border border-gray-500">
                              {jogador.erros}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={8}
                            className="p-2 border border-gray-500 text-gray-500 text-center"
                          >
                            Nenhum jogador registrado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Versão Mobile */}
              <div className="sm:hidden space-y-4 border rounded-xl">
                {time.Jogadores.length > 0 ? (
                  time.Jogadores.map((jogador, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 p-6 rounded-lg shadow-xl hover:shadow-2xl transition duration-300 text-center"
                    >
                      <div className="flex items-center mb-2 justify-center flex-col">
                        <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
                          <span className="text-xl font-bold text-gray-200">
                            {abreviacoesPosicoes[jogador.posicao] || "?"}
                          </span>
                        </div>
                        <p className="mt-4 text-lg font-semibold text-gray-200">
                          {jogador.nome}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-gray-300 text-sm">
                        <div>
                          <p className="text-xs">PTS</p>
                          <p>{jogador.pontuacao}</p>
                        </div>
                        <div>
                          <p className="text-xs">REB</p>
                          <p>{jogador.rebotes}</p>
                        </div>
                        <div>
                          <p className="text-xs">ASS</p>
                          <p>{jogador.assistencias}</p>
                        </div>
                        <div>
                          <p className="text-xs">STL</p>
                          <p>{jogador.roubos}</p>
                        </div>
                        <div>
                          <p className="text-xs">BLK</p>
                          <p>{jogador.bloqueios}</p>
                        </div>
                        <div>
                          <p className="text-xs">TO</p>
                          <p>{jogador.erros}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Nenhum jogador registrado.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExibirTimes;
