// pages/timer.tsx
"use client";

import { useState, useEffect } from "react";

const TimerPage: React.FC = () => {
  // Definindo o horário do primeiro jogo (data e hora)
  const gameDate = new Date("2025-03-31T21:30:00"); // Exemplo de data: 5 de abril de 2025 às 21:30

  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [hasGameStarted, setHasGameStarted] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const remainingTime = gameDate.getTime() - currentTime;
      
      if (remainingTime <= 0) {
        clearInterval(interval);
        setTimeRemaining(0);
        setHasGameStarted(true); // Marca que o jogo começou
      } else {
        setTimeRemaining(remainingTime);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Contagem Regressiva para o Primeiro Jogo</h1>

        {/* Exibindo a hora do primeiro jogo */}
        <p className="text-xl font-medium mb-4">
          O jogo será às: {gameDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>

        {/* Exibindo a contagem regressiva */}
        <div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg">
          <p className="text-lg">Faltam:</p>
          <p className="text-4xl font-semibold">
            {timeRemaining > 0 ? formatTime(timeRemaining) : "Jogo Iniciado!"}
          </p>
        </div>

        {/* Exibir o embed da live da Twitch quando o jogo começar */}
        {hasGameStarted && (
          <div className="mt-8">
            <h2 className="text-3xl font-bold text-white mb-4">Assista ao Jogo ao Vivo!</h2>
            <iframe
              src="https://player.twitch.tv/?channel=verusexp" // Substitua 'nome_do_canal' pelo nome do canal da Twitch
              height="600"
              width="100%"
              frameBorder="0"
              scrolling="no"
              allowFullScreen={true}
              title="Live da Twitch"
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimerPage;
