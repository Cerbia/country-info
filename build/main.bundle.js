'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/*reorganize code & create 
https://hackernoon.com/observer-vs-pub-sub-pattern-50d3b27f838c
https://gist.github.com/learncodeacademy/777349747d8382bfb722
*/

var prefix = "https://cryptic-headland-94862.herokuapp.com/";
var url = 'https://restcountries.eu/rest/v2/name/';
var countriesList = document.querySelector('.countries-container');
var elem = document.getElementById('countries');
var coordinates = [];
//var countries ="";
var map;
var buttons;
var theParent;
var countriesMap = new Map();
var countriesNames = [];
var markersArray = [];

document.getElementById('search').addEventListener('click', searchCountries);

function searchCountries() {
    var countryName = document.getElementById('country-name').value;
    if (!countryName) countryName = 'Poland';
    removeButtons();
    console.log(prefix + url + countryName);
    fetch(prefix + url + countryName).then(function (response) {
        return response.json();
    }).then(showCountriesList);
}

function showCountriesList(resp) {

    cleanUpMarkers();

    countriesList.innerHTML = '';
    resp.forEach(function (item) {
        coordinates.push({ name: item.name, latlng: { lat: item.latlng[0], lng: item.latlng[1] } });
    });
    resp.forEach(function (item) {
        countriesMap.set(item.name, { latlng: { lat: item.latlng[0], lng: item.latlng[1] }, flag: item.flag, nativeName: item.nativeName, capital: item.capital, currencies: item.currencies, languages: item.languages });
        countriesNames.push({ name: item.name });
    });
    //console.log(countriesMap);
    //debugger;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = countriesMap[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _slicedToArray(_step.value, 2),
                k = _step$value[0],
                v = _step$value[1];

            console.log(k, v);
        }

        //console.log(countriesMap.get('Serbia').latlng[0]);
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    generateCountriesList();
    setUpMarkers();
}

var templateCountryButton = document.getElementById('template-country').innerHTML;

function generateCountriesList() {
    var generateButtonTemplate = "";
    Mustache.parse(templateCountryButton);
    for (var i = 0; i < countriesNames.length; i++) {
        generateButtonTemplate += Mustache.render(templateCountryButton, countriesNames[i]);
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

function doSomething(e) {
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

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].remove();
    }
    buttons = [];
    coordinates = [];
}

window.initMap = function () {
    map = new google.maps.Map(document.getElementById('map'), { zoom: 5, center: { lat: 52, lng: 20 } });
};

function setUpMarkers() {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = countriesMap[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _step2$value = _slicedToArray(_step2.value, 2),
                k = _step2$value[0],
                v = _step2$value[1];

            //console.log(k, v);
            markersArray.push(new google.maps.Marker({ position: v.latlng, map: map }));
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }
}

function cleanUpMarkers() {
    console.log("here");
    //debugger;
    for (var i = 0; i < markersArray.length; i++) {
        markersArray[i].setMap(null);
    }
    //array is not cleaned :/
    markersArray.length = 0;
    console.log(markersArray);
}
