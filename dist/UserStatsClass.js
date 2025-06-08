export class UserStats {
    constructor(wins = 0, losses = 0, currentStreak = 0) {
        this.wins = wins;
        this.losses = losses;
        this.currentStreak = currentStreak;
    }
    addWin() {
        this.wins++;
        this.currentStreak += 1;
    }
    addLoss() {
        this.losses++;
        this.currentStreak = 0;
    }
    getWinPercentage() {
        const totalGames = this.wins + this.losses;
        return totalGames === 0 ? 0 : (this.wins / totalGames) * 100;
    }
}
//# sourceMappingURL=UserStatsClass.js.map