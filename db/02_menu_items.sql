-- Drop and recreate Users table

DROP TABLE IF EXISTS menu_items CASCADE;
CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  item_type VARCHAR(255) NOT NULL,
  item_price float NOT NULL,
  item_picture VARCHAR(255) NOT NULL,
  item_description VARCHAR(255) NOT NULL
);
