import { apiFetch } from '@/lib/api';
import { Product, CreateProductDto, PaginatedProductsResponse } from './types';

export interface FetchProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  placement?: string;
  careLevel?: string;
  isPetFriendly?: boolean;
}

export async function fetchProducts(params: FetchProductsParams = {}): Promise<Product[]> {
  try {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.placement) query.append('placement', params.placement);
    if (params.careLevel) query.append('careLevel', params.careLevel);
    if (params.isPetFriendly !== undefined) query.append('isPetFriendly', params.isPetFriendly.toString());

    const queryString = query.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products?limit=20';

    const response = await apiFetch<PaginatedProductsResponse | Product[]>(endpoint);

    // Support both paginated { data: Product[], meta: ... } and direct array
    if (response && Array.isArray((response as PaginatedProductsResponse).data)) {
      return (response as PaginatedProductsResponse).data;
    }
    if (Array.isArray(response)) {
      return response;
    }
    return [];
  } catch (error) {
    console.warn('Backend products not reachable, fallback empty:', error);
    return [];
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    return await apiFetch<Product>(`/products/${id}`);
  } catch (error) {
    console.warn(`Failed to fetch product ${id}:`, error);
    return null;
  }
}

export async function createProduct(dto: CreateProductDto): Promise<Product> {
  return await apiFetch<Product>('/products', {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export async function addProductReview(productId: string, rating: number, comment: string) {
  return await apiFetch(`/reviews/products/${productId}`, {
    method: 'POST',
    body: JSON.stringify({ rating, comment }),
  });
}
