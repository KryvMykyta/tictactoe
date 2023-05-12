import { matches } from './../schemas/matchSchema';
import { drizzle, BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { Database } from "better-sqlite3";
import { users } from "./../schemas/userSchema";
import { eq, or } from "drizzle-orm";

export class UsersRepo {
    db: BetterSQLite3Database;
    constructor(db: BetterSQLite3Database) {
        this.db = db
    }

    public getUserByLogin = (login: string) => {
        const user = this.db.select().from(users).where(eq(users.login, login)).all();
        return user;
    }

    public createUser = (login: string, password: string) => {
        this.db.insert(users).values({login, password, rating:0})
    }

    public getUserMatches = (login: string) => {
        const userMatches = this.db.select().from(matches).where(or(eq(matches.player1, login),eq(matches.player2, login))).all();
        return userMatches;
    }
}