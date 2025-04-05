import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { Button } from "./button";

interface Jogo {
  data: string;
  horario: string;
  time1: string;
  time2: string;
}

interface JogadoresTime {
  jogadores: string[];
}

type JogadorInfo = {
  nome: string;
  posicao: string;
};

type JogadoresPorJogo = {
  [index: number]: {
    time1ComInfo: JogadorInfo[];
    time2ComInfo: JogadorInfo[];
  };
};

const formatarData = (data: string): string => {
  const [ano, mes, dia] = data.split("-");
  return `${dia}-${mes}-${ano}`;
};

const posicaoOrdem = [
  "Point Guard",
  "Shooting Guard",
  "Small Forward",
  "Power Forward",
  "Center",
];

const abreviarPosicao = (posicao: string): string => {
  switch (posicao) {
    case "Point Guard":
      return "PG";
    case "Shooting Guard":
      return "SG";
    case "Small Forward":
      return "SF";
    case "Power Forward":
      return "PF";
    case "Center":
      return "C";
    default:
      return "";
  }
};

const ordenarPorPosicao = (
  jogadores: { nome: string; posicao: string }[]
): { nome: string; posicao: string }[] => {
  return jogadores.sort(
    (a, b) => posicaoOrdem.indexOf(a.posicao) - posicaoOrdem.indexOf(b.posicao)
  );
};

const Calendario = () => {
  const [jogosDoMes, setJogosDoMes] = useState<Jogo[]>([]);
  const [exibirJogos, setExibirJogos] = useState(5); // valor inicial padrão (mobile)
  const [jogosExpandidos, setJogosExpandidos] = useState<Set<number>>(
    new Set()
  );
  const [jogadoresPorJogo, setJogadoresPorJogo] = useState<JogadoresPorJogo>(
    {}
  );

  const formatarNomeTime = (nome: string) => {
    return nome
      .split(" ")
      .map((parte) =>
        parte === parte.toUpperCase()
          ? parte // mantém siglas
          : parte.charAt(0).toUpperCase() + parte.slice(1).toLowerCase()
      )
      .join(" ");
  };
  
  useEffect(() => {
    // Aumentar quantidade de jogos exibidos no desktop
    if (window.innerWidth >= 768) {
      setExibirJogos(10); // por exemplo: 10 no desktop
    }
  }, []);

  const toggleExpandir = async (index: number, jogo: Jogo) => {
    setJogosExpandidos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });

    const buscarJogadores = async (time: string): Promise<JogadorInfo[]> => {
      try {
        const docRef = doc(db, "times", formatarNomeTime(time));
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          const jogadores: JogadorInfo[] = [];

          for (const key in data.Jogadores) {
            const jogador = data.Jogadores[key];
            if (jogador?.Nome && jogador?.Posição) {
              jogadores.push({
                nome: jogador.Nome,
                posicao: jogador.Posição,
              });
            }
          }

          return jogadores;
        } else {
          console.warn(`Time "${time}" não encontrado.`);
          return [];
        }
      } catch (error) {
        console.error(`Erro ao buscar jogadores do time ${time}:`, error);
        return [];
      }
    };

    // Se ainda não buscamos os jogadores desse jogo
    if (!jogadoresPorJogo[index]) {
      const [jogadores1, jogadores2] = await Promise.all([
        buscarJogadores(jogo.time1),
        buscarJogadores(jogo.time2),
      ]);

      console.log(jogadores1, jogadores2);

      setJogadoresPorJogo((prev) => ({
        ...prev,
        [index]: {
          time1ComInfo: jogadores1,
          time2ComInfo: jogadores2,
        },
      }));
    }
  };

  useEffect(() => {
    const fetchJogos = async () => {
      try {
        const docRef = doc(db, "calendario", "jogos");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const jogosList: Jogo[] = [];
          const partidas = docSnap.data().partidas;

          for (const key in partidas) {
            if (partidas.hasOwnProperty(key)) {
              const jogo = partidas[key];
              jogosList.push({
                data: jogo.data,
                horario: jogo.horario,
                time1: jogo.time1,
                time2: jogo.time2,
              });
            }
          }

          jogosList.sort((a, b) => {
            const dataA = new Date(a.data);
            const dataB = new Date(b.data);
            return dataA.getTime() - dataB.getTime();
          });

          setJogosDoMes(jogosList);
        } else {
          console.log("Documento 'jogos' não encontrado!");
        }
      } catch (error) {
        console.error("Erro ao carregar jogos:", error);
      }
    };

    fetchJogos();
  }, []);

  const carregarMaisJogos = () => {
    const maisJogos = window.innerWidth >= 768 ? 5 : 3; // desktop carrega +5, mobile +3
    setExibirJogos((prev) => prev + maisJogos);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop === clientHeight) {
      carregarMaisJogos();
    }
  };

  const jogoEncerrado = (data: string, horario: string): boolean => {
    const agora = new Date();
    const dataHoraJogo = new Date(`${data}T${horario}`);
  
    // Soma 1 dia ao horário do jogo
    const encerramento = new Date(dataHoraJogo);
    encerramento.setDate(encerramento.getDate() + 1);
  
    return agora >= encerramento;
  };
  
  return (
    <div className="p-6 max-w-3xl mx-auto" onScroll={handleScroll}>
      <div className="flex flex-col items-center">
        <h2 className="font-heading font-semibold text-gray-200 text-md text-3xl uppercase text-center mb-6 mt-6">
          Calendário de Jogos
        </h2>
      </div>

      <div className="space-y-4">
        {jogosDoMes.slice(0, exibirJogos).map((jogo, index) => {
          const isExpanded = jogosExpandidos.has(index);
          return (
            <div
              key={index}
              onClick={() => toggleExpandir(index, jogo)}
              className={`flex flex-col md:flex-row md:justify-between md:items-center border p-3 rounded-lg shadow-md cursor-pointer transition-colors duration-200 ${
                jogoEncerrado(jogo.data, jogo.horario)
                  ? "bg-gray-700]/50 opacity-60"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              <div className="flex flex-col w-full">
                <span className="font-semibold text-gray-200 flex flex-col md:flex-row md:items-center md:gap-6 md:text-left text-center">
                  {jogoEncerrado(jogo.data, jogo.horario) && (
                    <span className="mt-2 mb-1 md:mt-0 md:mb-0 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded w-fit mx-auto md:mx-0">
                      ENCERRADO
                    </span>
                  )}

                  <span className="text-2xl md:text-2xl font-bold md:mr-2">
                    {formatarData(jogo.data)}
                  </span>

                  <span className="text-lg md:text-xl">
                    {jogo.time1} 🆚 {jogo.time2}
                  </span>

                  <span className="text-sm textgray-300 md:text-base md:ml-auto">
                    🕒 {jogo.horario}
                  </span>
                </span>

                {isExpanded && (
                  <div className="mt-4 bg-gray-800 p-4 rounded-md text-white text-sm md:text-base transition-all duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-gray-200 font-bold text-lg mb-3 border-b border-gray-300 pb-1">
                          {jogo.time1}
                        </h4>
                        <ul className="space-y-2">
                          {ordenarPorPosicao(
                            jogadoresPorJogo[index]?.time1ComInfo || []
                          ).map((jogador, i) => (
                            <li
                              key={i}
                              className="flex items-center gap-3 bg-gray-700 p-2 rounded-md shadow hover:bg-gray-600 transition"
                            >
                              <div className="bg-gray-500 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold uppercase">
                                {jogador.nome[0]}
                              </div>
                              <span className="font-medium">
                                {jogador.nome}
                              </span>
                              <span className="ml-auto text-[--color-gray-300] text-xs font-mono">
                                {abreviarPosicao(jogador.posicao)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-gray-200 font-bold text-lg mb-3 border-b border-gray-300 pb-1">
                          {jogo.time2}
                        </h4>
                        <ul className="space-y-2">
                          {ordenarPorPosicao(
                            jogadoresPorJogo[index]?.time2ComInfo || []
                          ).map((jogador, i) => (
                            <li
                              key={i}
                              className="flex items-center gap-3 bg-gray-700 p-2 rounded-md shadow hover:bg-gray-600 transition"
                            >
                              <div className="bg-gray-500 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold uppercase">
                                {jogador.nome[0]}
                              </div>
                              <span className="font-medium">
                                {jogador.nome}
                              </span>
                              <span className="ml-auto text-gray-300 text-xs font-mono">
                                {abreviarPosicao(jogador.posicao)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {jogosDoMes.length > exibirJogos && (
          <div className="text-center">
            <button
              onClick={carregarMaisJogos}
              className="bg-[--color-blue] text-white py-2 px-4 rounded-md hover:bg-[--color-blue]/80 hover:cursor-pointer hover:text-gray-400 hover:underline"
            >
              Carregar mais jogos
            </button>
          </div>
        )}

        <div className="text-center flex justify-center">
          <Button onClick={() => (window.location.href = "/")}>Voltar</Button>
        </div>
      </div>
    </div>
  );
};

export default Calendario;
