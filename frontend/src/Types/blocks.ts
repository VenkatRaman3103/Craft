import { fieldsType } from "./fields";

export type blockType = {
    type: string;
    block_id: string;
    order: number;
    text: string;
    fields: fieldsType[];
};
