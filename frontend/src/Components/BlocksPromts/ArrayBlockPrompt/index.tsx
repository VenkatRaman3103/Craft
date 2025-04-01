import { FieldsAndBlocksList } from "@/Components/FieldsAndBlocksList";
import { FieldsBlocksRenderer } from "@/Components/FieldsBlocksRenderer";
import { useState } from "react";

export const ArrayBlockPrompt = ({ block }) => {
    console.log(block, "block");
    return (
        <div>
            <div className="array-template"></div>

            {/* <FieldsAndBlocksList */}
            {/*     itemsList={pageData.page_items} */}
            {/*     query_key_id={page_id} */}
            {/*     parentCollectionId={parentCollectionId} */}
            {/*     queryKey={["pageData", page_id]} */}
            {/*     itemType="page" */}
            {/*     localFields={localFields} */}
            {/* /> */}

            <div>ArrayBlockPrompt</div>
        </div>
    );
};
