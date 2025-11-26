"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("./schemas/product.schema");
let ProductService = class ProductService {
    productModel;
    constructor(productModel) {
        this.productModel = productModel;
    }
    async create(dto) {
        const product = new this.productModel(dto);
        return await product.save();
    }
    async findAll(query) {
        const filters = {};
        if (query.text)
            filters.$text = { $search: query.text };
        if (query.brand)
            filters.brand = new RegExp(query.brand, 'i');
        if (query.categoryId)
            filters.categoryIds = query.categoryId;
        if (query.condition)
            filters.condition = query.condition;
        if (query.tags?.length)
            filters.tags = { $in: query.tags };
        if (query.minPrice || query.maxPrice) {
            filters.price = {};
            if (query.minPrice)
                filters.price.$gte = query.minPrice;
            if (query.maxPrice)
                filters.price.$lte = query.maxPrice;
        }
        if (query.minRating)
            filters.ratingAvg = { $gte: query.minRating };
        if (query.isActive !== undefined)
            filters.isActive = query.isActive;
        const sort = {};
        if (query.sortBy)
            sort[query.sortBy] = query.sortOrder === 'desc' ? -1 : 1;
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.productModel.find(filters).sort(sort).skip(skip).limit(limit).exec(),
            this.productModel.countDocuments(filters),
        ]);
        return { items, total };
    }
    async findOne(id) {
        return this.productModel.findById(id).exec();
    }
    async update(id, dto) {
        return this.productModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    }
    async remove(id) {
        await this.productModel.findByIdAndDelete(id).exec();
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProductService);
//# sourceMappingURL=product.service.js.map