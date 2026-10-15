import { apiFetch } from '@/lib/api';
import { Product, CreateProductDto } from './types';

export async function fetchProducts(): Promise<Product[]> {
  try {
    return await apiFetch<Product[]>('/products');
  } catch (error) {
    console.warn('Backend products not reachable, fallback empty:', error);
    return [];
  }
}

export async function fetchProductById(id: string): Promise<Product> {
  return await apiFetch<Product>(`/products/${id}`);
}

export async function createProduct(dto: CreateProductDto): Promise<Product> {
  return await apiFetch<Product>('/products', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}
