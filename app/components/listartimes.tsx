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
          derrotas: data.Derrotas, // Pegando o número de
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

      setTimes(timesData);
    };

    fetchTimes();
  }, []);

  return (
    <div className=" bg-gray-700 border border-gray-600 rounded-2xl p-8 space-y-6 h-auto w-full">
      <div className="flex items-center align-middle mb-6 justify-center md:justify-start">
        <Crown size={35}/>
        <h2 className="font-heading font-semibold text-gray-200 ml-2.5 text-3xl uppercase">
          Ranking Times
        </h2>
      </div>
      <ul className="md:text-left text-center">
        {times.map((time) => (
          <li key={time.id}>
            <strong>{time.nome}</strong> - V: {time.vitorias} | D:{" "}
            {time.derrotas}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListarTimes;
