import React from 'react';
import { enviarJogosParaFirestore } from './import';

const SendJogosButton = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={enviarJogosParaFirestore}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-400"
      >
        Enviar Jogos para o Firestore
      </button>
    </div>
  );
};

export default SendJogosButton;
