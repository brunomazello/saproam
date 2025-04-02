import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Button } from './button';  // Supondo que o Button esteja neste caminho

// Definindo o tipo Jogo
interface Jogo {
  data: string;
  horario: string;
  time1: string;
  time2: string;
}

const Calendario = () => {
  const [jogosDoMes, setJogosDoMes] = useState<Jogo[]>([]);  // Tipando o estado de jogos
  const [exibirJogos, setExibirJogos] = useState(5);

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

          // Ordenando os jogos pela data (do mais antigo para o mais recente)
          jogosList.sort((a, b) => {
            // Converter as datas para objetos Date e comparar
            const dataA = new Date(a.data);
            const dataB = new Date(b.data);

            return dataA.getTime() - dataB.getTime(); // Comparação para ordem crescente
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
  }, []);  // O efeito será executado apenas uma vez após o componente ser montado

  const carregarMaisJogos = () => {
    setExibirJogos((prev: number) => prev + 5);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (scrollHeight - scrollTop === clientHeight) {
      carregarMaisJogos();
    }
  };

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

        <div className="text-center flex justify-center">
          <Button onClick={() => window.location.href = '/'}>Voltar</Button>
        </div>
      </div>
    </div>
  );
};

export default Calendario;
