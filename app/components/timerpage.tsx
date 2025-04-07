"use client";

import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

// Tipos
interface Jogo {
  data: string;
  horario: string;
  time1: string;
  time2: string;
  twitchUser: string;
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

// Constantes auxiliares
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

const ordenarPorPosicao = (jogadores: JogadorInfo[]) => {
  return jogadores.sort(
    (a, b) => posicaoOrdem.indexOf(a.posicao) - posicaoOrdem.indexOf(b.posicao)
  );
};

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

// Componente principal
const ContagemRegressiva = () => {
  const [jogosDoDia, setJogosDoDia] = useState<Jogo[]>([]);
  const [temposRestantes, setTemposRestantes] = useState<string[]>([]);
  const [jogosExpandidos, setJogosExpandidos] = useState<Set<number>>(
    new Set()
  );
  const [jogadoresPorJogo, setJogadoresPorJogo] = useState<JogadoresPorJogo>( 
    {}
  );

  const calcularTempoRestante = (horario: string) => {
    const agora = new Date();
    const [hora, minuto] = horario.split(":").map(Number);
    const horarioJogo = new Date(agora);
    horarioJogo.setHours(hora, minuto, 0, 0);

    const diferenca = horarioJogo.getTime() - agora.getTime();
    if (diferenca <= 0) return "🔥 LIVE 🔴";

    const horas = Math.floor(diferenca / (1000 * 60 * 60));
    const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));

    return `${horas}h ${minutos}m`;
  };

  useEffect(() => {
    const fetchJogos = async () => {
      try {
        // Pega todos os documentos da coleção "calendario_v2"
        const jogosRef = collection(db, "calendario_v2");
        const querySnapshot = await getDocs(jogosRef);
    
        // Cria uma lista para armazenar os jogos encontrados
        const jogosList: Jogo[] = [];
    
        querySnapshot.forEach((doc) => {
          const jogoData = doc.data();
          
          // Pega as informações do jogo a partir do Firestore
          const jogo = {
            data: jogoData.data,
            horario: jogoData.horario,
            time1: jogoData.time1,
            time2: jogoData.time2,
            twitchUser: jogoData.twitchUser,
            placar: jogoData.placar,
            jogadores: jogoData.jogadores,
          };
    
          // Adiciona o jogo à lista
          jogosList.push(jogo);
        });
    
        console.log("Todos os jogos:", jogosList);
    
        // Formatação da data para o dia atual
        const hoje = new Date();
        const hojeBrasil = new Intl.DateTimeFormat("pt-BR", {
          timeZone: "America/Sao_Paulo",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(hoje);
    
        const hojeStr = hojeBrasil.split("/").reverse().join("-");
    
        console.log("Data hoje formatada:", hojeStr);
    
        // Filtra os jogos para o dia atual
        const jogosDoDiaAtual = jogosList.filter(
          (jogo) => jogo.data === hojeStr
        );
    
        console.log("Jogos do dia:", jogosDoDiaAtual);
    
        // Atualiza os estados do React com os jogos e tempos restantes
        setJogosDoDia(jogosDoDiaAtual);
        setTemposRestantes(
          jogosDoDiaAtual.map((jogo) => calcularTempoRestante(jogo.horario))
        );
      } catch (error) {
        console.error("Erro ao carregar jogos:", error);
      }
    };    

    fetchJogos();
  }, []);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTemposRestantes(
        jogosDoDia.map((jogo) => calcularTempoRestante(jogo.horario))
      );
    }, 60000);

    return () => clearInterval(intervalo);
  }, [jogosDoDia]);

  const toggleExpandir = async (index: number, jogo: Jogo) => {
    setJogosExpandidos((prev) => {
      const novo = new Set(prev);
      novo.has(index) ? novo.delete(index) : novo.add(index);
      return novo;
    });

    if (!jogadoresPorJogo[index]) {
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

            return ordenarPorPosicao(jogadores);
          } else {
            return [];
          }
        } catch (error) {
          console.error("Erro ao buscar jogadores:", error);
          return [];
        }
      };

      const [jogadores1, jogadores2] = await Promise.all([
        buscarJogadores(jogo.time1),
        buscarJogadores(jogo.time2),
      ]);

      setJogadoresPorJogo((prev) => ({
        ...prev,
        [index]: {
          time1ComInfo: jogadores1,
          time2ComInfo: jogadores2,
        },
      }));
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-center text-[--color-purple] mb-4 uppercase">
        Jogos de Hoje
      </h2>

      {jogosDoDia.length > 0 ? (
        <ul className="space-y-4">
          {jogosDoDia.map((jogo, index) => {
            const expandido = jogosExpandidos.has(index);
            const jogadores = jogadoresPorJogo[index];

            return (
              <li
                key={index}
                onClick={() => toggleExpandir(index, jogo)}
                className="cursor-pointer border p-3 rounded-lg bg-gray-700 shadow-md hover:bg-gray-600 hover:transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div className="flex flex-col w-full">
                    <span className="font-semibold text-gray-200 flex flex-col md:block">
                      {jogo.time1} 🆚 {jogo.time2}
                      <span className="md:ml-6 text-sm text-gray-300">
                        🕒 {jogo.horario}
                      </span>
                    </span>
                  </div>
                  <span
                    className={`text-sm font-bold w-[150px] text-center ${temposRestantes[index] === "🔥 LIVE 🔴" ? "text-danger animate-pulse" : "text-gray-100"}`}
                  >
                    {temposRestantes[index] === "🔥 LIVE 🔴" ? (
                      <a
                        href={`https://www.twitch.tv/${jogo.twitchUser}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-danger animate-pulse hover:text-blue-500 font-bold cursor-pointer"
                      >
                        🔴 ASSISTIR LIVE
                      </a>
                    ) : (
                      temposRestantes[index]
                    )}
                  </span>
                </div>

                {/* Lista de jogadores */}
                {expandido && jogadores && (
                  <div className="mt-4 bg-gray-800 p-4 rounded-md text-white text-sm md:text-base transition-all duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-gray-200 font-bold text-lg mb-3 border-b border-gray-300 pb-1">
                          {jogo.time1}
                        </h4>
                        <ul className="space-y-2">
                          {ordenarPorPosicao(jogadores.time1ComInfo || []).map(
                            (jogador, i) => (
                              <li key={i} className="flex justify-between">
                                <span>{jogador.nome}</span>
                                <span>{abreviarPosicao(jogador.posicao)}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-gray-200 font-bold text-lg mb-3 border-b border-gray-300 pb-1">
                          {jogo.time2}
                        </h4>
                        <ul className="space-y-2">
                          {ordenarPorPosicao(jogadores.time2ComInfo || []).map(
                            (jogador, i) => (
                              <li key={i} className="flex justify-between">
                                <span>{jogador.nome}</span>
                                <span>{abreviarPosicao(jogador.posicao)}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-center text-white">Nenhum jogo agendado para hoje.</p>
      )}
    </div>
  );
};

export default ContagemRegressiva;
