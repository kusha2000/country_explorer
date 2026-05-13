const BASE_URL = 'https://restcountries.com/v3.1';

// Fields needed for list and detail views
const FIELDS = 'name,flags,capital,population,region,subregion,languages,currencies,area,cca3';

// Fetch all countries
export const fetchAllCountries = async () => {
    try {
        const response = await fetch(
            `${BASE_URL}/all?fields=${FIELDS}`
        );

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Sort countries alphabetically by common name
        const sorted = data.sort((a, b) =>
            a.name.common.localeCompare(b.name.common)
        );

        return sorted;

    } catch (error) {
        console.error('[countriesApi] fetchAllCountries failed:', error);
        throw error;
    }
};

// Search countries by name (partial match)
export const fetchCountryByName = async (name) => {
    try {
        const response = await fetch(
            `${BASE_URL}/name/${name}?fields=${FIELDS}`
        );

        if (!response.ok) {
            throw new Error(`Country "${name}" not found`);
        }

        const data = await response.json();
        return data.sort((a, b) =>
            a.name.common.localeCompare(b.name.common)
        );

    } catch (error) {
        console.error(`[countriesApi] fetchCountryByName(${name}) failed:`, error);
        throw error;
    }
};


// Utility functions like this belong near the API/data layer
export const formatPopulation = (num) => {
    if (!num) return 'N/A';
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toString();
};

//Extract Currency Names
export const formatCurrencies = (currencies) => {
    if (!currencies) return 'N/A';
    return Object.values(currencies)
        .map(c => `${c.name} (${c.symbol || '?'})`)
        .join(', ');
};

//Extract Language Names
export const formatLanguages = (languages) => {
    if (!languages) return 'N/A';
    return Object.values(languages).join(', ');
};