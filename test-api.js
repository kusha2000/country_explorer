const { fetchAllCountries, fetchCountryByName, formatPopulation } = require('./src/api/countriesApi.js');

async function testAPI() {
    try {
        // Test 1: Fetch all countries (for Country List Screen)
        console.log('📍 Test 1: Fetching all countries...\n');
        const countries = await fetchAllCountries();
        console.log(`✓ Found ${countries.length} countries`);
        console.log(`  First 3: ${countries.slice(0, 3).map(c => c.name.common).join(', ')}\n`);

        // Test 2: Search countries by name (for Search Filter)
        console.log('📍 Test 2: Searching for countries containing "united"...\n');
        const searchResults = await fetchCountryByName('united');
        console.log(`✓ Found ${searchResults.length} result(s):`);
        searchResults.forEach(country => {
            console.log(`  - ${country.name.common} (${country.capital?.[0] || 'N/A'})`);
        });

    } catch (error) {
        console.error('✗ API Error:', error.message);
    }
}

testAPI();

