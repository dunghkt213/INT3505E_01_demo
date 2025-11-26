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
exports.ReviewService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const review_schema_1 = require("./schemas/review.schema");
const mongoose_3 = require("mongoose");
const user_service_1 = require("../user/user.service");
const product_service_1 = require("../product/product.service");
let ReviewService = class ReviewService {
    reviewModel;
    userService;
    productService;
    constructor(reviewModel, userService, productService) {
        this.reviewModel = reviewModel;
        this.userService = userService;
        this.productService = productService;
    }
    async create(dto, userId) {
        const product = await this.productService.findOne(dto.productId).catch(() => null);
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const user = await this.userService.findOne(userId).catch(() => null);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const existed = await this.reviewModel.findOne({
            productId: new mongoose_3.Types.ObjectId(dto.productId),
            userId: new mongoose_3.Types.ObjectId(userId),
        });
        if (existed) {
            throw new common_1.BadRequestException('You have already reviewed this product');
        }
        const created = await this.reviewModel.create({
            ...dto,
            userId: new mongoose_3.Types.ObjectId(userId),
            productId: new mongoose_3.Types.ObjectId(dto.productId),
            isApproved: true,
        });
        return {
            message: 'Review created successfully',
            review: created,
        };
    }
    async findAll(query) {
        const { productId, userId, rating, isApproved, search, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10, } = query;
        const filter = {};
        if (productId)
            filter.productId = productId;
        if (userId)
            filter.userId = userId;
        if (rating)
            filter.rating = rating;
        if (typeof isApproved === 'boolean')
            filter.isApproved = isApproved;
        if (search)
            filter.comment = { $regex: search, $options: 'i' };
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.reviewModel
                .find(filter)
                .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            this.reviewModel.countDocuments(filter),
        ]);
        return {
            items: items,
            total,
            page,
            limit: limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const review = await this.reviewModel.findById(id).lean();
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        return { ...review };
    }
    async update(id, userId, role, dto) {
        const review = await this.reviewModel.findById(id);
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        if (review.userId.toString() !== userId && role !== 'admin') {
            throw new common_1.ForbiddenException('You are not allowed to edit this review');
        }
        const { rating, comment } = dto;
        const updateFields = {};
        if (rating !== undefined)
            updateFields.rating = rating;
        if (comment !== undefined)
            updateFields.comment = comment;
        const updated = await this.reviewModel
            .findByIdAndUpdate(id, updateFields, { new: true })
            .lean();
        return {
            message: 'Review updated successfully',
            review: updated,
        };
    }
    async delete(id, userId, role) {
        const review = await this.reviewModel.findById(id);
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        if (review.userId.toString() !== userId && role !== 'admin') {
            throw new common_1.ForbiddenException('You are not allowed to delete this review');
        }
        await this.reviewModel.findByIdAndDelete(id);
        return {
            message: 'Review deleted successfully',
            reviewId: id,
            deletedBy: userId,
        };
    }
};
exports.ReviewService = ReviewService;
exports.ReviewService = ReviewService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(review_schema_1.Review.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        user_service_1.UserService,
        product_service_1.ProductService])
], ReviewService);
//# sourceMappingURL=review.service.js.map