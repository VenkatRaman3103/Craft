# array block

## array block template

### backend-end

#### Duplicatiing functionality for the array_template

- [x] Create a backend route for duplicating templates
- [x] Fetch original `arrayBlockTemplate` using the provided `template_id`
- [x] Get all `arrayBlockItems` for the original template
- [x] Insert a new template (`arrayBlockTemplate`) as a duplicate
- [x] For each `arrayBlockItem`:
    - [x] Fetch the referenced block (either from `blocks` or `arrayBlocks`)
    - [x] Fetch child block items (`block_items` or `arrayBlockItems`) depending on block type
    - [x] Fetch child blocks corresponding to those block items
    - [x] Clone the parent block and insert into `blocks` or `arrayBlocks`
    - [x] Insert a new block item referencing the cloned parent block
    - [x] Fetch all templates under the parent block (as arrayBlockTemplates)
    - [x] For each of these templates:
        - [x] Create a new arrayBlockTemplate under the new parent
        - [x] Fetch all block items under the old template
        - [x] Fetch all actual blocks referenced by those block items
        - [x] Clone those blocks and insert them into `blocks` or `arrayBlocks`
        - [x] Insert the corresponding block items under the newly created template
- [x] Return the duplicated structure as response
- [x] Add error handling and logging
