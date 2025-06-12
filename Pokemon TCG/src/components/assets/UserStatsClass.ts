export class UserStats {
    wins: number;
    losses: number;
    currentStreak: number;

    constructor(
        wins: number = 0,
        losses: number = 0,
        currentStreak: number = 0
    ) {
        this.wins = wins;
        this.losses = losses;
        this.currentStreak = currentStreak;
    }

    public addWin() {
        this.wins++;
        this.currentStreak += 1;
    }

    public addLoss() {
        this.losses++;
        this.currentStreak = 0;
    }

    public getWinPercentage(): number {
        const totalGames = this.wins + this.losses;
        return totalGames === 0 ? 0 : (this.wins / totalGames) * 100;
    }

    public toJSON() {
        return {
            wins: this.wins,
            losses: this.losses,
            currentStreak: this.currentStreak,
        };
    }

    public static fromJSON(json: any): UserStats {
        return new UserStats(json.wins, json.losses, json.currentStreak);
    }
}
