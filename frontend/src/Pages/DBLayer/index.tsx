import { getAllCollections } from "@/api/DBLayer/getAllCollections";
import { Table } from "@/DBLayer/Table";
import {
    collectionsTableConfig,
    CollectionType,
} from "@/DBLayer/TableConfigurations/collections";

export const CollectionsTable = () => {
    return (
        <Table<CollectionType>
            queryKey={["db-table"]}
            queryFn={() => getAllCollections()}
            columns={collectionsTableConfig}
            defaultSortColumn="name"
            getRowKey={(row) => row.collection_id}
        />
    );
};

export const DBLayer = () => {
    return (
        <div>
            <CollectionsTable />
        </div>
    );
};
