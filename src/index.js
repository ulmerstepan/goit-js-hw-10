import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import countryCardTpl from './templates/country-card.hbs';
import countriesListTpl from './templates/countries-list.hbs';

const DEBOUNCE_DELAY = 300;

const refs = {
    searchBox: document.getElementById('search-box'),
    countryCardBox: document.querySelector('.country-info'),
    countriesListBox: document.querySelector('.country-list'),
};

refs.searchBox.addEventListener('input', debounce(inputSearchBox, DEBOUNCE_DELAY));

function inputSearchBox(evt) {
    const inputCountryName = evt.target.value.trim();
    fetchCountries(inputCountryName);
};

function fetchCountries(countryName) {
    const url = `https://restcountries.com/v3.1/name/${countryName}?fields=name,capital,population,flags,languages`;

    if (countryName === '') {
        clearCountriesListBox();
        clearCountryCardbox();        
        return;
    }

    return fetch(url).then(response => {
        if (!response.ok) {
            Notify.failure('Oops, there is no country with that name');
            clearCountryCardbox();
            clearCountriesListBox();

            throw new Error(response.status);
        }

        return response.json();
    })
    .then(renderCountryCard);
}

function renderCountryCard(country) {
    
    if (country.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name');
        clearCountriesListBox();
        clearCountryCardbox();
        return;
    } else if (country.length > 1 && country.length <= 10) {
        refs.countriesListBox.innerHTML = countriesListTpl(country);
        clearCountryCardbox();
        return;
    }
    refs.countryCardBox.innerHTML = countryCardTpl(country);
    clearCountriesListBox();
    return;
   
};

function clearCountryCardbox() {
    refs.countryCardBox.innerHTML = '';
}

function clearCountriesListBox() {
    refs.countriesListBox.innerHTML = '';
}