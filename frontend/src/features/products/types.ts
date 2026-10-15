export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
  reviews?: {
    id: string;
    rating: number;
    comment: string;
  }[];
}

export interface CreateProductDto {
  title: string;
  description: string;
  price: number;
  images?: string[];
}
