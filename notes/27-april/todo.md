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

### db

- [x] update the realtion between `page_items` and `table_blocks`
    - one to one relation between `page_items` and the `table_blocks`

## frontend

### table block

- [x] connect the block prompt component with the backend for the table
- [x] create a table block from frontend
- [x] use reatct query to get the column first
