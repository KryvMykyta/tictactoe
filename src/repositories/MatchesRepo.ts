import { Match, matches } from '@/schemas/matchSchema';
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

export class MatchesRepo {
    db: BetterSQLite3Database;
    constructor(db: BetterSQLite3Database) {
        this.db = db
    }

    public addMatchResults = (matchData: Match) => {
        this.db.insert(matches).values(matchData).run()
    }
}