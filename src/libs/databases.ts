import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { UsersRepo } from "@/repositories/UsersRepo";
import { MatchesRepo } from "@/repositories/MatchesRepo";

const sqliteDB = drizzle(new Database("users.db"));

export const UserRepoInstance = new UsersRepo(sqliteDB)
export const MatchesRepoInstance = new MatchesRepo(sqliteDB)