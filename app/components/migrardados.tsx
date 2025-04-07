"use client";

import { useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  DocumentData,
} from "firebase/firestore";

interface JogadorAntigo {
  Nome: string;
  Posição: string;
  Jogos: number;
  assistencias?: number;
  bloqueios?: number;
  erros?: number;
  faltas?: number;
  fga?: number;
  fgm?: number;
  fta?: number;
  ftm?: number;
  pontuacao?: number;
  rebotes?: number;
  roubos?: number;
  tpa?: number;
  tpm?: number;
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

const MigrarJogadoresParaTimes = () => {
  const [migrando, setMigrando] = useState(false);

  const handleMigracao = async () => {
    setMigrando(true);
  
    try {
      const timesSnapshot = await getDocs(collection(db, "times"));
  
      for (const timeDoc of timesSnapshot.docs) {
        const timeId = timeDoc.id;
        const timeData = timeDoc.data() as TimeAntigo;
  
        const jogadoresData = timeData.Jogadores;
  
        if (!jogadoresData || typeof jogadoresData !== "object") {
          console.warn(`⚠️ Nenhum jogador encontrado no time: ${timeId}`);
          continue;
        }
  
        for (const [jogadorKey, jogador] of Object.entries(jogadoresData)) {
          if (!jogador || typeof jogador !== "object") continue;
  
          const jogadorDoc = {
            nome: jogador.Nome || jogadorKey,
            posicao: jogador.Posição || "",
            jogos: 0,
            timeId: timeId,
            assistencias: 0,
            bloqueios: 0,
            erros: 0,
            faltas: 0,
            fga: 0,
            fgm: 0,
            fta: 0,
            ftm: 0,
            pontuacao: 0,
            rebotes: 0,
            roubos: 0,
            tpa: 0,
            tpm: 0,
          };
  
          const jogadorId = jogador.Nome?.toLowerCase().replace(/\s+/g, "_") || jogadorKey;
          const jogadorRef = doc(db, "times_v2", timeId, "jogadores", jogadorId);
  
          console.log(`📤 Adicionando jogador "${jogadorKey}" no time "${timeId}" com campos zerados`);
  
          await setDoc(jogadorRef, jogadorDoc);
        }
      }
  
      alert("✅ Jogadores migrados com sucesso com campos zerados!");
    } catch (error) {
      console.error("❌ Erro ao migrar jogadores:", error);
      alert("Erro ao migrar jogadores. Veja o console.");
    } finally {
      setMigrando(false);
    }
  };
  
  return (
    <div className="p-6 max-w-xl mx-auto bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">
        Migrar Jogadores
      </h2>
      <button
        onClick={handleMigracao}
        disabled={migrando}
        className="bg-purple hover:bg-purple/90 transition px-4 py-2 rounded disabled:opacity-50"
      >
        {migrando ? "Migrando..." : "Migrar Jogadores"}
      </button>
    </div>
  );
};

export default MigrarJogadoresParaTimes;
