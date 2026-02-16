import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-client';
import type { ProductResponse, ProductRequest } from '@/types/api';

export const useProducts = () => {
  const queryClient = useQueryClient();

  // GET: Obtener todos los productos con caché de 5 minutos
  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: () => apiRequest<ProductResponse[]>('/products'),
    staleTime: 1000 * 60 * 5, 
  });

  // POST: Crear producto con Invalidación de Caché (Actualización instantánea)
  const createProductMutation = useMutation({
    mutationFn: (newProduct: ProductRequest) => 
      apiRequest<ProductResponse>('/products', {
        method: 'POST',
        body: JSON.stringify(newProduct),
      }),
    onSuccess: () => {
      // Al crear uno nuevo, obligamos a la app a refrescar la lista de productos
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return { productsQuery, createProductMutation };
};