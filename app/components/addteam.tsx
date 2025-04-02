"use client";

import { useState } from "react";
import { db, doc, setDoc } from "../../firebase"; // Importando Firestore

const CreateTime: React.FC = () => {
  const [nome, setNome] = useState("");
  const [vitorias, setVitorias] = useState(0);
  const [derrotas, setDerrotas] = useState(0);
  const [jogador1, setJogador1] = useState("");
  const [jogador2, setJogador2] = useState("");
  const [jogador3, setJogador3] = useState("");
  const [jogador4, setJogador4] = useState("");
  const [jogador5, setJogador5] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Referência para o documento do time
      const timeRef = doc(db, "times", nome);

      // Criando o objeto do time
      const timeData = {
        Nome: nome,
        Vitorias: vitorias,
        Derrotas: derrotas,
        pontosFeitos: 0,
        pontosRecebidos: 0,
        Jogadores: {
          Jogador1: { Nome: jogador1, Posição: "Point Guard" },
          Jogador2: { Nome: jogador2, Posição: "Shooting Guard" },
          Jogador3: { Nome: jogador3, Posição: "Small Forward" },
          Jogador4: { Nome: jogador4, Posição: "Power Forward" },
          Jogador5: { Nome: jogador5, Posição: "Center" },
        },
      };

      // Salvando no Firestore
      await setDoc(timeRef, timeData);

      // Resetando os campos
      setNome("");
      setVitorias(0);
      setDerrotas(0);
      setJogador1("");
      setJogador2("");
      setJogador3("");
      setJogador4("");
      setJogador5("");
    } catch (err) {
      setError("Erro ao adicionar time, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="font-heading font-semibold text-blue text-3xl mb-4 uppercase text-center">
        Criar Time
      </h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nome" className="block text-gray-300">
            Nome do Time
          </label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="vitorias" className="block text-gray-300">
            Vitórias
          </label>
          <input
            type="number"
            id="vitorias"
            value={vitorias}
            onChange={(e) => setVitorias(Number(e.target.value))}
            className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="derrotas" className="block text-gray-300">
            Derrotas
          </label>
          <input
            type="number"
            id="derrotas"
            value={derrotas}
            onChange={(e) => setDerrotas(Number(e.target.value))}
            className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="jogador1" className="block text-gray-300">
            Point Guard
          </label>
          <input
            type="text"
            id="jogador1"
            value={jogador1}
            onChange={(e) => setJogador1(e.target.value)}
            className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="jogador2" className="block text-gray-300">
            Shooting Guard
          </label>
          <input
            type="text"
            id="jogador2"
            value={jogador2}
            onChange={(e) => setJogador2(e.target.value)}
            className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="jogador3" className="block text-gray-300">
            Small Foward
          </label>
          <input
            type="text"
            id="jogador3"
            value={jogador3}
            onChange={(e) => setJogador3(e.target.value)}
            className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="jogador4" className="block text-gray-300">
            Power Foward
          </label>
          <input
            type="text"
            id="jogador4"
            value={jogador4}
            onChange={(e) => setJogador4(e.target.value)}
            className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="jogador5" className="block text-gray-300">
            Center
          </label>
          <input
            type="text"
            id="jogador5"
            value={jogador5}
            onChange={(e) => setJogador5(e.target.value)}
            className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
            required
          />
        </div>
        <div className="flex justify-center items-center">
        <button
          type="submit"
          disabled={loading}
          className="w-full flex text-center justify-between items-center px-5 h-12 bg-gray-500 text-blue font-semibold rounded-xl cursor-pointer hover:bg-blue hover:text-gray-900 transition-colors duration-300 mt-6"
        >
          {loading ? "Carregando..." : "Criar Time"}
        </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTime;
