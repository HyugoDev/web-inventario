import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api-client";
import { sileo } from "sileo";
import type { CategoryResponse, CategoryRequest } from "@/types/api";

export const useCategories = (searchQuery: string = "") => {
  const queryClient = useQueryClient();

  // 1. Obtener categorías
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiRequest<CategoryResponse[]>("/categories"),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // 1.1 hacer el search de categorias por nombre
  
  const categoriesSearchQuery = useQuery({
   // Importante: El queryKey cambia según el searchTerm para cachear resultados distintos
    queryKey: ["categories", searchQuery], 
    queryFn: () => {
      // Si hay búsqueda, usamos /categories/search, si no, /categories
      const path = searchQuery 
        ? `/categories/search?search=${encodeURIComponent(searchQuery)}` 
        : "/categories";
      return apiRequest<CategoryResponse[]>(path);
    },
    // Mantenemos la data anterior mientras cargamos la nueva para evitar parpadeos (opcional)
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });




  // 2. Mutación para CREAR (La que te faltaba)
  const createMutation = useMutation({
    mutationFn: (newCategory: CategoryRequest) =>
      apiRequest<CategoryResponse>("/categories", {
        method: "POST",
        body: JSON.stringify(newCategory),
      }),
    onSuccess: () => {
      sileo.success({
        title: "Categoría creada",
        description: "El catálogo ha sido actualizado.",
      });
      // Esto hace que la tabla se refresque automáticamente
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: Error) => {
      sileo.error({
        title: "Error al crear",
        description: error.message,
      });
    },
  });

  // 3. Mutación para ELIMINAR
  const deleteMutation = useMutation({
    mutationFn: (id: bigint) =>
      apiRequest(`/categories/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      sileo.success({ title: "Eliminado", description: "Registro borrado." });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: Error) => {
      sileo.error({ title: "Error", description: error.message });
    },
  });

  return {
    categoriesQuery,
    categoriesSearchQuery,
    createMutation,
    deleteMutation,
  };
};
