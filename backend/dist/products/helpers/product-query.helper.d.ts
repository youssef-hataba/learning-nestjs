import { SelectQueryBuilder } from "typeorm";
import { Product } from "../product.entity.js";
import { QueryProductsDto, ProductSortBy } from "../DTOs/query-products.dto.js";
import { SortOrder } from "../../utils/enums.js";
export declare const PRODUCT_SORT_FIELD_MAP: Record<ProductSortBy, string>;
export declare function applyProductFilters(queryBuilder: SelectQueryBuilder<Product>, query: QueryProductsDto): void;
export declare function applyProductSorting(queryBuilder: SelectQueryBuilder<Product>, sortBy?: ProductSortBy, sortOrder?: SortOrder): void;
