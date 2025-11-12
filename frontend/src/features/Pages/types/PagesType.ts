export type PagesType = {
    name: string;
    slug: string;
    description: string;
    id: string;
};

export type NewPageType = {
    name: string | null;
    slug: string | null;
    description: string | null;
    element_id: string | null;
};
