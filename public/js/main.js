document.addEventListener('DOMContentLoaded', async () => {
    const optimizeButton = document.querySelector('#optimizeButton');
    const resultsDiv = document.querySelector('#optimizedTeam');
    const matchdaySpan = document.querySelector('#matchday');
    const maxCreditsInput = document.querySelector('#maxCredits');
    let currentMatchday = null;

    // Validate max credits input
    maxCreditsInput.addEventListener('change', (e) => {
        let value = parseFloat(e.target.value);
        if (value < 50) value = 50;
        if (value > 100) value = 100;
        e.target.value = value;
    });

    // Fetch current matchday when page loads
    try {
        const response = await fetch('/api/currentMatchday');
        const data = await response.json();
        if (data.matchday) {
            currentMatchday = data.matchday;
            matchdaySpan.textContent = data.matchday;
        }
    } catch (error) {
        console.error('Error fetching current matchday:', error);
        matchdaySpan.textContent = 'Error';
    }

    optimizeButton.addEventListener('click', async () => {
        if (!currentMatchday) {
            resultsDiv.innerHTML = `
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Error: Could not determine current matchday
                </div>
            `;
            return;
        }

        try {
            resultsDiv.innerHTML = `
                <div class="flex items-center justify-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span class="ml-3 text-gray-700">Optimizing team...</span>
                </div>
            `;
            
            const maxCredits = parseFloat(maxCreditsInput.value);
            const response = await fetch(`/api/optimize?matchday=${currentMatchday}&maxCredits=${maxCredits}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            console.log('Received data:', data);
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            if (data.team && data.team.players) {
                displayOptimizedTeam(data.team);
            } else {
                resultsDiv.innerHTML = `
                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        No valid team data available
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error:', error);
            resultsDiv.innerHTML = `
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Error getting optimized team: ${error.message}
                </div>
            `;
        }
    });

    function displayOptimizedTeam(teamData) {
        // Create desktop table content
        const tableContent = teamData.players.map((player, index) => `
            <tr class="${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${index + 1}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${player.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${getPositionColor(player.position)}">
                        ${player.position}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${player.team}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${player.price}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${player.avgPoints}</td>
            </tr>
        `).join('');

        // Create coach row for desktop
        const coachRow = teamData.coach ? `
            <tr class="bg-gray-100">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">11</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${teamData.coach.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          bg-purple-100 text-purple-800">
                        Coach
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${teamData.coach.team}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${teamData.coach.price}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${teamData.coach.avgPoints}</td>
            </tr>
        ` : '';

        // Create mobile content
        const mobileTableContent = teamData.players.map((player, index) => `
            <div class="bg-white p-4 rounded-lg shadow-sm mb-2 border-l-4 
                      ${getPositionBorderColor(player.position)}">
                <div class="flex justify-between items-center">
                    <div class="flex-1">
                        <div class="flex items-center space-x-2">
                            <span class="text-sm font-medium text-gray-900">#${index + 1}</span>
                            <span class="text-sm font-medium text-gray-900">${player.name}</span>
                        </div>
                        <div class="flex items-center mt-1 space-x-2">
                            <span class="px-2 py-0.5 text-xs font-semibold rounded-full 
                                  ${getPositionColor(player.position)}">
                                ${player.position}
                            </span>
                            <span class="text-xs text-gray-500">${player.team}</span>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-sm font-medium text-gray-900">${player.price}</div>
                        <div class="text-xs text-gray-500">Avg: ${player.avgPoints}</div>
                    </div>
                </div>
            </div>
        `).join('');

        const mobileCoachContent = teamData.coach ? `
            <div class="bg-gray-50 p-4 rounded-lg shadow-sm mb-2 border-l-4 border-purple-500">
                <div class="flex justify-between items-center">
                    <div class="flex-1">
                        <div class="flex items-center space-x-2">
                            <span class="text-sm font-medium text-gray-900">#11</span>
                            <span class="text-sm font-medium text-gray-900">${teamData.coach.name}</span>
                        </div>
                        <div class="flex items-center mt-1 space-x-2">
                            <span class="px-2 py-0.5 text-xs font-semibold rounded-full 
                                  bg-purple-100 text-purple-800">
                                Coach
                            </span>
                            <span class="text-xs text-gray-500">${teamData.coach.team}</span>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-sm font-medium text-gray-900">${teamData.coach.price}</div>
                        <div class="text-xs text-gray-500">Avg: ${teamData.coach.avgPoints}</div>
                    </div>
                </div>
            </div>
        ` : '';
        
        resultsDiv.innerHTML = `
            <div class="bg-white shadow rounded-lg overflow-hidden">
                <div class="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200">
                    <h2 class="text-lg md:text-xl font-semibold text-gray-800">Your Optimized Team</h2>
                    <div class="mt-2 flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
                        <div class="text-xs md:text-sm text-gray-600">
                            Total Credits Used: <span class="font-medium">${teamData.totalCredits}</span>
                        </div>
                        <div class="text-xs md:text-sm text-gray-600">
                            Remaining Credits: <span class="font-medium">${teamData.remainingCredits}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Mobile view -->
                <div class="block md:hidden p-4">
                    ${mobileTableContent}
                    ${mobileCoachContent}
                </div>

                <!-- Desktop view -->
                <div class="hidden md:block overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Pts</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${tableContent}
                            ${coachRow}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    function getPositionColor(position) {
        switch (position) {
            case 'PG':
                return 'bg-blue-100 text-blue-800';
            case 'SF':
                return 'bg-green-100 text-green-800';
            case 'C':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    function getPositionBorderColor(position) {
        switch (position) {
            case 'PG':
                return 'border-blue-500';
            case 'SF':
                return 'border-green-500';
            case 'C':
                return 'border-red-500';
            default:
                return 'border-gray-500';
        }
    }
}); 