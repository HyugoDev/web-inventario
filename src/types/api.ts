
/**
 * Tipado para Categorías
 */
export interface CategoryRequest {
  name: string;
  description?: string;
}

export interface CategoryResponse {
  id: string; //  generado por Spring Boot
  name: string;
  description?: string;
}

/**
 * Tipado para Productos
 */
export interface ProductRequest {
  name: string;
  description?: string;
  categoryId: string;
  price: number;
  sku: string;
  imageUrl?: string;
}

export interface ProductResponse {
  id: bigint;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string; // Mapeado profesionalmente desde la entidad Category
  price: number;
  sku: string;
  imageUrl?: string;
  createdAt: string;
}

/**
 * Tipado para Inventario
 */
export interface InventoryRequest {
  productId: string;
  quantity: number;
  minStock: number;
  location: string;
}

export interface InventoryResponse {
  id: string;
  productId: string;
  productName: string; // Mapeado para evitar fetch extra en el frontend
  quantity: number;
  minStock: number;
  location: string;
  lastUpdated: string;
}

/**
 * Tipado para Errores (Manejo Global de Excepciones)
 */
export interface ApiError {
  timestamp: string;
  message: string;
  code: string;
  details?: Record<string, string>; // Para errores de validación (campo: mensaje)
}