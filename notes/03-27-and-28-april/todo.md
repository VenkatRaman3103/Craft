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
- [x] use `entries`
- [x] get the entires, rows and colums from the backend
- [x] make a grid based on the data collected from rows, columns and entries using `table_id`,
      `column_id` and `row_id`.
- [x] make the first row and the firt column as headings in the table
- [x] add "add row" button and "add column" button
- [x] connect the both buttons with backend
    - [x] create row
    - [x] create column
    - [x] create entries
- [x] invalidate the data
