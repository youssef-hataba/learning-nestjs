var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Get, Param, Post, Put, Delete, ParseUUIDPipe, UseGuards, Query, UseInterceptors, UploadedFiles, BadRequestException, Res, } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { CreateProductDto } from "./DTOs/create-product.dto.js";
import { UpdateProductDto } from "./DTOs/update-product.dto.js";
import { QueryProductsDto } from "./DTOs/query-products.dto.js";
import { ProductsService } from "./products.service.js";
import { AuthGuard } from "../users/guards/auth.guard.js";
import { RolesGuard } from "../users/guards/roles.guard.js";
import { CurrentUser } from "../users/decorators/current-user.decorator.js";
import { Roles } from "../users/decorators/user-role.decorator.js";
import { UserType } from "../utils/enums.js";
import { productImagesUploadOptions, MAX_PRODUCT_IMAGES } from "./helpers/product-images-upload.helper.js";
let ProductsController = class ProductsController {
    productsService;
    constructor(productsService) {
        this.productsService = productsService;
    }
    createProduct(body, user) {
        return this.productsService.createProduct(body, user.userId);
    }
    getAllProducts(query) {
        return this.productsService.getAllProducts(query);
    }
    getProductImage(filename, res) {
        const filePath = this.productsService.getProductImagePath(filename);
        res.sendFile(filePath);
    }
    getProductById(id) {
        return this.productsService.getProductById(id);
    }
    updateProduct(id, body) {
        return this.productsService.updateProduct(id, body);
    }
    deleteProduct(id) {
        return this.productsService.deleteProduct(id);
    }
    uploadProductImages(id, files) {
        if (!files || files.length === 0) {
            throw new BadRequestException("At least one product image file is required");
        }
        return this.productsService.uploadProductImages(id, files);
    }
    deleteProductImage(id, filename) {
        return this.productsService.deleteProductImage(id, filename);
    }
};
__decorate([
    Post(),
    Roles(UserType.ADMIN),
    UseGuards(AuthGuard, RolesGuard),
    __param(0, Body()),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateProductDto, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "createProduct", null);
__decorate([
    Get(),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QueryProductsDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getAllProducts", null);
__decorate([
    Get("images/:filename"),
    __param(0, Param("filename")),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "getProductImage", null);
__decorate([
    Get(":id"),
    __param(0, Param("id", ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProductById", null);
__decorate([
    Put(":id"),
    Roles(UserType.ADMIN),
    UseGuards(AuthGuard, RolesGuard),
    __param(0, Param("id", ParseUUIDPipe)),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateProduct", null);
__decorate([
    Delete(":id"),
    Roles(UserType.ADMIN),
    UseGuards(AuthGuard, RolesGuard),
    __param(0, Param("id", ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "deleteProduct", null);
__decorate([
    Post(":id/images"),
    Roles(UserType.ADMIN),
    UseGuards(AuthGuard, RolesGuard),
    UseInterceptors(FilesInterceptor("images", MAX_PRODUCT_IMAGES, productImagesUploadOptions)),
    __param(0, Param("id", ParseUUIDPipe)),
    __param(1, UploadedFiles()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "uploadProductImages", null);
__decorate([
    Delete(":id/images/:filename"),
    Roles(UserType.ADMIN),
    UseGuards(AuthGuard, RolesGuard),
    __param(0, Param("id", ParseUUIDPipe)),
    __param(1, Param("filename")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "deleteProductImage", null);
ProductsController = __decorate([
    Controller("products"),
    __metadata("design:paramtypes", [ProductsService])
], ProductsController);
export { ProductsController };
//# sourceMappingURL=products.controller.js.map