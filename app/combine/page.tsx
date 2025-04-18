"use client";
import { Button } from "../components/button";
import ContadorJogadores from "../components/contadorjogadores";
import InfoCombine from "../components/infocombine";
import RankingCombine from "../components/rankingcombine";
export default function Home() {
  return (
    <div className="min-h-dvh flex justify-center gap-8 flex-col md:mb-12 mt-12 md:mt-24">
      <InfoCombine />
      <ContadorJogadores/>
      <RankingCombine />
      <div className="text-center flex justify-center">
        <Button onClick={() => (window.location.href = "/")}>Voltar</Button>
      </div>
    </div>
  );
}
