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

type JogadorComTime = JogadorInfo & {
  time: string;  // Adiciona o time ao tipo
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

const gerarIDPadrao = (time1: string, time2: string, data: string) => {
  const t1 = time1.trim().toLowerCase().replace(/\s+/g, "-");
  const t2 = time2.trim().toLowerCase().replace(/\s+/g, "-");
  const dataFormatada = data.replace(/-/g, "");
  return `${t1}_vs_${t2}_${dataFormatada}`;
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
  const [exibirJogos, setExibirJogos] = useState(5);
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
          ? parte
          : parte.charAt(0).toUpperCase() + parte.slice(1).toLowerCase()
      )
      .join(" ");
  };

  const buscarJogadores = async (
    time1: string,
    time2: string,
    data: string
  ) => {
    try {
      const jogoID = gerarIDPadrao(time1, time2, data);
      console.log(`Buscando jogo com ID: ${jogoID}`); // Log para verificar o ID gerado
      const docRef = doc(db, "calendario_v2", jogoID);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        console.log(`Jogo ${jogoID} encontrado!`); // Confirma que o jogo foi encontrado
        const jogoData = docSnap.data();
        const jogadores: JogadorComTime[] = [];  // Alterado para JogadorComTime
  
        const jogadoresTime1 = jogoData.jogadores?.[time1] || {};
        const jogadoresTime2 = jogoData.jogadores?.[time2] || {};
  
        // Adicionando jogadores ao time1
        for (const key in jogadoresTime1) {
          if (jogadoresTime1.hasOwnProperty(key)) {
            jogadores.push({
              nome: jogadoresTime1[key].nome,
              posicao: jogadoresTime1[key].posicao || "Desconhecida",
              time: time1,  // Aqui adiciona o time
            });
          }
        }
  
        // Adicionando jogadores ao time2
        for (const key in jogadoresTime2) {
          if (jogadoresTime2.hasOwnProperty(key)) {
            jogadores.push({
              nome: jogadoresTime2[key].nome,
              posicao: jogadoresTime2[key].posicao || "Desconhecida",
              time: time2,  // Aqui adiciona o time
            });
          }
        }
  
        return jogadores;
      } else {
        console.warn(`Jogo "${jogoID}" não encontrado.`);
        return [];
      }
    } catch (error) {
      console.error("Erro ao buscar jogadores do jogo:", error);
      return [];
    }
  };
  

  const toggleExpandir = async (
    index: number,
    time1: string,
    time2: string,
    data: string
  ) => {
    setJogosExpandidos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  
    if (!jogadoresPorJogo[index]) {
      const jogadores = await buscarJogadores(time1, time2, data);
  
      const jogadoresTime1 = jogadores.filter(
        (jogador) => jogador.time === time1
      );
      const jogadoresTime2 = jogadores.filter(
        (jogador) => jogador.time === time2
      );
  
      setJogadoresPorJogo((prev) => ({
        ...prev,
        [index]: {
          time1ComInfo: ordenarPorPosicao(jogadoresTime1),
          time2ComInfo: ordenarPorPosicao(jogadoresTime2),
        },
      }));
    }
  };

  useEffect(() => {
    const fetchJogos = async () => {
      try {
        const colRef = collection(db, "calendario_v2"); // Acesso à coleção de jogos
        const snapshot = await getDocs(colRef);

        if (!snapshot.empty) {
          const jogosList: Jogo[] = [];

          snapshot.forEach((doc) => {
            const jogo = doc.data();
            jogosList.push({
              data: jogo.data,
              horario: jogo.horario,
              time1: jogo.time1,
              time2: jogo.time2,
            });
          });

          jogosList.sort((a, b) => {
            const dataA = new Date(a.data);
            const dataB = new Date(b.data);
            return dataA.getTime() - dataB.getTime();
          });

          setJogosDoMes(jogosList);
        } else {
          console.log("Nenhum jogo encontrado!");
        }
      } catch (error) {
        console.error("Erro ao carregar jogos:", error);
      }
    };

    fetchJogos();
  }, []);

  const carregarMaisJogos = () => {
    const maisJogos = window.innerWidth >= 768 ? 5 : 3;
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
              onClick={() =>
                toggleExpandir(index, jogo.time1, jogo.time2, jogo.data)
              }
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
