const express = require('express');
const router = express.Router();
const dunkestApi = require('../api/dunkestApi');
const Player = require('../models/player');

router.get('/optimize', async (req, res) => {
    try {
        const matchday = req.query.matchday || 677; // Default to 677 if not provided
        const playersData = await dunkestApi.getPlayers(matchday);
        
        if (!playersData || !Array.isArray(playersData)) {
            throw new Error('Invalid players data received from API');
        }

        const players = playersData.map(data => new Player(data));
        const optimizedTeam = optimizeTeam(players);
        
        res.json({
            team: {
                players: optimizedTeam.players,
                coach: optimizedTeam.coach,
                totalCredits: optimizedTeam.totalCredits,
                remainingCredits: optimizedTeam.remainingCredits
            }
        });
    } catch (error) {
        console.error('Error in optimize route:', error);
        res.status(500).json({ 
            error: 'Error optimizing team',
            details: error.message 
        });
    }
});

router.get('/currentMatchday', async (req, res) => {
    try {
        const matchday = await dunkestApi.getCurrentMatchday();
        res.json({ matchday });
    } catch (error) {
        console.error('Error getting current matchday:', error);
        res.status(500).json({ 
            error: 'Error getting current matchday',
            details: error.message 
        });
    }
});

function optimizeTeam(players) {
    const MAX_BUDGET = 95;
    const TEAM_SIZE = 10;
    const MIN_REMAINING = 0.5;

    try {
        // Separate coaches from players
        const coaches = players.filter(p => p.position === 'Coach');
        const activePlayers = players.filter(p => p.position !== 'Coach' && p.position !== 'Unknown');

        // Log player availability statistics
        const availabilityStats = {
            total: activePlayers.length,
            available: activePlayers.filter(p => p.status === 'available').length,
            injured: activePlayers.filter(p => p.status === 'out' && p.isInjured).length,
            out: activePlayers.filter(p => p.status === 'out' && !p.isInjured).length,
            doubtful: activePlayers.filter(p => p.status === 'doubtful').length
        };
        console.log('Player availability stats:', availabilityStats);

        // Filter eligible players and calculate efficiency scores
        const eligiblePlayers = activePlayers
            .filter(p => {
                const eligible = p.isEligible();
                if (!eligible) {
                    console.log(`${p.name} excluded because:`, {
                        price: p.price > 0 ? 'OK' : 'No price',
                        position: p.position !== 'Unknown' ? 'OK' : 'Unknown position',
                        status: p.status,
                        isInjured: p.isInjured
                    });
                }
                return eligible;
            })
            .map(p => ({
                player: p,
                efficiency: p.calculateScore() / p.price
            }))
            .sort((a, b) => b.efficiency - a.efficiency);

        console.log(`Found ${eligiblePlayers.length} eligible players out of ${activePlayers.length} total players`);

        // Group players by position
        const playersByPosition = {
            C: eligiblePlayers.filter(p => p.player.position === 'C'),
            SF: eligiblePlayers.filter(p => p.player.position === 'SF'),
            PG: eligiblePlayers.filter(p => p.player.position === 'PG')
        };

        let team = [];
        let totalCredits = 0;

        // Helper function to add a player to the team
        function addPlayer(playerEntry) {
            if (totalCredits + playerEntry.player.price <= MAX_BUDGET) {
                team.push(playerEntry.player);
                totalCredits += playerEntry.player.price;
                return true;
            }
            return false;
        }

        // Initial team selection
        const centers = playersByPosition.C.slice(0, 2);
        centers.forEach(p => addPlayer(p));

        const forwards = playersByPosition.SF.slice(0, 4);
        forwards.forEach(p => addPlayer(p));

        const guards = playersByPosition.PG.slice(0, 4);
        guards.forEach(p => addPlayer(p));

        // Upgrade players to use more budget
        let improved = true;
        while (improved && totalCredits < MAX_BUDGET - MIN_REMAINING) {
            improved = false;
            const remainingBudget = MAX_BUDGET - totalCredits;

            // Try to upgrade each player
            for (let i = 0; i < team.length; i++) {
                const currentPlayer = team[i];
                const maxUpgradePrice = currentPlayer.price + remainingBudget;

                // Find better players of the same position
                const betterPlayers = eligiblePlayers
                    .filter(p => 
                        p.player.position === currentPlayer.position &&
                        p.player.price <= maxUpgradePrice &&
                        p.player.price > currentPlayer.price &&
                        p.player.calculateScore() > currentPlayer.calculateScore() &&
                        !team.includes(p.player)
                    )
                    .sort((a, b) => b.player.calculateScore() - a.player.calculateScore());

                if (betterPlayers.length > 0) {
                    const upgrade = betterPlayers[0].player;
                    totalCredits = totalCredits - currentPlayer.price + upgrade.price;
                    team[i] = upgrade;
                    improved = true;
                    break;  // Only do one upgrade at a time to recalculate budget
                }
            }
        }

        // Try to add a coach with remaining budget
        let selectedCoach = null;
        const remainingForCoach = 100 - totalCredits;
        if (team.length === TEAM_SIZE) {
            const affordableCoaches = coaches
                .filter(c => c.price <= remainingForCoach)
                .sort((a, b) => b.calculateScore() - a.calculateScore());

            if (affordableCoaches.length > 0) {
                selectedCoach = affordableCoaches[0];
                totalCredits += selectedCoach.price;
            }
        }

        // Format team for response
        const formattedTeam = team.map(player => ({
            name: player.name,
            position: player.position,
            team: player.team,
            price: player.price,
            fantasyPoints: player.stats.fantasy_avg_points,
            score: player.calculateScore(),
            status: player.status
        }));

        return {
            players: formattedTeam,
            coach: selectedCoach ? {
                name: selectedCoach.name,
                position: 'Head Coach',
                team: selectedCoach.team,
                price: selectedCoach.price,
                score: selectedCoach.calculateScore()
            } : null,
            totalCredits: Math.round(totalCredits * 100) / 100,
            remainingCredits: Math.round((100 - totalCredits) * 100) / 100
        };

    } catch (error) {
        console.error('Error in optimizeTeam:', error);
        return {
            players: [],
            coach: null,
            totalCredits: 0,
            remainingCredits: 100
        };
    }
}

module.exports = router; 