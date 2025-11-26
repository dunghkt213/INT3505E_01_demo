import { Model } from 'mongoose';
import { Cart } from './schema/cart.schema';
import { AddToCartDto } from './dto/create-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';
export declare class CartService {
    private readonly cartModel;
    constructor(cartModel: Model<Cart>);
    getUserCart(userId: string): Promise<(import("mongoose").FlattenMaps<Cart> & Required<{
        _id: import("mongoose").FlattenMaps<unknown>;
    }> & {
        __v: number;
    }) | null>;
    addToCart(userId: string, dto: AddToCartDto): Promise<import("mongoose").Document<unknown, {}, Cart, {}, {}> & Cart & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateQuantity(userId: string, dto: UpdateCartItemDto): Promise<(import("mongoose").Document<unknown, {}, Cart, {}, {}> & Cart & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    removeItem(userId: string, productId: string): Promise<(import("mongoose").Document<unknown, {}, Cart, {}, {}> & Cart & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    clearCart(userId: string): Promise<(import("mongoose").Document<unknown, {}, Cart, {}, {}> & Cart & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
