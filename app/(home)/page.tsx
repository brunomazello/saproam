import logo from "../assets/logo.png";
import {
  LandPlot,
  CircleGauge,
  User,
  ShieldQuestion,
  ShieldAlert,
} from "lucide-react";
import { LinkButton } from "../components/button";
import Image from "next/image";
import AdComponent from "../components/AdComponent";
import ListarTimes from "../components/listartimes";
import ExibirTimes from "../components/exibirtimes";
export default function Home() {
  return (
    <div className="min-h-dvh flex justify-center gap-8 flex-col md:mb-12">
      
      <div className="flex flex-col md:mt-6 items-center md:items-center">
        <Image src={logo} alt="devstage" width={108.5} height={30} />
        <h1 className="text-4xl text-center leading-none font-heading font-medium flex flex-col md:text-7xl md:text-center mt-7">
          <span>SOUTH AMERICA</span>
          PRO-AM LEAGUE 2025
        </h1>
      </div>
      <div className="flex gap-5 md:flex-row flex-col">
        <div className="flex-1 bg-gray-700 border border-gray-600 rounded-2xl p-8 space-y-6">
          <div className="flex items-center justify-between md:justify-center">
            <h2 className="font-heading font-semibold text-gray-200 md:text-4xl text-2xl text-center md:text-center">
              Está lançado um novo e profissional League Draft
            </h2>
            {/* <span className="text-purple font-semibold text-xs flex items-center gap-2">
              <Radio className="size-5" />
              Ao Vivo
            </span> */}
          </div>
          <p className="text-gray-300 leading-relaxed text-sm md:text-left text-center">
            Estamos lançando uma liga de e-sports totalmente original, inspirada
            nas maiores competições do mundo. Com um formato profissional e
            calendário estruturado, nossa liga proporcionará um ambiente
            competitivo de alto nível para jogadores e equipes.
          </p>
          <div className="flex flex-col md:flex-row md:justify-normal items-center justify-center">
            <LandPlot className="w-16 h-16 md:w-8 md:h-8" />

            <h2 className="font-heading font-semibold text-gray-200 text-xl md:ml-2.5 text-center md:text-left mt-4 md:mt-0 ">
              Formato da Competição
            </h2>
          </div>
          <ol>
            <li className="text-gray-300 leading-relaxed text-sm md:text-base mb-2.5 text-center md:text-left">
              - O torneio seguirá um sistema de Playoffs com Upper e Lower
              Bracket.
            </li>
            <li className="text-gray-300 leading-relaxed text-sm md:text-base mb-2.5 text-center md:text-left">
              - A liga será realizada ao longo de cinco temporadas, finalizando
              em agosto.
            </li>
            <li className="text-gray-300 leading-relaxed text-sm md:text-base mb-2.5 text-center md:text-left">
              - Entre cada temporada, haverá uma off-season de uma semana para
              análises de expansão de equipes e ajustes no formato competitivo.
            </li>
            <li className="text-gray-300 leading-relaxed text-sm md:text-base mb-2.5 text-center md:text-left">
              - Calendário de Jogos: as partidas serão disputadas de segunda a
              quinta-feira, das 21:00 às 23:00.
            </li>
          </ol>
          <div className="flex flex-col md:flex-row md:justify-normal items-center justify-center">
            <CircleGauge className="w-16 h-16 md:w-8 md:h-8" />
            <h2 className="font-heading font-semibold text-gray-200 text-xl md:ml-2.5 text-center md:text-left mt-4 md:mt-0">
              Mecanismo de Draft e Regras de Equipes
            </h2>
          </div>
          <ol>
            <li className="text-gray-300 leading-relaxed text-sm md:text-base mb-2.5 text-center md:text-left">
              - A equipe campeã e as melhores colocadas terão o direito de
              manter parte do seu elenco.
            </li>
            <li className="text-gray-300 leading-relaxed text-sm md:text-base mb-2.5 text-center md:text-left">
              - As equipes que terminarem nas últimas posições terão as melhores
              escolhas no draft da temporada seguinte.
            </li>
            <li className="text-gray-300 leading-relaxed text-sm md:text-base mb-2.5 text-center md:text-left">
              - Jogadores não selecionados no draft (Undrafted) poderão
              participar do Draft Combine, onde terão suas estatísticas
              registradas e estarão disponíveis para contratação caso as equipes
              necessitem de substituições.
            </li>
          </ol>
          <div className="flex flex-col md:flex-row md:justify-normal items-center justify-center">
            <User className="w-16 h-16 md:w-8 md:h-8" />
            <h2 className="font-heading font-semibold text-gray-200 text-xl md:ml-2.5 text-center md:text-left mt-4 md:mt-0">
              Registro de Jogadores
            </h2>
          </div>

          <p className="text-gray-300 leading-relaxed text-sm md:text-base text-center md:text-left">
            Para participar do draft, o jogador precisa estar registrado. A
            inscrição de jogadores é gratuita.
          </p>
          <ol>
            <li className="text-gray-300 leading-relaxed text-sm md:text-base mb-2.5 text-center md:text-left">
              - Jogadores não selecionados no draft serão considerados Undrafted
              e poderão participar do Draft Combine.
            </li>
            <li className="text-gray-300 leading-relaxed text-sm md:text-base mb-2.5 text-center md:text-left">
              - As estatísticas dos jogadores no Combine serão registradas e
              analisadas pelos GMs para futuras seleções e trocas.
            </li>
            <li className="text-gray-300 leading-relaxed text-sm md:text-base mb-2.5 text-center md:text-left">
              - Jogadores que não se registrarem até o prazo estipulado não
              poderão participar da liga até a reabertura de registros na
              próxima temporada.
            </li>
          </ol>
          <div className="flex items-center justify-center">
            <LinkButton href="https://forms.gle/hoTXNRXo8BLUtCPx7">
              <span className="mr-2.5">🔗</span>
              Registre-se
            </LinkButton>
          </div>
          <div className="bg-gray-500 px-5 py-5 rounded-2xl">
            <div className="flex mb-6 justify-center items-center">
              <ShieldAlert className="w-16 h-16 md:w-8 md:h-8" />
              <h2 className="font-heading font-semibold text-gray-200 text-md ml-2.5">
                IMPORTANTE: Se você não tem disponibilidade para jogar de
                segunda a quinta, das 21:00 às 23:00, por favor, não se
                inscreva.
              </h2>
            </div>
            <div className="flex justify-center items-center">
              <ShieldQuestion className="w-16 h-16 md:w-8 md:h-8" />
              <h2 className="font-heading font-semibold text-gray-200 text-md ml-2.5">
                Dúvidas? Entre em contato com a administração da liga.
                Prepare-se para uma competição de alto nível e boa sorte!
              </h2>
            </div>
          </div>
        </div>
        {/* <div className="flex md:flex-col">
          <ListarTimes />
        </div> */}
      </div>
    </div>
  );
}
