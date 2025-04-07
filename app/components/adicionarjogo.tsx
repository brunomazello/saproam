import { useEffect, useState } from "react";
import { db, setDoc } from "../../firebase";
import { collection, addDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdicionarJogo = () => {
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [time1, setTime1] = useState("");
  const [time2, setTime2] = useState("");
  const [twitchUser, setTwitchUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [timesDisponiveis, setTimesDisponiveis] = useState<string[]>([]);

  function gerarIDPadrao(time1: string, time2: string, data: string) {
    const t1 = time1.trim().toLowerCase().replace(/\s+/g, "-");
    const t2 = time2.trim().toLowerCase().replace(/\s+/g, "-");
    const dataFormatada = data.replace(/-/g, "");
    return `${t1}_vs_${t2}_${dataFormatada}`;
  }


  const buscarJogadoresDoTime = async (nomeTime: string) => {
    const jogadoresRef = collection(db, "times_v2", nomeTime, "jogadores");
    const snapshot = await getDocs(jogadoresRef);
    const jogadores: any = {};

    snapshot.forEach((doc) => {
      const data = doc.data();
      jogadores[doc.id] = {
        nome: data.nome || "",
        posicao: data.posicao || "",
        // Remova os campos indesejados, como pontosFeitos e pontosRecebidos
        pontuacao: 0,
        rebotes: 0,
        assistencias: 0,
        roubos: 0,
        bloqueios: 0,
        faltas: 0,
        erros: 0,
        fgm: 0,
        fga: 0,
        tpm: 0,
        tpa: 0,
        ftm: 0,
        fta: 0,
        // Não inclua pontosFeitos e pontosRecebidos aqui
      };
    });

    return jogadores;
  };

  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "times_v2"));
        const nomes: string[] = [];
        querySnapshot.forEach((doc) => {
          nomes.push(doc.id);
        });
        setTimesDisponiveis(nomes);
      } catch (error) {
        console.error("Erro ao buscar times:", error);
        toast.error("Erro ao carregar times disponíveis.");
      }
    };

    fetchTimes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data || !horario || !time1 || !time2 || !twitchUser) {
      toast.error("Todos os campos são obrigatórios!");
      return;
    }

    if (time1 === time2) {
      toast.error("Os times devem ser diferentes!");
      return;
    }

    setLoading(true);

    try {
      const id = gerarIDPadrao(time1, time2, data);
      const docRef = doc(db, "calendario_v2", id);


      const jogadoresTime1 = await buscarJogadoresDoTime(time1);
      const jogadoresTime2 = await buscarJogadoresDoTime(time2);

      const jogadores = {
        [time1]: jogadoresTime1,
        [time2]: jogadoresTime2,
      };

      await setDoc(docRef, {
        data,
        horario,
        time1,
        time2,
        twitchUser,
        placar: {},
        jogadores,
      });

      toast.success("Jogo adicionado com sucesso!");
      setData("");
      setHorario("");
      setTime1("");
      setTime2("");
      setTwitchUser("");
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
            <select
              id="time1"
              value={time1}
              onChange={(e) => setTime1(e.target.value)}
              className="mt-1 w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600"
            >
              <option value="">Selecione um time</option>
              {timesDisponiveis.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="time2"
              className="block text-sm font-medium text-gray-300"
            >
              Time 2
            </label>
            <select
              id="time2"
              value={time2}
              onChange={(e) => setTime2(e.target.value)}
              className="mt-1 w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600"
            >
              <option value="">Selecione um time</option>
              {timesDisponiveis.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="twitchUser"
              className="block text-sm font-medium text-gray-300"
            >
              Usuário da Twitch
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
