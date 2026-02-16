import type { b } from "node_modules/tailwindcss/dist/types-CJYAW1ql.d.mts";

/**
 * Tipado para Categorías
 */
export interface CategoryRequest {
  name: string;
  description?: string;
}

export interface CategoryResponse {
  id: string; // UUID generado por Spring Boot
  name: string;
  description: string;
  createdAt: string; // ISO Date string
}

/**
 * Tipado para Productos
 */
export interface ProductRequest {
  name: string;
  description?: string;
  categoryId: bigint; // ID de la categoría a la que pertenece el producto
  price: number;
  sku: string;
  imageUrl?: string;
}

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  categoryId: bigint;
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
  productId: bigint;
  quantity: number;
  minStock: number;
  location: string;
}

export interface InventoryResponse {
  id: bigint;
  productId: bigint;
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