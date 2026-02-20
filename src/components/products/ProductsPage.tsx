import { QueryProvider } from "@/components/QueryProvider";
import { ProductsManager } from "@/components/products/ProductsManager";


export default function ProductsPage() {
  return (
    <QueryProvider>
       <ProductsManager />
    </QueryProvider>
  );
}