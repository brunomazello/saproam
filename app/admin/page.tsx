"use client";

import { useState } from "react";
import Image from "next/image";
import logo from "../assets/logo.png";
import AdicionarTime from "../components/addteam";
import EditarTime from "../components/editartimes";
import EditarJogador from "../components/editarjogador";
import AdicionarJogo from "../components/adicionarjogo";
import EditarJogo from "../components/editarjogo";
import SendJogosButton from "../components/sendjogosbtn";

export default function AdminPage() {
  const [senha, setSenha] = useState("");
  const [logado, setLogado] = useState(false);
  const [secaoAtiva, setSecaoAtiva] = useState<"time" | "jogador" | "jogo" | null>(null);
  const senhaCorreta = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  // Função de login
  const handleLogin = () => {
    if (senha === senhaCorreta) {
      setLogado(true);
    } else {
      alert("Senha incorreta!");
    }
  };

  if (!logado) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex flex-col md:mt-6 items-center md:items-center mb-10">
          <Image src={logo} alt="devstage" width={108.5} height={30} />
          <h1 className="text-4xl text-center leading-none font-heading font-medium flex flex-col md:text-7xl md:text-center mt-7">
            <span>SOUTH AMERICA</span>
            PRO-AM LEAGUE 2025
          </h1>
        </div>
        <h2 className="text-lg font-bold mb-4">Área Administrativa</h2>
        <input
          type="password"
          placeholder="Digite a senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="border rounded px-4 py-2 mb-2"
        />
        <button
          onClick={handleLogin}
          className="px-5 h-12 bg-gray-500 text-blue font-semibold rounded-xl w-auto cursor-pointer hover:bg-blue hover:text-gray-900 transition-colors duration-300 mt-6"
        >
          Entrar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-6 font-bold">Área Administrativa</h1>

      {/* Botões de navegação */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setSecaoAtiva("time")}
          className="text-sm w-full flex text-center justify-between items-center px-5 h-12 bg-gray-500 text-blue font-semibold rounded-xl cursor-pointer hover:bg-blue hover:text-gray-900 transition-colors duration-300 mt-6"
        >
          Edição de Times
        </button>
        <button
          onClick={() => setSecaoAtiva("jogador")}
          className="text-sm w-full flex text-center justify-between items-center px-5 h-12 bg-gray-500 text-blue font-semibold rounded-xl cursor-pointer hover:bg-blue hover:text-gray-900 transition-colors duration-300 mt-6"
        >
          Edição de Jogadores
        </button>
        <button
          onClick={() => setSecaoAtiva("jogo")}
          className="text-sm w-full flex text-center justify-between items-center px-5 h-12 bg-gray-500 text-blue font-semibold rounded-xl cursor-pointer hover:bg-blue hover:text-gray-900 transition-colors duration-300 mt-6"
        >
          Edição de Jogos
        </button>
      </div>

      {/* Conteúdo da seção ativa */}
      <div className="w-full">
        {secaoAtiva === "time" && <AdicionarTime />}
        {secaoAtiva === "jogador" && <EditarJogador />}
        {secaoAtiva === "jogo" && <AdicionarJogo />}
      </div>

      {/* Seção para a edição de times */}
      {secaoAtiva === "time" && <EditarTime />}
      {secaoAtiva === "jogo" && <EditarJogo/>}
      {secaoAtiva === "jogo" && <SendJogosButton/>}
    </div>
  );
}
