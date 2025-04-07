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

interface Jogador {
  Nome: string;
  pontuacao: number;
  [key: string]: any; // aceita outros campos como assistencias, bloqueios etc
}


const ListarTimes: React.FC = () => {
  const [times, setTimes] = useState<Time[]>([]);
  

  useEffect(() => {
    const fetchTimes = async () => {
      const timesSnapshot = await getDocs(collection(db, "times_v2"));
      const timesData: Time[] = [];
  
      for (const doc of timesSnapshot.docs) {
        const data = doc.data();
        console.log("DATA DO TIME:", data);
  
        const vitorias = data.vitorias || 0;
        const derrotas = data.derrotas || 0;
        const empates = data.empates || 0;
        const pontos = data.pontos || vitorias * 3 + empates;
        const jogos = data.jogos || 0;
        const pontosFeitos = data.pontosFeitos || 0;
        const pontosRecebidos = data.pontosRecebidos || 0;
  
        const jogadoresSnapshot = await getDocs(collection(db, "times_v2", doc.id, "jogadores"));
  
        const jogadoresArray: Jogador[] = jogadoresSnapshot.docs.map((jogadorDoc) => {
          const jogadorData = jogadorDoc.data();
  
          console.log("JOGADOR:", jogadorData);
  
          return {
            Nome: jogadorData.nome || jogadorData.Nome || "Desconhecido",
            posicao: jogadorData.posicao || jogadorData["Posição"] || "Desconhecida",
            pontuacao: jogadorData.pontuacao || 0,
            rebotes: jogadorData.rebotes || 0,
            assistencias: jogadorData.assistencias || 0,
            roubos: jogadorData.roubos || 0,
            bloqueios: jogadorData.bloqueios || 0,
            faltas: jogadorData.faltas || 0,
            erros: jogadorData.erros || 0,
          };
        });
  
        timesData.push({
          id: doc.id,
          nome: data.nome || "Sem Nome",
          vitorias,
          derrotas,
          empates,
          pontos,
          pontosFeitos,
          pontosRecebidos,
          jogadores: jogadoresArray.map((j) => j.Nome),
          jogos,
        });
      }
  
      // Ordenar
      timesData.sort((a, b) => {
        if (b.pontos !== a.pontos) return b.pontos - a.pontos;
        if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias;
        return b.pontosFeitos - a.pontosFeitos;
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
      <div className="overflow-x-auto w-full">
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
              <th className="px-4 py-2 border-b">PF</th>
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
                    : "bg-green text-black"
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
                <td className="px-2 py-2 border-b">{time.pontosFeitos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListarTimes;
