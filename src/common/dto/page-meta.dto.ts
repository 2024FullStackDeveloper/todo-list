export class PageMetaDto {
    readonly page: number;
    readonly limit: number;
    readonly itemCount: number;
    readonly pageCount: number;
    readonly hasPreviousPage: boolean;
    readonly hasNextPage: boolean;

    constructor(
        page: number,
        limit: number,
        itemCount: number
    ) {
        this.page = page;
        this.limit = limit;
        this.itemCount = itemCount;
        this.pageCount = Math.ceil(itemCount / limit);
        this.hasPreviousPage = page > 1;
        this.hasNextPage = page < this.pageCount;
    }
}


export class PageDto<T> {
    readonly data: T[];
    readonly meta: PageMetaDto;

    constructor(data: T[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}