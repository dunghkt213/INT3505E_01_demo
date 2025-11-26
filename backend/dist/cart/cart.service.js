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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const cart_schema_1 = require("./schema/cart.schema");
let CartService = class CartService {
    cartModel;
    constructor(cartModel) {
        this.cartModel = cartModel;
    }
    async getUserCart(userId) {
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        return this.cartModel.findOne({ userId: userObjectId }).lean();
    }
    async addToCart(userId, dto) {
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        const productObjectId = new mongoose_2.Types.ObjectId(dto.productId);
        let cart = await this.cartModel.findOne({ userId: userObjectId });
        if (!cart) {
            return this.cartModel.create({
                userId: userObjectId,
                items: [{ productId: productObjectId, quantity: dto.quantity }],
            });
        }
        const item = cart.items.find((i) => i.productId.equals(productObjectId));
        if (item) {
            item.quantity += dto.quantity;
        }
        else {
            cart.items.push({ productId: productObjectId, quantity: dto.quantity });
        }
        await cart.save();
        return cart;
    }
    async updateQuantity(userId, dto) {
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        const productObjectId = new mongoose_2.Types.ObjectId(dto.productId);
        const cart = await this.cartModel.findOne({ userId: userObjectId });
        if (!cart)
            return null;
        const item = cart.items.find((i) => i.productId.equals(productObjectId));
        if (item)
            item.quantity = dto.quantity;
        await cart.save();
        return cart;
    }
    async removeItem(userId, productId) {
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        const productObjectId = new mongoose_2.Types.ObjectId(productId);
        const cart = await this.cartModel.findOne({ userId: userObjectId });
        if (!cart)
            return null;
        cart.items = cart.items.filter((i) => !i.productId.equals(productObjectId));
        await cart.save();
        return cart;
    }
    async clearCart(userId) {
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        return this.cartModel.findOneAndUpdate({ userId: userObjectId }, { items: [] }, { new: true });
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cart_schema_1.Cart.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CartService);
//# sourceMappingURL=cart.service.js.map