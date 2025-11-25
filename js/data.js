export const countryData = {
    // Americas (All Red)
    'Canada': { flag: '🇨🇦', cities: ['Toronto', 'Vancouver'], entities: ['Allmer CA'], realEstate: 0, partners: [], note: 'North American content localization and media production hub.', presenceLevel: 'red' },
    'United States': { flag: '🇺🇸', cities: ['New York', 'Los Angeles'], entities: ['Allmer Entertainment LLC'], realEstate: 0, partners: [], note: 'Largest single market for all divisions. Significant focus on film/TV production and franchising.', presenceLevel: 'red' },
    'Mexico': { flag: '🇲🇽', cities: ['Mexico City'], entities: ['Allmer MX'], realEstate: 0, partners: [], note: 'Primary hub for Latin American content distribution and localized marketing.', presenceLevel: 'red' },
    'Colombia': { flag: '🇨🇴', cities: ['Bogotá'], entities: ['Allmer CO'], realEstate: 0, partners: [], note: 'Andean region operational base and Spanish-language content testing.', presenceLevel: 'red' },
    'Peru': { flag: '🇵🇪', cities: ['Lima', 'Cuzco'], entities: ['Allmer PE SAC'], realEstate: 0, partners: [], note: 'Focus on Andean market content localization and e-commerce growth.', presenceLevel: 'red' },
    'Brazil': { flag: '🇧🇷', cities: ['São Paulo', 'Rio de Janeiro'], entities: ['Allmer BR'], realEstate: 0, partners: [], note: 'Key market for e-commerce, media consumption, and social outreach.', presenceLevel: 'red' },
    'Argentina': { flag: '🇦🇷', cities: ['Buenos Aires'], entities: ['Allmer AR'], realEstate: 0, partners: [], note: 'Southern Cone operational base, focusing on publishing and music rights.', presenceLevel: 'red' },

    // Europe (Austria Green, Italy Yellow, Rest Red)
    'United Kingdom': { flag: '🇬🇧', cities: ['London', 'Manchester'], entities: ['Allmer UK Ltd'], realEstate: 0, partners: [], note: 'Primary English-speaking market in Europe. Strong presence for Allmer Games.', presenceLevel: 'red' },
    'Portugal': { flag: '🇵🇹', cities: ['Lisbon'], entities: ['Allmer PT Unipessoal Lda'], realEstate: 0, partners: [], note: 'Gateway hub for expansion into Brazil and Lusophone Africa.', presenceLevel: 'red' },
    'Spain': { flag: '🇪🇸', cities: ['Madrid', 'Barcelona'], entities: ['Allmer ES SL'], realEstate: 0, partners: [], note: 'Operational hub for the Spanish language market, including Latin American coordination.', presenceLevel: 'red' },
    'France': { flag: '🇫🇷', cities: ['Paris', 'Lyon'], entities: ['Allmer FR SAS'], realEstate: 0, partners: [], note: 'Focus on Allmer Music and Film distribution, especially for Francophone markets.', presenceLevel: 'red' },
    'Germany': { flag: '🇩🇪', cities: ['Berlin', 'Munich'], entities: ['Allmer DE GmbH'], realEstate: 0, partners: [], note: 'Largest market for Allmer Games and Merchandise in Continental Europe.', presenceLevel: 'red' },
    'Italy': { flag: '🇮🇹', cities: ['Rome', 'Milan'], entities: ['Allmer IT Srl'], realEstate: 0, partners: ['Film Production Studio A', 'Merchandise Distributor B'], note: 'Focus on film production partnerships and co-financing opportunities.', presenceLevel: 'yellow' },
    'Austria': {
        flag: '🇦🇹',
        cities: ['Vienna', 'Salzburg'],
        entities: ['Allmer AT GmbH'],
        realEstate: 3,
        realEstateDetails: [
            { name: 'Wieden (4th District)', type: 'Residential/Commercial Mix' },
            { name: 'Döbling (19th District)', type: 'Residential' },
            { name: 'Wagram', type: 'Residential/Investment' }
        ],
        partners: ['Local Bank Partner C'],
        note: 'Home country and primary operating base. Contains the Headquarters for Entertainment and Real Estate divisions. **Vienna currently holds 3 core properties.**',
        presenceLevel: 'green'
    },

    // Africa
    'South Africa': { flag: '🇿🇦', cities: ['Johannesburg', 'Cape Town'], entities: ['Allmer ZA'], realEstate: 0, partners: [], note: 'Strategic hub for Southern Africa operations.', presenceLevel: 'red' },
    'Nigeria': { flag: '🇳🇬', cities: ['Lagos', 'Abuja'], entities: ['Allmer NG'], realEstate: 0, partners: [], note: 'Key market for West African expansion.', presenceLevel: 'red' },
    'Egypt': { flag: '🇪🇬', cities: ['Cairo', 'Alexandria'], entities: ['Allmer EG'], realEstate: 0, partners: [], note: 'North African regional office.', presenceLevel: 'red' },
    'Kenya': { flag: '🇰🇪', cities: ['Nairobi', 'Mombasa'], entities: ['Allmer KE'], realEstate: 0, partners: [], note: 'East African technology and innovation hub.', presenceLevel: 'red' },
    'Morocco': { flag: '🇲🇦', cities: ['Casablanca', 'Rabat'], entities: ['Allmer MA'], realEstate: 0, partners: [], note: 'Gateway to North Africa and Europe.', presenceLevel: 'red' },
    'Ethiopia': { flag: '🇪🇹', cities: ['Addis Ababa'], entities: ['Allmer ET'], realEstate: 0, partners: [], note: 'Emerging market focus.', presenceLevel: 'red' },
    'Ghana': { flag: '🇬🇭', cities: ['Accra'], entities: ['Allmer GH'], realEstate: 0, partners: [], note: 'West African operational support.', presenceLevel: 'red' },

    // Asia & Oceania
    'India': { flag: '🇮🇳', cities: ['Mumbai', 'Delhi'], entities: ['Allmer IN'], realEstate: 0, partners: ['Mayank Kumarr'], note: 'Major growth market for mobile games, localized content, and Allmer Snacks distribution.', presenceLevel: 'yellow' },
    'Singapore': { flag: '🇸🇬', cities: ['Singapore'], entities: ['Allmer SG Pte. Ltd.'], realEstate: 0, partners: [], note: 'Asia-Pacific Financial and Legal Hub.', presenceLevel: 'red' },
    'Indonesia': { flag: '🇮🇩', cities: ['Jakarta', 'Surabaya'], entities: ['Allmer ID'], realEstate: 0, partners: [], note: 'High-growth market for mobile gaming and music distribution in Southeast Asia.', presenceLevel: 'red' },
    'China': { flag: '🇨🇳', cities: ['Beijing', 'Shanghai'], entities: ['Allmer CN'], realEstate: 0, partners: ['Jang Jae Ok'], note: 'Complex local entity structure required for content and distribution partnerships.', presenceLevel: 'yellow' },
    'South Korea': { flag: '🇰🇷', cities: ['Seoul'], entities: ['Allmer KR'], realEstate: 0, partners: ['Yong Hoo Kim'], note: 'Strategic focus on E-Sports, technology partnerships, and music distribution.', presenceLevel: 'yellow' },
    'Japan': { flag: '🇯🇵', cities: ['Tokyo', 'Osaka'], entities: ['Allmer JP G.K.'], realEstate: 0, partners: [], note: 'Key market for gaming and comics IP. High value but complex regulatory environment.', presenceLevel: 'red' },
    'Australia': { flag: '🇦🇺', cities: ['Sydney', 'Melbourne'], entities: ['Allmer AU Pty Ltd'], realEstate: 0, partners: [], note: 'Oceania base of operations for logistics and content distribution.', presenceLevel: 'red' },
};

export const subdivisionDescriptions = {
    'Allmer Studios': 'Allmer Studios is the creative engine of Simon Allmer Entertainment, overseeing all content production from film and music to games and publishing.',
    'Allmer Brands': 'Allmer Brands manages the company\'s intellectual property, franchising, and merchandise lines globally.',
    'Simon Allmer Stores': 'Simon Allmer Stores handles all physical and digital retail operations for merchandise and software.',
    'Simon Allmer Centers': 'Simon Allmer Centers oversees the global infrastructure and localized operations across all major continents.',
};
