"use client";

import { useEffect, useState } from "react";
import { db, collection, getDocs } from "../../firebase";
import { Crown } from "lucide-react";

type Jogador = {
  nome: string;
  posicao: string;
  pontuacao: number;
  assistencias: number;
  rebotes: number;
  erros: number;
  faltas: number;
  roubos: number;
  jogos: number;

  // Médias por jogo
  ppg: number;
  apg: number;
  rpg: number;
  spg: number;
  tpg: number;
  fpg: number;
  tppg: number;

  // Arremessos
  fgm: number;
  fga: number;
  tpm: number;
  tpa: number;
  ftm: number;
  fta: number;

  // Percentuais de acerto
  fgPerc: number; // Field Goal Percentage
  tpPerc: number; // Three-Point Percentage
  ftPerc: number; // Free Throw Percentage
};

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
              const jogos = jogadorData.Jogos || 1; // Evitar divisão por zero

              const fga = jogadorData.fga || 0;
              const fgm = jogadorData.fgm || 0;
              const tpa = jogadorData.tpa || 0;
              const tpm = jogadorData.tpm || 0;
              const fta = jogadorData.fta || 0;
              const ftm = jogadorData.ftm || 0;

              jogadoresList.push({
                nome: jogadorData.Nome,
                posicao: jogadorData.Posição,
                pontuacao: jogadorData.pontuacao || 0,
                assistencias: jogadorData.assistencias || 0,
                rebotes: jogadorData.rebotes || 0,
                erros: jogadorData.erros || 0,
                faltas: jogadorData.faltas || 0,
                roubos: jogadorData.roubos || 0,
                jogos: jogos,
                

                // Médias por jogo
                ppg: (jogadorData.pontuacao || 0) / jogos,
                apg: (jogadorData.assistencias || 0) / jogos,
                rpg: (jogadorData.rebotes || 0) / jogos,
                spg: (jogadorData.roubos || 0) / jogos,
                tpg: (jogadorData.erros || 0) / jogos,
                fpg: (jogadorData.faltas || 0) / jogos,
                tppg: (jogadorData.tpm || 0) / jogos,

                // Arremessos
                fgm: fgm,
                fga: fga,
                tpm: tpm,
                tpa: tpa,
                ftm: ftm,
                fta: fta,

                // Cálculo dos percentuais
                fgPerc: fga > 0 ? Number(((fgm / fga) * 100).toFixed(0)) : 0,
                tpPerc: tpa > 0 ? Number(((tpm / tpa) * 100).toFixed(0)) : 0,
                ftPerc: fta > 0 ? Number(((ftm / fta) * 100).toFixed(0)) : 0,
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

      // Ordenações por média por jogo
      ppgDesc: () => ordenar("ppg", false),
      ppgAsc: () => ordenar("ppg", true),
      apgDesc: () => ordenar("apg", false),
      apgAsc: () => ordenar("apg", true),
      rpgDesc: () => ordenar("rpg", false),
      rpgAsc: () => ordenar("rpg", true),
      spgDesc: () => ordenar("spg", false),
      spgAsc: () => ordenar("spg", true),
      tpgDesc: () => ordenar("tpg", false),
      tpgAsc: () => ordenar("tpg", true),
      fpgDesc: () => ordenar("fpg", false),
      fpgAsc: () => ordenar("fpg", true),

      // Ordenações pelos percentuais de arremesso
      fgPercDesc: () => ordenar("fgPerc", false),
      fgPercAsc: () => ordenar("fgPerc", true),
      tpPercDesc: () => ordenar("tpPerc", false),
      tpPercAsc: () => ordenar("tpPerc", true),
      ftPercDesc: () => ordenar("ftPerc", false),
      ftPercAsc: () => ordenar("ftPerc", true),
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
            <option value="ppgDesc">Pontuação Média (Maior para Menor)</option>
            <option value="ppgAsc">Pontuação Média (Menor para Maior)</option>
            <option value="rebotesDesc">Rebotes (Maior para Menor)</option>
            <option value="rebotesAsc">Rebotes (Menor para Maior)</option>
            <option value="rpgDesc">Rebotes Média (Maior para Menor)</option>
            <option value="rpgAsc">Rebotes Média (Menor para Maior)</option>
            <option value="assistenciasDesc">
              Assistências (Maior para Menor)
            </option>
            <option value="assistenciasAsc">
              Assistências (Menor para Maior)
            </option>
            <option value="apgDesc">
              Assistências Média (Maior para Menor)
            </option>
            <option value="apgAsc">
              Assistências Média (Menor para Maior)
            </option>
            <option value="errosDesc">Erros (Maior para Menor)</option>
            <option value="errosAsc">Erros (Menor para Maior)</option>
            <option value="faltasDesc">Faltas (Maior para Menor)</option>
            <option value="faltasAsc">Faltas (Menor para Maior)</option>
            <option value="roubosDesc">Roubos (Maior para Menor)</option>
            <option value="roubosAsc">Roubos (Menor para Maior)</option>
            <option value="spgDesc">Roubos Média (Maior para Menor)</option>
            <option value="spgAsc">Roubos Média (Menor para Maior)</option>
            <option value="tpPercDesc">3P Porcentagem (Maior para Menor)</option>
            <option value="tpPercAsc">3P Porcentagem (Menor para Maior)</option>
            <option value="fgPercDesc">FG Porcentagem (Maior para Menor)</option>
            <option value="fgPercAsc">FG Porcentagem (Menor para Maior)</option>
            <option value="ftPercDesc">FT Porcentagem (Maior para Menor)</option>
            <option value="ftPercAsc">FT Porcentagem (Menor para Maior)</option>
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
              <th className="px-2 py-2">POS</th>
              <th className="px-2 py-2">JGS</th>
              <th className="px-2 py-2">PTS</th>
              <th className="px-2 py-2">PPG</th>
              <th className="px-2 py-2">AST</th>
              <th className="px-2 py-2">APG</th>
              <th className="px-2 py-2">REB</th>
              <th className="px-2 py-2">RPG</th>
              <th className="px-2 py-2">TO</th>
              <th className="px-2 py-2">TPG</th>
              <th className="px-2 py-2">STL</th>
              <th className="px-2 py-2">SPG</th>
              <th className="px-2 py-2">FALTAS</th>
              <th className="px-2 py-2">3PG</th>
              <th className="px-2 py-2">3PM</th>
              <th className="px-2 py-2">FGM</th>
              <th className="px-2 py-2">FTM</th>
            </tr>
          </thead>
          <tbody>
            {jogadoresFiltrados.map((jogador, index) => (
              <tr
                key={index}
                className="text-center hover:bg-gray-100 hover:text-black"
              >
                <td className="px-2 py-2 border-b">
                  <a
                    href={`/jogadores/${encodeURIComponent(jogador.nome)}`}
                    className="text-blue-400 hover:underline"
                  >
                    {jogador.nome}
                  </a>
                </td>
                <td className="px-2 py-2 border-b">{jogador.posicao}</td>
                <td className="px-2 py-2 border-b">{jogador.jogos}</td>
                <td className="px-2 py-2 border-b">{jogador.pontuacao}</td>
                <td className="px-2 py-2 border-b">{jogador.ppg}</td>
                <td className="px-2 py-2 border-b">{jogador.assistencias}</td>
                <td className="px-2 py-2 border-b">{jogador.apg}</td>
                <td className="px-2 py-2 border-b">{jogador.rebotes}</td>
                <td className="px-2 py-2 border-b">{jogador.rpg}</td>
                <td className="px-2 py-2 border-b">{jogador.erros}</td>
                <td className="px-2 py-2 border-b">{jogador.tpg}</td>
                <td className="px-2 py-2 border-b">{jogador.roubos}</td>
                <td className="px-2 py-2 border-b">{jogador.spg}</td>
                <td className="px-2 py-2 border-b">{jogador.faltas}</td>
                <td className="px-2 py-2 border-b">{jogador.tppg}</td>
                <td className="px-2 py-2 border-b">{jogador.tpPerc}%</td>
                <td className="px-2 py-2 border-b">{jogador.fgPerc}%</td>
                <td className="px-2 py-2 border-b">{jogador.ftPerc}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RankingJogadores;
