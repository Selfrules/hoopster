const Player = require('../models/player');

class OptimizerService {
    constructor() {
        this.MAX_COST = 100;
        this.MAX_PLAYERS_PER_TEAM = 3;
        this.REQUIRED_POSITIONS = {
            'C': 2,
            'F': 4,
            'G': 4
        };
    }

    async optimizeTeam(players) {
        const selectedTeam = {
            'C': [],
            'F': [],
            'G': []
        };
        let totalCost = 0;
        const teamCounts = new Map();

        // Sort players by efficiency score
        const sortedPlayers = players
            .map(player => new Player(player))
            .sort((a, b) => b.calculateEfficiencyScore() - a.calculateEfficiencyScore());

        for (const player of sortedPlayers) {
            const position = player.position;
            const team = player.team;

            // Check if we need more players in this position
            if (selectedTeam[position].length >= this.REQUIRED_POSITIONS[position]) {
                continue;
            }

            // Check team limit
            if ((teamCounts.get(team) || 0) >= this.MAX_PLAYERS_PER_TEAM) {
                continue;
            }

            // Check cost limit
            if (totalCost + player.cost > this.MAX_COST) {
                continue;
            }

            // Add player to selected team
            selectedTeam[position].push(player);
            totalCost += player.cost;
            teamCounts.set(team, (teamCounts.get(team) || 0) + 1);
        }

        return Object.values(selectedTeam).flat();
    }
}

module.exports = new OptimizerService(); 