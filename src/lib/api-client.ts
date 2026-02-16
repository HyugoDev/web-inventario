const BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  // Manejo de errores profesional: Captura el error de Spring Boot
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `Error HTTP: ${response.status}`);
  }

  // Manejo de 204 No Content
  if (response.status === 204) return {} as T;

  return response.json();
}