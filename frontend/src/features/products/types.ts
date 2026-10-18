export type PlantPlacement = 'INDOOR' | 'OUTDOOR' | 'BOTH';
export type LightRequirement = 'LOW_LIGHT' | 'INDIRECT_BRIGHT' | 'DIRECT_SUN';
export type WateringFrequency = 'LOW' | 'MODERATE' | 'HIGH';
export type CareLevel = 'EASY' | 'MODERATE' | 'EXPERT';

export interface ProductReview {
  id: string;
  rating: number;
  comment: string;
  createdAt?: string;
  user?: {
    id: string;
    username: string;
    profileImage?: string;
  };
}

export interface Product {
  id: string;
  title: string;
  scientificName?: string;
  description: string;
  price: number;
  stock: number;
  placement?: PlantPlacement;
  lightRequirement?: LightRequirement;
  wateringFrequency?: WateringFrequency;
  careLevel?: CareLevel;
  isPetFriendly?: boolean;
  humidity?: string;
  potSize?: string;
  category?: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  reviews?: ProductReview[];
  user?: {
    id: string;
    username: string;
    email?: string;
    profileImage?: string;
  };
}

export interface PaginatedProductsResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface CreateProductDto {
  title: string;
  scientificName?: string;
  description: string;
  price: number;
  stock?: number;
  placement?: PlantPlacement;
  lightRequirement?: LightRequirement;
  wateringFrequency?: WateringFrequency;
  careLevel?: CareLevel;
  isPetFriendly?: boolean;
  humidity?: string;
  potSize?: string;
  category?: string;
  images?: string[];
}
