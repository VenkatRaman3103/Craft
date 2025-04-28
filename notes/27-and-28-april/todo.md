# Table block

## backend

### api

- columns
- [x] base route for the columns
- [x] add a `GET` route to read all columns based on the `table_id`
- [x] add a `POST` route to create a new column based on the `table_id`
- [x] add a `DELETE` route to delete all columns based on the `table_id`
- [x] add a `PATCH` route to update column based on the `table_id` and `column_id`

- rows
- [x] base route for the rows
- [x] add a `GET` route to read all rows based on the `column_id`
- [x] add a `POST` route to create a new column based on the `column_id`
- [x] add a `DELETE` route to delete all rows based on the `column_id`
- [x] add a `PATCH` route to update column based on the `column_id` and `column_id`

- [x] reststructed the rows to use the table_id instead of column_id

- entries
- [x] base route for the entries
- [x] add a `GET` route to read all entries based on the `column_id`
- [x] add a `GET` route to read all entries based on the `row_id`
- [x] add a `GET` route to read all entries based on the `column_id` and `row_id`
- [x] add a `POST` route to create a new column based on the `column_id`
- [x] add a `DELETE` route to delete all entries based on the `column_id`
- [x] add a `DELETE` route to delete all entries based on the `row_id`
- [x] add a `DELETE` route to delete all entries based on both `row_id` and `column_id`
- [x] add a `PATCH` route to update entries based on the `column_id` and `column_id`

### db

- [x] update the realtion between `page_items` and `table_blocks`
    - one to one relation between `page_items` and the `table_blocks`

## frontend

### table block

- [x] connect the block prompt component with the backend for the table
- [x] create a table block from frontend
- [x] use reatct query to get the column first
- [x] create a table component and connect the rows and columns from the api data
- [ ] use `entries`
- [ ] get the entires, rows and colums from the backend
- [ ] make a grid based on the data collected from rows, columns and entries using `table_id`,
      `column_id` and `row_id`.
- [ ] make the first row and the firt column as headings in the table
- [ ] add "add row" button and "add column" button
- [ ] connect the both buttons with backend
    - [ ] create row
    - [ ] create column
    - [ ] create entries
- [ ] invalidate the data

<!-- - Added `POST /entries/:row_id/:column_id` route to create a new entry based on `column_id` and `row_id` -->
<!-- - Added `DELETE /entries/:row_id/row` routes to delete entries by column_id, row_id, and both -->
<!-- - Added `DELETE /entries/:row_id/row` routes to delete entries by column_id, row_id, and both -->
<!-- - Added PATCH route to update entries by column_id and row_id -->
<!-- - Updated database structure to use entries -->
<!---->
<!-- - Fetched entries, rows, and columns from backend -->
<!-- - Built dynamic grid using table_id, column_id, and row_id -->
<!-- - Set first row and first column as table headings -->
<!-- - Added "Add Row" and "Add Column" buttons -->
<!-- - Connected buttons to backend to create rows, columns, and entries -->
<!-- - Invalidated and refetched data after creation -->
