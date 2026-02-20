import { useState } from "react";

import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { CategoryFormDialog } from "@/components/categorias/category-form-dialog";
import { IconPlus, IconDotsVertical } from "@tabler/icons-react";
import type { ColumnDef } from "node_modules/@tanstack/table-core/build/lib/types";

import { type CategoryResponse } from "@/types/api";
import { DataTable } from "@/components/data-table/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function CategoriesManager() {
  const { categoriesQuery, deleteMutation } = useCategories();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<bigint | null>(null);

  // const columns = [
  //   {
  //     header: "ID",
  //     render: (cat: any) => (
  //       <span className="text-primary font-mono text-xs">
  //         #{cat.id.slice(0, 8)}
  //       </span>
  //     ),
  //   },
  //   {
  //     header: "Nombre",
  //     render: (cat: any) => <span className="font-medium">{cat.name}</span>,
  //   },
  //    {
  //     header: "Descripción",
  //     render: (cat: any) => <span className="font-medium">{cat.description}</span>,
  //   },
  //   {
  //     header: "Acciones",
  //     render: (cat: any) => (
  //       <Button
  //         variant="ghost"
  //         size="icon"
  //         onClick={() => setDeleteTargetId(cat.id)}
  //         className="hover:text-destructive"
  //       >
  //         <Trash2 className="h-4 w-4" />
  //       </Button>
  //     ),
  //   },
  // ];

  const columns: ColumnDef<CategoryResponse>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Nombre" },
    { accessorKey: "description", header: "Descripción" },
    {
      id: "actions",
      cell: ({ row }: { row: any }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDeleteTargetId(row.original.id)}
            >
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-mono">CATEGORÍAS</h2>
          <p className="text-muted-foreground text-sm">
            Gestiona el catálogo base
          </p>
        </div>
        <Button
          onClick={() => setFormOpen(true)}
          className="neon-glow font-mono text-xs"
        >
          <IconPlus className="mr-2 h-4 w-4" /> NUEVA CATEGORÍA
        </Button>
      </div>

      <DataTable columns={columns} query={categoriesQuery} />

      <CategoryFormDialog open={formOpen} onOpenChange={setFormOpen} />

      <ConfirmDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        title="ELIMINAR CATEGORÍA"
        description="¿Estás seguro de que deseas eliminar este registro? Esta acción es irreversible y podría afectar a los productos vinculados."
        onConfirm={async () => {
          if (deleteTargetId) {
            await deleteMutation.mutateAsync(deleteTargetId);
            setDeleteTargetId(null); // Esto cierra el diálogo
          }
        }}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
