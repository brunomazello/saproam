"use client";

import { useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Jogo {
  data: string;
  horario: string;
  time1: string;
  time2: string;
  twitchUser: string; // <- novo campo
}

const AdicionarJogo = () => {
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [time1, setTime1] = useState("");
  const [time2, setTime2] = useState("");
  const [loading, setLoading] = useState(false);
  const [twitchUser, setTwitchUser] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data || !horario || !time1 || !time2 || !twitchUser) {
      toast.error("Todos os campos são obrigatórios!");
      return;
    }

    setLoading(true);

    try {
      const docRef = doc(db, "calendario", "jogos");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const partidas = docSnap.data().partidas || {};
        const id = new Date().toISOString(); // ou `crypto.randomUUID()` se preferir

        partidas[id] = { data, horario, time1, time2, twitchUser };

        await updateDoc(docRef, { partidas });

        toast.success("Jogo adicionado com sucesso!");
        setData("");
        setHorario("");
        setTime1("");
        setTime2("");
        setTwitchUser("");
      } else {
        toast.error("Documento 'jogos' não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao adicionar jogo:", error);
      toast.error("Erro ao adicionar jogo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-gray-800 rounded-lg shadow-lg">
      <ToastContainer />
      <h2 className="font-heading font-semibold text-blue text-3xl mb-8 uppercase text-center cursor-pointer">
        Adicionar Jogo
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label
              htmlFor="data"
              className="block text-sm font-medium text-gray-300"
            >
              Data
            </label>
            <input
              type="date"
              id="data"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="mt-1 w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="horario"
              className="block text-sm font-medium text-gray-300"
            >
              Horário
            </label>
            <input
              type="time"
              id="horario"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
              className="mt-1 w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="time1"
              className="block text-sm font-medium text-gray-300"
            >
              Time 1
            </label>
            <input
              type="text"
              id="time1"
              value={time1}
              onChange={(e) => setTime1(e.target.value)}
              placeholder="Ex: Lakers"
              className="mt-1 w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="time2"
              className="block text-sm font-medium text-gray-300"
            >
              Time 2
            </label>
            <input
              type="text"
              id="time2"
              value={time2}
              onChange={(e) => setTime2(e.target.value)}
              placeholder="Ex: Heat"
              className="mt-1 w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="twitchUser"
              className="block text-sm font-medium text-gray-300"
            >
              Usuario da Twitch
            </label>
            <input
              type="text"
              id="twitchUser"
              value={twitchUser}
              onChange={(e) => setTwitchUser(e.target.value)}
              placeholder="Ex: Lima_Wes"
              className="mt-1 w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-blue text-white font-semibold rounded-md hover:bg-blue/90 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adicionando..." : "Adicionar Jogo"}
        </button>
      </form>
    </div>
  );
};

export default AdicionarJogo;
