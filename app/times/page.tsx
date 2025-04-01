"use client";

import ExibirTimes from "../components/exibirtimes";
import { Button } from "../components/button";

export default function InvitePage() {
  return (
    <div className="min-h-dvh flex items-center justify-center gap-8 flex-col md:flex-rw">
      <ExibirTimes />
      <div className="mb-10">
        <Button onClick={() => (window.location.href = "/")}>Voltar</Button>
      </div>
    </div>
  );
}
