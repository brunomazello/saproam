'use client'

import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

// Definindo o tipo Jogo
interface Jogo {
  data: string;
  horario: string;
  time1: string;
  time2: string;
}

const ContagemRegressiva = () => {
  const hoje = new Date().toISOString().split("T")[0];  // No formato YYYY-MM-DD

  const [jogosDoDia, setJogosDoDia] = useState<Jogo[]>([]); // Lista de jogos do dia
  const [temposRestantes, setTemposRestantes] = useState<string[]>([]); // Tempos restantes para cada jogo

  // Função para calcular o tempo restante
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
        // Acessando o documento "jogos" dentro da coleção "calendario"
        const docRef = doc(db, "calendario", "jogos");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const jogosList: Jogo[] = [];

          // Acessando as partidas dentro do documento 'jogos'
          const partidas = docSnap.data().partidas;

          // Iterando sobre as partidas para extrair os jogos
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

          // Definindo a data de hoje no fuso horário de Brasília (GMT-3)
          const hoje = new Date();
          const hojeBrasil = new Intl.DateTimeFormat("pt-BR", {
            timeZone: "America/Sao_Paulo",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).format(hoje);  // "DD/MM/YYYY"
          
          const hojeStr = hojeBrasil.split("/").reverse().join("-"); // Formato "YYYY-MM-DD"

          // Filtra os jogos que têm a mesma data de hoje
          const jogosDoDiaAtual = jogosList.filter(jogo => {
            const dataJogo = jogo.data;  // A data do Firestore já está no formato "YYYY-MM-DD"
            return dataJogo === hojeStr;  // Comparação de datas no formato "YYYY-MM-DD"
          });

          setJogosDoDia(jogosDoDiaAtual);
          setTemposRestantes(jogosDoDiaAtual.map(jogo => calcularTempoRestante(jogo.horario)));
        } else {
          console.log("Documento 'jogos' não encontrado!");
        }
      } catch (error) {
        console.error("Erro ao carregar jogos:", error);
      }
    };

    fetchJogos();
  }, []);  // Executa quando o componente é montado

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTemposRestantes(
        jogosDoDia.map((jogo) => calcularTempoRestante(jogo.horario))
      );
    }, 60000); // Atualiza a cada minuto

    return () => clearInterval(intervalo);
  }, [jogosDoDia]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-center text-[--color-purple] mb-4 uppercase">
        Jogos de Hoje
      </h2>

      {jogosDoDia.length > 0 ? (
        <ul className="space-y-4">
          {jogosDoDia.map((jogo, index) => (
            <li
              key={index}
              className="flex justify-between items-center border p-3 rounded-lg bg-[--color-gray-700] shadow-md hover:bg-gray-200 hover:transition-colors hover:text-black"
            >
              <div className="flex flex-col w-full">
                <span className="font-semibold text-[--color-blue] flex flex-col md:block">
                  {jogo.time1} 🆚 {jogo.time2}
                  <span className="md:ml-6 text-sm text-[--color-gray-300]">
                    🕒 {jogo.horario}
                  </span>
                </span>
              </div>
              <span
                className={`text-sm font-bold ${temposRestantes[index] === "🔥 LIVE 🔴"
                    ? "text-[--color-danger] animate-pulse"
                    : "text-[--color-gray-100]"
                } w-[150px] text-center`} // Adicionando largura fixa
              >
                {temposRestantes[index] === "🔥 LIVE 🔴" ? (
                  <a
                    href="https://www.twitch.tv/verusexp" // Substitua pela URL da live
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[--color-danger] animate-pulse hover:text-blue-500 text-sm font-bold cursor-pointer"
                  >
                    🔴 ASSISTIR LIVE
                  </a>
                ) : (
                  temposRestantes[index]
                )}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-[--color-gray-300]">
          📭 Nenhum jogo programado para hoje.
        </p>
      )}

      <div className="flex items-center w-full justify-end mt-4">
        <a href="/calendario" className="hover:text-gray-300 hover:underline">
          Ver completo
        </a>
      </div>
    </div>
  );
};

export default ContagemRegressiva;
