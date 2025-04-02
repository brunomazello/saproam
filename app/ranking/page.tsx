"use client";
import { Button } from "../components/button";
import ListarTimes from "../components/listartimes";
import RankingJogadores from "../components/rankingjogadores";
export default function Home() {
  return (
    <div className="min-h-dvh flex justify-center gap-8 flex-col md:mb-12 mt-12">
      <ListarTimes />
      <RankingJogadores/>
      <div className="text-center flex justify-center">
        <Button onClick={() => (window.location.href = "/")}>Voltar</Button>
      </div>
    </div>
  );
}
