CREATE USER "user" WITH PASSWORD 'user_password';
CREATE USER admin WITH PASSWORD 'admin_password';

ALTER USER admin CREATEDB CREATEROLE;

CREATE DATABASE mydb OWNER admin;
\c mydb
-- Доступ к базе
GRANT CONNECT ON DATABASE mydb TO "user";

-- Доступ к схеме
GRANT USAGE ON SCHEMA public TO "user";

-- Чтение и запись данных во всех таблицах
GRANT SELECT, INSERT, UPDATE
ON ALL TABLES IN SCHEMA public
TO "user";

-- Доступ к sequence (SERIAL/BIGSERIAL)
GRANT USAGE, SELECT
ON ALL SEQUENCES IN SCHEMA public
TO "user";

CREATE TABLE "tags" (
  "id" integer PRIMARY KEY,
  "name" varchar
);

CREATE TABLE "statuses" (
  "id" integer PRIMARY KEY,
  "name" varchar
);

CREATE TABLE "products" (
  "id" integer PRIMARY KEY,
  "name" varchar,
  "count" integer,
  "description" varchar,
  "price" integer,
  "image_url" varchar,
  "tag_id" integer
);

CREATE TABLE "roles" (
  "id" integer PRIMARY KEY,
  "name" varchar
);

CREATE TABLE "users" (
  "id" integer PRIMARY KEY,
  "username" varchar,
  "email" varchar,
  "password" varchar,
  "role_id" varchar,
  "created_at" timestamp
);

CREATE TABLE "orders" (
  "id" integer PRIMARY KEY,
  "adress" varchar,
  "date" date,
  "Full_price" integer,
  "user_id" integer,
  "status_id" integer,
  "created_at" timestamp
);

CREATE TABLE "products_in_orders" (
  "id" integer,
  "count" integer,
  "product_id" integer,
  "order_id" integer
);

CREATE TABLE "feedbacks" (
  "id" integer,
  "user_id" integer,
  "product_id" integer,
  "message" varchar,
  "rating" integer,
  "created_at" timestamp
);

ALTER TABLE "users" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "orders" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "orders" ADD FOREIGN KEY ("status_id") REFERENCES "statuses" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "products_in_orders" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "products_in_orders" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "products" ADD FOREIGN KEY ("tag_id") REFERENCES "tags" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "feedbacks" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "feedbacks" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id") DEFERRABLE INITIALLY IMMEDIATE;
