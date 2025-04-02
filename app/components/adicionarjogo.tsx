import { useState } from "react";
import { db } from "../../firebase"; // Supondo que o Firestore esteja configurado corretamente
import { doc, getDoc, updateDoc } from "firebase/firestore";

// Definindo o tipo Jogo
interface Jogo {
  data: string;
  horario: string;
  time1: string;
  time2: string;
}

const AdicionarJogo = () => {
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [time1, setTime1] = useState("");
  const [time2, setTime2] = useState("");
  const [loading, setLoading] = useState(false); // Estado de carregamento

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data || !horario || !time1 || !time2) {
      alert("Todos os campos são obrigatórios!");
      return;
    }

    setLoading(true); // Inicia o carregamento

    try {
      // Acessando o documento "jogos" na coleção "calendario"
      const docRef = doc(db, "calendario", "jogos");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const jogosList: Jogo[] = docSnap.data().jogos || [];  // Garantindo que jogosList tem o tipo Jogo[]
        jogosList.push({ data, horario, time1, time2 });

        // Atualiza o documento com os novos dados
        await updateDoc(docRef, {
          jogos: jogosList,
        });

        alert("Jogo adicionado com sucesso!");
        setData("");
        setHorario("");
        setTime1("");
        setTime2("");
      } else {
        console.log("Documento 'jogos' não encontrado!");
      }
    } catch (error) {
      console.error("Erro ao adicionar jogo:", error);
      alert("Erro ao adicionar jogo. Tente novamente.");
    } finally {
      setLoading(false); // Fim do carregamento
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-semibold text-gray-200 text-center mb-6">
        Adicionar Jogos
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="data" className="text-gray-200">
            Data:
          </label>
          <input
            type="date"
            id="data"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full p-2 rounded-md bg-gray-700 text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="horario" className="text-gray-200">
            Horário:
          </label>
          <input
            type="time"
            id="horario"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
            className="w-full p-2 rounded-md bg-gray-700 text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="time1" className="text-gray-200">
            Time 1:
          </label>
          <input
            type="text"
            id="time1"
            value={time1}
            onChange={(e) => setTime1(e.target.value)}
            className="w-full p-2 rounded-md bg-gray-700 text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="time2" className="text-gray-200">
            Time 2:
          </label>
          <input
            type="text"
            id="time2"
            value={time2}
            onChange={(e) => setTime2(e.target.value)}
            className="w-full p-2 rounded-md bg-gray-700 text-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-5 h-12 bg-gray-500 text-blue font-semibold rounded-xl w-auto cursor-pointer hover:bg-blue hover:text-gray-900 transition-colors duration-300"
        >
          {loading ? "Carregando..." : "Adicionar Jogo"}
        </button>
      </form>
    </div>
  );
};

export default AdicionarJogo;
