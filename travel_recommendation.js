// Define time zones for each location
const timeZones = {
    "Sydney, Australia": 'Australia/Sydney',
    "Melbourne, Australia": 'Australia/Melbourne',
    "Tokyo, Japan": 'Asia/Tokyo',
    "Kyoto, Japan": 'Asia/Tokyo',
    "Rio de Janeiro, Brazil": 'America/Sao_Paulo',
    "São Paulo, Brazil": 'America/Sao_Paulo',
    "Angkor Wat, Cambodia": 'Asia/Phnom_Penh',
    "Taj Mahal, India": 'Asia/Kolkata',
    "Bora Bora, French Polynesia": 'Pacific/Tahiti',
    "Copacabana Beach, Brazil": 'America/Sao_Paulo'
};

// Event listener for the search button
document.getElementById('search-btn').addEventListener('click', function() {
    const searchQuery = document.getElementById('search-input').value.toLowerCase().trim();

    if (searchQuery === '') {
        alert('Please enter a search term.');
        return;
    }
    
    // Fetch data from the JSON file
    fetch('travel_recommendation_api.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Ensure data structure matches expectations
            if (!data.beaches || !data.temples || !data.countries) {
                throw new Error('Unexpected data structure');
            }

            // Define the categories to search through
            const categories = {
                beach: data.beaches,
                temple: data.temples,
                country: data.countries.flatMap(country => country.cities)
            };

            // Determine which category to search based on the search query
            let results = [];
            if (searchQuery.includes('beach')) {
                results = categories.beach;
            } else if (searchQuery.includes('temple')) {
                results = categories.temple;
            } else if (searchQuery.includes('country') || searchQuery.includes('city')) {
                results = categories.country;
            } else {
                // If no keyword matches, return an empty array
                results = [];
            }

            // Filter results based on the search query
            const filteredResults = results.filter(item =>
                item.name.toLowerCase().includes(searchQuery)
            );

            // Display filtered results
            displayResults(filteredResults);
        })
        .catch(error => console.error('Error fetching data:', error));
});

// Function to display results in the results section
function displayResults(results) {
    const resultContainer = document.getElementById('results');
    resultContainer.innerHTML = ''; // Clear previous results

    if (results.length === 0) {
        resultContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    // Display only the first two results
    results.slice(0, 2).forEach(result => {
        const resultDiv = document.createElement('div');
        resultDiv.classList.add('result-item'); // Add a class for styling

        // Get current time for the location
        const timeZone = timeZones[result.name];
        const timeOptions = { timeZone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
        const currentTime = timeZone ? new Date().toLocaleTimeString('en-US', timeOptions) : 'N/A';

        resultDiv.innerHTML = `
            <h2>${result.name}</h2>
            <img src="${result.imageUrl}" alt="${result.name}" class="result-image">
            <p>${result.description}</p>
            <p>Current time: ${currentTime}</p> <!-- Display current time -->
        `;
        resultContainer.appendChild(resultDiv);
    });
}

// Event listener for the clear button
document.getElementById('clear-btn').addEventListener('click', function() {
    clearResults();
});

// Function to clear search input and results
function clearResults() {
    document.getElementById('search-input').value = ''; // Clear search input
    document.getElementById('results').innerHTML = ''; // Clear results
}
