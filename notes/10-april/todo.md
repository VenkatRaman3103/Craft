# array block

## array block template

### db

- [x] check the one to one relation between the `array_block_templates` and the `array_block_items`
    - `parent_block_id` from `array_block_items` should points to the `template_id` of `array_template`
    - `reference_id` from `array_block_items` should points to the `block_id` of `array_block`

### api

- [x] create route for `array_template`
- [x] update route for `array_template` to update name
- [x] update route for `array_template` to update description
- [x] delete route for `array_template`

- [x] read route to read all the blocks from the `array_block_items` via templates, an array that
      has objects as the `array_block_items`

### nesting functionality

- [ ] creation of `array_template` from the frontend while creating the `array_block`
- [ ] rendering of each blocks withing each template

<!-- - [ ] change the array_template table `variable` name from `arrayBlockTemplates` to `arrayTemplates` -->
