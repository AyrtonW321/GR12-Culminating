import { User } from "./UserClass.js";
import { Deck } from "./DeckClass.js";

export class GameRecord {
    recordId: string;
    date: Date;
    opponent: User;
    userDeck: Deck;
    opponentDeck: Deck;
    winner: User;
    turns: number;
    gameLog: string[];

    constructor(
        recordId: string,
        date: Date,
        opponent: User,
        userDeck: Deck,
        opponentDeck: Deck,
        winner: User,
        turns: number,
        gameLog: string[]
    ) {
        this.recordId = recordId;
        this.date = date;
        this.opponent = opponent;
        this.userDeck = userDeck;
        this.opponentDeck = opponentDeck;
        this.winner = winner;
        this.turns = turns;
        this.gameLog = gameLog;
    }

    public getMatchSummary(): string {
        const winnerName = this.winner.username;
        return (
            `Match on ${this.date.toDateString()} against ${
                this.opponent.username
            }.\n` +
            `User Deck: ${this.userDeck.name}, Opponent Deck: ${this.opponentDeck.name}.\n` +
            `Winner: ${winnerName} in ${this.turns} turns.`
        );
    }

    public toJSON() {
        return {
            recordId: this.recordId,
            date: this.date.toISOString(),
            opponent: this.opponent.toJSON(),
            userDeck: this.userDeck.toJSON(),
            opponentDeck: this.opponentDeck.toJSON(),
            winner: this.winner.toJSON(),
            turns: this.turns,
            gameLog: this.gameLog,
        };
    }

    public static fromJSON(json: any): GameRecord {
        return new GameRecord(
            json.recordId,
            new Date(json.date),
            User.fromJSON(json.opponent),
            Deck.fromJSON(json.userDeck),
            Deck.fromJSON(json.opponentDeck),
            User.fromJSON(json.winner),
            json.turns,
            json.gameLog
        );
    }
}
