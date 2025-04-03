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
<<<<<<< HEAD
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
=======
      <div className="flex flex-col items-center justify-center min-h-screen">
>>>>>>> master
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
<<<<<<< HEAD
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="flex justify-between items-center bg-gray-800 p-5">
=======
    <div className="min-h-screen text-white mt-20">
      <nav className="flex justify-between items-center p-5">
>>>>>>> master
        <div className="flex items-center space-x-4">
          <Image src={logo} alt="Logo" width={100} height={30} />
          <span className="text-xl font-heading">Admin Panel</span>
        </div>
        <div className="hidden md:flex space-x-6">
          <button
            onClick={() => setSecaoAtiva("time")}
            className="w-full px-4 py-2 bg-gray-500 text-blue rounded-xl hover:bg-blue-700 transition-colors"
          >
            Edição de Times
          </button>
          <button
            onClick={() => setSecaoAtiva("jogador")}
            className="w-full px-4 py-2 bg-gray-500 text-blue rounded-xl hover:bg-blue-700 transition-colors"
          >
            Edição de Jogadores
          </button>
          <button
            onClick={() => setSecaoAtiva("jogo")}
            className="w-full px-4 py-2 bg-gray-500 text-blue rounded-xl hover:bg-blue-700 transition-colors"
          >
            Edição de Jogos
          </button>
        </div>
        {/* Menu Mobile */}
        <div className="md:hidden">
          <button onClick={() => setSecaoAtiva(null)} className="text-white p-5 y-5 bg-gray-500 text-blue rounded-xl hover:bg-blue-700 transition-colors">
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
              className="w-full px-4 py-2 bg-gray-500 text-blue rounded-xl hover:bg-blue-700 transition-colors"
            >
              Edição de Times
            </button>
            <button
              onClick={() => setSecaoAtiva("jogador")}
              className="w-full px-4 py-2 bg-gray-500 text-blue rounded-xl hover:bg-blue-700 transition-colors"
            >
              Edição de Jogadores
            </button>
            <button
              onClick={() => setSecaoAtiva("jogo")}
              className="w-full px-4 py-2 bg-gray-500 text-blue rounded-xl hover:bg-blue-700 transition-colors"
            >
              Edição de Jogos
            </button>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Conteúdo da seção ativa */}
        {secaoAtiva === "time" && <AdicionarTime />}
        {secaoAtiva === "jogador" && <EditarJogador />}
        {secaoAtiva === "jogo" && <AdicionarJogo />}
        {secaoAtiva === "time" && <EditarTime />}
        {secaoAtiva === "jogo" && <EditarJogo />}
        {secaoAtiva === "jogo" && <SendJogosButton />}
      </div>
    </div>
  );
}
