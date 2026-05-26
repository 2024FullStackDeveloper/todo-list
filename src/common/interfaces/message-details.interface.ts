import { Validation } from "./validation.interface";

export type MessageType = "toast" | "modal" | "field";


export interface MessageDetails {
    message: string;
}

export interface ToastMessageDetails extends MessageDetails {
    type: 'toast';
}

export interface FieldMessageDetails extends MessageDetails {
    type: 'field';
    validations?: Array<Validation>;
}

export interface ModalMessageDetails extends MessageDetails {
    type: 'modal';
    content?: string;
}
