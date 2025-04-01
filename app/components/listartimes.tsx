"use client";

import { useEffect, useState } from "react";
import { db, collection, getDocs } from "../../firebase"; // Importando Firestore
import { Crown } from "lucide-react";

interface Time {
  id: string;
  nome: string;
  vitorias: number;
  derrotas: number;
  pontosFeitos: number;
  pontosRecebidos: number;
  jogadores: string[];
}

const ListarTimes: React.FC = () => {
  const [times, setTimes] = useState<Time[]>([]);

  useEffect(() => {
    const fetchTimes = async () => {
      const querySnapshot = await getDocs(collection(db, "times"));
      const timesData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          nome: data.Nome, // Pegando o nome do time
          vitorias: data.Vitorias, // Pegando o número de vitórias
          derrotas: data.Derrotas, // Pegando o número de derrotas
          pontosFeitos: data.pontosFeitos,
          pontosRecebidos: data.pontosRecebidos,
          jogadores: [
            data.Jogador1,
            data.Jogador2,
            data.Jogador3,
            data.Jogador4,
            data.Jogador5,
          ], // Pegando os nomes dos jogadores
        };
      }) as Time[];

      // Ordenar os times pela quantidade de vitórias (decrescente)
      timesData.sort((a, b) => {
        if (a.vitorias === b.vitorias) {
          // Caso as vitórias sejam iguais, ordena pelo número de pontos feitos
          return b.pontosFeitos - a.pontosFeitos;
        }
        return b.vitorias - a.vitorias;
      });

      setTimes(timesData);
    };

    fetchTimes();
  }, []);

  return (
    <div className="bg-gray-700 border border-gray-600 rounded-2xl p-8 space-y-6 h-auto w-full">
      <div className="flex items-center mb-6 justify-center">
        <Crown size={35} />
        <h2 className="font-heading font-semibold text-gray-200 ml-2.5 text-3xl uppercase ">
          Ranking Times
        </h2>
      </div>
      <table className="table-auto w-full text-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Time</th>
            <th className="px-4 py-2 border-b">Vitórias</th>
            <th className="px-4 py-2 border-b">Derrotas</th>
          </tr>
        </thead>
        <tbody>
          {times.map((time) => (
            <tr key={time.id} className="text-center">
              <td className="px-4 py-2 border-b">{time.nome}</td>
              <td className="px-4 py-2 border-b">{time.vitorias}</td>
              <td className="px-4 py-2 border-b">{time.derrotas}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListarTimes;
