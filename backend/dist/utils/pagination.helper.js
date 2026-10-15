export function applyPagination(queryBuilder, page, limit) {
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);
}
export function buildPaginationMeta(total, page, limit) {
    const totalPages = Math.ceil(total / limit);
    return {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
    };
}
//# sourceMappingURL=pagination.helper.js.map