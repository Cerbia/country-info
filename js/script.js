/*reorganize code & create 
https://hackernoon.com/observer-vs-pub-sub-pattern-50d3b27f838c
https://gist.github.com/learncodeacademy/777349747d8382bfb722
*/

const prefix = "https://cryptic-headland-94862.herokuapp.com/";
const url = 'https://restcountries.eu/rest/v2/name/';
var countriesList = document.querySelector('.countries-container');
var elem = document.getElementById('countries');
var coordinates =[];
var countries ="";
var map;
var buttons;

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
	//1.flaga
	//console.log(resp[0].flag);
	//nazwa oryg. nativeName
	//stolica: capital
	//waluta: currencies[] {code: "EUR", name: "Euro", symbol: "€"}
	//języki: languages[] {iso639_1: "la", iso639_2: "lat", name: "Latin", nativeName: "latine"}

	console.log(resp);
	countriesList.innerHTML = '';
	resp.forEach(function(item){
	    coordinates.push({name:item.name, latlng:{lat: item.latlng[0], lng: item.latlng[1]}});
	});
	generateCountriesList();
	setUpMarkers();
}

var templateCountry = document.getElementById('template-country').innerHTML;

function generateCountriesList() {
	Mustache.parse(templateCountry);
		for (var i = 0; i < coordinates.length; i++) {
    	countries+= Mustache.render(templateCountry, coordinates[i]);
	}
	countriesList.insertAdjacentHTML('afterbegin', countries);
	buttonClick();
}

function buttonClick() {
	buttons = document.querySelectorAll('.country-button');
	buttons.forEach(function(item, idx){
	    item.addEventListener('click', function(){
    		map.setCenter(coordinates[idx].latlng);
    		map.setZoom(5);
	    });
	});
}

function removeButtons() {
	buttons = document.querySelectorAll('.country-button');

	for(var i=0;i<buttons.length;i++) {
		buttons[i].remove();
	}
	buttons = [];
	coordinates = [];
	countries= "";
}

window.initMap = function() {
    map = new google.maps.Map(
        document.getElementById('map'), {zoom: 5, center: {lat: 52, lng: 20}}
    );
}

function setUpMarkers() {
	var markers = coordinates.map(function(coord){
        return new google.maps.Marker({position: coord.latlng, map: map});
    });
}