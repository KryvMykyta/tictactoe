import { InferModel } from 'drizzle-orm';
import { sqliteTable, text, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable("users", {
  login: text("phone").notNull().primaryKey(),
  password: text("password").notNull(),
  rating: real("rating").notNull()
});


export type UsersType = InferModel<typeof users>;