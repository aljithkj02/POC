

class GameManager {
    static instance: GameManager;
    private games: string[];

    private constructor() {
        this.games = [];
    }

    static getInstance() {
        if (!GameManager.instance) {
            GameManager.instance = new GameManager();
        }
        return GameManager.instance;
    }

    addGame(game: string) {
        this.games.push(game);
    }

    log() {
        console.log(this.games);
    }
}

export const gameManager = GameManager.getInstance();