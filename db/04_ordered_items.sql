-- Drop and recreate Users table

DROP TABLE IF EXISTS ordered_items CASCADE;
CREATE TABLE ordered_items (
  ordered_item_id SERIAL PRIMARY KEY NOT NULL,
  order_id int NOT NULL,
  menu_item_id int NOT NULL,
  quantity int NOT NULL
);
