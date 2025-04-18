"use client";
import logo from "../assets/logo.png";
import {
  LandPlot,
  CircleGauge,
  User,
  ShieldQuestion,
  ShieldAlert,
} from "lucide-react";
import { LinkButton } from "../components/button";
import Image from "next/image";
import AdComponent from "../components/AdComponent";
import ListarTimes from "../components/listartimes";
import ExibirTimes from "../components/exibirtimes";
import FullCalendar from "@fullcalendar/react";
import Calendario from "../components/fullcalendar";
export default function Home() {
  return (
    <div className="min-h-dvh flex justify-center gap-8 flex-col md:mb-12 md:mt-12">
      <Calendario />
    </div>
  );
}
