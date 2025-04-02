import RankingJogadores from "../components/rankingjogadores";
import TimerPage from "../components/timerpage";

export default function InvitePage() {
  const inviteLink = "http://localhost:3000/invite/12931289381238";

  return (
    <div className="min-h-dvh flex items-center justify-between gap-16 flex-col md:flex-row">
      <RankingJogadores/>
    </div>
  );
}
