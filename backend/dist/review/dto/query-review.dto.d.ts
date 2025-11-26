export declare class QueryReviewDto {
    productId?: string;
    userId?: string;
    rating?: number;
    isApproved?: boolean | string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'rating';
    sortOrder?: 'asc' | 'desc';
}
