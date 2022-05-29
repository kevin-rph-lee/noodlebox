-- Drop and recreate Users table

DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  user_ID int NOT NULL,
  order_completion VARCHAR(255) DEFAULT false NOT NULL,
  order_created_dateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NUll
);
