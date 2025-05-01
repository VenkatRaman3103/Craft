# Reference Block

## backend

- [x] base schema for the referece block

    - block_id
    - referece_type
    - collection_id

- [x] base schema for referece block items

    - item_id
    - block_id

## api

### referece block

- [x] added base route for the referece block
- [x] create route to create a new referece block
- [x] read route to read all referece blocks
- [x] read route to read a referece block based on the given block_id
- [x] delete route to delete a referece block based on the given block_id
- [x] update route to update the name of a referece block based on the given block_id
- [x] update route to update the collection_id of a referece block based on the given block_id
- [x] update route to update the referece_type of a referece block based on the given block_id

- [ ] referesh the referece block items while changing the collection_id and referece_type

## frontend

- [x] connect referece block data to frontend
- [x] add base ui elements
    - [x] drop down component to select the collections
    - [x] drop down component to list the options for filtering the pages
    - [x] input field to get the data from the json
    - [x] dymanic component that shows the list of pages
        - [x] all
        - [x] single select
        - [x] multi select select
