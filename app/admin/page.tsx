"use client";

import { useState } from "react";
import AdicionarTime from "../components/addteam";
import EditarTime from "../components/editartimes";

export default function AdminPage() {
  const [senha, setSenha] = useState("");
  const [logado, setLogado] = useState(false);
  const senhaCorreta = "admin123"; // Altere para uma senha mais segura

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
    <div className="min-h-screen flex items-center justify-between gap-16 flex-col md:flex-row">
      <AdicionarTime />
      <EditarTime />
    </div>
  );
}
