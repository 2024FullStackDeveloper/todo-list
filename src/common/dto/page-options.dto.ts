import { createZodDto } from "nestjs-zod";
import z from "zod";

export const pageOptionsSchema = z.object({
    page: z.coerce.number().int().positive().min(1).default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().optional(),
    sort: z.string()
        .optional()
        .transform((val) => {
            if (!val) return {};
            const sortObj: Record<string, "ASC" | "DESC"> = {}
            const pairs = val.split(",");
            for (const pair of pairs) {
                const [key, value] = pair.trim().split(":");
                if (!key || !value) continue;
                sortObj[key] = value.toUpperCase() as "ASC" | "DESC";
            }
            return sortObj;
        })
});

export class PageOptionsDto extends createZodDto(pageOptionsSchema) { }