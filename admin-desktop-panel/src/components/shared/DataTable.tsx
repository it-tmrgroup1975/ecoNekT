import { useState } from "react";
import { 
  flexRender, 
  getCoreRowModel, 
  useReactTable, 
  getPaginationRowModel, 
  getSortedRowModel, 
  getFilteredRowModel 
} from "@tanstack/react-table";
import type { SortingState, ColumnDef } from "@tanstack/react-table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";

// 1. แก้ไข DataTableProps ให้รับ 2 Generic Arguments
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]; // ต้องใช้ TValue ที่นี่
  data: TData[];
  searchPlaceholder?: string;
}

// 2. ระบุ Generic ให้กับฟังก์ชัน DataTable ให้ครบทั้ง TData และ TValue
export function DataTable<TData, TValue>({ 
  columns, 
  data, 
  searchPlaceholder 
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder || "ค้นหา..."}
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 border-primary/10 focus-visible:ring-primary/20 rounded-xl"
          />
        </div>
        <Button variant="outline" className="border-primary/10 text-primary gap-2 rounded-xl">
          <SlidersHorizontal className="h-4 w-4" />
          ตัวกรองขั้นสูง
        </Button>
      </div>

      {/* Table Body */}
      <div className="rounded-2xl border border-primary/5 bg-white/50 backdrop-blur-sm overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-primary/5 border-b border-primary/5 text-primary">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-4 py-3 text-left font-bold cursor-pointer hover:bg-primary/5 transition-colors"
                      onClick={header.column.getToggleSortingHandler()}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-primary/5">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-secondary/5 transition-colors group">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-3 text-muted-foreground group-hover:text-foreground">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2 py-4">
        <p className="text-xs text-muted-foreground">
          แสดง {table.getRowModel().rows.length} จาก {data.length} รายการ
        </p>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}