"use client";

import { useEffect, useState } from "react";
import { db, collection, getDocs } from "../../firebase"; // Importando Firestore
import { Crown } from "lucide-react";

interface Time {
  id: string;
  nome: string;
  vitorias: number;
  derrotas: number;
  empates: number;
  pontos: number;
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
        const vitorias = data.Vitorias || 0;
        const derrotas = data.Derrotas || 0;
        const empates = data.Empates || 0;
        const pontos = data.Pontos || (vitorias * 3 + empates * 1); // Correção: Vitória vale 3 pontos, empate vale 1

        return {
          id: doc.id,
          nome: data.Nome,
          vitorias,
          derrotas,
          empates,
          pontos,
          pontosFeitos: data.pontosFeitos || 0,
          pontosRecebidos: data.pontosRecebidos || 0,
          jogadores: [
            data.Jogador1,
            data.Jogador2,
            data.Jogador3,
            data.Jogador4,
            data.Jogador5,
          ],
        };
      }) as Time[];

      // Ordenar os times por pontos, depois por vitórias e depois por pontos feitos
      timesData.sort((a, b) => {
        if (b.pontos !== a.pontos) return b.pontos - a.pontos; // Primeiro ordena pelos pontos
        if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias; // Depois pelas vitórias
        return b.pontosFeitos - a.pontosFeitos; // Em último caso, pelos pontos feitos
      });

      setTimes(timesData);
    };

    fetchTimes();
  }, []);

  return (
    <div className="bg-gray-700 border border-gray-600 rounded-2xl p-8 space-y-6 h-auto w-full">
      <div className="flex items-center mb-6 justify-center">
        <Crown size={35} />
        <h2 className="font-heading font-semibold text-gray-200 ml-2.5 text-3xl uppercase">
          Ranking Times
        </h2>
      </div>
      <table className="table-auto w-full text-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Time</th>
            <th className="px-4 py-2 border-b">V</th>
            <th className="px-4 py-2 border-b">D</th>
            <th className="px-4 py-2 border-b">E</th> {/* Coluna de Empates */}
            <th className="px-4 py-2 border-b">PJ</th> {/* Coluna de Pontos */}
          </tr>
        </thead>
        <tbody>
          {times.map((time) => (
            <tr
              key={time.id}
              className="text-center hover:bg-gray-100 hover:text-black md:text-base"
            >
              <td className="px-2 py-2 border-b">{time.nome}</td>
              <td className="px-2 py-2 border-b">{time.vitorias}</td>
              <td className="px-2 py-2 border-b">{time.derrotas}</td>
              <td className="px-2 py-2 border-b">{time.empates}</td> {/* Exibindo Empates */}
              <td className="px-2 py-2 border-b">{time.pontos}</td> {/* Exibindo Pontos */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListarTimes;
