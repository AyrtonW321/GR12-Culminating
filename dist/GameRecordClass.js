export class GameRecord {
    constructor(recordId, date, opponent, userDeck, opponentDeck, winner, turns, gameLog) {
        this.recordId = recordId;
        this.date = date;
        this.opponent = opponent;
        this.userDeck = userDeck;
        this.opponentDeck = opponentDeck;
        this.winner = winner;
        this.turns = turns;
        this.gameLog = gameLog;
    }
    getMatchSummary() {
        const winnerName = this.winner.username;
        return (`Match on ${this.date.toDateString()} against ${this.opponent.username}.\n` +
            `User Deck: ${this.userDeck.name}, Opponent Deck: ${this.opponentDeck.name}.\n` +
            `Winner: ${winnerName} in ${this.turns} turns.`);
    }
}
//# sourceMappingURL=GameRecordClass.js.map