import Image from "next/image";
import logo from "../../app/assets/logo.svg";
import { Ranking } from "./ranking";
import Stats from "./stats";
import InviteLinkInput from "./invite-link-input";
import AdicionarTime from "../components/addteam";
import ListarTimes from "../components/listartimes";
import ExibirTimes from "../components/exibirtimes";
import EditarTime from "../components/editartimes";
import AtualizarPontuacao from "../components/editarjogador";

export default function InvitePage() {
  const inviteLink = "http://localhost:3000/invite/12931289381238";

  return (
    <div className="min-h-dvh flex items-center justify-between gap-16 flex-col md:flex-row">
      <AdicionarTime />
      <ListarTimes />
      <ExibirTimes/>
      <EditarTime/>
      <AtualizarPontuacao/>
    </div>
  );
}
