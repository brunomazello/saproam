"use client";

import { useState } from "react";
import AdicionarTime from "../components/addteam";
import EditarTime from "../components/editartimes";
import EditarJogador from "../components/editarjogador";
import Image from "next/image";
import logo from "../assets/logo.png";
import { Button } from "../components/button";

export default function AdminPage() {
  return (
    <div className="min-h-screen flex items-center justify-center gap-8 flex-col">
      <AdicionarTime />
    </div>
  );
}
