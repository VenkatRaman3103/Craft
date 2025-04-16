# api preview component

## array block template

### backend-end

- [x] add a new route for returning the data in proper json format for the api
- [ ] collect the data for the page for which need to part the logic from the route into individual
      function
    - [ ] use the newly created function instead of the logic block
- [ ] after collecting the data pick the items from the `block_items` and make them as a new key
      pair value, where the key should be the name of the block or the field
- [ ] use standardized names for the keys
- [ ] use the payload api as the reference

### front-end

- [ ] make a new section in the page for the api, the new section should be toggleable
- [ ] fix the design for the api section
- [ ] create the api preview component
- [ ] connect it with the backend
- [ ] each entries should be distinguishable
- [ ] array entries should have different disign from normal entries
- [ ] make each entries section collapsable
- [ ] create a url field
- [ ] create a params component which should be populated based the backed api
- [ ] make the url field interactive with url params

#### notes

- the entries should be collapsable
- things should have different colors for better readbility
- there should be line numbers
- add a feidl for the url with interactive params
- the api should reflect the data based on the url params

### misc

- [x] make the side bar component toggleable based on the selected type
