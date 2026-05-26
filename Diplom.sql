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
  "role_id" integer,
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
