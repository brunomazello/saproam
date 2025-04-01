import { useState } from 'react';
import { Button } from './button'; // Supondo que o Button esteja neste caminho
import { jogos } from './jogos';

export default function Calendario() {
  const [exibirJogos, setExibirJogos] = useState(5);

  const carregarMaisJogos = () => {
    setExibirJogos((prev: number) => prev + 5);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (scrollHeight - scrollTop === clientHeight) {
      carregarMaisJogos();
    }
  };

  const jogosDoMes = jogos;

  return (
    <div className="p-6 max-w-3xl mx-auto" onScroll={handleScroll}>
      <div className="flex flex-col items-center">
        <h2 className="font-heading font-semibold text-gray-200 text-md text-3xl uppercase text-center mb-6 mt-6">
          Calendário de Jogos
        </h2>
      </div>

      <div className="space-y-4">
        {jogosDoMes.slice(0, exibirJogos).map((jogo, index) => (
          <div
            key={index}
            className="flex justify-between items-center border p-3 rounded-lg bg-[--color-gray-700] shadow-md hover:bg-gray-200 hover:transition-colors hover:text-black"
          >
            <div className="flex flex-col w-full">
              <span className="font-semibold text-[--color-blue] flex flex-col md:block text-center">
                <span className='text-2xl md:text-base md:flex md:items-center md:justify-center md:text-6xl'>{jogo.data}</span>
                {jogo.time1} 🆚 {jogo.time2}
                <span className="text-sm text-[--color-gray-300] md:flex md:justify-center">
                  🕒 {jogo.horario}
                </span>
              </span>
            </div>
          </div>
        ))}

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

        {/* Botão de Voltar para a Home */}
        <div className="text-center flex justify-center">
          <Button onClick={() => window.location.href = '/'}>
            Voltar
          </Button>
        </div>

        {jogosDoMes.length === 0 && (
          <p className="text-center text-[--color-gray-300]">
            📭 Nenhum jogo programado.
          </p>
        )}
      </div>
    </div>
  );
}
