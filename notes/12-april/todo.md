# array block

## array block template

### front-end

- bug
- [x] blocks selection popup is closing after adding more than one template

- [x] deletetion functionality for `normal_block` inside the `array_block`

#### Duplicatiing functionality for the array_template

- add a function in the backend to duplicate the content of template
- [x] create a special route for the `array_template` that has be called while duplication not
      on creation of template
- [x] the special route should create a new template
- [x] first get the `array_block_items` for the first template (which will act like a blueprint),
      then create new `array_block_items` based on the collected blocks and change the `parent_block_id`
      to use newly create template using special route
- [x] based on the created `blocks` create `block_items`
- [x] test its responses

### db

- [ ] make one to one relation with the templates using parent_template_id

### api

- [x] route for duplication

<!---->
