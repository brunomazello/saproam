"use client";

import { useEffect, useState } from "react";
import { db, collection, getDocs } from "../../firebase"; // Importando Firestore
import { Crown, Trophy } from "lucide-react";
import Link from "next/link";

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
  jogos: number[];
}

const ListarTimes: React.FC = () => {
  const [times, setTimes] = useState<Time[]>([]);

  useEffect(() => {
    const fetchTimes = async () => {
      const querySnapshot = await getDocs(collection(db, "times"));
      const timesData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        console.log(data);
        const vitorias = data.Vitorias || 0;
        const derrotas = data.Derrotas || 0;
        const empates = data.Empates || 0;
        const pontos = data.Pontos || vitorias * 3 + empates * 1; // Correção: Vitória vale 3 pontos, empate vale 1
        const jogos = data.Jogos || 0;

        return {
          id: doc.id,
          nome: data.Nome,
          vitorias,
          derrotas,
          empates,
          pontos,
          jogos,
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
    <div className="bg-gray-700 border border-gray-600 rounded-2xl p-8 space-y-6 h-auto w-full overflow-x-auto">
      <div className="flex items-center mb-6 justify-center">
        <Crown size={35} />
        <h2 className="font-heading font-semibold text-gray-200 ml-2.5 text-3xl uppercase">
          Ranking Times
        </h2>
      </div>
      <table className="table-auto w-full text-gray-200 bg-black">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b flex justify-center">
              <Trophy />
            </th>
            {/* <- Nova coluna */}
            <th className="px-4 py-2 border-b">Time</th>
            <th className="px-4 py-2 border-b">J</th>
            <th className="px-4 py-2 border-b">V</th>
            <th className="px-4 py-2 border-b">E</th>
            <th className="px-4 py-2 border-b">D</th>
            <th className="px-4 py-2 border-b">P</th>
          </tr>
        </thead>

        <tbody>
          {times.map((time, index) => (
            <tr
              key={time.id}
              className={`text-center md:text-base ${
                index === times.length - 1
                  ? "bg-danger text-black"
                  : index >= 4
                  ? "bg-blue text-black"
                  : "bg-gray-200 text-black"
              }`}
            >
              <td className="px-2 py-2 border-b font-bold">{index + 1}</td>{" "}
              {/* <- Posição */}
              <td className="px-2 py-2 border-b font-semibold">
                <Link
                  href={`/times/${encodeURIComponent(time.nome)}`}
                  className="hover:underline text-blue-400"
                >
                  {time.nome}
                </Link>
              </td>
              <td className="px-2 py-2 border-b">{time.jogos}</td>
              <td className="px-2 py-2 border-b">{time.vitorias}</td>
              <td className="px-2 py-2 border-b">{time.empates}</td>
              <td className="px-2 py-2 border-b">{time.derrotas}</td>
              <td className="px-2 py-2 border-b">{time.pontos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListarTimes;
