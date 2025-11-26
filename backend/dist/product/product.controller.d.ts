import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create(dto: CreateProductDto): Promise<import("./schemas/product.schema").ProductDocument>;
    findAll(query: QueryProductDto): Promise<{
        items: import("./schemas/product.schema").ProductDocument[];
        total: number;
    }>;
    findOne(id: string): Promise<import("./schemas/product.schema").ProductDocument | null>;
    update(id: string, dto: UpdateProductDto): Promise<import("./schemas/product.schema").ProductDocument | null>;
    remove(id: string): Promise<void>;
    search(body: QueryProductDto): Promise<{
        items: import("./schemas/product.schema").ProductDocument[];
        total: number;
    }>;
}
