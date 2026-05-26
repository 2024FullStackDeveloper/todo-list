import { HttpStatus } from "@nestjs/common";
import { ApiStatus } from "./api-status.interface";
import { FieldMessageDetails, ModalMessageDetails, ToastMessageDetails } from "./message-details.interface";

export interface ApiResponse<T> {
    timestamp: number;
    statusCode: HttpStatus;
    status: ApiStatus;
    details: ToastMessageDetails | FieldMessageDetails | ModalMessageDetails;
    data: T | null;
    path: string;
}