import { User } from "./UserClass.js";
import { Deck } from "./DeckClass.js";

// class for holding the game record, storage reasons
export class GameRecord {
    // properties
    recordId: string;
    date: Date;
    opponent: User;
    userDeck: Deck;
    opponentDeck: Deck;
    winner: User;
    turns: number;
    gameLog: string[];

    // constructor
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

    /**
     * get the match summer, winner, loser, turns etc
     * @returns returns a string with all the data of the battle
     */
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

    /**
     * serializes a array class into json string format
     * used to store or transfer the data
     * 
     * @returns returns a plain JS object representing the current state of the class with its properties
     */
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

    /**
     * Recreates an instance from a json object
     *
     * deserializes a plain object, parsed from json
     * into an instance by extracting its properties.
     *
     * @param {any} json - the json object containing all the properties of the ability class
     */
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
