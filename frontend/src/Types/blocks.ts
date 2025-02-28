import { fieldsType } from "./fields";

export type blockType = {
    type: string;
    block_id: string;
    order: number;
    text: string;
    fields: fieldsType[];
};

export type pageType = {
    page_id: string;
    created_at: string;
    edited_at: string;
    title: string;
    slug: string;
    blocks: blockType[];
};
