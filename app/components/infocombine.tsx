"use client";

import logo from "../assets/logo.png";
import {
  LandPlot,
  CircleGauge,
  User,
  ShieldQuestion,
  ShieldAlert,
  Calendar,
} from "lucide-react";
import { LinkButton } from "../components/button";
import Image from "next/image";
import TimerPage from "../components/timerpage";
import ListarTimesMini from "../components/listatimes-mini";
export default function InfoCombine() {
  return (
    <div className="bg-gray-700 border border-gray-600 rounded-2xl p-6 w-full mx-auto">
      <h2 className="text-4xl uppercase font-heading text-purple-400 mb-6 text-center mb-4 font-heading bold mt-7">
        🏀 Combine Draft SAPAL
      </h2>
      <p className="text-gray-300 leading-relaxed text-sm md:text-left text-justify mb-4">
        O <strong className="text-white font-semibold mr-1 ml-1">Combine Draft</strong> é
        a última chance de provar que você merece um lugar na elite.
      </p>
      <p className="text-gray-300 leading-relaxed text-sm md:text-left text-justify mb-4"> 
        Aqui, os
        <strong className="text-white font-semibold mr-1 ml-1">
          jogadores não draftados
        </strong>
        se enfrentam em partidas intensas, colocando suas habilidades à prova
        diante dos olheiros e técnicos da{" "}
        <span className="text-purple-300 font-semibold">SAPAL</span>.
      </p>
      <p className="text-gray-300 leading-relaxed text-sm md:text-left text-justify mb-4">
        Cada posse, cada ponto e cada jogada contam — porque a qualquer momento,
        alguém pode ser
        <span className="text-blue-400 font-semibold ml-1">
          chamado para a liga principal
        </span>
        .
      </p>
      <p className="text-gray-300 leading-relaxed text-sm md:text-left text-justify mb-4">
        É no Combine que nascem as histórias de superação. Onde o desconhecido
        vira promessa. Onde quem ficou de fora tem a chance de entrar pela porta
        da frente, com atitude e performance.
      </p>
      <p className="text-lg leading-relaxed font-semibold text-white mt-6 text-center mb-4">
        Você pode não ter sido escolhido antes. <br />
        Mas aqui, {""}
        <span className="text-blue-400">você ainda pode ser chamado.</span>
        <br />
        <br />
        Essa é sua hora.
      </p>
      <div className="flex items-center justify-center mt-10 mb-10">
        <LinkButton href="https://forms.gle/hoTXNRXo8BLUtCPx7">
          <span className="mr-2.5">🔗</span>
          Registrar-se no combine
        </LinkButton>
      </div>
    </div>
  );
}
