"use client";
import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { UseQueryResult } from "node_modules/@tanstack/react-query/build/modern/types";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  query: UseQueryResult<TData[], Error>;
}

export function DataTable<TData extends { id: any }>({
  columns,
  query,
}: DataTableProps<TData>) {
  const { data, isLoading, isError, error, isFetching } = query;
  const columnCount = columns.length;
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const tableData = React.useMemo<TData[]>(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row: any) => row.id.toString(),
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {/* LOADING (primera carga) */}
            {isLoading && (
              <TableRow>
                <TableCell colSpan={columnCount} className="h-32 text-center">
                  Cargando datos...
                </TableCell>
              </TableRow>
            )}

            {/* ERROR */}
            {isError && (
              <TableRow>
                <TableCell
                  colSpan={columnCount}
                  className="h-32 text-center text-destructive"
                >
                  {(error as Error).message}
                  <div className="mt-4">
                    <Button size="sm" onClick={() => query.refetch()}>
                      Reintentar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {/* EMPTY STATE */}
            {!isLoading && !isError && tableData.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columnCount}
                  className="h-32 text-center text-muted-foreground"
                >
                  No hay registros
                </TableCell>
              </TableRow>
            )}

            {/* DATA */}
            {!isLoading &&
              !isError &&
              tableData.length > 0 &&
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {/* BACKGROUND REFETCH (muy importante) */}
            {isFetching && !isLoading && (
              <TableRow>
                <TableCell
                  colSpan={columnCount}
                  className="text-center text-xs text-muted-foreground"
                >
                  Actualizando datos...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación simple reutilizable */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
