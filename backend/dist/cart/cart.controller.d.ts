import { CartService } from './cart.service';
import { AddToCartDto } from './dto/create-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(req: any): Promise<(import("mongoose").FlattenMaps<import("./schema/cart.schema").Cart> & Required<{
        _id: import("mongoose").FlattenMaps<unknown>;
    }> & {
        __v: number;
    }) | null>;
    addItem(req: any, dto: AddToCartDto): Promise<import("mongoose").Document<unknown, {}, import("./schema/cart.schema").Cart, {}, {}> & import("./schema/cart.schema").Cart & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateItem(req: any, productId: string, dto: UpdateCartItemDto): Promise<(import("mongoose").Document<unknown, {}, import("./schema/cart.schema").Cart, {}, {}> & import("./schema/cart.schema").Cart & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    removeItem(req: any, productId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schema/cart.schema").Cart, {}, {}> & import("./schema/cart.schema").Cart & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    clearCart(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schema/cart.schema").Cart, {}, {}> & import("./schema/cart.schema").Cart & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
