const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
let countries = [];

const getCountries = async () => {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        countries = data;
    } catch (error) {
        console.error(error);
    }
};

const getWeather = async (cityName, countryName) => {
    const apiKey = '045d994bed1610857fbf0bf33d57074e';
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName},${countryName}&appid=${apiKey}`);
    const data = await response.json();
    return data;
};


const displayResults = (countries) => {
    searchResults.innerHTML = "";
    countries.forEach(country => {
        const countryName = country.name.common;
        const flagURL = country.flags.png;

        const countryElement = document.createElement("div");
        countryElement.innerHTML = `<img src="${flagURL}" width="150" height="90"> ${countryName}`;
        searchResults.appendChild(countryElement);

        countryElement.addEventListener('click', async () => {
            const weatherData = await getWeather(country.capital?.[0], countryName);
            searchResults.innerHTML = `<h2>${countryName}</h2>
                                       <img src="${country.flags.png}" width="50" height="30">
                                       <p>Capital: ${country.capital?.[0] || 'Not available'}</p>
                                       <p>Population: ${country.population || 'Not available'}</p>
                                       <p>Region: ${country.region || 'Not available'}</p>
                                       <p>Weather: ${weatherData.weather[0].description}</p>`;
        });
    });
};

getCountries();

searchInput.addEventListener('input', async e => {
    const searchText = e.target.value.toLowerCase().trim();

    if (searchText.startsWith('f') && countries.filter(country => country.name.common.toLowerCase().includes(searchText)).length > 10) {
        searchResults.innerHTML = "<p>Por favor, sé más específico en tu búsqueda.</p>";
        return;
    }

    const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(searchText)).slice(0, 10);
    if (filteredCountries.length === 1) {
        const specificCountry = filteredCountries[0];
        const weatherData = await getWeather(specificCountry.capital?.[0], specificCountry.name.common);
        searchResults.innerHTML = `
                                    <div class="banderitas">
                                    <h2>${specificCountry.name.common}</h2>
                                   <img src="${specificCountry.flags.png}" width="130" height="90">
                                   <p>Capital: ${specificCountry.capital?.[0] || 'Not available'}</p>
                                   <p>Population: ${specificCountry.population || 'Not available'}</p>
                                   <p>Region: ${specificCountry.region || 'Not available'}</p>
                                   <p>Subregion: ${specificCountry.subregion || 'Not available'}</p>
                                   <p>Language: ${Object.values(specificCountry.languages).join(', ') || 'Not available'}</p> 
                                   <p>Weather: ${weatherData.weather[0].description}</p>  
                                   </div>
                                   `;

                                    
        return;
    }

    if (filteredCountries.length > 0) {
        displayResults(filteredCountries);
        return;
    }

    searchResults.innerHTML = "<p>No se encontraron coincidencias.</p>";
});

