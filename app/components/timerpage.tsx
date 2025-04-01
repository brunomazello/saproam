import { useState, useEffect, useMemo } from "react";
import { jogos } from "./jogos";

export default function ContagemRegressiva() {
  const hoje = new Date().toISOString().split("T")[0];

  // Memoriza os jogos do dia para evitar recriação em cada renderização
  const jogosDoDia = useMemo(() => jogos.filter((jogo) => jogo.data === hoje), [hoje]);

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

  // Inicializa os tempos restantes
  const [temposRestantes, setTemposRestantes] = useState(() =>
    jogosDoDia.map((jogo) => calcularTempoRestante(jogo.horario))
  );

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTemposRestantes(jogosDoDia.map((jogo) => calcularTempoRestante(jogo.horario)));
    }, 60000); // Atualiza a cada minuto

    return () => clearInterval(intervalo);
  }, [jogosDoDia]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-center text-[--color-purple] mb-4 uppercase">
        Jogos de Hoje
      </h2>

      {jogosDoDia.length > 0 ? (
        <ul className="space-y-4 ">
          {jogosDoDia.map((jogo, index) => (
            <li
              key={index}
              className="flex justify-between items-center border p-3 rounded-lg bg-[--color-gray-700] shadow-md hover:bg-gray-200 hover:transition-colors hover:text-black"
            >
              <div className="flex flex-col ">
                <span className="font-semibold text-[--color-blue] flex flex-col md:block">
                  {jogo.time1} 🆚 {jogo.time2}
                  <span className="md:ml-6 text-sm text-[--color-gray-300]">🕒 {jogo.horario}</span>
                </span>

              </div>
              <span
                className={`text-lg font-bold ${
                  temposRestantes[index] === "🔥 LIVE 🔴"
                    ? "text-[--color-danger] animate-pulse"
                    : "text-[--color-gray-100]"
                } w-[80px] text-center`} // Adicionando largura fixa
              >
                {temposRestantes[index]}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-[--color-gray-300]">📭 Nenhum jogo programado para hoje.</p>
      )}
    </div>
  );
}
