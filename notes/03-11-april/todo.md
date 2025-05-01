# array block

## array block template

### front-end

- use react query for below operations

- [x] connect front-end with backend for the array blocks
- [x] create dummy templates in the backend and render it in the front-end
- [x] create actuall templates from the front-end, check backend is updating correctly and render it

- [x] make the array and normal block to render inside the template with nesting

- [x] update create block function to use template id or something so that the blocks will be
      created within that template
- [x] use template id to make the blocks render inside the template component
- [x] use template id to make the blocks render inside the template component

#### Duplicatiing functionality for the array_template

- [x] connect add template button with `array_block_templates`
- [ ] add a function in the backend to duplicate the content of template
- [ ] template the functionality

### db

- [x] add a new column called `parent_template_id` in the `array_block_items` which will have the templates table's 'template_id'
- [ ] make one to one relation with the templates using parent_template_id

### api

- [x] update the `getArrayBlocksWithTemplates` to get `array_block_items` with nesting for that template
- [x] make the template into an object with `template_id` as `templateId` and all the `array_block_items` as `templateItems`
- [x] use the newly created `parent_template_id` of the `array_block_items` to get for filtering the
      `array_block_items`
