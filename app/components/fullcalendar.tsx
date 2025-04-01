// Calendario.tsx - Componente que exibe os jogos com React Table
import { jogos, Jogo } from "./jogos";
import { useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Calendar } from "lucide-react";

export default function Calendario() {
  const columns: ColumnDef<Jogo>[] = [
    { accessorKey: "data", header: "Data" },
    { accessorKey: "horario", header: "Horário" },
    { accessorFn: (row) => `${row.time1} vs ${row.time2}`, header: "Times" },
  ];

  const table = useReactTable({
    data: jogos,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex flex-col items-center">
        <Calendar size={68}/>
        <h2 className="font-heading font-semibold text-gray-200 text-md text-3xl uppercase text-center mb-6 mt-6">
          Calendário de jogos
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 shadow-md">
          <thead className="bg-gray-600">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border border-gray-300 px-4 py-2 text-center"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-100 hover:text-black text-center">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border border-gray-300 px-4 py-2"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
