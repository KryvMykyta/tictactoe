import { InferModel } from 'drizzle-orm';
import { sqliteTable, text, real } from 'drizzle-orm/sqlite-core';

export const matches = sqliteTable("matches", {
  id: text("id").notNull().primaryKey(),
  player1: text("player1").notNull(),
  player2: text("player2").notNull(),
  winner: text("winner").notNull(),
});


export type MatchesType = InferModel<typeof matches>;