import AdicionarTime from "../components/addteam";
import ListarTimes from "../components/listartimes";
import ExibirTimes from "../components/exibirtimes";
import EditarTime from "../components/editartimes";
import AtualizarPontuacao from "../components/editarjogador";

export default function InvitePage() {
  return (
    <div className="min-h-dvh flex items-center justify-between gap-16 flex-col md:flex-row">
      <ExibirTimes />
    </div>
  );
}
