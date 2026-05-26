import { ValueTransformer } from "typeorm";

export const LowercaseTransformer: ValueTransformer = {
    to(value: string) {
        return value.toLowerCase();
    },
    from(value: string) {
        return value;
    }
}