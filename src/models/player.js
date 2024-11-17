class Player {
    constructor(data) {
        this.id = data.id;
        this.name = `${data.first_name} ${data.last_name}`;
        
        // Store raw position for coach detection
        this.rawPosition = data.position?.name || data.position;
        
        // Map position from the API data - include both Guards and Forwards
        const positionMap = {
            'Guard': 'PG',
            'Forward': 'SF',
            'Center': 'C',
            'G': 'PG',
            'F': 'SF',
            'C': 'C',
            'PG': 'PG',
            'SG': 'PG',  // Count Shooting Guards as Guards
            'SF': 'SF',
            'PF': 'SF',  // Count Power Forwards as Forwards
            'Head Coach': 'Coach'  // Add mapping for coaches
        };

        // Get position from either position.name or direct position property
        let positionValue = this.rawPosition;
        if (typeof positionValue === 'object' && positionValue !== null) {
            positionValue = positionValue.name;
        }
        
        // Special handling for Head Coach
        if (positionValue === 'Head Coach') {
            this.position = 'Coach';
        } else {
            this.position = positionMap[positionValue] || 'Unknown';
        }
        
        // Handle team data
        this.team = data.team?.name || 'N/A';
        this.price = parseFloat(data.quotation) || 0;
        
        // Calculate status based on injury and probability
        this.status = this.calculateStatus(data);
        
        // Stats
        this.stats = {
            avg_pts: parseFloat(data.avg_pts) || 0,
            fantasy_points: parseFloat(data.fantasy_points) || 0
        };

        // Debug log
        console.log(`Created ${this.position === 'Coach' ? 'coach' : 'player'}: ${this.name}, Position: ${this.position} (raw: ${this.rawPosition}), Price: ${this.price}`);
    }

    calculateStatus(data) {
        // Coaches are always available
        if (this.position === 'Coach') return 'available';
        
        // Check if player is injured or won't play
        if (data.is_injured || data.probability_of_playing === 0) {
            return 'out';
        }
        
        // Check probability of playing
        if (data.probability_of_playing === 1) {
            return 'available';
        }
        
        // If probability is between 0 and 1, consider them doubtful
        if (data.probability_of_playing > 0) {
            return 'doubtful';
        }

        return 'out'; // Default to out if we don't have clear status
    }

    calculateScore() {
        // Special scoring for coaches
        if (this.position === 'Coach') {
            // Base coach score on their team's performance or a fixed value
            return Math.max(0, this.price * 5);  // Example scoring for coaches
        }

        // Regular player scoring
        let score = this.stats.avg_pts * 2;
        
        if (this.stats.fantasy_points > 0) {
            score += this.stats.fantasy_points;
        }

        if (score === 0) {
            score = this.price * 2;
        }

        return Math.max(0, Math.round(score * 10) / 10);
    }

    isEligible() {
        // Coaches are eligible if they have a price
        if (this.position === 'Coach') {
            const eligible = this.price > 0;
            console.log(`Coach ${this.name} eligibility:`, {
                price: this.price,
                eligible
            });
            return eligible;
        }
        
        // Regular player eligibility - add status check
        const eligible = this.price > 0 && 
                        this.position !== 'Unknown' && 
                        this.status === 'available';  // Only available players are eligible
        
        console.log(`Player ${this.name} eligibility:`, {
            price: this.price,
            position: this.position,
            rawPosition: this.rawPosition,
            status: this.status,
            eligible
        });
        
        return eligible;
    }

    getEfficiencyRatio() {
        const score = this.calculateScore();
        return score > 0 ? score / this.price : 0;
    }

    isCoach() {
        return this.position === 'Coach';
    }
}

module.exports = Player; 