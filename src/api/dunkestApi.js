const axios = require('axios');

class DunkestApi {
    constructor() {
        this.baseUrl = 'https://fantaking-api.dunkest.com/api/v1';
        this.apiKey = '1929597|4PoJUcbEysIam1VobJlNOlXn8QB0Tm4V3NzCiQJW675f9215';
    }

    async getCurrentMatchday() {
        try {
            const response = await axios.get(
                `${this.baseUrl}/schedules/19/matchdays/677`, 
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'Accept': '*/*',
                        'Origin': 'https://fantasy.dunkest.com',
                        'Referer': 'https://fantasy.dunkest.com/'
                    }
                }
            );
            
            if (response.data && response.data.data && response.data.data.number) {
                console.log(`Current matchday number: ${response.data.data.number}`);
                return response.data.data.number;
            } else {
                console.error('Unexpected API response structure:', response.data);
                throw new Error('Invalid API response structure');
            }
        } catch (error) {
            console.error('Error fetching current matchday:', error);
            throw error;
        }
    }

    async getPlayers(matchday) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/players-lists/19/matchdays/677/players`, 
                {
                    params: {
                        per_page: -1,
                        page: 1,
                        sort_by: 'quotation',
                        sort_order: 'desc',
                        current_matchday: matchday
                    },
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'Accept': '*/*',
                        'Origin': 'https://fantasy.dunkest.com',
                        'Referer': 'https://fantasy.dunkest.com/'
                    }
                }
            );
            
            if (response.data && response.data.data) {
                console.log(`Received ${response.data.data.length} players from API for matchday ${matchday}`);
                return response.data.data;
            } else {
                console.error('Unexpected API response structure:', response.data);
                throw new Error('Invalid API response structure');
            }
        } catch (error) {
            console.error('Error fetching players:', error);
            throw error;
        }
    }

    async getPlayerStats(playerId) {
        try {
            return {};
        } catch (error) {
            console.error('Error fetching player stats:', error);
            throw error;
        }
    }
}

module.exports = new DunkestApi(); 