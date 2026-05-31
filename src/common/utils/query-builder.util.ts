import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { PageOptionsDto } from '../dto/page-options.dto';
import { PageDto, PageMetaDto } from '../dto/page-meta.dto';

interface PaginateOptions {
    searchFields?: string[];
}

export async function paginate<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    pageOptionsDto: PageOptionsDto,
    options: PaginateOptions = {},
    defaultSortColumn: string = 'createdAt',
): Promise<PageDto<T>> {
    const alias = queryBuilder.alias;

    // 1. Handle Dynamic Multi-Sorting Automatically
    if (pageOptionsDto.sort && Object.keys(pageOptionsDto.sort).length > 0) {
        Object.entries(pageOptionsDto.sort).forEach(([field, order], index) => {
            if (index === 0) {
                queryBuilder.orderBy(`${alias}.${field}`, order);
            } else {
                queryBuilder.addOrderBy(`${alias}.${field}`, order);
            }
        });
    } else {
        const cols = queryBuilder.expressionMap.mainAlias?.metadata.columns;
        if (cols?.some(col => col.propertyName === defaultSortColumn)) {
            queryBuilder.orderBy(`${alias}.${defaultSortColumn}`, 'DESC');
        }
    }

    // 2. Handle Global Text Search Automatically (if fields are provided)
    if (pageOptionsDto.search && options?.searchFields?.length) {
        options.searchFields.forEach((field, index) => {
            const condition = `${alias}.${field} ILIKE :search`;
            const params = { search: `%${pageOptionsDto.search}%` };

            if (index === 0) {
                queryBuilder.andWhere(condition, params);
            } else {
                queryBuilder.orWhere(condition, params);
            }
        });
    }

    // 3. Handle Pagination
    const page = pageOptionsDto.page ?? 1;
    const limit = pageOptionsDto.limit ?? 10;

    queryBuilder.skip((page - 1) * limit).take(limit);

    // 4. Execute and package response
    const [entities, itemCount] = await queryBuilder.getManyAndCount();
    const pageMetaDto = new PageMetaDto(page, limit, itemCount);

    return new PageDto(entities, pageMetaDto);
}