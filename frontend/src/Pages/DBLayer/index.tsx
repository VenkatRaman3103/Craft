import { getAllCollections } from "@/api/DBLayer/getAllCollections";
import { getAllPages } from "@/api/DBLayer/getAllPages";
import { Table } from "@/DBLayer/Table";
import {
    collectionsTableConfig,
    CollectionType,
} from "@/DBLayer/TableConfigurations/collections";
import { pagesTableConfig } from "@/DBLayer/TableConfigurations/pages";

export const CollectionsTable = () => {
    return (
        <>
            {/* Collection */}
            <Table<CollectionType>
                queryKey={["db-collection-table"]}
                queryFn={() => getAllCollections()}
                columns={collectionsTableConfig}
                defaultSortColumn="name"
                getRowKey={(row) => row.collection_id}
            />

            {/* Pages */}
            <Table<CollectionType>
                queryKey={["db-pages-table"]}
                queryFn={() => getAllPages()}
                columns={pagesTableConfig}
                defaultSortColumn="title"
                getRowKey={(row) => row.page_id}
            />
        </>
    );
};

export const DBLayer = () => {
    return (
        <div>
            <CollectionsTable />
        </div>
    );
};
