import { QueryProvider } from "@/components/QueryProvider";
import { CategoriesManager } from "./CategoriesManager";

// Este es el único componente que Astro llamará
export default function CategoriasPage() {
  return (
    <QueryProvider>
       <CategoriesManager />
    </QueryProvider>
  );
}