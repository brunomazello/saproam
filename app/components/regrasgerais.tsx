import {
  ExternalLink,
  Tv,
  UserX,
  LandPlot,
  User,
  CircleGauge,
  Clock,
  RefreshCw,
  Shuffle,
  Users,
} from "lucide-react";
import Link from "next/link";
export default function RegrasGerais() {
  return (
    <div className="bg-gray-700 border border-gray-600 rounded-2xl p-8 space-y-6 h-auto w-full mt-10 w-auto">
      <div className="flex items-center justify-between md:justify-center">
        <h2 className="font-heading font-semibold text-gray-300 md:text-4xl text-2xl text-center">
          Regras Gerais - 1ª Temporada
        </h2>
      </div>

      <div className="flex flex-col md:flex-row md:justify-normal items-center justify-center">
        <LandPlot className="w-16 h-16 md:w-8 md:h-8" />
        <h2 className="font-heading font-semibold text-gray-300 text-xl md:ml-2.5 text-justify  mt-4 md:mt-0">
          Formato
        </h2>
      </div>
      <p className="text-gray-300 leading-relaxed text-sm md:text-base text-justify ">
        Serão 7 equipes juntas em um grupo único que jogarão entre si em um
        confronto de 2 jogos com cada adversário.
      </p>
      <ul className="text-gray-300 leading-relaxed text-sm md:text-base text-justify  list-disc list-inside">
        <li>
          Para resultados de 2 vitórias (2x0), são dados 3 pontos para o time
          vencedor.
        </li>
        <li>
          Para resultados em que cada equipe vença 1 jogo (1x1), é dado 1 ponto
          para cada time.
        </li>
      </ul>

      <div className="flex flex-col md:flex-row md:justify-normal items-center justify-center">
        <CircleGauge className="w-16 h-16 md:w-8 md:h-8" />
        <h2 className="font-heading font-semibold text-gray-300 text-xl md:ml-2.5 text-justify  mt-4 md:mt-0">
          Desempate
        </h2>
      </div>
      <ol className="text-gray-300 leading-relaxed text-sm md:text-base text-justify  list-decimal list-inside">
        <li>Confronto direto;</li>
        <li>Saldo de pontos;</li>
        <li>Pontos feitos;</li>
        <li>Sorteio.</li>
      </ol>

      <div className="flex flex-col md:flex-row md:justify-normal items-center justify-center">
        <User className="w-16 h-16 md:w-8 md:h-8" />
        <h2 className="font-heading font-semibold text-gray-300 text-xl md:ml-2.5 text-justify  mt-4 md:mt-0">
          Playoffs
        </h2>
      </div>
      <p className="text-gray-300 leading-relaxed text-sm md:text-base text-justify ">
        O Playoffs será disputado em melhores de 3.
      </p>
      <ul className="text-gray-300 leading-relaxed text-sm md:text-base text-justify  list-disc list-inside">
        <li>O time que terminar em 1° enfrenta o 4° na SEMI-FINAL DA UPPER.</li>
        <li>O time que terminar em 2° enfrenta o 3° na SEMI-FINAL DA UPPER.</li>
        <li>Os vencedores desse confronto se enfrentam na FINAL DA UPPER.</li>
        <li>
          Os perdedores de todos os jogos da Upper continuarão vivos e jogarão
          na parte Lower dos playoffs.
        </li>
        <li>
          O time que terminar em 5° enfrenta o 6° na PRIMEIRA FASE DA LOWER.
        </li>
        <li>
          O vencedor do confronto da primeira fase da Lower enfrenta o time de
          pior campanha entre os perdedores das semifinais da Upper na SEGUNDA
          FASE DA LOWER.
        </li>
        <li>
          O vencedor da segunda fase da Lower enfrenta o time de melhor campanha
          entre os perdedores das semifinais da Upper na TERCEIRA FASE DA LOWER.
        </li>
        <li>
          O vencedor da terceira fase da Lower enfrenta o perdedor da final da
          Upper.
        </li>
      </ul>

      {/* Transmissões */}
      <section className="mb-6  text-justify flex flex-col justify-center">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-justify">
          <Tv /> Transmissões
        </h2>
        <p className="text-gray-300">
          Terça e quinta:{" "}
          <Link href="https://www.twitch.tv/lima_wes" className="text-gray-300">
            Lima Wes
          </Link>
        </p>
        <p className="text-gray-300">
          Segunda e quarta:{" "}
          <Link href="https://www.twitch.tv/verusexp" className="text-gray-300">
            Saint
          </Link>
        </p>
      </section>

      {/* Substituições */}
      <section className="mb-6  text-justify flex flex-col justify-center">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-justify">
          <UserX /> Substituições de Jogadores
        </h2>
        <p className="text-gray-300">
          Jogadores podem ser substituídos caso não possam jogar, mas deve haver
          acordo entre os times e a administração.
        </p>
      </section>

      {/* Partidas */}
      <section className="mb-6  text-justify flex flex-col justify-center">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-justify">
          <Clock /> Partidas
        </h2>
        <p className="text-gray-300">
          Há uma tolerância de 10 minutos de atraso. Se um jogador não aparecer,
          o time adversário pode requisitar W.O.
        </p>
      </section>

      {/* Desconexões */}
      <section className="mb-6  text-justify flex flex-col justify-center">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-justify">
          <RefreshCw /> Desconexões
        </h2>
        <p className="text-gray-300">
          Cada equipe tem direito a 1 reinício de partida por série. O tempo que
          faltava será jogado no reinício.
        </p>
      </section>

      {/* Trocas */}
      <section className="mb-6  text-justify flex flex-col justify-center">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-justify">
          <Shuffle /> Trocas
        </h2>
        <p className="text-gray-300">
          Jogadores draftados podem ser trocados. Trocas devem ser enviadas no
          grupo dos GM's.
        </p>
      </section>

      {/* Post Season */}
      <section>
        <h2 className="text-xl font-semibold flex items-center gap-2 text-justify">
          <Users /> Post Season
        </h2>
        <p className="text-gray-300">
          GM’s dos times campeão e vice podem escolher até 3 jogadores para
          manter no elenco.
        </p>
      </section>
      <section>
          <h2 className="text-xl font-semibold">Direitos, Deveres e Punições</h2>
          <ul className="list-disc list-inside text-gray-300">
            <li>Jogadores têm direito a jogar todas as partidas disponíveis.</li>
            <li>Trash Talk permitido, exceto racismo, xenofobia e discurso de ódio.</li>
            <li>Ausência em mais de 2 jogos resulta em banimento da temporada.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Jogadores Undrafted</h2>
          <p className="text-gray-300">
            Jogadores undrafted podem substituir ausências e mudar de posição mediante comunicação.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Draft Combine</h2>
          <p className="text-gray-300">
            Partidas organizadas para todos os inscritos, dando prioridade a jogadores undrafted.
          </p>
        </section>
    </div>
  );
}
