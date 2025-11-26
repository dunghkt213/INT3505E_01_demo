import { Model } from 'mongoose';
import { ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
export declare class ProductService {
    private readonly productModel;
    constructor(productModel: Model<ProductDocument>);
    create(dto: CreateProductDto): Promise<ProductDocument>;
    findAll(query: QueryProductDto): Promise<{
        items: ProductDocument[];
        total: number;
    }>;
    findOne(id: string): Promise<ProductDocument | null>;
    update(id: string, dto: UpdateProductDto): Promise<ProductDocument | null>;
    remove(id: string): Promise<void>;
}
