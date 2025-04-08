import React, { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // ajuste o caminho conforme seu projeto

const ContadorJogadores: React.FC = () => {
  const [total, setTotal] = useState<number | null>(null);
  const [doCombine, setDoCombine] = useState<number>(0);
  const [dosTimes, setDosTimes] = useState<number>(0);

  useEffect(() => {
    const contarJogadores = async () => {
      const jogadoresUnicos = new Set<string>();
      const jogadoresCombine = new Set<string>();
      const jogadoresTimes = new Set<string>();

      // 🔹 Buscar jogadores do Combine
      try {
        const combineDoc = await getDoc(doc(db, "combine", "jogadores"));
        if (combineDoc.exists()) {
          const combineData = combineDoc.data();
          Object.keys(combineData).forEach((nome) => {
            jogadoresUnicos.add(nome);
            jogadoresCombine.add(nome);
          });
        }
      } catch (err) {
        console.error("Erro ao buscar jogadores do combine:", err);
      }

      // 🔹 Buscar jogadores de todos os times
      try {
        const timesSnap = await getDocs(collection(db, "times"));

        for (const timeDoc of timesSnap.docs) {
          const timeData = timeDoc.data();
          const jogadores = timeData.Jogadores;

          if (jogadores && typeof jogadores === "object") {
            Object.values(jogadores).forEach((jogadorData: any) => {
              const nome = jogadorData?.Nome;
              if (nome) {
                jogadoresUnicos.add(nome);
                jogadoresTimes.add(nome);
              }
            });
          }
        }
      } catch (err) {
        console.error("Erro ao buscar jogadores dos times:", err);
      }

      // Atualiza os estados
      setTotal(jogadoresUnicos.size);
      setDoCombine(jogadoresCombine.size);
      setDosTimes(jogadoresTimes.size);
    };

    contarJogadores();
  }, []);

  return (
    <div className="bg-gray-700 border border-gray-600 rounded-2xl p-6 w-full mx-auto mt-7">
      <h3 className="text-2xl font-heading text-purple-400 mb-3 text-center">
        Jogadores Cadastrados
      </h3>

      {total !== null ? (
        <div className="space-y-2 text-center">
          <p className="text-5xl font-bold text-blue-400">{total}</p>
          <div className="text-gray-300 text-sm mt-4">
            <p>
              <span className="text-green-400 font-semibold">{doCombine}</span>{" "}
              do Combine
            </p>
            <p>
              <span className="text-yellow-400 font-semibold">{dosTimes}</span>{" "}
              dos Times
            </p>
          </div>
        </div>
      ) : (
        <p className="text-center text-lg text-gray-300">Carregando...</p>
      )}
    </div>
  );
};

export default ContadorJogadores;
