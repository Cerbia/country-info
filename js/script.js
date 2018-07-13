/*reorganize code & create 
https://hackernoon.com/observer-vs-pub-sub-pattern-50d3b27f838c
https://gist.github.com/learncodeacademy/777349747d8382bfb722
*/


const prefix = "https://cryptic-headland-94862.herokuapp.com/";
const url = 'https://restcountries.eu/rest/v2/name/';
var countriesList = document.querySelector('.countries-container');
var elem = document.getElementById('countries');
var coordinates =[];
//var countries ="";
var map;
var buttons;
var theParent;
var countriesMap = new Map();
var countriesNames =[];
let markersArray = [];

document.getElementById('search').addEventListener('click', searchCountries);

function searchCountries() {
    var countryName = document.getElementById('country-name').value;
    if(!countryName) countryName = 'Poland';
    removeButtons();
    console.log(prefix + url + countryName);
    fetch(prefix + url + countryName)
        .then(response => response.json())
        .then(showCountriesList);
}

function showCountriesList(resp) {

    cleanUpMarkers();

    countriesList.innerHTML = '';
    resp.forEach(function(item){
        coordinates.push({name:item.name, latlng:{lat: item.latlng[0], lng: item.latlng[1]}});
    });
    resp.forEach(function (item) {
            countriesMap.set(item.name, { latlng: {lat: item.latlng[0], lng: item.latlng[1]}, flag:item.flag, nativeName: item.nativeName, capital:item.capital, currencies:item.currencies, languages:item.languages });
            countriesNames.push({name:item.name});
        });
    //console.log(countriesMap);
    //debugger;

    for (let [k, v] of countriesMap) {
        console.log(k, v);
    }

    //console.log(countriesMap.get('Serbia').latlng[0]);
    generateCountriesList();
    setUpMarkers();
}

var templateCountryButton = document.getElementById('template-country').innerHTML;

function generateCountriesList() {
    var generateButtonTemplate ="";
    Mustache.parse(templateCountryButton);
        for (var i = 0; i < countriesNames.length; i++) {
            generateButtonTemplate+= Mustache.render(templateCountryButton, countriesNames[i]);
        }
    countriesList.insertAdjacentHTML('afterbegin', generateButtonTemplate);
    buttonClick();
}

function buttonClick() {
    /*buttons = document.querySelectorAll('.country-button');
    buttons.forEach(function(item, idx){
        item.addEventListener('click', function(){
            map.setCenter(coordinates[idx].latlng);
            map.setZoom(5);
        });
    });*/
}


theParent = document.querySelector('.countries-container');

theParent.addEventListener('click', doSomething, false);

function doSomething(e){
    if (e.target !== e.currentTarget) {
        console.log(e.currentTarget);
        console.log(e.target);
        alert("Hello " + e.target.innerHTML);
    }
    e.stopPropagation();

        //map.setCenter(coordinates[idx].latlng);
        //map.setZoom(5);
}

function removeButtons() {
    buttons = document.querySelectorAll('.country-button');

    for(var i=0;i<buttons.length;i++) {
        buttons[i].remove();
    }
    buttons = [];
    coordinates = [];
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
    console.log("here");
    //debugger;
    for (var i = 0; i < markersArray.length; i++) {
        markersArray[i].setMap(null);
    }
    //array is not cleaned :/
    markersArray.length = 0;
    console.log(markersArray);

}





