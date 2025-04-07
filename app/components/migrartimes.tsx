'use client'

import { useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  DocumentData,
} from "firebase/firestore";

// Interfaces para dados antigos
interface JogadorAntigo {
  Nome: string;
  Posição: string;
  Jogos: number;
}

interface TimeAntigo extends DocumentData {
  Nome: string;
  Dono: string;
  Jogos: number;
  Vitorias: number;
  Derrotas: number;
  Empates: number;
  Pontos: number;
  pontosFeitos: number;
  pontosRecebidos: number;
  Jogadores?: Record<string, JogadorAntigo>;
}

// Interfaces para dados novos
interface TimeNovo {
  nome: string;
  dono: string;
  jogos: number;
  vitorias: number;
  derrotas: number;
  empates: number;
  pontos: number;
  pontosFeitos: number;
  pontosRecebidos: number;
}

interface JogadorNovo {
  nome: string;
  posicao: string;
  jogos: number;
  timeId: string;
}

const MigrarTimes = () => {
  const [migrando, setMigrando] = useState(false);

  const handleMigracao = async () => {
    if (!confirm("Tem certeza que deseja migrar os dados para times_v2 e jogadores?")) return;

    setMigrando(true);

    try {
      const timesSnapshot = await getDocs(collection(db, "times"));

      for (const timeDoc of timesSnapshot.docs) {
        const timeId = timeDoc.id;
        const timeData = timeDoc.data() as TimeAntigo;

        const novoTime: TimeNovo = {
          nome: timeData.Nome || timeId,
          dono: timeData.Dono || "",
          jogos: timeData.Jogos || 0,
          vitorias: timeData.Vitorias || 0,
          derrotas: timeData.Derrotas || 0,
          empates: timeData.Empates || 0,
          pontos: timeData.Pontos || 0,
          pontosFeitos: timeData.pontosFeitos || 0,
          pontosRecebidos: timeData.pontosRecebidos || 0,
        };

        await setDoc(doc(db, "times_v2", timeId), novoTime);

        // Migrar jogadores individualmente
        if (timeData.Jogadores) {
          for (const [jogadorId, jogador] of Object.entries(timeData.Jogadores)) {
            const novoJogador: JogadorNovo = {
              nome: jogador.Nome || jogadorId,
              posicao: jogador.Posição || "",
              jogos: jogador.Jogos || 0,
              timeId: timeId,
            };

            // Define ID como timeId_nome para evitar duplicação
            const jogadorDocId = `${timeId}_${jogadorId}`;

            await setDoc(doc(db, "jogadores", jogadorDocId), novoJogador);
          }
        }
      }

      alert("✅ Migração concluída com sucesso!");
    } catch (error) {
      console.error("Erro ao migrar dados:", error);
      alert("❌ Erro ao migrar dados. Veja o console.");
    } finally {
      setMigrando(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Migrar Times</h2>
      <button
        onClick={handleMigracao}
        disabled={migrando}
        className="bg-blue hover:bg-blue/90 transition px-4 py-2 rounded disabled:opacity-50"
      >
        {migrando ? "Migrando..." : "Iniciar Migração"}
      </button>
    </div>
  );
};

export default MigrarTimes;
