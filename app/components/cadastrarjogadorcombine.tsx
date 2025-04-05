"use client";
import { useState } from "react";
import { db } from "@/firebase"; // ajuste para seu path
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CadastrarJogadorCombine() {
  const [nome, setNome] = useState("");
  const [posicao, setPosicao] = useState("Point Guard");
  const [assistencias, setAssistencias] = useState(0);
  const [bloqueios, setBloqueios] = useState(0);
  const [erros, setErros] = useState(0);
  const [faltas, setFaltas] = useState(0);
  const [fga, setFga] = useState(0);
  const [fgm, setFgm] = useState(0);
  const [fta, setFta] = useState(0);
  const [ftm, setFtm] = useState(0);
  const [pontuacao, setPontuacao] = useState(0);
  const [rebotes, setRebotes] = useState(0);
  const [roubos, setRoubos] = useState(0);
  const [tpa, setTpa] = useState(0);
  const [tpm, setTpm] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const jogadorData = {
        nome,
        posicao,
        assistencias,
        bloqueios,
        erros,
        faltas,
        fga,
        fgm,
        fta,
        ftm,
        pontuacao,
        rebotes,
        roubos,
        tpa,
        tpm,
      };
      await setDoc(
        doc(db, "combine", "jogadores"), // <- aqui paramos no documento
        {
          [nome]: jogadorData // <- isso é um CAMPO com o nome do jogador
        },
        { merge: true } // <- para não sobrescrever outros jogadores já salvos
      );
      
      toast.success("Jogador cadastrado com sucesso!");
      // resetar campos
      setNome("");
      setPosicao("Point Guard");
      setAssistencias(0);
      setBloqueios(0);
      setErros(0);
      setFaltas(0);
      setFga(0);
      setFgm(0);
      setFta(0);
      setFtm(0);
      setPontuacao(0);
      setRebotes(0);
      setRoubos(0);
      setTpa(0);
      setTpm(0);
    } catch (err) {
      setError("Erro ao cadastrar jogador. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <ToastContainer />
      <h2 className="font-heading font-semibold text-blue text-3xl mb-4 uppercase text-center">
        Cadastrar Jogador (COMBINE)
      </h2>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Nome" value={nome} onChange={setNome} />
        <Select
          label="Posição"
          value={posicao}
          onChange={setPosicao}
          options={[
            "Point Guard",
            "Shooting Guard",
            "Small Forward",
            "Power Forward",
            "Center",
          ]}
        />

        <div className="flex justify-center items-center">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex text-center justify-between items-center px-5 h-12 bg-gray-500 text-blue font-semibold rounded-xl cursor-pointer hover:bg-blue hover:text-gray-900 transition-colors duration-300 mt-6"
          >
            {loading ? "Carregando..." : "Cadastrar Jogador"}
          </button>
        </div>
      </form>
    </div>
  );
}

type InputProps = {
  label: string;
  value: string;
  onChange: (val: string) => void;
};

function Input({ label, value, onChange }: InputProps) {
  const id = label.toLowerCase().replace(" ", "_");
  return (
    <div>
      <label htmlFor={id} className="block text-gray-300">
        {label}
      </label>
      <input
        type="text"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
        required
      />
    </div>
  );
}

type InputNumberProps = {
  label: string;
  value: number;
  onChange: (val: number) => void;
};

function InputNumber({ label, value, onChange }: InputNumberProps) {
  const id = label.toLowerCase().replace(" ", "_");
  return (
    <div>
      <label htmlFor={id} className="block text-gray-300">
        {label}
      </label>
      <input
        type="number"
        id={id}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
        required
      />
    </div>
  );
}

type SelectProps = {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
};

function Select({ label, value, onChange, options }: SelectProps) {
  const id = label.toLowerCase().replace(" ", "_");
  return (
    <div>
      <label htmlFor={id} className="block text-gray-300">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-white"
        required
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
