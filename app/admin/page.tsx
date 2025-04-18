'use client';

import { useState } from "react";
import Image from "next/image";
import logo from "../assets/logo.png";
import AdicionarTime from "../components/addteam";
import EditarTime from "../components/editartimes";
import EditarJogador from "../components/editarjogador";
import AdicionarJogo from "../components/adicionarjogo";
import EditarJogo from "../components/editarjogo";
import SendJogosButton from "../components/sendjogosbtn";
import CadastrarJogadorCombine from "../components/cadastrarjogadorcombine";
import EditarJogadorCombine from "../components/editarjogadorcombine";
import AlterarJogador from "../components/alterarjogador";

export default function AdminPage() {
  const [senha, setSenha] = useState("");
  const [logado, setLogado] = useState(false);
  const [secaoAtiva, setSecaoAtiva] = useState<"time" | "jogador" | "jogo" |"combine" | null>(null);
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
        <div className="flex flex-col items-center mb-10">
          <Image src={logo} alt="devstage" width={108.5} height={30} />
          <h1 className="text-4xl text-white font-heading font-medium mt-7">SOUTH AMERICA PRO-AM LEAGUE 2025</h1>
        </div>
        <h2 className="text-lg font-bold mb-4 text-white">Área Administrativa</h2>
        <input
          type="password"
          placeholder="Digite a senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="border-2 border-gray-500 rounded px-4 py-2 mb-2 text-white bg-gray-700"
        />
        <button
          onClick={handleLogin}
          className="px-5 h-12 bg-blue text-white font-semibold rounded-xl w-auto cursor-pointer hover:bg-blue-700 mt-6"
        >
          Entrar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white mt-20">
      <nav className="flex justify-between items-center p-5">
        <div className="flex items-center space-x-4">
          <Image src={logo} alt="Logo" width={100} height={30} />
          <span className="text-xl font-heading">Admin Panel</span>
        </div>
        <div className="hidden md:flex space-x-6">
          <button
            onClick={() => setSecaoAtiva("time")}
            className="w-full px-6 py-2 rounded-md text-gray-300 transition hover:cursor-pointer hover:bg-gray-100 hover:text-black bg-gray-800"
          >
            Edição de Times
          </button>
          <button
            onClick={() => setSecaoAtiva("jogador")}
            className="w-full px-4 py-2 rounded-md text-gray-300 transition hover:cursor-pointer hover:bg-gray-100 hover:text-black bg-gray-800"
          >
            Edição de Jogadores
          </button>
          <button
            onClick={() => setSecaoAtiva("jogo")}
            className="w-full px-4 py-2 rounded-md text-gray-300 transition hover:cursor-pointer hover:bg-gray-100 hover:text-black bg-gray-800"
          >
            Edição de Calendario
          </button>
          <button
            onClick={() => setSecaoAtiva("combine")}
            className="w-full px-4 py-2 rounded-md text-gray-300 transition hover:cursor-pointer hover:bg-gray-100 hover:text-black bg-gray-800"
          >
            Combine
          </button>
        </div>
        {/* Menu Mobile */}
        <div className="md:hidden">
          <button onClick={() => setSecaoAtiva(null)} className="text-white p-5 y-5 rounded-md text-gray-300 transition hover:cursor-pointer hover:bg-gray-100 hover:text-black bg-gray-800">
            Menu
          </button>
        </div>
      </nav>

      {/* Menu Mobile Responsivo */}
      <div className="md:hidden">
        <button
          onClick={() => setSecaoAtiva(null)}
          className="hidden"
        >
          {secaoAtiva === null ? "Menu" : "Fechar Menu"}
        </button>
        {secaoAtiva === null && (
          <div className="space-y-2 p-4">
            <button
              onClick={() => setSecaoAtiva("time")}
              className="w-full px-4 py-5 md:py-2 text-gray-300 transition hover:cursor-pointer hover:bg-gray-100 hover:text-black bg-gray-800 mb-10 md:mb-0"
            >
              Edição de Times
            </button>
            <button
              onClick={() => setSecaoAtiva("jogador")}
              className="w-full px-10 py-5 md:py-2 rounded-md text-gray-300 transition hover:cursor-pointer hover:bg-gray-100 hover:text-black bg-gray-800 mb-10 md:mb-0"
            >
              Edição de Jogadores
            </button>
            <button
              onClick={() => setSecaoAtiva("jogo")}
              className="w-full px-10 py-5 md:py-2 rounded-md text-gray-300 transition hover:cursor-pointer hover:bg-gray-100 hover:text-black bg-gray-800 mb-10 md:mb-0"
            >
              Edição de Calendario
            </button>
            <button
              onClick={() => setSecaoAtiva("combine")}
              className="w-full px-10 py-5 md:py-2 rounded-md text-gray-300 transition hover:cursor-pointer hover:bg-gray-100 hover:text-black bg-gray-800 md:mb-0"
            >
              Combine
            </button>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Conteúdo da seção ativa */}
        {/* {secaoAtiva === "time" && <AdicionarTime />} */}
        {secaoAtiva === "jogador" && <EditarJogador />}
        {secaoAtiva === "jogo" && <AdicionarJogo />}
        {secaoAtiva === "time" && <EditarTime />}
        {secaoAtiva === "jogo" && <EditarJogo />}
        {secaoAtiva === "combine" && <CadastrarJogadorCombine/>}
        {secaoAtiva === "combine" && <EditarJogadorCombine/>}
        {secaoAtiva === "time" && <AlterarJogador />}

        
      </div>
    </div>
  );
}
