"use client";

import { useEffect, useState } from "react";
import { db, collection, getDocs } from "../../firebase";
import { Crown } from "lucide-react";

interface Jogador {
  nome: string;
  posicao: string;
  pontuacao: number;
  assistencias: number;
  rebotes: number;
  erros: number;
  faltas: number;
  roubos: number;
}

const RankingJogadores: React.FC = () => {
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [jogadoresFiltrados, setJogadoresFiltrados] = useState<Jogador[]>([]);

  // Filtros
  const [filtroPosicao, setFiltroPosicao] = useState<string>("");
  const [filtroOrdenacao, setFiltroOrdenacao] =
    useState<string>("pontuacaoDesc");

  useEffect(() => {
    const fetchJogadores = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "times"));
        const jogadoresList: Jogador[] = [];

        if (querySnapshot.empty) return;

        for (const docSnap of querySnapshot.docs) {
          const data = docSnap.data();
          const jogadoresData = data.Jogadores;

          for (let i = 1; i <= 5; i++) {
            const jogadorKey = `Jogador${i}`;
            const jogadorData = jogadoresData[jogadorKey];

            if (jogadorData) {
              jogadoresList.push({
                nome: jogadorData.Nome,
                posicao: jogadorData.Posição,
                pontuacao: jogadorData.pontuacao || 0,
                assistencias: jogadorData.assistencias || 0,
                rebotes: jogadorData.rebotes || 0,
                erros: jogadorData.erros || 0,
                faltas: jogadorData.faltas || 0,
                roubos: jogadorData.roubos || 0,
              });
            }
          }
        }

        setJogadores(jogadoresList);
        setJogadoresFiltrados(jogadoresList);
      } catch (error) {
        console.error("Erro ao carregar os jogadores:", error);
      }
    };

    fetchJogadores();
  }, []);

  const resetarFiltros = () => {
    setFiltroPosicao("");
    setFiltroOrdenacao("pontuacaoDesc");
    setJogadoresFiltrados(jogadores); // Restaura a lista original
  };

  const aplicarFiltros = () => {
    let jogadoresFiltrados = [...jogadores];

    if (filtroPosicao) {
      jogadoresFiltrados = jogadoresFiltrados.filter((jogador) =>
        jogador.posicao.toLowerCase().includes(filtroPosicao.toLowerCase())
      );
    }

    const ordenar = (key: keyof Jogador, asc: boolean) => {
      jogadoresFiltrados.sort((a, b) => {
        const valorA = Number(a[key]);
        const valorB = Number(b[key]);

        return asc ? valorA - valorB : valorB - valorA;
      });
    };

    const ordem = {
      pontuacaoDesc: () => ordenar("pontuacao", false),
      pontuacaoAsc: () => ordenar("pontuacao", true),
      rebotesDesc: () => ordenar("rebotes", false),
      rebotesAsc: () => ordenar("rebotes", true),
      assistenciasDesc: () => ordenar("assistencias", false),
      assistenciasAsc: () => ordenar("assistencias", true),
      errosDesc: () => ordenar("erros", false),
      errosAsc: () => ordenar("erros", true),
      faltasDesc: () => ordenar("faltas", false),
      faltasAsc: () => ordenar("faltas", true),
      roubosDesc: () => ordenar("roubos", false),
      roubosAsc: () => ordenar("roubos", true),
    };

    ordem[filtroOrdenacao as keyof typeof ordem]?.();
    setJogadoresFiltrados(jogadoresFiltrados);
  };

  return (
    <div className="bg-gray-700 border border-gray-600 rounded-2xl p-6 w-full ">
      <div className="flex items-center justify-center mb-10 items-center">
        <Crown size={30} />
        <h2 className="font-heading font-semibold text-gray-200 ml-2 text-xl sm:text-3xl uppercase">
          Ranking Jogadores
        </h2>
      </div>

      {/* Filtros */}
      <div className="space-y-4 flex md:flex-row flex-col justify-between w-full">
        <div className="flex flex-wrap md:flex-nowrap justify-center gap-2 sm:gap-4">
          <select
            value={filtroPosicao}
            onChange={(e) => setFiltroPosicao(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-gray-600 text-white w-full"
          >
            <option value="">Filtrar por Posição</option>
            <option value="Point Guard">Point Guard</option>
            <option value="Shooting Guard">Shooting Guard</option>
            <option value="Small Forward">Small Forward</option>
            <option value="Power Forward">Power Forward</option>
            <option value="Center">Center</option>
          </select>

          <select
            value={filtroOrdenacao}
            onChange={(e) => setFiltroOrdenacao(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-gray-600 text-white w-full"
          >
            <option value="pontuacaoDesc">Pontuação (Maior para Menor)</option>
            <option value="pontuacaoAsc">Pontuação (Menor para Maior)</option>
            <option value="rebotesDesc">Rebotes (Maior para Menor)</option>
            <option value="rebotesAsc">Rebotes (Menor para Maior)</option>
            <option value="assistenciasDesc">
              Assistências (Maior para Menor)
            </option>
            <option value="assistenciasAsc">
              Assistências (Menor para Maior)
            </option>
            <option value="errosDesc">Erros (Maior para Menor)</option>
            <option value="errosAsc">Erros (Menor para Maior)</option>
            <option value="faltasDesc">Faltas (Maior para Menor)</option>
            <option value="faltasAsc">Faltas (Menor para Maior)</option>
            <option value="roubosDesc">Roubos (Maior para Menor)</option>
            <option value="roubosAsc">Roubos (Menor para Maior)</option>
          </select>
        </div>
        <div className="flex justify-between w-full md:max-w-sm">
          <button
            onClick={resetarFiltros}
            className="px-5 h-12 bg-gray-500 text-danger font-semibold rounded-xl w-auto cursor-pointer hover:bg-danger hover:text-gray-900 transition-colors duration-300 mb-4"
          >
            Resetar Filtros
          </button>
          <button
            onClick={aplicarFiltros}
            className="px-5 h-12 bg-gray-500 text-blue font-semibold rounded-xl w-auto cursor-pointer hover:bg-blue hover:text-gray-900 transition-colors duration-300 mb-4"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>

      {/* Tabela com Scroll no Mobile */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-gray-200">
          <thead>
            <tr className="bg-gray-600">
              <th className="px-2 py-2">Jogador</th>
              <th className="px-2 py-2">Posição</th>
              <th className="px-2 py-2">Pontos</th>
              <th className="px-2 py-2">Assistências</th>
              <th className="px-2 py-2">Rebotes</th>
              <th className="px-2 py-2">Erros</th>
              <th className="px-2 py-2">Faltas</th>
              <th className="px-2 py-2">Roubos</th>
            </tr>
          </thead>
          <tbody>
            {jogadoresFiltrados.map((jogador, index) => (
              <tr
                key={index}
                className="text-center hover:bg-gray-100 hover:text-black"
              >
                <td className="px-2 py-2 border-b">{jogador.nome}</td>
                <td className="px-2 py-2 border-b">{jogador.posicao}</td>
                <td className="px-2 py-2 border-b">{jogador.pontuacao}</td>
                <td className="px-2 py-2 border-b">{jogador.assistencias}</td>
                <td className="px-2 py-2 border-b">{jogador.rebotes}</td>
                <td className="px-2 py-2 border-b">{jogador.erros}</td>
                <td className="px-2 py-2 border-b">{jogador.faltas}</td>
                <td className="px-2 py-2 border-b">{jogador.roubos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RankingJogadores;
