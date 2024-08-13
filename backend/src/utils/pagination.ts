import { Request } from 'express';
export interface PaginationOptions {
    page: number;
    limit: number;
}

export function getPaginationOptions(req: Request): PaginationOptions {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    return { page, limit };
}

export function paginate(query: any, options: PaginationOptions) {
    const { page, limit } = options;
    const offset = (page - 1) * limit;
    return query.limit(limit).offset(offset);
}

// Use in routes like this:
// router.get('/', async (req, res) => {
//   const options = getPaginationOptions(req);
//   const paginatedQuery = paginate(db.select().from(problems), options);
//   const results = await paginatedQuery;
//   res.json(results);
// });