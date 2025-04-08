// import { sampleBlocks } from "@/Data/blocks";
// import { sampleFields } from "@/Data/fields";
// import React from "react";
// import { FieldsBlocksRendererProps } from ".";
// import { PageItems } from "../Blocks";
// import { BlocksPropmts } from "../BlocksPromts";
// import { BlockSelectionPopup } from "../BlocksSelectionPopup";
// import { AddPageItemsBtn } from "../FieldsAndBlocksList";
// import { FieldSelectionPopup } from "../FieldSelectionPopup";
// import { FieldsPromt } from "../FieldsPromt";
//
// export const FieldsBlocksRenderer = ({
//     // Component props
//     itemsList,
//     query_key_id,
//     parentCollectionId,
//     itemType,
//     queryKey,
//     queryClient,
//     localFields,
//     parentBlockId,
//     parentBlockType,
//     // Hook-derived props
//     showFieldPromt,
//     promtFields,
//     isFieldPopupOpen,
//     openFieldPopup,
//     closeFieldPopup,
//     handleAddSelectedFields,
//     handleFieldsCancel,
//     fieldType,
//     showBlockPrompt,
//     selectedBlocks,
//     isBlockPopupOpen,
//     openBlockPopup,
//     closeBlockPopup,
//     handleBlocksSelected,
//     handleBlockPromptCancel,
// }: FieldsBlocksRendererProps) => {
//     console.log(itemsList, itemType, parentBlockType, "itemsListpageCheck");
//     return (
//         <div className="fields-blocks-renderer">
//             <div>{parentBlockType}</div>
//             {/* Page Items */}
//             <PageItems
//                 queryClient={queryClient}
//                 itemsList={itemsList}
//                 query_key_id={query_key_id}
//                 parentCollectionId={parentCollectionId}
//                 itemType={parentBlockType}
//                 localFields={localFields}
//                 queryKey={queryKey}
//             />
//
//             {/* Fields Prompts */}
//             {showFieldPromt && (
//                 <div className="fields-prompt-container">
//                     {promtFields.map((field: any) => (
//                         <div key={field.field_id}>
//                             <FieldsPromt
//                                 field={field}
//                                 queryClient={queryClient}
//                                 query_key_id={query_key_id}
//                                 handleFieldsCancel={handleFieldsCancel}
//                                 fieldType={fieldType}
//                                 parentBlockId={parentBlockId}
//                                 queryKey={queryKey}
//                                 itemType={parentBlockType}
//                             />
//                         </div>
//                     ))}
//                 </div>
//             )}
//
//             {/* Blocks Prompts */}
//             {showBlockPrompt && (
//                 <div className="blocks-prompt-container">
//                     {selectedBlocks.map((block: any) => (
//                         <BlocksPropmts
//                             key={block.instanceId || block.blockId}
//                             localFields={localFields}
//                             query_key_id={query_key_id}
//                             queryKey={queryKey}
//                             block={block}
//                             parentBlockId={parentBlockId}
//                             parentBlockType={parentBlockType}
//                             page_id={query_key_id || ""}
//                             itemType={itemType}
//                             queryClient={queryClient}
//                             onCancel={() => handleBlockPromptCancel(block)}
//                         />
//                     ))}
//
//                     {/* Add Buttons */}
//                 </div>
//             )}
//
//             <AddPageItemsBtn
//                 openFieldPopup={openFieldPopup}
//                 openBlockPopup={openBlockPopup}
//                 itemType={itemType}
//                 isVerbose={true}
//             />
//
//             {/* Popups */}
//             <FieldSelectionPopup
//                 isOpen={isFieldPopupOpen}
//                 onClose={closeFieldPopup}
//                 onAddFields={handleAddSelectedFields}
//                 localFields={localFields}
//                 availableFields={sampleFields}
//             />
//
//             <BlockSelectionPopup
//                 isOpen={isBlockPopupOpen}
//                 onClose={closeBlockPopup}
//                 availableBlocks={sampleBlocks}
//                 onBlocksSelected={handleBlocksSelected}
//             />
//         </div>
//     );
// };
