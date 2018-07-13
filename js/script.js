/*reorganize code & create 
https://hackernoon.com/observer-vs-pub-sub-pattern-50d3b27f838c
https://gist.github.com/learncodeacademy/777349747d8382bfb722
*/


const prefix = "https://cryptic-headland-94862.herokuapp.com/";
const url = 'https://restcountries.eu/rest/v2/name/';
var countriesButtonContainer = document.querySelector('.countries-container');
// mustache template
var templateCountryButton = document.getElementById('template-country').innerHTML;
var map;
var theParentCountryButtonEl;
var countriesMap = new Map();
var countriesNames =[];
let markersArray = [];

document.getElementById('search').addEventListener('click', searchCountries);

function searchCountries() {
    var countryName = document.getElementById('country-name').value;
    if(!countryName) countryName = 'Poland';
    
    fetch(prefix + url + countryName)
        .then(response => response.json())
        .then(showCountriesList);
}

function showCountriesList(resp) {
    //czyszczenie
    countriesNames = [];
    countriesMap.clear();
    cleanUpMarkers();
    // Czyszczenie buttonów w html
    countriesButtonContainer.innerHTML = '';

    resp.forEach(function (item) {
            countriesMap.set(item.name, { latlng: {lat: Number(item.latlng[0]), lng: Number(item.latlng[1])}, flag:item.flag, nativeName: item.nativeName, capital:item.capital, currencies:item.currencies, languages:item.languages });
            countriesNames.push({name:item.name});
            //console.log(item.name + 'latlng: {lat: ' + item.latlng[0] + ', lng: ' + item.latlng[1] + '}');
        });

    generateCountriesList();
    setUpMarkers();
}

function generateCountriesList() {
    var generateButtonTemplate ="";
    Mustache.parse(templateCountryButton);
        for (var i = 0; i < countriesNames.length; i++) {
            generateButtonTemplate+= Mustache.render(templateCountryButton, countriesNames[i]);
        }
    countriesButtonContainer.insertAdjacentHTML('afterbegin', generateButtonTemplate);
}

theParentCountryButtonEl = document.querySelector('.countries-container');

theParentCountryButtonEl.addEventListener('click', centerCountryOnTheMap, false);

function centerCountryOnTheMap(e){
    if (e.target !== e.currentTarget) {
        map.setCenter(countriesMap.get(e.target.innerHTML).latlng);
        map.setZoom(5);
    }
    e.stopPropagation();
}

window.initMap = function() {
    map = new google.maps.Map(
        document.getElementById('map'), {zoom: 5, center: {lat: 52, lng: 20}}
    );
}

function setUpMarkers() {
    for (let [k, v] of countriesMap) {
        //console.log(k, v);
        markersArray.push(new google.maps.Marker({position: v.latlng, map: map}));
    }
}

function cleanUpMarkers(){
    markersArray.forEach(function(item){
        item.setMap(null);
    });
    markersArray = [];
    //console.log(markersArray);
}
