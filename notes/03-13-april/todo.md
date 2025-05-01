# array block

## array block template

### frontend

- [x] the add more template button should change both for adding new template and also for
      Duplicatiing template

### backend

#### Duplicatiing functionality for the array_template

- [x] use the first template as blueprint
- [x] get the template and its parent and child blocks
- [x] use the reference as a relation between the blocks and block items to get the actual content
      of the blocks
- [x] either form a structure and traverse it or just use the blocks
- [x] duplicate the template and get the children block items using the blueprint template
- [x] if any child has to become a new parent block, means nested with another block, then duplicate
      the block and create block item
- [x] if any child has no nested block, then duplicate the block and create array block item
- [ ] apply the logics and functionality to the array blocks as well

### db

- [ ] make one to one relation with the templates using parent_template_id

# backlogs

- [ ] proper deletion functionality for all the blocks
